import { XMLParser } from "fast-xml-parser";
import { parseGrasshopper, type ParsedXml } from "./parser.js";

async function main() {
  const args = process.argv.slice(2);
  const inputFile = args[0] || "brep-area-Wire_1.xml";
  const outputFile = args[1] || inputFile.replace(".xml", "_optimized.json");
  
  console.log(`Parsing ${inputFile}...`);
  
  try {
    const xmlContent = await Bun.file(inputFile).text();
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      parseAttributeValue: false,
      parseTagValue: false,
      trimValues: true,
      isArray: (name) => {
        // Always return arrays for these elements
        return ["item", "chunk"].includes(name);
      }
    });
    
    const parsed = parser.parse(xmlContent) as ParsedXml;
    
    const ghData = parseGrasshopper(parsed);
    
    await Bun.write(outputFile, JSON.stringify(ghData, null, 2));
    
    console.log(`✓ Written to ${outputFile}`);
    console.log(`  Components: ${Object.keys(ghData.components).length}`);
    console.log(`  Wires: ${ghData.wires.length}`);
    
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
