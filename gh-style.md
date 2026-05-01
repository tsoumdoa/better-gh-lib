**Key corrections from the screenshot:**

- Canvas is **light warm grey** (`#d4d0c8` / `#ccc9c0`), not dark
- Grid is **subtle slightly darker lines** on the light background
- Number/value nodes are **yellow** (`#f5f07a`)
- Component nodes are **medium grey** bodies
- Wires are **dark grey** (`#555`–`#666`), fairly thin
- Node borders are subtle, slightly rounded rectangles
- param columns (inputs/outputs) are **light grey** (`#b8b5ae`) and with are streched
  based on the contents

---

## Corrected Color Palette

```ts
export const GH_COLORS = {
	// Canvas
	canvas: "#ccc9c0", // light warm grey
	gridLine: "#bbb8af", // subtle darker grid

	// Standard component node
	nodeBg: "#b8b5ae", // medium warm grey body
	nodeHeader: "#a8a5a0", // slightly darker header zone
	nodeBorder: "#888880",
	nodeSelected: "#00a0ff",

	// Value / Parameter nodes (number, boolean, etc.)
	valueNodeBg: "#f5f07a", // yellow
	valueNodeBorder: "#c8c040",

	// Script nodes (C#, Python, etc.)
	scriptNodeBg: "#606060", // dark grey
	scriptNodeAccent: "#404040", // darker stripe/center

	// Swatch / special nodes
	swatchBg: "#c0bcb5",

	// Wires
	wire: "#5a5a5a",
	wireHover: "#333333",
	wireSelected: "#00a0ff",

	// Text
	textDark: "#1a1a1a",
	textLight: "#f0f0f0", // for dark nodes like C#
};
```

---

## Corrected Background

```tsx
<Background
	variant={BackgroundVariant.Lines}
	gap={40}
	size={1}
	color="#bbb8af"
	style={{ backgroundColor: "#ccc9c0" }}
/>
```

---

## Corrected Node Types

Looking at the screenshot, there are clearly **3 distinct node shapes**:

### 1. Value Node (yellow pill — numbers, booleans)

