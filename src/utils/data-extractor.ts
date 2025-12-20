import three from "../../test/xml/json/three.json";

export const SchemaNames = [
	"DocumentHeader",
	"PreviewBoundary",
	"DefinitionProperties",
	"RcpLayout", //Remote Control Procedure Layout
	"GHALibraries",
	"ValueTable",
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
	// three.Archive.items.item;
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
		count: objChunk["@_count"],
	};
}

/**
 * Retrieves the definition objects.
 *
 * @param ghJson - Gh definition parsed from xml.
 * @returns An object containing the primary definition data and its metadata.
 * @property {any} main - The actual definition object data found in the chunk.
 * @property {number} count - The total number of components (componentCount).
 */
export function getDefinitionObject(ghJson: any) {
	return getMainChunkObj(ghJson, "DefinitionObjects");
}

// console.log(getDefinitionObject(three).main);
