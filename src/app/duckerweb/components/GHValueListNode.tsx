import type { GHValueListNodeProps } from "../types/type";
import { GHHandle } from "./Handle";
import { HandlePosition } from "./HandlePosition";

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

			<HandlePosition position="right">
				<GHHandle
					variant="detailed"
					position="right"
					type="source"
					id={outputs[0]?.id}
				/>
			</HandlePosition>
		</div>
	);
}
