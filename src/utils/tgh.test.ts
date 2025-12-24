import { expect, test } from "vitest";
import fs from "node:fs";
import { ghXmlParser } from "./gh-xml-parser";
import {
	getDefinitionObject,
	getGhaLibraryDescriptors,
	getVersion,
} from "./data-extractor";
import { writeDefObjTofiles, writeGhaLibsToFiles } from "./tgh-test-helper";

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

	writeGhaLibsToFiles(r, file, xmlFolder);
	for (const ghaLib of r.descriptor) {
		expect(ghaLib.name).toEqual(expect.any(String));
		expect(ghaLib.author).toEqual(expect.any(String));
		expect(ghaLib.version).toEqual(expect.any(String));
	}

	const isAllVanilla = r.isAlltanilla;
	expect(isAllVanilla).toBe(r.descriptor.length === 0);
}

function testGetDefObject(jsonXml: any, file: string) {
	const r = getDefinitionObject(jsonXml);

	writeDefObjTofiles(r, file, xmlFolder);

	// might not be so useful but ok for now
	for (const obj of r.defObj.main) {
		const atName = obj["@_name"];
		expect(atName).toBe("Object");
	}

	const mainBodyLength = r.defObj.main.length;
	expect(mainBodyLength).toBe(r.componenentCount); // this one is just testing the count

	// main body length is number of components
	//length of identifiers, pivots, bounds should be the same as the main body length
	expect(r.identifiers.length).toBe(mainBodyLength);
	expect(r.pivots.length).toBe(mainBodyLength);
	expect(r.bounds.length).toBe(mainBodyLength);
	expect(r.interfaceDescriptors.length).toBe(mainBodyLength);
}
