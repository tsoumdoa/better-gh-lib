import {
	getBounds,
	getIdentifier,
	getInstanceIdentifier,
	getInterfaceDescriptor,
	getPivot,
	parseIOs,
} from "./helper";
import {
	Bound,
	CanvasPoint,
	GhaLibDiscripor,
	InstanceIdentifier,
	InterfaceDescriptor,
	NodeIdentifier,
} from "./tgh";

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
export function getDefinitionObject(ghJson: any) {
	const defObj = getMainChunkObj(ghJson, "DefinitionObjects");
	const componenentCount = defObj.count;

	const identifiers: NodeIdentifier[] = [];
	const bounds: Bound[] = [];
	const pivots: CanvasPoint[] = [];
	const instanceIdentifiers: InstanceIdentifier[] = [];
	const interfaceDescriptors: InterfaceDescriptor[] = [];
	const ios: any[] = [];

	for (const obj of defObj.main) {
		identifiers.push(getIdentifier(obj));
		bounds.push(getBounds(obj));
		pivots.push(getPivot(obj));
		instanceIdentifiers.push(getInstanceIdentifier(obj));
		interfaceDescriptors.push(getInterfaceDescriptor(obj));
		ios.push(parseIOs(obj));
	}

	return {
		defObj: defObj,
		componenentCount: componenentCount,
		identifiers: identifiers,
		pivots: pivots,
		bounds: bounds,
		instanceIdentifiers: instanceIdentifiers,
		interfaceDescriptors: interfaceDescriptors,
		ios: ios,
	};
}
export type DefinitionObjectResult = ReturnType<typeof getDefinitionObject>;

export function getGhaLibraryDescriptors(ghJson: any) {
	const descs: GhaLibDiscripor[] = [];
	const ghaLibs = getMainChunkObj(ghJson, "GHALibraries");

	for (const ghaLib of ghaLibs.main) {
		//@ts-ignore
		const author = ghaLib.items.item.find((i) => i["@_name"] === "Author");
		//@ts-ignore
		const name = ghaLib.items.item.find((i) => i["@_name"] === "Name");
		//@ts-ignore
		const version = ghaLib.items.item.find((i) => i["@_name"] === "Version");
		//@ts-ignore
		const ghaLibId = ghaLib.items.item.find((i) => i["@_name"] === "Id");

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
		ghaLibs: ghaLibs,
		descriptor: descs,
		isAlltanilla: descs.length === 0,
	};
}
export type GhaLibraryDescriptorsResult = ReturnType<
	typeof getGhaLibraryDescriptors
>;
