import { bench } from "vitest";
import { compress, decompress } from "./gzip";
import fs from "node:fs";

bench(
  "compression",
  () => {
    const xml = fs.readFileSync("./public/xml/test.xml", "utf8");
    compress(xml);
  },
  { time: 1000 }
);

bench(
  "decompression",
  () => {
    const xml = fs.readFileSync("./public/xml/test.xml", "utf8");
    const compressed = compress(xml);
    decompress(compressed);
  },
  { time: 1000 }
);
