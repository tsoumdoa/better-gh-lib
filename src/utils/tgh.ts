import { GhXmlType } from "../types/types";

export type CanvasPoint = {
	x: number;
	y: number;
};

type DrawSize = {
	width: number;
	height: number;
};

export type Bound = CanvasPoint & DrawSize;
type DrawType = "Thick" | "Thin" | "Hidden"; //TODO: check these names...
// const NODE_TYPES = [
// 	"Relay",
// 	"Compoemnent",
// 	"Group",
// 	"CSharpCodeBlock",
// 	"PythonCodeBlock",
// 	"AndMOre...",
// ] as const; //TODO: check these names...

type Group = {
	index: number[];
};

export type GhaLibDiscripor = {
	name: string;
	libId: string;
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

// type NodeType = (typeof NODE_TYPES)[number];

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
	// type: NodeType;
	// parents: string[];
	identifier: NodeIdentifier;
	instanceIdentifier: InstanceIdentifier;
	bound: Bound;
	pivot: CanvasPoint;
	interfaceDescriptor: InterfaceDescriptor;
	input: InputParameter[];
	output: OutputParameter[];
};

// Identifiers for which node is being used
export type NodeIdentifier = {
	guid: string;
	name: string;
	libId?: string;
};

export type InstanceIdentifier = {
	instanceGuid: string;
	name: string;
	nickName: string;
	description: string;
	locked: boolean;
	hidden: boolean;
	others: Record<string, string>;
};

export type InterfaceDescriptor = {
	inputCount: number;
	outputCount: number;
	inputIdentifiers: InterfaceIdentifier[];
	outputIdentifiers: InterfaceIdentifier[];
};

export type InterfaceIdentifier = {
	guid: string;
	typeCode: number;
};
