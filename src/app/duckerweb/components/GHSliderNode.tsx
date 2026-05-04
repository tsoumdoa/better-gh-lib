import { Handle, Position } from "@xyflow/react";
import type { Port, GHSliderNodeProps } from "../types/type";

export function GHSliderNode({ data, selected }: GHSliderNodeProps) {
	const percent = data.percent ?? 50;

	return (
		<div
			className={`flex h-7 items-center overflow-hidden rounded-sm border bg-[#c8c5be] font-sans text-[10px] shadow-sm select-none ${selected ? "border-[#00a0ff]" : "border-[#999990]"} `}
			style={{ minWidth: 200 }}
		>
			<div className="flex h-full shrink-0 items-center border-r border-[#aaa] bg-[#b0ada6] px-2 py-2 font-medium text-[#222]">
				{data.label ?? "Slider"}
			</div>

			<div className="flex h-full flex-1 items-center gap-1 bg-[#d8d5ce] px-2 py-2">
				<div className="relative h-[2px] flex-1 bg-[#aaa]">
					<div
						className="absolute top-1/2 h-4 w-2 -translate-y-1/2 cursor-ew-resize border border-[#666] bg-[#888]"
						style={{ left: `${percent}%` }}
					/>
				</div>
				<span className="shrink-0 font-mono text-[10px] text-[#333]">
					{data.value ?? "0"}
				</span>
				<span className="text-[8px] text-[#666]">◆</span>
			</div>

			<Handle
				type="source"
				position={Position.Right}
				id={data.outputs[0]?.id}
				className="!h-[9px] !w-[9px] !rounded-full !border !border-[#777] !bg-[#aaa]"
				style={{
					clipPath: "inset(0 0 0 50%)",
				}}
			/>
		</div>
	);
}
