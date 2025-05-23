import { GhXmlType, XY } from "@/types/types";
import { getBody, getKeyNameObj, getKeyNameObjArray } from "./helper-functions";
import { DefinitionObjectsSchema } from "@/types/gh-xml-schema";
import {
  ItemObjChunkType,
  DefObjChunk,
  DefObjMainChunkType,
  PropertyType,
} from "@/types/subs/definition-objects-schema";
import { getArrayFrom, getArrayFromWithKey } from "./helper-functions";
import {
  AttributeContainerType,
  BoundsAttributeType,
  NodeParamContainerType,
  PivotAttributeType,
  ScriptContainerType,
} from "@/types/subs/param-object-schema";
import { getScriptParam } from "./get-script-params";
import { getNodeParam } from "./get-node-param";

export function getDefObjects(ghxml: GhXmlType) {
  const ghaLibs = getBody(ghxml, "DefinitionObjects");
  const c = DefinitionObjectsSchema.safeParse(ghaLibs);
  if (c.error) return undefined;
  const chunks = c.data.chunks;

  const chunk = chunks.chunk;
  const chunkArray = getArrayFrom(chunk);
  const compIdents = getComponentIdentifiers(chunkArray);
  const numberOfUniqueComponents = uniqueComponentCount(compIdents);

  const { compoentData, nodeData } = unwrapContainer(chunkArray);

  const { sizeOfScript, density } = getSizeAndCordinate(
    compoentData as AttributeContainerType[][]
  );

  const inputParam = getNodeParam(
    compoentData as NodeParamContainerType[][],
    "param_input"
  );
  const outputParam = getNodeParam(
    compoentData as NodeParamContainerType[][],
    "param_output"
  );

  const scriptParam = getScriptParam(compoentData as ScriptContainerType[][]);

  // happen only with param relay	component
  let sNodeCompSourceCount = 0;
  const singleNodeComponentSource = nodeData.map((c) =>
    getKeyNameObjArray<AttributeContainerType>(
      c as unknown as AttributeContainerType[],
      "@_name",
      "Source"
    )
  );

  singleNodeComponentSource.map((c) => {
    if (Array.isArray(c)) {
      sNodeCompSourceCount += c.length;
    }
  });
  const totalCanvasSourceCount =
    inputParam.totalSourceCount +
    outputParam.totalSourceCount +
    scriptParam.totalSourceCount +
    sNodeCompSourceCount;

  return {
    componentCount: chunks["@_count"],
    sourceCount: totalCanvasSourceCount,
    sizeOfScript: sizeOfScript,
    uniqueComponentCount: numberOfUniqueComponents,
    density: density,
  };
}

function getComponentIdentifiers(chunkArray: DefObjMainChunkType[]) {
  const identiferChunks = chunkArray.map((c) => c.items);
  const componentIdentifiers: PropertyType[] = [];

  identiferChunks.map((c) => {
    const obj = {
      guid: c.item.find((i) => i["@_name"] === "GUID")?.["#text"] ?? "",
      lib: c.item.find((i) => i["@_name"] === "Lib")?.["#text"] ?? "",
      name: c.item.find((i) => i["@_name"] === "Name")?.["#text"] ?? "",
    };
    componentIdentifiers.push(obj);
  });
  return componentIdentifiers;
}

function unwrapContainer(chunkArray: DefObjMainChunkType[]) {
  const conChunkArray = getArrayFromWithKey(chunkArray, (c) => c.chunks.chunk);
  const containerChunksArray = getArrayFromWithKey(
    conChunkArray,
    //@ts-ignore
    (c) => c.chunks
  );
  //@ts-ignore
  const containerItemArray = getArrayFromWithKey(conChunkArray, (c) => c.items);

  const containerChunks = getArrayFrom<DefObjChunk>(containerChunksArray);
  const containerItems = getArrayFrom<ItemObjChunkType>(containerItemArray);

  const containerChunksChunk = getArrayFromWithKey(
    containerChunks,
    (c) => c.chunk
  );

  const containerItemsItem = getArrayFromWithKey(containerItems, (c) => c.item);

  return {
    compoentData: containerChunksChunk.map((c) => getArrayFrom(c)),
    nodeData: containerItemsItem.map((c) => getArrayFrom(c)),
  };
}

function getSizeAndCordinate(compoentData: AttributeContainerType[][]) {
  // works excepet for relay component
  const attributeContainer = compoentData.map((c) =>
    getKeyNameObj(
      c as unknown as AttributeContainerType[],
      "@_name",
      "Attributes"
    )
  );
  const attContainerItems = getArrayFromWithKey(
    attributeContainer,
    (c) => c?.items?.item
  );
  const pivots = attContainerItems.map((c) =>
    getKeyNameObj(c as unknown as PivotAttributeType[], "@_name", "Pivot")
  );
  const xy = pivots.map((c) => {
    if (c) {
      return { x: c.X ?? 0, y: c.Y ?? 0 };
    } else return { x: 0, y: 0 };
  });
  const bounds = attContainerItems.map((c) =>
    getKeyNameObj(c as unknown as BoundsAttributeType[], "@_name", "Bounds")
  );
  const sizeOfScript = getSizeOfScript(xy);
  const xywh = bounds.map((c) => {
    if (c) {
      return { x: c.X ?? 0, y: c.Y ?? 0, w: c.W ?? 0, h: c.H ?? 0 };
    } else return { x: 0, y: 0, w: 0, h: 0 };
  });

  const totalArea = xywh.map((c) => c.w * c.h).reduce((a, b) => a + b, 0);
  //this is ignoring the actaul size of the component thus the number is off...
  const density =
    Math.round((totalArea / (sizeOfScript.x * sizeOfScript.y)) * 100) / 100;

  return {
    xy: xy,
    xywh: xywh,
    sizeOfScript: getSizeOfScript(xy),
    density: density,
  };
}

function getSizeOfScript(xy: XY[]): XY {
  let topLeftX = Number.MAX_SAFE_INTEGER;
  let topLeftY = Number.MAX_SAFE_INTEGER;
  xy.map((c) => {
    if (c.x < topLeftX) topLeftX = c.x;
    if (c.y < topLeftY) topLeftY = c.y;
  });

  let bottomRightX = Number.MIN_SAFE_INTEGER;
  let bottomRightY = Number.MIN_SAFE_INTEGER;
  xy.map((c) => {
    if (c.x > bottomRightX) bottomRightX = c.x;
    if (c.y > bottomRightY) bottomRightY = c.y;
  });

  const x = bottomRightX - topLeftX;
  const y = bottomRightY - topLeftY;

  return { x: Math.round(x), y: Math.round(y) };
}

function uniqueComponentCount(componentIdentifiers: PropertyType[]) {
  const uniqueGuids = new Set<string>();
  componentIdentifiers.forEach((c) => {
    if (!uniqueGuids.has(c.guid)) {
      uniqueGuids.add(c.guid);
    }
  });
  return uniqueGuids.size;
}
