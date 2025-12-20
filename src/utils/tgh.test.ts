import { expect, test } from "vitest";
import fs from "node:fs";
import { ghXmlParser } from "./gh-xml-parser";
import { getDefinitionObject, getVersion } from "./data-extractor";

const xmlFolder = "./test/xml/";
const files = fs.readdirSync("./test/xml/");

for (const file of files) {
	if (!file.endsWith(".xml")) {
		continue;
	}

	const xml = fs.readFileSync(xmlFolder + file, "utf8");
	const jsonXml = ghXmlParser.parse(xml);
	fs.writeFileSync(
		xmlFolder + "json/" + file.replace(".xml", ".json"),
		JSON.stringify(jsonXml, null, 2)
	);

	test(`testGetVersion ${file}`, () => {
		testGetVersion(jsonXml);
	});

	test(`testGetDefinitionObject ${file}`, () => {
		testGetMainChunks(jsonXml, file);
	});
}

function testGetVersion(jsonXml: any) {
	const { major, minor, revision } = getVersion(jsonXml);
	expect(major).toBe(0);
	expect(minor).toBe(2);
	expect(revision).toBe(2);
}

function testGetMainChunks(jsonXml: any, file: string) {
	const r = getDefinitionObject(jsonXml);

	fs.writeFileSync(
		xmlFolder + `defObj/${file.replace(".xml", ".json")}`,
		JSON.stringify(r.main[0], null, 2)
	);

	const mainBodyLength = r.main.length;
	expect(mainBodyLength).toBe(r.count); // this one is just testing the count
}
