import {
	Bound,
	CanvasPoint,
	InterfaceDescriptor,
	InterfaceIdentifier,
} from "./tgh";

export function handleBounds(p: any): Bound {
	if (!p) {
		return {
			x: -1,
			y: -1,
			width: -1,
			height: -1,
		};
	}
	return {
		x: p.X,
		y: p.Y,
		width: p.W,
		height: p.H,
	};
}

export function handlePivot(p: any): CanvasPoint {
	if (!p) {
		return {
			x: -1,
			y: -1,
		};
	}
	return {
		x: p.X,
		y: p.Y,
	};
}

export function extractInterfaceDescriptor(
	attr: Record<string, any>
): InterfaceDescriptor {
	const items: Record<string, any>[] = attr.items.item;
	const inputCount = items.find((i) => i["@_name"] === "InputCount")?.["#text"];
	const outputCount = items.find((i) => i["@_name"] === "OutputCount")?.[
		"#text"
	];

	const inputIdentifiers: InterfaceIdentifier[] = [];
	const outputIdentifiers: InterfaceIdentifier[] = [];

	for (const item of items) {
		const name = item["@_name"];
		const guid = item["#text"];
		const typeCode = item["@_type_code"];
		const identifier: InterfaceIdentifier = {
			guid: guid,
			typeCode: typeCode,
		};
		if (name === "InputId") inputIdentifiers.push(identifier);
		if (name === "OutputId") outputIdentifiers.push(identifier);
	}

	return {
		inputCount: inputCount,
		outputCount: outputCount,
		inputIdentifiers: inputIdentifiers ?? [],
		outputIdentifiers: outputIdentifiers ?? [],
	};
}

export function handleZuiIoAttrs(chunk: Record<string, any>[]) {
	const inputAttrInputParams =
		chunk.filter((i) => i["@_name"] === "InputParam") ?? [];

	const outputAttrOutputParams =
		chunk.filter((i) => i["@_name"] === "OutputParam") ?? [];

	var inputBounds: Bound[] = [];
	var outputBounds: Bound[] = [];
	var inputPivots: CanvasPoint[] = [];
	var outputPivots: CanvasPoint[] = [];

	for (const inputParam of inputAttrInputParams) {
		//@ts-ignore
		const inputParamAttr = inputParam.chunks.chunk.find(
			(i: Record<string, unknown>) => i["@_name"] === "Attributes"
		);

		const inputParamAttrItems = inputParamAttr.items.item;
		const bounds = inputParamAttrItems.find(
			(i: Record<string, unknown>) => i["@_name"] === "Bounds"
		);

		const pivots = inputParamAttrItems.find(
			(i: Record<string, unknown>) => i["@_name"] === "Pivot"
		);

		inputBounds.push(handleBounds(bounds));
		inputPivots.push(handlePivot(pivots));
	}

	for (const outputParam of outputAttrOutputParams) {
		//@ts-ignore
		const outputParamAttr = outputParam.chunks.chunk.find(
			(i: Record<string, unknown>) => i["@_name"] === "Attributes"
		);

		const outputParamAttrItems = outputParamAttr.items.item;
		const bounds = outputParamAttrItems.find(
			(i: Record<string, unknown>) => i["@_name"] === "Bounds"
		);

		const pivots = outputParamAttrItems.find(
			(i: Record<string, unknown>) => i["@_name"] === "Pivot"
		);

		outputBounds.push(handleBounds(bounds));
		outputPivots.push(handlePivot(pivots));
	}

	return {
		inputBounds: inputBounds,
		outputBounds: outputBounds,
		inputPivots: inputPivots,
		outputPivots: outputPivots,
	};
}
