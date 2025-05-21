import { GhXmlType } from "@/types/types";
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

  const { compoentData, nodeData } = unwrapContainer(chunkArray);

  //danerously asserting type here, but sort of checking the type in function, so it's ok...
  const pivotAtt = getPivotAtt(compoentData as AttributeContainerType[][]);
  const inputParam = getNodeParam(
    compoentData as NodeParamContainerType[][],
    "param_input"
  );

  const outputParam = getNodeParam(
    compoentData as NodeParamContainerType[][],
    "param_output"
  );

  const { scriptParam, totalScriptSourceCount } = getScriptParam(
    compoentData as ScriptContainerType[][]
  );

  const singleNodeComponentSource = nodeData.map((c) =>
    getKeyNameObjArray<AttributeContainerType>(
      c as unknown as AttributeContainerType[],
      "@_name",
      "Source"
    )
  );
  // console.log(singleNodeComponentSource);
  //
  console.log(inputParam);
  console.log(outputParam);
  console.log(scriptParam);

  const totalCanvasSourceCount =
    inputParam.totalSourceCount +
    outputParam.totalSourceCount +
    totalScriptSourceCount;

  console.log(totalCanvasSourceCount);
  return {
    componentCount: chunks["@_count"],
    compponentIdent: compIdents,
    pivotAtt: pivotAtt,
    inputParam: inputParam,
    outputParam: outputParam,
    sourceCount: totalCanvasSourceCount,
    //sourceArrays:
    // compoentUids:
    // compoentInputUids:
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
