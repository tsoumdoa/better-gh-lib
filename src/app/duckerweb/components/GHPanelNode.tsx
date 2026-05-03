import { Handle, Position } from "@xyflow/react";
import type { GHNodeProps } from "../types/type";
import { HANDLE_SIZE } from "./constants";

export function GHPanelNode({ data, selected }: GHNodeProps) {
	const inputs = data.inputs ?? [];
	const outputs = data.outputs ?? [];

	return (
		<div className="relative overflow-visible">
			<div
				className={`relative flex items-center overflow-hidden rounded-sm border font-sans text-[10px] shadow-sm select-none ${selected ? "border-[#444]" : "border-[#b0aa40]"}`}
				style={{
					minWidth: 60,
					height: data.height ?? 28,
					backgroundColor: "#fff",
				}}
			>
				{data.value !== undefined && data.value !== "" && (
					<span className="px-2 font-mono text-[10px] text-[#444]">
						{data.value}
					</span>
				)}
			</div>

			<div
				className="pointer-events-none absolute left-0 flex items-center"
				style={{ top: "50%", transform: "translateY(-50%)" }}
			>
				<Handle
					type="target"
					position={Position.Left}
					id={inputs[0]?.id}
					className="pointer-events-auto relative! top-auto! left-auto! translate-x-0! translate-y-0!"
					style={{
						width: HANDLE_SIZE,
						height: HANDLE_SIZE,
						flexShrink: 0,
						borderRadius: "50%",
						border: "2.5px solid #777",
						background: "#fff",
						transform: "translateX(-50%)",
					}}
				/>
			</div>

			<div
				className="pointer-events-none absolute right-0 flex items-center justify-end"
				style={{ top: "50%", transform: "translateY(-50%)" }}
			>
				<Handle
					type="source"
					position={Position.Right}
					id={outputs[0]?.id}
					className="pointer-events-auto relative! top-auto! right-auto! translate-x-0! translate-y-0!"
					style={{
						width: HANDLE_SIZE,
						height: HANDLE_SIZE,
						flexShrink: 0,
						borderRadius: "80%",
						border: "2.5px solid #777",
						background: "#fff",
						transform: "translateX(50%)",
					}}
				/>
			</div>
		</div>
	);
}
