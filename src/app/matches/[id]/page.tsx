"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getMatch, deleteMatch, type Match } from "@/lib/matches";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-blue-800 bg-blue-900/40 p-4 text-center">
      <p className="text-xs uppercase tracking-wider text-blue-300">{label}</p>
      <p className="mt-1 text-2xl font-bold text-teal-300">{value}</p>
    </div>
  );
}

export default function MatchDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [match, setMatch] = useState<Match | undefined>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMatch(getMatch(params.id));
    setLoaded(true);
  }, [params.id]);

  const handleDelete = () => {
    if (window.confirm("Delete this match? This cannot be undone.")) {
      deleteMatch(params.id);
      router.push("/matches");
    }
  };

  if (loaded && !match) {
    return (
      <main className="flex-1 bg-blue-950 px-5 py-8">
        <div className="mx-auto max-w-md text-center">
          <p className="text-blue-200">Match not found.</p>
          <Link
            href="/matches"
            className="mt-4 inline-block text-teal-300 underline"
          >
            Back to matches
          </Link>
        </div>
      </main>
    );
  }

  if (!match) {
    return (
      <main className="flex-1 bg-blue-950 px-5 py-8">
        <div className="mx-auto max-w-md text-blue-300">Loading…</div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-blue-950 px-5 py-8">
      <div className="mx-auto max-w-md">
        <Link
          href="/matches"
          className="text-sm text-teal-300 hover:underline"
        >
          ← Back to matches
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            {formatDate(match.date)}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              match.result === "Win"
                ? "bg-teal-400 text-blue-950"
                : "bg-orange-500 text-white"
            }`}
          >
            {match.result}
          </span>
        </div>

        {match.format && (
          <p className="mt-1 text-sm text-blue-300">{match.format}</p>
        )}

        {match.score && (
          <p className="mt-4 font-mono text-3xl font-bold text-white">
            {match.score}
          </p>
        )}

        <div className="mt-6 space-y-2 text-blue-100">
          {match.partner && (
            <p>
              <span className="text-blue-400">Partner:</span> {match.partner}
            </p>
          )}
          <p>
            <span className="text-blue-400">Opponents:</span>{" "}
            {match.opponent1 || "?"}
            {match.opponent2 ? ` & ${match.opponent2}` : ""}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat label="Mood" value={`${match.mood}/5`} />
          <Stat label="Energy" value={`${match.energy}/5`} />
          <Stat label="Rating" value={`${match.selfRating}/10`} />
        </div>

        {match.notes && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-orange-400">Notes</p>
            <p className="whitespace-pre-wrap rounded-xl border border-blue-800 bg-blue-900/40 p-4 text-blue-100">
              {match.notes}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleDelete}
          className="mt-8 w-full rounded-full border border-red-500/60 py-3 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/10"
        >
          Delete match
        </button>
      </div>
    </main>
  );
}
