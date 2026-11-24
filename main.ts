// Make the Judge Smile: writes one warm line to entry.txt.
// The line lives in entry.txt beside this program; this program reads
// it and copies it to the output directory the harness names.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

// Read the entry line from beside this program. If entry.txt is
// missing or unreadable, fail with one clear line on stderr and
// exit 1 instead of dumping an uncaught-exception stack trace.
function readEntry(path: string): string {
  try {
    return readFileSync(path, "utf8").trim();
  } catch {
    console.error(`error: entry.txt not found or unreadable at ${path}`);
    process.exit(1);
  }
}

const line = readEntry(join(here, "entry.txt"));

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
const expected = line + "\n";
writeFileSync(outPath, expected, "utf8");

// Read the written file back and verify it matches the source
// text exactly, so a truncated or corrupted write fails loudly
// instead of being silently judged.
const written = readFileSync(outPath, "utf8");
if (written !== expected) {
  console.error("error: written output does not match entry.txt");
  process.exit(1);
}
