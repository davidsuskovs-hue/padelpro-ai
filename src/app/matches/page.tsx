"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMatches, type Match } from "@/lib/matches";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMatches(getMatches());
    setLoaded(true);
  }, []);

  return (
    <main className="flex-1 bg-blue-950 px-5 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Matches</h1>
          <Link
            href="/log"
            className="rounded-full bg-blue-700 px-4 py-2 text-sm font-bold text-white ring-2 ring-orange-400"
          >
            + Log
          </Link>
        </div>

        {loaded && matches.length === 0 && (
          <div className="rounded-2xl border border-blue-800 bg-blue-900/40 p-8 text-center">
            <p className="text-blue-200">No matches yet.</p>
            <Link
              href="/log"
              className="mt-4 inline-block rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white"
            >
              Log your first match
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {matches.map((m) => (
            <Link
              key={m.id}
              href={`/matches/${m.id}`}
              className="block rounded-2xl border border-blue-800 bg-blue-900/50 p-4 transition-colors hover:border-teal-400"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-300">
                  {formatDate(m.date)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    m.result === "Win"
                      ? "bg-teal-400 text-blue-950"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  {m.result}
                </span>
              </div>
              {m.score && (
                <p className="mt-2 font-mono text-lg font-bold text-white">
                  {m.score}
                </p>
              )}
              <p className="mt-1 text-sm text-blue-200">
                vs {m.opponent1 || "?"}
                {m.opponent2 ? ` & ${m.opponent2}` : ""}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
