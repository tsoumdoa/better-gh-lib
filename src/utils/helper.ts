import {
	Bound,
	CanvasPoint,
	InstanceIdentifier,
	InterfaceDescriptor,
	InterfaceIdentifier,
	NodeIdentifier,
} from "./tgh";

export function getBounds(obj: any): Bound {
	const p = getAttribute(obj, "Bounds");
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

export function getPivot(obj: any): CanvasPoint {
	const p = getAttribute(obj, "Pivot");
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

function getAttribute(obj: any, name: "Bounds" | "Pivot") {
	const attr = obj.chunks.chunk[0].chunks.chunk.find(
		//@ts-ignore
		(i) => i["@_name"] === "Attributes"
	).items;

	if (!attr) {
		return null;
	}

	return attr.item.find(
		//@ts-ignore
		(i) => i["@_name"] === name
	);
}

export function getIdentifier(obj: any): NodeIdentifier {
	const ii = obj.items.item;
	//@ts-ignore
	const g = ii.find((i) => i["@_name"] === "GUID")?.["#text"];
	//@ts-ignore
	const n = ii.find((i) => i["@_name"] === "Name")?.["#text"];
	//@ts-ignore
	const id = ii.find((i) => i["@_name"] === "Lib")?.["#text"];

	return {
		guid: g,
		name: n,
		libId: id,
	};
}

export function getInstanceIdentifier(obj: any): InstanceIdentifier {
	const ignoreKeys = [
		"InstanceGuid",
		"Name",
		"NickName",
		"Locked",
		"Hidden",
		"Description",
	];
	const ii = obj.chunks.chunk[0].items.item;
	//@ts-ignore
	const g = ii.find((i) => i["@_name"] === ignoreKeys[0])?.["#text"];
	//@ts-ignore
	const n = ii.find((i) => i["@_name"] === ignoreKeys[1])?.["#text"];
	//@ts-ignore
	const id = ii.find((i) => i["@_name"] === ignoreKeys[2])?.["#text"];
	//@ts-ignore
	const l = ii.find((i) => i["@_name"] === ignoreKeys[3])?.["#text"] || false;
	//@ts-ignore
	const h = ii.find((i) => i["@_name"] === ignoreKeys[4])?.["#text"] || false;
	//@ts-ignore
	const d = ii.find((i) => i["@_name"] === ignoreKeys[5])?.["#text"];

	const objCollector: any = {};

	for (const c of ii) {
		const key = c["@_name"];
		const value = c["#text"];
		if (ignoreKeys.includes(key)) {
			continue;
		}
		if (key === "ID") {
			if (!objCollector[key]) {
				objCollector[key] = [value];
			} else if (Array.isArray(objCollector[key])) {
				objCollector[key].push(value);
			} else {
				objCollector[key] = [objCollector[key], value];
			}
			continue;
		}
		objCollector[key] = value;
	}

	return {
		instanceGuid: g,
		name: n,
		nickName: id,
		description: d,
		locked: l,
		hidden: h,
		others: objCollector,
	};
}

export function getInterfaceDescriptor(obj: any): InterfaceDescriptor {
	const attr = obj.chunks.chunk[0].chunks.chunk[1];
	if (!attr) {
		return {
			inputCount: -1,
			outputCount: -1,
			inputIdentifiers: [],
			outputIdentifiers: [],
		};
	}
	const items = attr.items.item;
	if (!items) {
		return {
			inputCount: -1,
			outputCount: -1,
			inputIdentifiers: [],
			outputIdentifiers: [],
		};
	}

	const inputCount = items.find(
		//@ts-ignore
		(i) => i["@_name"] === "InputCount"
	)?.["#text"];
	const outputCount = items.find(
		//@ts-ignore
		(i) => i["@_name"] === "OutputCount"
	)?.["#text"];

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
		inputIdentifiers: inputIdentifiers,
		outputIdentifiers: outputIdentifiers,
	};
}

export function parseIOs(obj: any) {
	const zuiBody = obj.chunks.chunk[0].chunks.chunk.find(
		//@ts-ignore
		(i) => i["@_name"] === "ParameterData"
	);
	if (zuiBody) {
		return parseZuiIOs(zuiBody);
	}
	return parseStandardIOs(obj);
}

function parseZuiIOs(zuiBody: any) {
	// TODO: change the implentaion for the current interfaceDescriptor
	// console.log(zuiBody.items.item); //interfaceDescriptor

	const chunks = zuiBody.chunks;

	if (!chunks) return {};
	const inputParam = chunks.chunk.find(
		//@ts-ignore
		(i) => i["@_name"] === "InputParam"
	);
	const outputParam = chunks.chunk.find(
		//@ts-ignore
		(i) => i["@_name"] === "OutputParam"
	);

	return {
		inputParam: inputParam,
		outputParam: outputParam,
	};
}

function parseStandardIOs(obj: any) {
	const inputParam = obj.chunks.chunk[0].chunks.chunk.find(
		//@ts-ignore
		(i) => i["@_name"] === "param_output"
	);
	const outputParam = obj.chunks.chunk[0].chunks.chunk.find(
		//@ts-ignore
		(i) => i["@_name"] === "param_input"
	);

	return {
		inputParam: inputParam,
		outputParam: outputParam,
	};
}
