import { expect, test } from "vitest";
import fs from "node:fs";
import { ghXmlParser } from "./gh-xml-parser";
import {
	getDefinitionObject,
	getGhaLibraryDescriptors,
	getVersion,
} from "./data-extractor";

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
		testGetDefObject(jsonXml, file);
	});

	test(`testGetGhaLibraries ${file}`, () => {
		testGetGhaLibraries(jsonXml, file);
	});
}

function testGetVersion(jsonXml: any) {
	const { major, minor, revision } = getVersion(jsonXml);
	expect(major).toBe(0);
	expect(minor).toBe(2);
	expect(revision).toBe(2);
}

function testGetGhaLibraries(jsonXml: any, file: string) {
	const r = getGhaLibraryDescriptors(jsonXml);

	fs.writeFileSync(
		xmlFolder + `ghaLibs/${file.replace(".xml", ".json")}`,
		JSON.stringify(r.ghaLibs.main, null, 2)
	);

	fs.writeFileSync(
		xmlFolder + `ghaLibsDescriptor/${file.replace(".xml", ".json")}`,
		JSON.stringify(r.descriptor, null, 2)
	);

	for (const ghaLib of r.descriptor) {
		expect(ghaLib.name).toEqual(expect.any(String));
		expect(ghaLib.author).toEqual(expect.any(String));
		expect(ghaLib.version).toEqual(expect.any(String));
	}

	const mainBodyCount = r.ghaLibs.count;
	const mainBodyLength = r.ghaLibs.main.length;
	const parsedLength = r.descriptor.length;
	expect(mainBodyCount).toBe(mainBodyLength);
	expect(mainBodyLength).toBe(parsedLength);
}

function testGetDefObject(jsonXml: any, file: string) {
	const r = getDefinitionObject(jsonXml);

	//write defObj to file
	fs.writeFileSync(
		xmlFolder + `defObj/${file.replace(".xml", ".json")}`,
		JSON.stringify(r.defObj.main[0], null, 2) // exporting the first object for ease of pasrsing the data structure
	);

	// write identifiers to file
	fs.writeFileSync(
		xmlFolder + `identifiers/${file.replace(".xml", ".json")}`,
		JSON.stringify(r.identifiers, null, 2)
	);

	// might not be so useful but ok for now
	for (const obj of r.defObj.main) {
		const atName = obj["@_name"];
		expect(atName).toBe("Object");
	}

	const mainBodyLength = r.defObj.main.length;
	expect(mainBodyLength).toBe(r.componenentCount); // this one is just testing the count
}
