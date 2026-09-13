import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../data/scenes.ts", import.meta.url), "utf8");
const reiLines = [...source.matchAll(/speaker:\s*"REI",\s*text:\s*"([^"]*)"/g)].map(match => match[1]);
const banned = ["俺", "僕"];
const violations = [];

reiLines.forEach((text, index) => {
  for (const word of banned) {
    if (text.includes(word)) violations.push({ index: index + 1, word, text });
  }
});

if (violations.length > 0) {
  console.error("Reiのセリフに男性一人称が混入しています:");
  for (const item of violations) {
    console.error(`- #${item.index}: [${item.word}] ${item.text}`);
  }
  process.exit(1);
}

console.log(`OK: Rei dialogue consistency (${reiLines.length} lines checked)`);
