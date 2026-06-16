import CourtScrollAnimation from "@/components/CourtScrollAnimation";
import TiltCard from "@/components/TiltCard";
import MetricsLoader from "@/components/MetricsLoader";
import ImpactButton from "@/components/ImpactButton";

export default function Home() {
  return (
    <main className="flex-1 bg-blue-950">
      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-700 to-blue-900 px-6 text-center">
        <span className="mb-6 inline-block rounded-full bg-orange-500 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-white">
          🎾 Padel Journal
        </span>
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
          PadelPro AI
        </h1>
        <p className="mt-4 text-lg text-teal-300">
          Your padel improvement journal
        </p>
        <div className="mt-8 h-1 w-16 rounded-full bg-yellow-400" />
        <p className="mt-10 animate-pulse text-sm text-blue-200">
          ↓ scroll to explore
        </p>
      </section>

      {/* Scroll-driven court animation */}
      <CourtScrollAnimation />

      {/* AI metrics dashboard */}
      <MetricsLoader />

      {/* Interactive feature card */}
      <section className="bg-blue-950 px-6">
        <h2 className="pt-20 text-center text-3xl font-bold text-white">
          Built Like Pro Tech
        </h2>
        <TiltCard />
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center bg-gradient-to-b from-blue-950 to-blue-900 px-6 pb-28 pt-10 text-center">
        <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
          Ready to level up?
        </h2>
        <p className="mb-8 max-w-md text-blue-200">
          Track every match, learn from every point, and watch your game climb.
        </p>
        <ImpactButton />
      </section>
    </main>
  );
}
