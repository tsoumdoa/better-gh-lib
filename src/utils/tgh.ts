import { GhXmlType } from "../types/types";

type CanvasPoint = {
	x: number;
	y: number;
};

type DrawSize = {
	width: number;
	height: number;
};

type Bound = CanvasPoint & DrawSize;
type DrawType = "Thick" | "Thin" | "Hidden"; //TODO: check these names...
const NODE_TYPES = [
	"Relay",
	"Compoemnent",
	"Group",
	"CSharpCodeBlock",
	"PythonCodeBlock",
	"AndMOre...",
] as const; //TODO: check these names...

type Group = {
	index: number[];
};

export type GhaLibDiscripor = {
	name: string;
	author: string;
	version: string;
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
		names: GhaLibDiscripor[];
		count: number;
	};
	Nodes: TghNode[];
	Groups?: Group[];
	connections: Connection[];
};

type Connection = {
	from: number;
	to: number;
};

type NodeType = (typeof NODE_TYPES)[number];

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
	identifier: NodeIdentifier;
	// type: NodeType;
	// guid: string;
	// author: string;
	// locked: boolean;
	// preview: boolean;
	// input: InputParameter[];
	// output: OutputParameter[];
	// parents: string[];
	// bounds: Bound;
	// pivot: CanvasPoint;
};

export type NodeIdentifier = {
	guid: string;
	name: string;
};
