import { expect, test } from "vitest";
import fs from "node:fs";
import { XMLParser } from "fast-xml-parser";
import { GhXml } from "../../types/types";

test("test zod ghxml validation", () => {
  const xmlFolder = "./test/xml/";
  //make sure this option is same as in the zod schema...
  //todo improve this shit...
  const parser = new XMLParser({
    ignoreAttributes: false,
    ignoreDeclaration: false,
    parseTagValue: true,
    parseAttributeValue: true,
    commentPropName: "comments",
    trimValues: true,
  });
  fs.readdirSync(xmlFolder).forEach((file) => {
    if (!file.endsWith(".xml")) {
      return;
    }
    const xml = fs.readFileSync(xmlFolder + file, "utf8");

    let parsedFromXml;
    let res = false;

    try {
      parsedFromXml = parser.parse(xml);
    } catch {
      res = false;
    }
    res = false;
    try {
      GhXml.parse(parsedFromXml);
      res = true;
    } catch {
      res = false;
    }

    expect(res, `faled xml: ${file}`).toBeTruthy();
  });
});
