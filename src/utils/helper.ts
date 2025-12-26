import {
	extractInterfaceDescriptor,
	handleBounds,
	handleZuiIoAttrs,
	handlePivot,
} from "./handler";
import { Bound, CanvasPoint, InstanceIdentifier, NodeIdentifier } from "./tgh";

export function getComponentBounds(obj: any): Bound {
	const p = getComponentAttribute(obj, "Bounds");
	return handleBounds(p);
}
export function getComponentPivot(obj: any): CanvasPoint {
	const p = getComponentAttribute(obj, "Pivot");
	return handlePivot(p);
}

function findObjByAtName(obj: any, atName: string) {
	return obj.find((i: Record<string, unknown>) => i["@_name"] === atName);
}

function getComponentAttribute(obj: any, name: "Bounds" | "Pivot") {
	const attr = obj.chunks.chunk[0].chunks.chunk.find(
		(i: Record<string, unknown>) => i["@_name"] === "Attributes"
	).items;

	if (!attr) {
		return null;
	}

	return attr.item.find((i: Record<string, unknown>) => i["@_name"] === name);
}

export function getIdentifier(obj: any): NodeIdentifier {
	const ii: Record<string, any>[] = obj.items.item;
	const g = findObjByAtName(ii, "GUID")?.["#text"];
	const n = findObjByAtName(ii, "Name")?.["#text"];
	const id = findObjByAtName(ii, "Lib")?.["#text"];

	return {
		guid: g,
		name: n,
		libId: id,
	};
}

export function getInstanceIdentifier(obj: any) {
	const ii: Record<string, any>[] = obj.chunks.chunk[0].items.item;
	const parsed = transformParams(ii);
	return parsed;
}

export function parseIOs(obj: any) {
	const zuiBody = obj.chunks.chunk[0].chunks.chunk.find(
		//@ts-ignore
		(i) => i["@_name"] === "ParameterData"
	);
	if (zuiBody) {
		return handleZuiIOs(obj);
	}
	return handleStandardIOs(obj);
}

function parseZuiIOs(zuiBody: any) {
	const chunks = zuiBody.chunks;

	if (!chunks)
		return {
			inputParams: [],
			outputParams: [],
			inputBounds: [],
			outputBounds: [],
			inputPivots: [],
			outputPivots: [],
		};
	const chunk: Record<string, any>[] = chunks.chunk;
	const parsedAttrs = handleZuiIoAttrs(chunk);

	const inputAttrItems = findObjByAtName(chunk, "InputParam")?.items.item ?? [];
	const outputAttrItems =
		findObjByAtName(chunk, "OutputParam")?.items.item ?? [];

	return {
		inputParams: transformParams(inputAttrItems),
		outputParams: transformParams(outputAttrItems),
		inputBounds: parsedAttrs.inputBounds,
		outputBounds: parsedAttrs.outputBounds,
		inputPivots: parsedAttrs.inputPivots,
		outputPivots: parsedAttrs.outputPivots,
	};
}

function handleZuiIOs(obj: any) {
	const attr = obj.chunks.chunk[0].chunks.chunk.find(
		(i: Record<string, unknown>) => i["@_name"] === "ParameterData"
	);
	const ios = parseZuiIOs(attr);
	const intDesc = extractInterfaceDescriptor(attr);

	return {
		params: {
			inputParams: ios.inputParams,
			outputParams: ios.outputParams,
		},
		bounds: {
			input: ios.inputBounds,
			output: ios.outputBounds,
		},
		pivots: {
			input: ios.inputPivots,
			output: ios.outputPivots,
		},
		zuiDescriptor: intDesc,
		isZui: true,
	};
}

function handleStandardIOs(obj: any) {
	const chunk: Record<string, unknown>[] = obj.chunks.chunk[0].chunks.chunk;

	const inputParams = chunk.filter((i) => i["@_name"] === "param_output");
	const outputParams = chunk.filter((i) => i["@_name"] === "param_input");

	var inputBounds: Bound[] = [];
	var outputBounds: Bound[] = [];
	var inputPivots: CanvasPoint[] = [];
	var outputPivots: CanvasPoint[] = [];

	for (const inputParam of inputParams) {
		// @ts-ignore
		const chunk = inputParam.chunks.chunk;
		const inputParamAttr = findObjByAtName(chunk, "Attributes");
		const inputParamAttrItems = inputParamAttr.items.item;
		const bounds = findObjByAtName(inputParamAttrItems, "Bounds");
		const pivots = findObjByAtName(inputParamAttrItems, "Pivot");

		inputBounds.push(handleBounds(bounds));
		inputPivots.push(handlePivot(pivots));
	}

	for (const outputParam of outputParams) {
		//@ts-ignore
		const chunk = outputParam.chunks.chunk;
		const outputParamAttr = findObjByAtName(chunk, "Attributes");
		const outputParamAttrItems = outputParamAttr.items.item;
		const bounds = findObjByAtName(outputParamAttrItems, "Bounds");

		const pivots = findObjByAtName(outputParamAttrItems, "Pivot");

		outputBounds.push(handleBounds(bounds));
		outputPivots.push(handlePivot(pivots));
	}

	//@ts-ignore
	const ioParamsIn = inputParams.map((i) => transformParams(i.items.item));
	//@ts-ignore
	const ioParamsOut = outputParams.map((i) => transformParams(i.items.item));

	return {
		params: {
			inputParams: ioParamsIn,
			outputParams: ioParamsOut,
		},
		bounds: {
			input: inputBounds,
			output: outputBounds,
		},
		pivots: {
			input: inputPivots,
			output: outputPivots,
		},
		isZui: false,
	};
}

function transformParams(params: Record<string, any>[]) {
	return params.reduce((acc, param) => {
		const key = param["@_name"];
		const value = param["#text"];

		if (key === "Source") {
			if (!acc[key]) {
				acc[key] = [];
			}
			acc[key].push(value);
		} else {
			acc[key] = value;
		}

		return acc;
	}, {});
}
