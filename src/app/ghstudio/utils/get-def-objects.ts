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

  // works excepet for relay component
  const pivotAtt = getPivotAtt(compoentData as AttributeContainerType[][]);
  const xy = pivotAtt.map((c) => {
    if (c) {
      return { x: c.X ?? 0, y: c.Y ?? 0 };
    } else return { x: 0, y: 0 };
  });
  const sizeOfScript = getSizeOfScript(xy);

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

function getPivotAtt(compoentData: AttributeContainerType[][]) {
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
  return attContainerItems.map((c) =>
    getKeyNameObj(c as unknown as PivotAttributeType[], "@_name", "Pivot")
  );
}

function getSizeOfScript(xy: XY[]): XY {
  let topLeftX = 0;
  let topRightY = 0;
  xy.map((c) => {
    if (c.x < topLeftX) topLeftX = c.x;
    if (c.y < topRightY) topRightY = c.y;
  });

  // find the largest x and y
  let bottomLeftX = 0;
  let bottomRightY = 0;
  xy.map((c) => {
    if (c.x > bottomLeftX) bottomLeftX = c.x;
    if (c.y > bottomRightY) bottomRightY = c.y;
  });

  const x = bottomLeftX - topLeftX;
  const y = bottomRightY - topRightY;

  return { x: x, y: y };
}

function uniqueComponentCount(componentIdentifiers: PropertyType[]) {
  let count = 0;
  componentIdentifiers.map((c) => {
    if (componentIdentifiers.filter((e) => e.guid === c.guid).length === 1) {
      count++;
    }
  });
  return count;
}
