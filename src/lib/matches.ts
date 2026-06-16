// Single source of truth for match data.
//
// The rest of the app must ONLY use the exported functions below and must never
// touch localStorage directly. To move to a real database later, we only rewrite
// the internals of this file (and make these functions async) — the screens stay
// the same.

export type MatchFormat = "Doubles" | "Americano";
export type MatchResult = "Win" | "Loss";

export interface Match {
  id: string;
  date: string; // ISO date, e.g. "2026-06-17"
  format?: MatchFormat;
  partner: string;
  opponent1: string;
  opponent2: string;
  score: string; // free text, e.g. "6-3 6-4"
  result: MatchResult;
  mood: number; // 1–5
  energy: number; // 1–5
  selfRating: number; // 1–10
  notes: string;
  createdAt: number; // timestamp, used for newest-first sorting
}

// Everything needed to create a match, minus the fields we generate ourselves.
export type NewMatch = Omit<Match, "id" | "createdAt">;

const STORAGE_KEY = "padelpro.matches.v1";

function readAll(): Match[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Match[]) : [];
  } catch {
    return [];
  }
}

function writeAll(matches: Match[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
}

/** All matches, newest first. */
export function getMatches(): Match[] {
  return readAll().sort((a, b) => b.createdAt - a.createdAt);
}

/** A single match by id, or undefined if not found. */
export function getMatch(id: string): Match | undefined {
  return readAll().find((m) => m.id === id);
}

/** Create and persist a new match. Returns the saved match (with id). */
export function addMatch(input: NewMatch): Match {
  const match: Match = {
    ...input,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()) + Math.random().toString(16).slice(2),
    createdAt: Date.now(),
  };
  const all = readAll();
  all.push(match);
  writeAll(all);
  return match;
}

/** Delete a match by id. */
export function deleteMatch(id: string): void {
  writeAll(readAll().filter((m) => m.id !== id));
}
