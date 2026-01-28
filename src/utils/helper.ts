import {
  Bound,
  CanvasPoint,
  InterfaceDescriptor,
  InterfaceIdentifier,
} from "./tgh-types";

export function findObjByAtName(obj: any, atName: string) {
  return obj.find((i: Record<string, unknown>) => i["@_name"] === atName);
}

export function filterObjByAtName(obj: any, atName: string) {
  return obj.filter((i: Record<string, unknown>) => i["@_name"] === atName);
}

export function extractBounds(p: any): Bound {
  if (!p) {
    return { x: -1, y: -1, width: -1, height: -1 };
  }
  return { x: p.X, y: p.Y, width: p.W, height: p.H };
}

export function extractPivot(p: any): CanvasPoint {
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

export function extractComponentBounds(obj: any): Bound {
  const p = extractComponentAttribute(obj, "Bounds");
  return extractBounds(p);
}
export function extractComponentPivot(obj: any): CanvasPoint {
  const p = extractComponentAttribute(obj, "Pivot");
  return extractPivot(p);
}

function extractComponentAttribute(obj: any, name: "Bounds" | "Pivot") {
  const attr = findObjByAtName(
    obj.chunks.chunk[0].chunks.chunk,
    "Attributes"
  ).items;

  if (!attr) {
    return null;
  }

  return attr.item.find((i: Record<string, unknown>) => i["@_name"] === name);
}

export function extractInstanceIdentifier(obj: any) {
  const ii: Record<string, any>[] = obj.chunks.chunk[0].items.item;
  const parsed = transformParams(ii);
  return parsed;
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
