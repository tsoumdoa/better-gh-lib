import { parseIOs } from "./handler";

export type CanvasPoint = {
	x: number;
	y: number;
};

type DrawSize = {
	width: number;
	height: number;
};

export type Bound = CanvasPoint & DrawSize;
// type DrawType = "Thick" | "Thin" | "Hidden";
const NODE_TYPES = [
	"Compoemnent",
	"Relay",
	"Group",
	"CSharpCodeBlock",
	"PythonCodeBlock",
] as const;

type Group = {
	index: number[];
};

export type GhaLibDiscripor = {
	name: string;
	libId: string;
	author: string;
	version: string;
};

export type GhJsonScript = {
	stats: {
		GhVersion: {
			major: number;
			minor: number;
			revision: number;
		};
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

type IoParam = Parameter & {
	type: "Input" | "Output";
	description: string;
	instanceGuid: string;
	name: string;
	nickName: string;
	[key: string]: any;
};

type TghNode = {
	type: NodeType;
	identifier: NodeIdentifier;
	instanceIdentifier: InstanceIdentifier;
	bound: Bound;
	pivot: CanvasPoint;
	interfaceDescriptor: InterfaceDescriptor;
	input: IoParam[];
	output: IoParam[];
};

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
};

export type InterfaceDescriptor = {
	inputCount: number;
	outputCount: number;
	inputIdentifiers: InterfaceIdentifier[];
	outputIdentifiers: InterfaceIdentifier[];
	[key: string]: any;
};

export type InterfaceIdentifier = {
	guid: string;
	typeCode: number;
};

export type IOS = ReturnType<typeof parseIOs>;
