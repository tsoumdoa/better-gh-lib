import { GhXmlType } from "@/types/types";
import { getBody } from "./helper-functions";
import { DefinitionObjectsSchema } from "@/types/gh-xml-schema";
import {
  ContainerChunk,
  DefObjChunk,
  DefObjMainChunkType,
  ItemObjChunkType,
  PropertyType,
} from "@/types/subs/definition-objects-schema";

export function getDefObjects(ghxml: GhXmlType) {
  const ghaLibs = getBody(ghxml, "DefinitionObjects");
  const c = DefinitionObjectsSchema.safeParse(ghaLibs);
  if (c.error) return undefined;
  const chunks = c.data.chunks;

  ///////
  const chunk = chunks.chunk;
  const chunkArray: DefObjMainChunkType[] = [];
  if (Array.isArray(chunk)) {
    const casted = chunk as DefObjMainChunkType[];
    chunkArray.push(...casted);
  } else {
    chunkArray.push(chunk as DefObjMainChunkType);
  }

  const compIdents = getComponentIdentifiers(chunkArray);

  //////
  const containerChunks = chunkArray.map((c) => c.chunks.chunk);
  const containerChunksArray: ContainerChunk[] = [];
  if (Array.isArray(containerChunks)) {
    const casted = containerChunks as ContainerChunk[];
    containerChunksArray.push(...casted);
  } else {
    containerChunksArray.push(containerChunks as ContainerChunk);
  }

  ///////
  const containerChunksChunks = containerChunksArray.map((c) => c.chunks);
  const containerChunksChunksArray: DefObjChunk[] = [];
  if (Array.isArray(containerChunksChunks)) {
    const casted = containerChunksChunks as DefObjChunk[];
    containerChunksChunksArray.push(...casted);
  } else {
    containerChunksChunksArray.push(containerChunksChunks as DefObjChunk);
  }

  ///////
  const containerChunksItems = containerChunksArray.map((c) => c.items);
  const containerChunksItemsArray: ItemObjChunkType[] = [];
  if (Array.isArray(containerChunksItems)) {
    const casted = containerChunksItems as ItemObjChunkType[];
    containerChunksItemsArray.push(...casted);
  } else {
    containerChunksItemsArray.push(containerChunksItems as ItemObjChunkType);
  }

  console.log(containerChunksChunksArray);
  console.log(containerChunksItemsArray);

  //source
  //compoenentLoc

  return {
    componentCount: chunks["@_count"],
  };
}

function getComponentIdentifiers(chunkArray: DefObjMainChunkType[]) {
  const identiferChunks = chunkArray.map((c) => c.items);
  const componentIdentifiers: PropertyType[] = [];

  identiferChunks.map((c) => {
    const obj = {
      guid: c.item.find((i) => i["@_name"] === "GUID")?.["#text"]!,
      lib: c.item.find((i) => i["@_name"] === "Lib")?.["#text"] || undefined,
      name: c.item.find((i) => i["@_name"] === "Name")?.["#text"]!,
    };
    componentIdentifiers.push(obj);
  });
  return componentIdentifiers;
}
