"use client";

import { useMemo } from "react";
import {
	ReactFlow,
	Background,
	Controls,
	MiniMap,
	Handle,
	Position,
	type Node,
	type Edge,
	type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ParsedGrasshopper, InputPort, OutputPort } from "parser/sand/src/types";

interface FlowViewerProps {
	parsedData: ParsedGrasshopper;
}

function GhComponentNode({ data }: NodeProps) {
	const inputs = data.inputs as Record<string, InputPort> | undefined;
	const outputs = data.outputs as Record<string, OutputPort> | undefined;
	const inputKeys = Object.keys(inputs || {});
	const outputKeys = Object.keys(outputs || {});
	const isGroup = data.type === "Group";
	const isInput = data.hasValue;
	const isRelay = data.type === "Relay" || (inputKeys.length === 1 && outputKeys.length === 1 && inputKeys[0] === outputKeys[0]);

	const getNickName = (port: InputPort | OutputPort | undefined, key: string) => {
		return port?.nick || key;
	};

	const totalPorts = Math.max(inputKeys.length, outputKeys.length);
	const portHeight = 20;

	if (isGroup) {
		return (
			<div
				className="relative min-w-[100px] rounded-md border-2 border-dashed border-neutral-500/50 bg-neutral-500/10 p-2"
				style={{
					minHeight: 60,
				}}
			>
				<div className="text-[10px] text-neutral-400">{String(data.label)}</div>
			</div>
		);
	}

	const showSourceHandle = outputKeys.length > 0 || data.isConnectedAsSource;
	const showTargetHandle = inputKeys.length > 0 || data.isConnectedAsTarget;

	const isConnectedAsSource = Boolean(data.isConnectedAsSource);
	const isConnectedAsTarget = Boolean(data.isConnectedAsTarget);

	if (showSourceHandle && outputKeys.length === 0) {
		return (
			<div
				className="relative min-w-[100px] rounded-md bg-neutral-800 p-2 text-xs text-neutral-100 ring-1 ring-neutral-600"
				style={{ minHeight: 40 }}
			>
				{isConnectedAsTarget && (
					<Handle
						type="target"
						id="input"
						position={Position.Left}
						style={{
							top: "50%",
							background: "#22c55e",
							width: 6,
							height: 6,
						}}
					/>
				)}
				<Handle
					type="source"
					id="output"
					position={Position.Right}
					style={{
						top: "50%",
						background: "#3b82f6",
						width: 6,
						height: 6,
					}}
				/>
				<div className="font-semibold">{String(data.label)}</div>
				<div className="text-[10px] text-neutral-400">{String(data.type)}</div>
			</div>
		);
	}

	if (isInput) {
		return (
			<div
				className="relative min-w-[100px] rounded-md bg-neutral-700 p-2 text-xs text-neutral-100 ring-1 ring-neutral-500"
				style={{ minHeight: 40 }}
			>
				<Handle
					type="source"
					position={Position.Right}
					style={{
						top: "50%",
						background: "#3b82f6",
						width: 6,
						height: 6,
					}}
				/>
				<div className="font-semibold">{String(data.label)}</div>
				<div className="text-[10px] text-neutral-400">{String(data.valueType)}</div>
			</div>
		);
	}

	if (isRelay) {
		return (
			<div
				className="relative min-w-[80px] rounded-md bg-neutral-800 p-2 text-xs text-neutral-100 ring-1 ring-neutral-600"
				style={{ minHeight: 40 }}
			>
				<Handle
					type="target"
					id={inputKeys[0]}
					position={Position.Left}
					style={{
						top: "50%",
						background: "#22c55e",
						width: 6,
						height: 6,
					}}
				/>
				<div className="font-semibold">{String(data.label)}</div>
				<Handle
					type="source"
					id={outputKeys[0]}
					position={Position.Right}
					style={{
						top: "50%",
						background: "#3b82f6",
						width: 6,
						height: 6,
					}}
				/>
			</div>
		);
	}

	return (
		<div
			className="relative min-w-[100px] rounded-md bg-neutral-800 p-2 text-xs text-neutral-100 ring-1 ring-neutral-600"
			style={{ minHeight: Math.max(40, totalPorts * portHeight + 40) }}
		>
			<Handle
				type="target"
				position={Position.Left}
				style={{
					top: "50%",
					background: "#22c55e",
					width: 6,
					height: 6,
				}}
			/>

			<div className="font-semibold">{String(data.label)}</div>
			<div className="text-[10px] text-neutral-400">{String(data.type)}</div>

			{(inputKeys.length > 0 || outputKeys.length > 0) && (
				<div className="mt-1 flex justify-between gap-4 text-[9px]">
					<div className="flex flex-col">
						{inputKeys.map((key) => (
							<div key={key} className="flex items-center gap-1">
								<Handle
									type="target"
									id={key}
									position={Position.Left}
									style={{
										background: "#22c55e",
										width: 6,
										height: 6,
										left: -8,
										position: "relative",
									}}
								/>
								<span className="text-neutral-300">
									{getNickName(inputs?.[key], key)}
								</span>
							</div>
						))}
					</div>
					<div className="flex flex-col items-end">
						{outputKeys.map((key) => (
							<div key={key} className="flex items-center gap-1">
								<span className="text-neutral-300">
									{getNickName(outputs?.[key], key)}
								</span>
								<Handle
									type="source"
									id={key}
									position={Position.Right}
									style={{
										background: "#3b82f6",
										width: 6,
										height: 6,
										right: -8,
										position: "relative",
									}}
								/>
							</div>
						))}
					</div>
				</div>
			)}

			<Handle
				type="source"
				position={Position.Right}
				style={{
					top: "50%",
					background: "#3b82f6",
					width: 6,
					height: 6,
				}}
			/>
		</div>
	);
}

