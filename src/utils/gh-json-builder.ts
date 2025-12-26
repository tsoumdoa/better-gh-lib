import {
	getDefObj,
	getGhaLibraryDescriptors,
	getVersion,
} from "./data-extractor";
import { ghXmlParser } from "./gh-xml-parser";

export function buildGhJson(xml: any) {
	const jsonXml = ghXmlParser.parse(xml);

	const version = getVersion(jsonXml);
	const defObjs = getDefObj(jsonXml);
	const ghLibs = getGhaLibraryDescriptors(jsonXml);

	return {
		GhVersion: `${version.major}.${version.minor}.${version.revision}`,
		...defObjs,
		ghLibs: ghLibs.descriptor,
		isAllVanilla: ghLibs.isAllVanilla,
	};
}
