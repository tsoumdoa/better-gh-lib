import { XMLParser } from "fast-xml-parser";
import { parseGrasshopper, type ParsedXml } from "./parser.js";
import { glob } from "glob";
import * as path from "path";

async function processFile(inputPath: string): Promise<void> {
  const outputPath = inputPath.replace(".xml", "_optimized.json");

  try {
    const xmlContent = await Bun.file(inputPath).text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      parseAttributeValue: false,
      parseTagValue: false,
      trimValues: true,
      isArray: (name) => ["item", "chunk"].includes(name)
    });

    const parsed = parser.parse(xmlContent) as ParsedXml;
    const ghData = parseGrasshopper(parsed);

    await Bun.write(outputPath, JSON.stringify(ghData, null, 2));

    console.log(`✓ ${path.basename(inputPath)}`);
    console.log(`  Components: ${Object.keys(ghData.components).length}`);
    console.log(`  Wires: ${ghData.wires.length}`);

  } catch (error) {
    console.error(`✗ ${path.basename(inputPath)}: ${error}`);
  }
}

async function main() {
  const pattern = process.argv[2] || "xmls/*.xml";

  console.log(`Looking for XML files matching: ${pattern}\n`);

  const files = await glob(pattern);

  if (files.length === 0) {
    console.log("No XML files found.");
    return;
  }

  console.log(`Found ${files.length} XML file(s)\n`);

  for (const file of files.sort()) {
    await processFile(file);
    console.log();
  }

  console.log("Done!");
}

main();
