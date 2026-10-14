// Prints cyclomatic complexity for every function, worst first.
// ESLint does the counting; the gate itself lives in eslint.config.mjs.
import { ESLint } from "eslint";

const eslint = new ESLint({
  overrideConfig: { rules: { complexity: ["warn", 0] } },
  cache: false,
});
const results = await eslint.lintFiles(["src", "scripts"]);

const rows = results.flatMap((file) =>
  file.messages
    .filter((m) => m.ruleId === "complexity")
    .map((m) => ({
      where: `${file.filePath.replace(process.cwd() + "/", "")}:${m.line}`,
      name: m.message.match(/^(.*?) has a complexity/)?.[1] ?? "?",
      cc: Number(m.message.match(/complexity of (\d+)/)?.[1]),
    })),
);
rows.sort((a, b) => b.cc - a.cc);

const band = (cc) => (cc > 10 ? "refactor" : cc > 5 ? "watch" : "ok");
console.log("| CC | Band | Function | Where |\n|---|---|---|---|");
for (const row of rows.filter((r) => r.cc > 3)) {
  console.log(`| ${row.cc} | ${band(row.cc)} | ${row.name} | ${row.where} |`);
}
const max = rows[0]?.cc ?? 0;
console.log(`\n${rows.length} functions, max ${max}, ${rows.filter((r) => r.cc > 5).length} above 5. Showing CC > 3.`);
process.exit(max > 10 ? 1 : 0);
