import type { GHToggleNodeProps } from "../types/type";
import { GHHandle } from "./Handle";

export function GHToggleNode({ data, selected }: GHToggleNodeProps) {
	return (
		<div
			className={`flex h-7 items-center overflow-hidden rounded-sm border border-none bg-[#c8c5be] font-sans text-[10px] shadow-sm select-none`}
			style={{ minWidth: 80 }}
		>
			<div className="flex h-full shrink-0 items-center border-r border-[#aaa] bg-[#b0ada6] px-2 font-medium text-[#222]">
				{data.label ?? "Toggle"}
			</div>

			<div className="flex h-full flex-1 items-center justify-center bg-[#444] px-3">
				<span className="font-mono text-[11px] text-[#ddd]">
					{data.value ?? "False"}
				</span>
			</div>

			<GHHandle
				variant="compact"
				position="right"
				type="source"
				id={data.outputs[0]?.id}
			/>
		</div>
	);
}
