import { compress, decompress } from "./gzip";
import { expect, test } from "vitest";
import fs from "node:fs";

test("test compression and decompression", () => {
	const text = "hello world world";
	const compressed = compress(text);
	const decompressed = decompress(compressed);
	const stringFromBuffer = new TextDecoder().decode(decompressed);
	expect(stringFromBuffer).toBe("hello world world");
});

test("text compress and decompress xml", () => {
	const xml = fs.readFileSync("./test/xml/test.xml", "utf8");
	const compressed = compress(xml);
	const decompressed = decompress(compressed);
	const stringFromBuffer = new TextDecoder().decode(decompressed);
	expect(stringFromBuffer).toBe(xml);
});
