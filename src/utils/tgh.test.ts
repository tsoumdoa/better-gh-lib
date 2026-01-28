import { expect, test } from "vitest";
import fs from "node:fs";
import { ghXmlParser } from "./gh-xml-parser";
import {
  getDefObj,
  getGhaLibraryDescriptors,
  getVersion,
} from "./data-extractor";
import { writeDefObjTofiles, writeGhaLibsToFiles } from "./tgh-test-helper";
import { buildGhJson } from "./gh-json-builder";

const xmlFolder = "./test/xml/";
const files = fs.readdirSync("./test/xml/");

for (const file of files) {
  if (!file.endsWith(".xml")) {
    continue;
  }

  const xml = fs.readFileSync(xmlFolder + file, "utf8");
  const parsed = buildGhJson(xml);

  fs.writeFileSync(
    xmlFolder + "parsed/" + file.replace(".xml", ".json"),
    JSON.stringify(parsed, null, 2)
  );

  const jsonXml = ghXmlParser.parse(xml);
  fs.writeFileSync(
    xmlFolder + "devs/json/" + file.replace(".xml", ".json"),
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
}

function testGetDefObject(jsonXml: any, file: string) {
  const r = getDefObj(jsonXml);

  const identifierLength = r.identifiers.length;

  expect(identifierLength).toBe(r.componenentCount);
  expect(identifierLength).toBe(r.bounds.length);
  expect(identifierLength).toBe(r.pivots.length);
  expect(identifierLength).toBe(r.instanceIdentifiers.length);
  expect(identifierLength).toBe(r.ios.length);

  writeDefObjTofiles(r, file, xmlFolder);
}
