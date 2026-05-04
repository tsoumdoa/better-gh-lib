import type { GHButtonNodeProps } from "../types/type";
import { GHHandle } from "./Handle";

export function GHButtonNode({ data, selected }: GHButtonNodeProps) {
	return (
		<div
			className={`flex h-7 items-center overflow-hidden rounded-sm border border-none bg-[#444] font-sans text-[10px] shadow-sm select-none`}
			style={{ minWidth: 100 }}
		>
			<div className="flex h-full shrink-0 items-center border-r border-[#aaa] bg-[#b0ada6] px-2 font-medium text-[#222]">
				{data.label ?? "Button"}
			</div>

			<div className="flex h-full flex-1 items-center justify-center border border-none" />

			<GHHandle
				variant="compact"
				position="right"
				type="source"
				id={data.outputs[0]?.id}
			/>
		</div>
	);
}
