import {
	extractInterfaceDescriptor,
	handleBounds,
	handleZuiIoAttrs,
	handlePivot,
	parseZuiIOs,
} from "./handler";
import { Bound, CanvasPoint, NodeIdentifier } from "./tgh";

export function getComponentBounds(obj: any): Bound {
	const p = getComponentAttribute(obj, "Bounds");
	return handleBounds(p);
}
export function getComponentPivot(obj: any): CanvasPoint {
	const p = getComponentAttribute(obj, "Pivot");
	return handlePivot(p);
}

export function findObjByAtName(obj: any, atName: string) {
	return obj.find((i: Record<string, unknown>) => i["@_name"] === atName);
}

export function filterObjByAtName(obj: any, atName: string) {
	return obj.filter((i: Record<string, unknown>) => i["@_name"] === atName);
}

function getComponentAttribute(obj: any, name: "Bounds" | "Pivot") {
	const attr = findObjByAtName(
		obj.chunks.chunk[0].chunks.chunk,
		"Attributes"
	).items;

	if (!attr) {
		return null;
	}

	return attr.item.find((i: Record<string, unknown>) => i["@_name"] === name);
}

export function getIdentifier(obj: any): NodeIdentifier {
	const identifier: Record<string, any>[] = obj.items.item;

	return {
		guid: findObjByAtName(identifier, "GUID")?.["#text"],
		name: findObjByAtName(identifier, "Name")?.["#text"],
		libId: findObjByAtName(identifier, "Lib")?.["#text"],
	};
}

export function transformParams(params: Record<string, any>[]) {
	return params.reduce((acc, param) => {
		const key = param["@_name"];
		const value = param["#text"];

		if (key === "Source") {
			if (!acc[key]) {
				acc[key] = [];
			}
			acc[key].push(value);
		} else if (key === "ClusterDocument") {
			const encoded = param.stream["#text"]; //base64 encoded binary data;
			acc[key] = encoded;
		} else {
			acc[key] = value;
		}

		return acc;
	}, {});
}

export function getInstanceIdentifier(obj: any) {
	const ii: Record<string, any>[] = obj.chunks.chunk[0].items.item;
	const parsed = transformParams(ii);
	return parsed;
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
export type IOS = ReturnType<typeof parseIOs>;

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

		inputBounds.push(handleBounds(bounds));
		inputPivots.push(handlePivot(pivots));
	}

	for (const outputParam of outputParams) {
		//@ts-ignore
		const chunk = outputParam.chunks.chunk;
		const outputParamAttrItems = findObjByAtName(chunk, "Attributes").items
			.item;
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
