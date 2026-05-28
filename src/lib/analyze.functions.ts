import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  imageDataUrl: z.string().min(20).max(15_000_000),
});

const tool = {
  type: "function" as const,
  function: {
    name: "report_leaf_analysis",
    description: "Report the plant/leaf analysis result.",
    parameters: {
      type: "object",
      properties: {
        isLeaf: { type: "boolean", description: "Whether the image actually shows a plant leaf or flower." },
        plantName: { type: "string", description: "Best-guess common name of the plant/flower." },
        isHealthy: { type: "boolean" },
        healthScore: { type: "number", description: "0-100 overall health score." },
        diseaseName: { type: "string", description: "Disease name, or 'None' if healthy." },
        diseaseSeverity: { type: "string", enum: ["none", "mild", "moderate", "severe"] },
        symptoms: { type: "array", items: { type: "string" } },
        causes: { type: "array", items: { type: "string" } },
        cure: { type: "array", items: { type: "string" }, description: "Treatment / cure steps." },
        precautions: { type: "array", items: { type: "string" } },
        precipitationNeed: { type: "string", description: "Water / precipitation requirement of this leaf (e.g. 'Low - mist 2x/week')." },
        decayRate: {
          type: "object",
          properties: {
            humid: { type: "string", description: "Estimated decay rate in humid environment." },
            dry: { type: "string", description: "Estimated decay rate in dry environment." },
            cold: { type: "string", description: "Estimated decay rate in cold environment." },
          },
          required: ["humid", "dry", "cold"],
        },
        summary: { type: "string" },
      },
      required: [
        "isLeaf", "plantName", "isHealthy", "healthScore", "diseaseName",
        "diseaseSeverity", "symptoms", "causes", "cure", "precautions",
        "precipitationNeed", "decayRate", "summary",
      ],
      additionalProperties: false,
    },
  },
};

export type LeafAnalysis = {
  isLeaf: boolean;
  plantName: string;
  isHealthy: boolean;
  healthScore: number;
  diseaseName: string;
  diseaseSeverity: "none" | "mild" | "moderate" | "severe";
  symptoms: string[];
  causes: string[];
  cure: string[];
  precautions: string[];
  precipitationNeed: string;
  decayRate: { humid: string; dry: string; cold: string };
  summary: string;
};

export const analyzeLeaf = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<{ analysis: LeafAnalysis | null; error: string | null }> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { analysis: null, error: "AI service not configured." };
    }

    try {
      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are LeafSense, an expert plant pathologist. Analyze the provided plant/leaf/flower image. " +
                "Identify the plant, detect any diseases, estimate health, water needs, and decay rate under different environments. " +
                "If the image is NOT a plant/leaf/flower, set isLeaf=false and fill remaining fields with safe defaults. " +
                "Always respond by calling the report_leaf_analysis tool.",
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this leaf/flower." },
                { type: "image_url", image_url: { url: data.imageDataUrl } },
              ],
            },
          ],
          tools: [tool],
          tool_choice: { type: "function", function: { name: "report_leaf_analysis" } },
        }),
      });

      if (!res.ok) {
        if (res.status === 429) return { analysis: null, error: "Rate limit exceeded. Please try again in a moment." };
        if (res.status === 402) return { analysis: null, error: "AI credits exhausted. Please add credits to continue." };
        const t = await res.text();
        console.error("AI gateway error:", res.status, t);
        return { analysis: null, error: "AI service error. Please try again." };
      }

      const json = await res.json();
      const call = json?.choices?.[0]?.message?.tool_calls?.[0];
      const argsStr = call?.function?.arguments;
      if (!argsStr) return { analysis: null, error: "AI returned no analysis." };
      const analysis = JSON.parse(argsStr) as LeafAnalysis;
      return { analysis, error: null };
    } catch (e) {
      console.error("analyzeLeaf failed:", e);
      return { analysis: null, error: "Something went wrong analyzing the image." };
    }
  });
