import { Handle, Position } from "@xyflow/react";
import type { GHValueListNodeProps } from "../types/type";
import { HANDLE_SIZE } from "./constants";

export function GHValueListNode({ data, selected }: GHValueListNodeProps) {
	const outputs = data.outputs ?? [];

	return (
		<div className="relative overflow-visible">
			<div
				className={`relative flex items-center overflow-hidden rounded-sm border font-sans text-[10px] shadow-sm select-none ${selected ? "border-[#444]" : "border-[#444]"}`}
				style={{
					minWidth: 100,
					height: data.value ? 28 : 24,
					backgroundColor: "#fff",
				}}
			>
				<div className="flex shrink-0 items-center border-r border-[#ddd] bg-[#f5f5f0] px-2 font-medium text-[#444]">
					{data.label}
				</div>

				<div className="flex flex-1 items-center justify-between px-2">
					<span className="font-mono text-[10px] text-[#333]">
						{data.value ?? ""}
					</span>
					<span className="text-[8px] text-[#999]">▾</span>
				</div>
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