```tsx
// components/GHValueNode.tsx
export function GHValueNode({ data, selected }: NodeProps) {
	return (
		<div
			className={`relative flex h-7 items-center rounded-sm border bg-[#f5f07a] font-sans text-[10px] select-none ${selected ? "border-[#00a0ff]" : "border-[#b0aa40]"} shadow-sm`}
			style={{ minWidth: 60 }}
		>
			{/* Left port nub */}
			<Handle
				type="target"
				position={Position.Left}
				className="!left-[-5px] !h-2 !w-2 !rounded-full !border !border-[#666] !bg-[#999]"
			/>

			<span className="px-2 font-medium whitespace-nowrap text-[#333]">
				{data.label}
			</span>

			{/* Right port nub */}
			<Handle
				type="source"
				position={Position.Right}
				className="!right-[-5px] !h-2 !w-2 !rounded-full !border !border-[#666] !bg-[#999]"
			/>
		</div>
	);
}
```

### 2. Standard Component Node (grey, multi-port)

```tsx
// components/GHComponentNode.tsx
export function GHComponentNode({ data, selected }: NodeProps) {
	const inputs = data.inputs ?? [];
	const outputs = data.outputs ?? [];

	return (
		<div
			className={`relative flex overflow-visible rounded-sm border font-sans text-[10px] shadow-md select-none ${selected ? "border-[#00a0ff]" : "border-[#888880]"} `}
			style={{ minWidth: 140 }}
		>
			{/* Left inputs column */}
			<div
				className="flex flex-col justify-around border-r border-[#999] bg-[#b8b5ae] px-1 py-1"
				style={{ minWidth: 70 }}
			>
				{inputs.map((input) => (
					<div key={input.id} className="relative flex h-5 items-center">
						<Handle
							type="target"
							position={Position.Left}
							id={input.id}
							className="!left-[-5px] !h-[7px] !w-[7px] !rounded-full !border !border-[#777] !bg-[#aaa]"
						/>
						<span className="w-full pr-1 pl-1 text-right text-[10px] text-[#222]">
							{input.label}
						</span>
					</div>
				))}
			</div>

			{/* Center label / accent stripe */}
			<div
				className="flex items-center justify-center px-1"
				style={{
					backgroundColor: data.accentColor ?? "#808080",
					minWidth: 28,
				}}
			>
				<span
					className="text-[11px] font-bold tracking-tight text-white"
					style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
				>
					{data.shortLabel ?? data.label}
				</span>
			</div>

			{/* Right outputs column */}
			<div
				className="flex flex-col justify-around border-l border-[#999] bg-[#b8b5ae] px-1 py-1"
				style={{ minWidth: 70 }}
			>
				{outputs.map((output) => (
					<div key={output.id} className="relative flex h-5 items-center">
						<span className="w-full pr-1 pl-1 text-left text-[10px] text-[#222]">
							{output.label}
						</span>
						<Handle
							type="source"
							position={Position.Right}
							id={output.id}
							className="!right-[-5px] !h-[7px] !w-[7px] !rounded-full !border !border-[#777] !bg-[#aaa]"
						/>
					</div>
				))}
			</div>
		</div>
	);
}
```

### 3. Slider Node

```tsx
// components/GHSliderNode.tsx
export function GHSliderNode({ data, selected }: NodeProps) {
	return (
		<div
			className={`flex h-7 items-center overflow-hidden rounded-sm border bg-[#c8c5be] font-sans text-[10px] shadow-sm select-none ${selected ? "border-[#00a0ff]" : "border-[#999990]"} `}
			style={{ minWidth: 200 }}
		>
			{/* Label tab */}
			<div className="flex h-full shrink-0 items-center border-r border-[#aaa] bg-[#b0ada6] px-2 font-medium text-[#222]">
				{data.label ?? "Slider"}
			</div>

			{/* Track area */}
			<div className="flex h-full flex-1 items-center gap-1 bg-[#d8d5ce] px-2">
				{/* Tick marks - decorative */}
				<div className="relative h-[2px] flex-1 rounded bg-[#aaa]">
					<div
						className="absolute top-1/2 h-4 w-2 -translate-y-1/2 cursor-ew-resize rounded-sm border border-[#666] bg-[#888]"
						style={{ left: `${data.percent ?? 70}%` }}
					/>
				</div>
				{/* Value display */}
				<span className="shrink-0 font-mono text-[10px] text-[#333]">
					{data.value ?? 0}
				</span>
				{/* Diamond icon */}
				<span className="text-[8px] text-[#666]">◆</span>
			</div>

			{/* Output nub */}
			<Handle
				type="source"
				position={Position.Right}
				className="!right-[-4px] !h-[7px] !w-[7px] !rounded-full !border !border-[#777] !bg-[#aaa]"
			/>
		</div>
	);
}
```

---

## Corrected Edge

Wires are dark, fairly thin, smooth bezier:

```tsx
export function GHEdge({
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	selected,
}: EdgeProps) {
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		curvature: 0.35,
	});

	return (
		<BaseEdge
			path={edgePath}
			style={{
				stroke: selected ? "#00a0ff" : "#555552",
				strokeWidth: selected ? 2 : 1.5,
			}}
		/>
	);
}
```

---

## Corrected Tailwind Config

```ts
export default {
	theme: {
		extend: {
			colors: {
				gh: {
					canvas: "#ccc9c0",
					grid: "#bbb8af",
					node: "#b8b5ae",
					value: "#f5f07a", // yellow nodes
					script: "#606060", // dark nodes (C#)
					wire: "#555552",
					select: "#00a0ff",
					border: "#888880",
				},
			},
		},
	},
};
```

---

## Summary of Corrections

| Property     | ❌ Before       | ✅ After                              |
| ------------ | --------------- | ------------------------------------- |
| Canvas       | `#3a3a3a` dark  | `#ccc9c0` light warm grey             |
| Grid         | dark lines      | subtle slightly darker lines          |
| Node body    | light `#e8e8e8` | medium grey `#b8b5ae`                 |
| Value nodes  | same grey       | **yellow** `#f5f07a`                  |
| Wires        | medium grey     | **dark** `#555552`                    |
| Port handles | square          | **round** circles                     |
| Script nodes | same as others  | **dark** `#606060` with center stripe |
