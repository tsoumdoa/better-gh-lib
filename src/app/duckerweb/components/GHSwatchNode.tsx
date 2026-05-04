import type { GHSwatchNodeProps } from "../types/type";
import { GHHandle } from "./Handle";

function semicolonRgbaToCss(input: string): string {
	const parts = input.split(";").map(Number);

	if (parts.length < 3 || parts.some(Number.isNaN)) {
		return "#ddd";
	}

	const [a = 255, r, g, b] = parts;
	const alpha = Math.max(0, Math.min(255, a)) / 255;

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function GHSwatchNode({ data }: GHSwatchNodeProps) {
	const bg = data.color ? semicolonRgbaToCss(data.color) : "#ddd";
	return (
		<div
			className={`flex h-7 items-center overflow-hidden rounded-sm border border-none font-sans text-[10px] shadow-sm select-none`}
			style={{
				minWidth: 100,
				backgroundColor: bg,
			}}
		>
			<div className="flex h-full shrink-0 items-center border-r border-[#aaa] bg-[#b0ada6] px-2 font-medium text-[#222]">
				{data.label ?? "Swatch"}
			</div>

			<GHHandle
				variant="compact"
				position="right"
				type="source"
				id={data.outputs[0]?.id}
				className="!right-[-0px]"
			/>
		</div>
	);
}
