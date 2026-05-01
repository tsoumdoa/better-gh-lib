import type { ParsedGrasshopper } from "parser/sand/src/types";
import { generateNodes } from "./lib/node-generator";
import { generateEdges } from "./lib/edge-generator";
import type { GHNode } from "./types/type";

export function generateFlowData(parsed: ParsedGrasshopper): {
	nodes: GHNode[];
	edges: import("@xyflow/react").Edge[];
} {
	const nodes = generateNodes(parsed.components);
	const nodeIds = new Set(nodes.map((n) => n.id));
	const edges = generateEdges(parsed.wires, nodeIds);

	return { nodes, edges };
}

export function getComponentCount(parsed: ParsedGrasshopper): number {
	return Object.keys(parsed.components).length;
}

export function getUniqueLibraryCount(parsed: ParsedGrasshopper): number {
	const libraries = parsed.metadata?.libraries ?? [];
	return new Set(libraries.map((l) => l.name)).size;
}
