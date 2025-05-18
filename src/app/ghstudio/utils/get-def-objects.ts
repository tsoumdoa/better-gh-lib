import { GhXmlType } from "@/types/types";
import { getBody } from "./helper-functions";
import { DefinitionObjectsSchema } from "@/types/gh-xml-schema";
import {
  ItemObjChunkType,
  DefObjChunk,
  DefObjMainChunkType,
  PropertyType,
} from "@/types/subs/definition-objects-schema";
import { getArrayFrom, getArrayFromWithKey } from "./helper-functions";

export function getDefObjects(ghxml: GhXmlType) {
  const ghaLibs = getBody(ghxml, "DefinitionObjects");
  const c = DefinitionObjectsSchema.safeParse(ghaLibs);
  if (c.error) return undefined;
  const chunks = c.data.chunks;

  const chunk = chunks.chunk;
  const chunkArray = getArrayFrom(chunk);
  const compIdents = getComponentIdentifiers(chunkArray);

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

  const containerChunksChunk = getArrayFrom(
    containerChunks.map((c) => c.chunk)
  );
  console.log(containerChunksChunk);

  const containerItemsItem = getArrayFrom(containerItems.map((c) => c.item));
  console.log(containerItemsItem);

  //source
  //compoenentLoc

  return {
    componentCount: chunks["@_count"],
    compponentIdent: compIdents,
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
