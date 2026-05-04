import { Handle, Position } from "@xyflow/react";
import { HANDLE_SIZE } from "./constants";

type HandleVariant = "detailed" | "compact";
type HandlePosition = "left" | "right";
type HandleType = "source" | "target";

interface GHHandleProps {
	variant: HandleVariant;
	position: HandlePosition;
	type: HandleType;
	id?: string;
	className?: string;
}

export function GHHandle({
	variant,
	position,
	type,
	id,
	className = "",
}: GHHandleProps) {
	if (variant === "compact") {
		return (
			<Handle
				type={type}
				position={position === "left" ? Position.Left : Position.Right}
				id={id}
				className={`!h-[9px] !w-[9px] !rounded-full !border !border-[#777] !bg-[#aaa] ${className}`}
				style={{
					clipPath: "inset(0 0 0 50%)",
				}}
			/>
		);
	}

	const borderRadius = type === "target" ? "50%" : "80%";
	const transform =
		position === "left" ? "translateX(-50%)" : "translateX(50%)";

	return (
		<Handle
			type={type}
			position={position === "left" ? Position.Left : Position.Right}
			id={id}
			className={`pointer-events-auto relative! top-auto! left-auto! translate-x-0! translate-y-0! ${className}`}
			style={{
				width: HANDLE_SIZE,
				height: HANDLE_SIZE,
				flexShrink: 0,
				borderRadius,
				border: "2.5px solid #777",
				background: "#fff",
				transform,
			}}
		/>
	);
}