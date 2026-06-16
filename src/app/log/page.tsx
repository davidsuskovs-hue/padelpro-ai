"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addMatch, type MatchFormat, type MatchResult } from "@/lib/matches";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** A row of tappable number buttons (1..max). */
function Scale({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (n: number) => void;
  max: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`h-10 w-10 rounded-lg border text-sm font-semibold transition-colors ${
            value === n
              ? "border-teal-400 bg-teal-400 text-blue-950"
              : "border-blue-700 bg-blue-900 text-blue-200 hover:border-teal-400"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

const fieldClass =
  "w-full rounded-lg border border-blue-700 bg-blue-900 px-4 py-3 text-base text-white placeholder:text-blue-400 focus:border-teal-400 focus:outline-none";
const labelClass = "mb-2 block text-sm font-semibold text-blue-200";

export default function LogMatchPage() {
  const router = useRouter();

  const [date, setDate] = useState(today());
  const [format, setFormat] = useState<MatchFormat | "">("");
  const [partner, setPartner] = useState("");
  const [opponent1, setOpponent1] = useState("");
  const [opponent2, setOpponent2] = useState("");
  const [score, setScore] = useState("");
  const [result, setResult] = useState<MatchResult>("Win");
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [selfRating, setSelfRating] = useState(5);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMatch({
      date,
      format: format === "" ? undefined : format,
      partner: partner.trim(),
      opponent1: opponent1.trim(),
      opponent2: opponent2.trim(),
      score: score.trim(),
      result,
      mood,
      energy,
      selfRating,
      notes: notes.trim(),
    });
    router.push("/matches");
  };

  return (
    <main className="flex-1 bg-blue-950 px-5 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-2xl font-bold text-white">Log a match</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass} htmlFor="date">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={fieldClass}
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="format">
              Match format <span className="text-blue-400">(optional)</span>
            </label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value as MatchFormat | "")}
              className={fieldClass}
            >
              <option value="">—</option>
              <option value="Doubles">Doubles</option>
              <option value="Americano">Americano</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="partner">
              My partner&apos;s name
            </label>
            <input
              id="partner"
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              className={fieldClass}
              placeholder="e.g. Alex"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="opp1">
                Opponent 1
              </label>
              <input
                id="opp1"
                value={opponent1}
                onChange={(e) => setOpponent1(e.target.value)}
                className={fieldClass}
                placeholder="Name"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="opp2">
                Opponent 2
              </label>
              <input
                id="opp2"
                value={opponent2}
                onChange={(e) => setOpponent2(e.target.value)}
                className={fieldClass}
                placeholder="Name"
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="score">
              Final score
            </label>
            <input
              id="score"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className={fieldClass}
              placeholder="e.g. 6-3 6-4"
            />
          </div>

          <div>
            <span className={labelClass}>Result</span>
            <div className="grid grid-cols-2 gap-3">
              {(["Win", "Loss"] as MatchResult[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setResult(r)}
                  className={`rounded-lg border py-3 text-base font-bold transition-colors ${
                    result === r
                      ? r === "Win"
                        ? "border-teal-400 bg-teal-400 text-blue-950"
                        : "border-orange-500 bg-orange-500 text-white"
                      : "border-blue-700 bg-blue-900 text-blue-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-blue-800 bg-blue-900/40 p-4">
            <p className="text-sm font-semibold text-orange-400">How it went</p>
            <div>
              <span className={labelClass}>Mood (1–5)</span>
              <Scale value={mood} onChange={setMood} max={5} />
            </div>
            <div>
              <span className={labelClass}>Energy (1–5)</span>
              <Scale value={energy} onChange={setEnergy} max={5} />
            </div>
            <div>
              <span className={labelClass}>Self-rating (1–10)</span>
              <Scale value={selfRating} onChange={setSelfRating} max={10} />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className={fieldClass}
              placeholder="What worked, what to improve..."
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-blue-700 py-4 text-lg font-bold text-white ring-2 ring-orange-400 transition-colors hover:bg-blue-600"
          >
            Save match
          </button>
        </form>
      </div>
    </main>
  );
}
