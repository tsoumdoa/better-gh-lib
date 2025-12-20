import { GhXmlType } from "../types/types";

type DrawType = "Thick" | "Thin" | "Hidden"; //TODO: check these names...
const NODE_TYPES = [
	"Relay",
	"Compoemnent",
	"Group",
	"CSharpCodeBlock",
	"PythonCodeBlock",
	"AndMOre...",
] as const;

type Group = {
	index: number[];
};

export type TghCanvas = {
	ghXmlJson?: GhXmlType;
	stats: {
		GhVersion: string;
		uniqueCount: number;
		canvasSize: DrawSize;
		totalNodeCount: number;
		componentcount: number;
		UniqueComponentCount: number;
		groupCount: number;
	};
	plugins: {
		names: string[];
		count: number;
	};
	Nodes: TghNode[];
	Groups?: Group[];
	connections: Connection[];

	// getNodeCounts: () => Promise<number[]>;
};

type Connection = {
	from: number;
	to: number;
};

type NodeType = (typeof NODE_TYPES)[number];
type CanvasPoint = {
	x: number;
	y: number;
};

type DrawSize = {
	width: number;
	height: number;
};

type Bound = CanvasPoint & DrawSize;

type Parameter = {
	guid: string;
	type: string;
	name: string;
	location: CanvasPoint;
};

type InputParameter = Parameter & {
	paramOverride: string;
	drawType: DrawType;
};

type OutputParameter = Parameter & {
	//
};

type TghNode = {
	type: NodeType;
	guid: string;
	author: string;
	locked: boolean;
	preview: boolean;
	input: InputParameter[];
	output: OutputParameter[];
	parents: string[];
	bounds: Bound;
	pivot: CanvasPoint;
};
