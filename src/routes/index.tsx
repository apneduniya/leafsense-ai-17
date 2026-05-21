import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Upload, Sparkles, ShieldCheck, Droplets, Leaf } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import heroLeaf from "@/assets/hero-leaf.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LeafSense — AI plant & flower disease detection" },
      { name: "description", content: "Scan any leaf or flower with your camera. Instantly detect disease, get cures, precautions, water needs and decay rate." },
      { property: "og:title", content: "LeafSense — AI plant disease detection" },
      { property: "og:description", content: "Snap a leaf, get an AI diagnosis with cures, precautions, water needs and decay estimates." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium backdrop-blur">
                <Leaf className="h-3.5 w-3.5 text-leaf" /> AI-powered plant diagnostics
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Know what's hurting your plants — in seconds.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                LeafSense analyzes any leaf or flower from a photo. Identify diseases, learn the cure,
                understand water needs and predict decay rate across environments.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/analyze" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-leaf)] transition hover:opacity-90">
                  <Camera className="h-4 w-4" /> Start scanning
                </Link>
                <Link to="/about" className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/70 px-6 py-3 font-medium hover:bg-background">
                  How it works
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroLeaf}
                alt="Close-up of a healthy green leaf with water droplets"
                width={1536}
                height={1024}
                className="aspect-[3/2] w-full rounded-3xl object-cover shadow-[var(--shadow-leaf)]"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What LeafSense tells you</h2>
            <p className="mt-3 text-muted-foreground">One scan, a full health report for your plant.</p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Feature icon={<Sparkles className="h-5 w-5" />} title="Disease detection" desc="Identify the disease affecting your leaf or flower, with severity." />
            <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Cure & precautions" desc="Step-by-step treatment plus how to prevent recurrence." />
            <Feature icon={<Droplets className="h-5 w-5" />} title="Water needs" desc="Precipitation requirement tailored to the plant species." />
            <Feature icon={<Leaf className="h-5 w-5" />} title="Decay rate" desc="Estimated decay in humid, dry and cold environments." />
          </div>
        </section>

        {/* How it works */}
        <section className="bg-leaf-soft/40 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Three steps to a healthy plant</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Step n={1} icon={<Camera className="h-5 w-5" />} title="Capture or upload" desc="Take a fresh photo with your camera, or pick one from your gallery." />
              <Step n={2} icon={<Sparkles className="h-5 w-5" />} title="AI analyzes" desc="Our vision model inspects color, veins and lesions in seconds." />
              <Step n={3} icon={<ShieldCheck className="h-5 w-5" />} title="Act on insights" desc="Read the diagnosis and follow tailored cure & precaution steps." />
            </div>
            <div className="mt-12 text-center">
              <Link to="/analyze" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-leaf)] transition hover:opacity-90">
                <Camera className="h-4 w-4" /> Scan a leaf now
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition hover:shadow-[var(--shadow-leaf)]">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-leaf-soft text-leaf">{icon}</div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Step({ n, icon, title, desc }: { n: number; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-semibold">{n}</span>
        <span className="text-leaf">{icon}</span>
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
