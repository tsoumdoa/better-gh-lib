"use client";

import { useMemo } from "react";
import {
	ReactFlow,
	Background,
	BackgroundVariant,
	Controls,
	type NodeTypes,
	type EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { GHPanelNode } from "./GHPanelNode";
import { GHComponentNode } from "./GHComponentNode";
import { GHSliderNode } from "./GHSliderNode";
import { GHValueListNode } from "./GHValueListNode";
import { GHToggleNode } from "./GHToggleNode";
import { GHSwatchNode } from "./GHSwatchNode";
import { GHButtonNode } from "./GHButtonNode";
import { GHGroupNode } from "./GHGroupNode";
import { GHEdge } from "./GHEdge";
import type { GHFlowCanvasProps } from "../types/type";

const nodeTypes: NodeTypes = {
	panel: GHPanelNode as NodeTypes[string],
	value: GHPanelNode as NodeTypes[string],
	component: GHComponentNode as NodeTypes[string],
	slider: GHSliderNode as NodeTypes[string],
	valueList: GHValueListNode as NodeTypes[string],
	toggle: GHToggleNode as NodeTypes[string],
	swatch: GHSwatchNode as NodeTypes[string],
	button: GHButtonNode as NodeTypes[string],
	group: GHGroupNode as NodeTypes[string],
};

const edgeTypes: EdgeTypes = {
	default: GHEdge as EdgeTypes[string],
};

export function GHFlowCanvas({ nodes, edges }: GHFlowCanvasProps) {
	const defaultEdgeOptions = useMemo(
		() => ({
			type: "default",
		}),
		[]
	);

	return (
		<div className="h-[600px] w-full bg-[#ccc9c0]">
			<style>{`.react-flow__node.group, .react-flow__node.group > div { padding: 0 !important; border: 1px solid #bbb !important; box-shadow: none !important; background: transparent !important; }`}</style>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				defaultEdgeOptions={defaultEdgeOptions}
				fitView
				fitViewOptions={{ padding: 0.2 }}
				minZoom={0.1}
				maxZoom={4}
				proOptions={{ hideAttribution: true }}
				colorMode="dark"
			>
				<Background
					variant={BackgroundVariant.Lines}
					gap={40}
					size={1}
					color="#bbb8af"
					style={{ backgroundColor: "#ccc9c0" }}
				/>
				<Controls />
			</ReactFlow>
		</div>
	);
}
