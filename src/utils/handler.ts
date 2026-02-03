import {
	extractBounds,
	extractInterfaceDescriptor,
	extractPivot,
	filterObjByAtName,
	findObjByAtName,
	transformParams,
} from "./helper";
import { Bound, CanvasPoint, NodeIdentifier } from "./tgh-types";

export function handleZuiIoAttrs(chunk: Record<string, any>[]) {
	const inputAttrInputParams = filterObjByAtName(chunk, "InputParam");
	const outputAttrOutputParams = filterObjByAtName(chunk, "OutputParam");

	var inputBounds: Bound[] = [];
	var outputBounds: Bound[] = [];
	var inputPivots: CanvasPoint[] = [];
	var outputPivots: CanvasPoint[] = [];

	for (const inputParam of inputAttrInputParams) {
		const inputParamAttrItems = inputParam.chunks.chunk.find(
			(i: Record<string, unknown>) => i["@_name"] === "Attributes"
		).items.item;

		const bounds = findObjByAtName(inputParamAttrItems, "Bounds");
		const pivots = findObjByAtName(inputParamAttrItems, "Pivot");

		inputBounds.push(extractBounds(bounds));
		inputPivots.push(extractPivot(pivots));
	}

	for (const outputParam of outputAttrOutputParams) {
		const outputParamAttrItems = findObjByAtName(
			outputParam.chunks.chunk,
			"Attributes"
		).items.item;

		const bounds = findObjByAtName(outputParamAttrItems, "Bounds");
		const pivots = findObjByAtName(outputParamAttrItems, "Pivot");

		outputBounds.push(extractBounds(bounds));
		outputPivots.push(extractPivot(pivots));
	}

	return {
		inputBounds: inputBounds,
		outputBounds: outputBounds,
		inputPivots: inputPivots,
		outputPivots: outputPivots,
	};
}
export function parseZuiIOs(zuiBody: any) {
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

	const inParams = filterObjByAtName(chunk, "InputParam").map((i: any) =>
		transformParams(i.items.item)
	);
	const outParams = filterObjByAtName(chunk, "OutputParam").map((i: any) =>
		transformParams(i.items.item)
	);

	return {
		inputParams: inParams,
		outputParams: outParams,
		inputBounds: parsedAttrs.inputBounds,
		outputBounds: parsedAttrs.outputBounds,
		inputPivots: parsedAttrs.inputPivots,
		outputPivots: parsedAttrs.outputPivots,
	};
}

export function handleIdentifier(obj: any): NodeIdentifier {
	const identifier: Record<string, any>[] = obj.items.item;

	return {
		guid: findObjByAtName(identifier, "GUID")?.["#text"],
		name: findObjByAtName(identifier, "Name")?.["#text"],
		libId: findObjByAtName(identifier, "Lib")?.["#text"],
	};
}

export function parseIOs(obj: any) {
	const zuiBody = obj.chunks.chunk[0].chunks.chunk.find(
		(i: Record<string, unknown>) => i["@_name"] === "ParameterData"
	);
	if (zuiBody) {
		return handleZuiIOs(obj);
	}
	return handleStandardIOs(obj);
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
		const inputParamAttrItems = findObjByAtName(chunk, "Attributes").items.item;
		const bounds = findObjByAtName(inputParamAttrItems, "Bounds");
		const pivots = findObjByAtName(inputParamAttrItems, "Pivot");

		inputBounds.push(extractBounds(bounds));
		inputPivots.push(extractPivot(pivots));
	}

	for (const outputParam of outputParams) {
		//@ts-ignore
		const chunk = outputParam.chunks.chunk;
		const outputParamAttrItems = findObjByAtName(chunk, "Attributes").items
			.item;
		const bounds = findObjByAtName(outputParamAttrItems, "Bounds");

		const pivots = findObjByAtName(outputParamAttrItems, "Pivot");

		outputBounds.push(extractBounds(bounds));
		outputPivots.push(extractPivot(pivots));
	}

	const ioParamsIn = inputParams.map((i: any) => transformParams(i.items.item));
	const ioParamsOut = outputParams.map((i: any) =>
		transformParams(i.items.item)
	);

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

export function getScripts(obj: any) {
	const scripts = obj.chunks.chunk[0].chunks.chunk.find(
		(i: Record<string, unknown>) => i["@_name"] === "Script"
	);
	if (!scripts) return {};

	const languageSpec = scripts.chunks.chunk[0].items.item;
	const taxon = findObjByAtName(languageSpec, "Taxon")["#text"];

	const item = scripts.items.item;
	const objs = transformParams(item);
	const scriptTextEncoded = findObjByAtName(item, "Text")?.["#text"];
	const decoded = new TextDecoder().decode(
		Buffer.from(scriptTextEncoded, "base64")
	);

	delete objs["Text"];

	return {
		taxon: taxon,
		...objs,
		script: decoded,
	};
}