const nodeTypes = {
	ghComponent: GhComponentNode,
};

export function FlowViewer({ parsedData }: FlowViewerProps) {
	const { nodes, edges } = useMemo(() => {
		const nodeMap: Record<string, Node> = {};
		const edgeList: Edge[] = [];

		const connectedAsSource = new Set<string>();
		const connectedAsTarget = new Set<string>();
		
		for (const wire of parsedData.wires) {
			const fromId = wire.from.split(".")[0];
			const toId = wire.to.split(".")[0];
			connectedAsSource.add(fromId);
			connectedAsTarget.add(toId);
		}

		for (const [id, component] of Object.entries(parsedData.components)) {
			const pivot = component.visuals?.pivot;
			const bounds = component.visuals?.bounds;
			const position = pivot
				? { x: pivot.x, y: pivot.y }
				: { x: Math.random() * 500, y: Math.random() * 500 };

			const label = component.nickName || component.type;
			const inputCount = Object.keys(component.inputs || {}).length;
			const outputCount = Object.keys(component.outputs || {}).length;
			const hasValue = !!component.value;
			const isGroup = component.type === "Group";

			const hasPorts = inputCount > 0 || outputCount > 0;

			if (isGroup && bounds) {
				nodeMap[id] = {
					id,
					type: "ghComponent",
					position,
					data: {
						label,
						type: component.type,
						inputs: {},
						outputs: {},
						hasPorts: false,
						hasValue: false,
					},
					style: {
						width: bounds.width,
						height: bounds.height,
						background: "transparent",
						border: "none",
					},
					extent: [
						[position.x, position.y],
						[position.x + bounds.width, position.y + bounds.height],
					] as [[number, number], [number, number]],
				};
				continue;
			}

			nodeMap[id] = {
				id,
				type: "ghComponent",
				position,
				data: {
					label,
					type: component.type,
					inputs: component.inputs,
					outputs: component.outputs,
					hasPorts,
					hasValue,
					valueType: component.value?.type,
					isConnectedAsSource: connectedAsSource.has(id),
					isConnectedAsTarget: connectedAsTarget.has(id),
				},
			};
		}

		for (const wire of parsedData.wires) {
			const toParts = wire.to.split(".");
			const toIdCandidate = toParts[0];
			const toPort = toParts[1] || null;

			// Find toId - try exact match first, then search by GUID
			let toId = nodeMap[toIdCandidate] ? toIdCandidate : null;
			if (!toId) {
				for (const [compId, comp] of Object.entries(parsedData.components)) {
					if ((comp as any).guid === toIdCandidate) {
						toId = compId;
						break;
					}
				}
			}

			// Find fromId - same approach
			let fromId = nodeMap[wire.from] ? wire.from : null;
			if (!fromId) {
				for (const [compId, comp] of Object.entries(parsedData.components)) {
					if ((comp as any).guid === wire.from) {
						fromId = compId;
						break;
					}
				}
			}

			// If still not found, try to find via input sources
			if (!fromId && toId) {
				const targetComp = parsedData.components[toId];
				if (targetComp?.inputs) {
					for (const [inputKey, input] of Object.entries(targetComp.inputs)) {
						if (input.source) {
							// Try to find component with this GUID
							for (const [compId, comp] of Object.entries(parsedData.components)) {
								if ((comp as any).guid === input.source) {
									fromId = compId;
									break;
								}
							}
							if (fromId) break;
						}
					}
				}
			}

			const fromNode = fromId ? nodeMap[fromId] : undefined;
			const toNode = toId ? nodeMap[toId] : undefined;

			if (fromNode && toNode && fromId && toId) {
				// Get source component's outputs for the handle
				const sourceComp = parsedData.components[fromId];
				const outputKeys = sourceComp?.outputs ? Object.keys(sourceComp.outputs) : [];
				const sourceHandle: string | null = outputKeys.length > 0 ? outputKeys[0] : null;
				
				edgeList.push({
					id: `${wire.from}-${wire.to}`,
					source: fromId,
					sourceHandle,
					target: toId,
					targetHandle: toPort,
					type: "default",
					animated: false,
					style: { stroke: "#a1a1aa", strokeWidth: 2 },
				});
			}
		}

		return { nodes: Object.values(nodeMap), edges: edgeList };
	}, [parsedData]);

	if (nodes.length === 0) {
		return <div className="py-8 text-neutral-400">No components to display</div>;
	}

	return (
		<div className="h-[500px] w-full rounded-md border border-neutral-700">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				fitView
				attributionPosition="bottom-left"
				defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
			>
				<Background color="#27272a" gap={20} />
				<Controls className="bg-neutral-800 fill-neutral-200" />
				<MiniMap
					nodeColor={() => "#3f3f46"}
					maskColor="rgba(0, 0, 0, 0.5)"
					className="bg-neutral-900"
				/>
			</ReactFlow>
		</div>
	);
}
