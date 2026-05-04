import type { Node, Edge, Position } from "@xyflow/react";

export type GHNodeType = "value" | "panel" | "component" | "slider" | "valueList" | "toggle" | "swatch" | "button" | "group" | "relay";

export type GHNodeData = {
	label: string;
	type: GHNodeType;
	inputs: Port[];
	outputs: Port[];
	accentColor?: string;
	selected?: boolean;
	members?: string[];
	containerBounds?: Bounds;
	value?: string;
	percent?: number;
	height?: number;
} & Record<string, unknown>;

export type GHNode = Node<GHNodeData>;

export type Port = {
	id: string;
	label: string;
};

export type Bounds = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type ParsedComponent = {
	id: string;
	type: string;
	nickName: string;
	description?: string;
	library?: string;
	inputs: Record<string, { nick: string; description?: string }>;
	outputs: Record<string, { nick: string; description?: string }>;
};

export type ViewMode = "list" | "flow" | "json";

export type GHFlowCanvasProps = {
	nodes: FlowNode[];
	edges: Edge[];
};

export type FlowNode = Node<GHNodeData>;

export type GHNodeProps = {
	data: {
		label: string;
		type: string;
		inputs: Port[];
		outputs: Port[];
		accentColor?: string;
		selected?: boolean;
		inputWidth?: number;       // <-- specific to GHComponentNode
		outputWidth?: number;      // <-- specific to GHComponentNode
		value?: string;            // <-- for value nodes (number, panel, etc.)
		height?: number;
	};
	selected?: boolean;
};

export type GHGroupNodeProps = {
	data: {
		label: string;
		type: string;
		members?: string[];
		containerBounds?: Bounds;
		accentColor?: string;
		selected?: boolean;
	};
	selected?: boolean;
};

export type GHSliderNodeProps = {
	data: {
		label: string;
		type: string;
		inputs: Port[];
		outputs: Port[];
		accentColor?: string;
		selected?: boolean;
		value?: string;
		percent?: number;
	};
	selected?: boolean;
};

export type GHValueListItem = {
	name: string;
	expression: string | number;
	selected: boolean;
};

export type GHValueListNodeProps = {
	data: {
		label: string;
		type: string;
		inputs: Port[];
		outputs: Port[];
		accentColor?: string;
		selected?: boolean;
		value?: string;
		items?: GHValueListItem[];
		selectedIndex?: number;
	};
	selected?: boolean;
};

export type GHToggleNodeProps = {
	data: {
		label: string;
		type: string;
		inputs: Port[];
		outputs: Port[];
		accentColor?: string;
		selected?: boolean;
		value?: string;
	};
	selected?: boolean;
};

export type GHSwatchNodeProps = {
	data: {
		label: string;
		type: string;
		inputs: Port[];
		outputs: Port[];
		accentColor?: string;
		selected?: boolean;
		value?: string;
		color?: string;
	};
	selected?: boolean;
};

export type GHButtonNodeProps = {
	data: {
		label: string;
		type: string;
		inputs: Port[];
		outputs: Port[];
		accentColor?: string;
		selected?: boolean;
	};
	selected?: boolean;
};

export type GHEdgeProps = {
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
	sourcePosition: Position;
	targetPosition: Position;
	selected?: boolean;
};
