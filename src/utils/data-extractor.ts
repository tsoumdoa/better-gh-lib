import {
	handleIdentifier,
	parseIOs,
	getScripts,
} from "./handler";
import { extractComponentBounds, extractComponentPivot, extractInstanceIdentifier, findObjByAtName } from "./helper";
import {
	Bound,
	CanvasPoint,
	GhaLibDiscripor,
	InstanceIdentifier,
	NodeIdentifier,
	IOS,
} from "./tgh-types";

export const SchemaNames = [
	"Docum:ntHeader", // not so important
	"PreviewBoundary", // not so important
	"DefinitionProperties", // not so important
	"RcpLayout", //not so important - Remote Control Procedure Layout
	"ValueTable", //not so important - DefinitionProperties
	"GHALibraries",
	"DefinitionObjects",
] as const;
export type SchemaNameLiteral = (typeof SchemaNames)[number];

export function getVersion(ghJson: any) {
	return {
		major: ghJson.Archive.items.item[0].Major as number,
		minor: ghJson.Archive.items.item[0].Minor as number,
		revision: ghJson.Archive.items.item[0].Revision as number,
	};
}

export function getObjectCount(ghJson: any) {
	return {
		componentCount: ghJson.DefinitionObjects.items.item[0]
			.ObjectCount as number,
		sourceCount: ghJson.DefinitionObjects.items.item[0].SourceCount as number,
	};
}

export function getMainChunkObj(ghJson: any, chunkObjName: SchemaNameLiteral) {
	const mainChunks = ghJson.Archive.chunks.chunk[0].chunks.chunk;
	const objChunk = mainChunks.filter(
		// @ts-ignore
		(c) => c["@_name"] === chunkObjName
	)[0].chunks;

	return {
		main: objChunk.chunk,
		count: objChunk["@_count"], // count that should be the same as the length of chunk
	};
}

/**
 * Retrieves the definition objects.
 *
 * @param ghJson - Gh definition parsed from xml.
 * @returns An object containing the primary definition data and its metadata.
 * @property {any} main - The actual definition object data found in the chunk.
 * @property {number} count - The total number of components (componentCount).
 *
 */
export function getDefObj(ghJson: any) {
	const defObj = getMainChunkObj(ghJson, "DefinitionObjects");
	const componenentCount = defObj.count;

	const identifiers: NodeIdentifier[] = [];
	const bounds: Bound[] = [];
	const pivots: CanvasPoint[] = [];
	const instanceIdentifiers: InstanceIdentifier[] = [];
	const ios: IOS[] = [];
	const scripts: any[] = [];

	for (const obj of defObj.main) {
		identifiers.push(handleIdentifier(obj));
		bounds.push(extractComponentBounds(obj));
		pivots.push(extractComponentPivot(obj));
		instanceIdentifiers.push(extractInstanceIdentifier(obj) as any);
		ios.push(parseIOs(obj));
		scripts.push(getScripts(obj));
	}
	const allGuids = identifiers.map((c) => c.guid);
	const uniqueGuids = new Set(allGuids);
	const uniqueCount = uniqueGuids.size;

	return {
		componenentCount: componenentCount,
		uniqueCount: uniqueCount,
		identifiers: identifiers,
		pivots: pivots,
		bounds: bounds,
		instanceIdentifiers: instanceIdentifiers,
		ios: ios,
		scripts: scripts,
	};
}
export type DefinitionObjectResult = ReturnType<typeof getDefObj>;

export function getGhaLibraryDescriptors(ghJson: any) {
	const descs: GhaLibDiscripor[] = [];
	const ghaLibs = getMainChunkObj(ghJson, "GHALibraries");

	for (const ghaLib of ghaLibs.main) {
		const item = ghaLib.items.item;
		const author = findObjByAtName(item, "Author");
		const name = findObjByAtName(item, "Name");
		const version = findObjByAtName(item, "Version");
		const ghaLibId = findObjByAtName(item, "Id");

		const n = name?.["#text"] ?? "";

		if (n === "Grasshopper") continue;

		descs.push({
			name: n,
			author: author?.["#text"] ?? "",
			version: version?.["#text"] ?? "",
			libId: ghaLibId?.["#text"] ?? "",
		});
	}

	return {
		descriptor: descs,
		isAllVanilla: descs.length === 0,
	};
}
export type GhaLibraryDescriptorsResult = ReturnType<
	typeof getGhaLibraryDescriptors
>;
