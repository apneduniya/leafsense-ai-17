import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Camera, Sparkles, ShieldCheck, Droplets, Thermometer } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LeafSense — How it works" },
      { name: "description", content: "LeafSense is a final-year college project that uses AI vision to diagnose plant diseases and recommend treatments." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight">About LeafSense</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          LeafSense is a final-year major project that combines computer vision with a large
          multimodal AI model to diagnose plant and flower diseases from a single photo.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What it does</h2>
        <ul className="mt-4 space-y-3 text-foreground/90">
          <Bullet icon={<Sparkles className="h-4 w-4" />}>Identifies the plant and any disease affecting it, with severity.</Bullet>
          <Bullet icon={<ShieldCheck className="h-4 w-4" />}>Recommends cures, treatments and precautions.</Bullet>
          <Bullet icon={<Droplets className="h-4 w-4" />}>Estimates the water / precipitation need of the leaf.</Bullet>
          <Bullet icon={<Thermometer className="h-4 w-4" />}>Predicts decay rate in humid, dry and cold environments.</Bullet>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold">How it works</h2>
        <p className="mt-3 text-muted-foreground">
          You either capture a live photo using your device camera or upload one from your gallery.
          The image is sent securely to our backend, which calls a multimodal vision model. The
          model returns a structured report — disease, causes, cure, precautions, water needs and
          environmental decay rate — which the app renders into a clean diagnosis card.
        </p>

        <div className="mt-10 flex">
          <Link to="/analyze" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-leaf)] transition hover:opacity-90">
            <Camera className="h-4 w-4" /> Try it now
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Bullet({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-md bg-leaf-soft text-leaf">{icon}</span>
      <span>{children}</span>
    </li>
  );
}
