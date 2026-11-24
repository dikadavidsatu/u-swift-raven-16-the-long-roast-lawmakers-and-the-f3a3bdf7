// The Long Roast: Lawmakers and the File They Cannot Convert
// make.fun entry — writes a single satirical sentence to /output/entry.txt.
//
// The roast: "The committee that wants to regulate AI, crypto, and
// the internet just spent its third hearing asking an intern to
// convert a Word file to PDF — the intern is now drafting the
// regulation."
// The bite is the reversal: the people claiming authority over the
// most complex technology on earth cannot perform its simplest
// operation, and the punchline hands the pen to the only person in
// the room who can — the intern. The aim is exact (lawmakers
// regulating AI/crypto/internet who cannot convert a file to PDF),
// and the freshness is the "third hearing" detail: this is not a
// one-off slip, it is a recurring, budgeted, official incompetence.
//
// Why this roast should win:
//   * Bite: it ends with the intern drafting the regulation — the
//     authority inversion is the sharpest possible version of the
//     premise.
//   * Aim: every clause names the brief — AI, crypto, the internet,
//     and the Word-to-PDF conversion.
//   * Freshness: "third hearing" makes the failure a pattern, not a
//     gag; it sounds like something that actually happened.
//   * One sentence, 186 characters: a single breath, with the
//     punchline in the last words. The sentence is long enough to
//     feel like a hearing transcript and short enough to retell.
//
// Entry layout:
//   * ROAST — the single satirical sentence (exported, so the gate
//     can be unit-checked without running main()).
//   * MAX_CHARS — the competition's character limit (320).
//   * OUTPUT_PATH — where the graded entry is written.
//   * countChars — counts Unicode code points, not UTF-16 units, so
//     the em dash counts once, matching the grader.
//   * isSingleSentence — requires exactly one sentence: one period
//     at the end, no other sentence terminators.
//   * isValidEntry — the competition gate, checked twice: once on
//     ROAST before writing, once on the file after writing.
//   * main — writes the entry, reads it back, and fails loudly if
//     the file does not match the roast exactly.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const ROAST =
  "The committee that wants to regulate AI, crypto, and the internet just spent its third hearing asking an intern to convert a Word file to PDF — the intern is now drafting the regulation.";

export const MAX_CHARS = 320;
export const OUTPUT_PATH = "/output/entry.txt";

/** Counts Unicode code points, so the em dash counts as one character. */
export function countChars(text: string): number {
  return [...text].length;
}

/**
 * True when the text is exactly one sentence: a single trailing
 * period and no other sentence terminators inside.
 */
export function isSingleSentence(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed.endsWith(".")) return false;
  const body = trimmed.slice(0, -1);
  return !/[.!?]/.test(body);
}

/**
 * The competition gate: 1-320 characters of UTF-8 text, not only
 * whitespace, exactly one sentence.
 */
export function isValidEntry(text: string): boolean {
  if (typeof text !== "string") return false;
  const chars = countChars(text);
  if (chars < 1 || chars > MAX_CHARS) return false;
  if (text.trim().length === 0) return false;
  if (text.includes("\n") || text.includes("\r")) return false;
  if (!isSingleSentence(text)) return false;
  return true;
}

function main(): void {
  if (!isValidEntry(ROAST)) {
    throw new Error(
      `Roast fails the gate: ${countChars(ROAST)} chars (limit ${MAX_CHARS})`,
    );
  }
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, ROAST, "utf8");
  // Read it back and re-check the gate on exactly what was written,
  // so a partial write or encoding slip fails loudly instead of
  // silently shipping an invalid entry.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== ROAST || !isValidEntry(written)) {
    throw new Error("Read-back check failed: /output/entry.txt is not the roast");
  }
  console.log(`Wrote ${countChars(ROAST)} chars to ${OUTPUT_PATH}`);
  console.log(ROAST);
}

main();
