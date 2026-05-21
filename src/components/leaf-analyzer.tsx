import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Upload, X, Loader2, Leaf, AlertTriangle, CheckCircle2, Droplets, Sparkles, ShieldCheck, Bug, Thermometer } from "lucide-react";
import { analyzeLeaf, type LeafAnalysis } from "@/lib/analyze.functions";

type Mode = "idle" | "camera";

async function fileToCompressedDataUrl(file: File | Blob, maxDim = 1280, quality = 0.85): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

export function LeafAnalyzer() {
  const analyzeFn = useServerFn(analyzeLeaf);
  const [mode, setMode] = useState<Mode>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LeafAnalysis | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function startCamera() {
    setError(null);
    setResult(null);
    setImageUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setMode("camera");
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch (e) {
      console.error(e);
      setError("Could not access camera. Please allow camera permission or upload an image instead.");
    }
  }

  async function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.92));
    stopCamera();
    setMode("idle");
    const dataUrl = await fileToCompressedDataUrl(blob);
    setImageUrl(dataUrl);
    await runAnalysis(dataUrl);
  }

  async function onFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setResult(null);
    const dataUrl = await fileToCompressedDataUrl(file);
    setImageUrl(dataUrl);
    await runAnalysis(dataUrl);
  }

  async function runAnalysis(dataUrl: string) {
    setLoading(true);
    setError(null);
    try {
      const { analysis, error } = await analyzeFn({ data: { imageDataUrl: dataUrl } });
      if (error) setError(error);
      else setResult(analysis);
    } catch (e) {
      console.error(e);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setImageUrl(null);
    setResult(null);
    setError(null);
    stopCamera();
    setMode("idle");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      {/* Left: capture panel */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Capture or upload</h2>

        {mode === "camera" && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-border bg-black">
              <video ref={videoRef} className="aspect-video w-full object-cover" playsInline muted />
            </div>
            <div className="flex gap-2">
              <button
                onClick={capturePhoto}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:opacity-90"
              >
                <Camera className="h-4 w-4" /> Capture
              </button>
              <button
                onClick={() => { stopCamera(); setMode("idle"); }}
                className="rounded-lg border border-border px-4 py-3 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {mode === "idle" && !imageUrl && (
          <div className="grid gap-3">
            <button
              onClick={startCamera}
              className="group flex items-center gap-4 rounded-xl border border-border bg-background p-4 text-left transition hover:border-primary hover:bg-leaf-soft"
            >
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Camera className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-medium">Use camera</span>
                <span className="block text-sm text-muted-foreground">Take a live photo of the leaf or flower.</span>
              </span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center gap-4 rounded-xl border border-border bg-background p-4 text-left transition hover:border-primary hover:bg-leaf-soft"
            >
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Upload className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-medium">Upload from gallery</span>
                <span className="block text-sm text-muted-foreground">Pick an existing image from your device.</span>
              </span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onFilePicked} />
          </div>
        )}

        {imageUrl && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-border bg-muted">
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img src={imageUrl} className="aspect-video w-full object-cover" />
            </div>
            <button onClick={reset} className="w-full rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-muted">
              Scan another leaf
            </button>
          </div>
        )}
      </div>

      {/* Right: results */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Diagnosis</h2>

        {!loading && !result && !error && (
          <div className="grid place-items-center py-16 text-center text-muted-foreground">
            <Leaf className="mb-3 h-10 w-10 text-leaf" />
            <p>Your leaf analysis will appear here.</p>
          </div>
        )}

        {loading && (
          <div className="grid place-items-center py-16 text-center">
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
            <p className="font-medium">Analyzing leaf…</p>
            <p className="text-sm text-muted-foreground">Our AI is examining color, texture and patterns.</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        {result && <Result result={result} />}
      </div>
    </div>
  );
}

function Result({ result }: { result: LeafAnalysis }) {
  if (!result.isLeaf) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-foreground" />
        <div>
          <p className="font-medium">This doesn't look like a plant.</p>
          <p className="text-sm text-muted-foreground">Try another image of a leaf or flower for accurate analysis.</p>
        </div>
      </div>
    );
  }

  const severityColor =
    result.diseaseSeverity === "severe" ? "bg-destructive text-destructive-foreground"
    : result.diseaseSeverity === "moderate" ? "bg-amber-500 text-white"
    : result.diseaseSeverity === "mild" ? "bg-yellow-400 text-black"
    : "bg-leaf text-primary-foreground";

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">{result.plantName}</h3>
          {result.isHealthy ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-leaf-soft px-3 py-1 text-xs font-medium text-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-leaf" /> Healthy
            </span>
          ) : (
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${severityColor}`}>
              <Bug className="h-3.5 w-3.5" /> {result.diseaseSeverity}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{result.summary}</p>

        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-leaf" style={{ width: `${Math.max(0, Math.min(100, result.healthScore))}%` }} />
          </div>
          <span className="text-sm font-medium tabular-nums">{result.healthScore}/100</span>
        </div>
      </div>

      {!result.isHealthy && (
        <Section icon={<Bug className="h-4 w-4" />} title={`Disease — ${result.diseaseName}`}>
          <List items={result.symptoms} label="Symptoms" />
          <List items={result.causes} label="Causes" />
        </Section>
      )}

      {!result.isHealthy && (
        <Section icon={<Sparkles className="h-4 w-4" />} title="Cure & treatment">
          <List items={result.cure} />
        </Section>
      )}

      <Section icon={<ShieldCheck className="h-4 w-4" />} title="Precautions">
        <List items={result.precautions} />
      </Section>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard icon={<Droplets className="h-4 w-4" />} title="Precipitation need">
          {result.precipitationNeed}
        </InfoCard>
        <InfoCard icon={<Thermometer className="h-4 w-4" />} title="Decay rate by environment">
          <ul className="mt-1 space-y-1 text-sm">
            <li><span className="text-muted-foreground">Humid:</span> {result.decayRate.humid}</li>
            <li><span className="text-muted-foreground">Dry:</span> {result.decayRate.dry}</li>
            <li><span className="text-muted-foreground">Cold:</span> {result.decayRate.cold}</li>
          </ul>
        </InfoCard>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <span className="text-leaf">{icon}</span>
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function List({ items, label }: { items: string[]; label?: string }) {
  if (!items?.length) return null;
  return (
    <div>
      {label && <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>}
      <ul className="space-y-1 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />{it}</li>
        ))}
      </ul>
    </div>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <h4 className="flex items-center gap-2 text-sm font-semibold"><span className="text-leaf">{icon}</span>{title}</h4>
      <div className="mt-1 text-sm text-foreground">{children}</div>
    </div>
  );
}
