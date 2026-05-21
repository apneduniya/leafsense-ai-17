import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { LeafAnalyzer } from "@/components/leaf-analyzer";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze a leaf — LeafSense" },
      { name: "description", content: "Use your camera or upload an image to get an instant AI diagnosis for your plant or flower." },
    ],
  }),
  component: Analyze,
});

function Analyze() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Analyze your leaf</h1>
          <p className="mt-3 text-muted-foreground">
            Take a clear, well-lit photo of a single leaf or flower for best results.
          </p>
        </div>
        <LeafAnalyzer />
      </main>
      <SiteFooter />
    </div>
  );
}
