// Make the Judge Smile — make.fun entry (program/v1, Node 22, stdlib only).
//
// Writes one line about a small good thing that happened today to
// /output/entry.txt. Fully deterministic: no network, no randomness, no clock.
//
// The line was picked from 8 fresh candidates, written in this session, by a
// pairwise tournament judged on the published brief's criteria, in order:
// (1) a small good thing today, (2) warmth, (3) surprise, (4) one concrete
// detail, (5) fresh wording. The bracket and each verdict are recorded below
// so the choice can be re-derived from this file alone.

import { mkdirSync, writeFileSync } from "node:fs";

// 1-indexed in the comments; index 0 in the array.
const CANDIDATES: readonly string[] = [
  // 1 — 99 chars. Warm recognition, but the gentlest turn of the eight.
  "The parking guard waved my motorbike in before I slowed down — he remembered my plate from Tuesday.",
  // 2 — 109 chars. The cat's company is warm; "booked the seat" is a fresh turn.
  "A stray cat picked my lap over the sunny step and stayed through my whole coffee like it had booked the seat.",
  // 3 — 102 chars. Real kindness, but the umbrella image is a familiar one.
  "A stranger shared his umbrella until my ride came, then walked back into the rain like it was nothing.",
  // 4 — 86 chars. Three mangoes plus a verbatim note: concrete and charming.
  "My neighbour left three mangoes at my door with a note: 'from the tree, not the shop.'",
  // 5 — 97 chars. WINNER. A child silently watching a stranger fail a crossword,
  // then lending the crayon: the observer becomes the helper, the adult the helped.
  "A kid on the bus lent me his crayon so I could finish the crossword he had been watching me fail.",
  // 6 — 87 chars. A specific bilingual detail; "believed her all day" lands well.
  "The coffee lady wrote 'selamat pagi, yang rajin' on my cup, and I believed her all day.",
  // 7 — 103 chars. Joyful, but amusement at a stranger rather than warmth.
  "My ojek driver sang so badly at the red light that the whole intersection laughed with him, not at him.",
  // 8 — 99 chars. A mother's excitement over a blooming jasmine; the abrupt
  // hang-up is a real, recognisable mum-ism.
  "Mum called just to say the jasmine she planted finally bloomed, then hung up before I could answer.",
];

// Pairwise results, keyed "a-v-b" = true when a beat b. Bracket:
// QF: 2>1, 4>3, 5>6, 8>7 · SF: 4>2, 5>8 · Final: 5>4.
const BEATS: Readonly<Record<string, boolean>> = {
  "2v1": true, // "booked the seat" turns harder than being waved in.
  "4v3": true, // the note's punch beats a familiar umbrella kindness.
  "5v6": true, // a child rescuing an adult's crossword beats a friendly cup.
  "8v7": true, // a mother's joy over jasmine beats shared laughter.
  "4v2": true, // "from the tree, not the shop" out-turns "booked the seat".
  "5v8": true, // role reversal (kid helps adult) beats the abrupt hang-up.
  "5v4": true, // two turns in one scene (watched me fail, then helped) beat one note.
};

function beats(a: number, b: number): boolean {
  const key = `${a}v${b}`;
  if (key in BEATS) return BEATS[key];
  const flipped = `${b}v${a}`;
  if (flipped in BEATS) return !BEATS[flipped];
  throw new Error(`no pairwise result recorded for ${a} vs ${b}`);
}

function pickWinner(): number {
  const qf1 = beats(2, 1) ? 2 : 1;
  const qf2 = beats(4, 3) ? 4 : 3;
  const qf3 = beats(5, 6) ? 5 : 6;
  const qf4 = beats(8, 7) ? 8 : 7;
  const sf1 = beats(qf2, qf1) ? qf2 : qf1;
  const sf2 = beats(qf3, qf4) ? qf3 : qf4;
  return beats(sf1, sf2) ? sf1 : sf2;
}

function main(): void {
  const winner = pickWinner();
  const line = CANDIDATES[winner - 1];

  // Gate self-check, mirroring the sealed scorer: UTF-8, 1–200 code points,
  // exactly one line, not only whitespace.
  const chars = [...line].length;
  if (chars < 1 || chars > 200) throw new Error(`line is ${chars} chars, gate is 1-200`);
  if (line.trim().length === 0) throw new Error("line is only whitespace");
  if (line.includes("\n") || line.includes("\r")) throw new Error("line must be a single line");

  mkdirSync("/output", { recursive: true });
  // No trailing newline: the file is exactly the one line, so the gate's
  // 1–200 character count reads the line itself (97 chars).
  writeFileSync("/output/entry.txt", line, "utf8");
}

main();
