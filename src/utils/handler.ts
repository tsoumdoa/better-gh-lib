import { filterObjByAtName, findObjByAtName } from "./helper";
import {
	Bound,
	CanvasPoint,
	InterfaceDescriptor,
	InterfaceIdentifier,
} from "./tgh";

export function handleBounds(p: any): Bound {
	if (!p) {
		return { x: -1, y: -1, width: -1, height: -1 };
	}
	return { x: p.X, y: p.Y, width: p.W, height: p.H };
}

export function handlePivot(p: any): CanvasPoint {
	if (!p) {
		return { x: -1, y: -1 };
	}
	return { x: p.X, y: p.Y };
}

export function extractInterfaceDescriptor(
	attr: Record<string, any>
): InterfaceDescriptor {
	const items: Record<string, any>[] = attr.items.item;
	const inputCount = findObjByAtName(items, "InputCount")?.["#text"];
	const outputCount = findObjByAtName(items, "OutputCount")?.["#text"];

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
	const inputAttrInputParams = filterObjByAtName(chunk, "InputParam");
	const outputAttrOutputParams = filterObjByAtName(chunk, "OutputParam");

	var inputBounds: Bound[] = [];
	var outputBounds: Bound[] = [];
	var inputPivots: CanvasPoint[] = [];
	var outputPivots: CanvasPoint[] = [];

	for (const inputParam of inputAttrInputParams) {
		//@ts-ignore
		const inputParamAttrItems = inputParam.chunks.chunk.find(
			(i: Record<string, unknown>) => i["@_name"] === "Attributes"
		).items.item;

		const bounds = findObjByAtName(inputParamAttrItems, "Bounds");
		const pivots = findObjByAtName(inputParamAttrItems, "Pivot");

		inputBounds.push(handleBounds(bounds));
		inputPivots.push(handlePivot(pivots));
	}

	for (const outputParam of outputAttrOutputParams) {
		const outputParamAttrItems = findObjByAtName(
			outputParam.chunks.chunk,
			"Attributes"
		).items.item;

		const bounds = findObjByAtName(outputParamAttrItems, "Bounds");
		const pivots = findObjByAtName(outputParamAttrItems, "Pivot");

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
