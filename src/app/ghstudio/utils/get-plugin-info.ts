import { GhaLibrariesSchema } from "@/types/gh-xml-schema";
import {
  LibrarySchemaType,
  PluginLibrarySchemaType,
  PluginLibraryType,
  VanilaLibrarySchemaType,
  VanilaLibraryType,
} from "@/types/subs/library-type-schema";
import { GhXmlType } from "@/types/types";
import { getBody } from "./helper-functions";

export function getPluginInfo(ghxml: GhXmlType) {
  const ghaLibs = getBody(ghxml, "GHALibraries");

  const c = GhaLibrariesSchema.safeParse(ghaLibs);
  if (c.error) return undefined;
  const chunk = c.data.chunks;

  const libInfo: LibrarySchemaType[] = [];

  if (c.data.chunks["@_count"] === 1) {
    libInfo.push(chunk.chunk as LibrarySchemaType);
  } else {
    libInfo.push(...(chunk.chunk as LibrarySchemaType[]));
  }
  const vanilaLibs: VanilaLibraryType[] = [];
  const pluginLibs: PluginLibraryType[] = [];

  libInfo.map((lib) => {
    const item = lib.items.item;
    if (item.length === 4) {
      const castedItem = lib as VanilaLibrarySchemaType;
      const author = castedItem.items.item.find(
        (i) => i["@_name"] === "Author"
      );
      const id = castedItem.items.item.find((i) => i["@_name"] === "Id");
      const name = castedItem.items.item.find((i) => i["@_name"] === "Name");
      const version = castedItem.items.item.find(
        (i) => i["@_name"] === "Version"
      );

      if (
        vanilaLibs.find(
          (lib) =>
            lib.author === author?.["#text"] &&
            lib.version === version?.["#text"]
        )
      ) {
        return;
      }
      vanilaLibs.push({
        author: author?.["#text"] ?? "",
        id: id?.["#text"] ?? "",
        name: name?.["#text"] ?? "",
        version: version?.["#text"] ?? "",
      });
    } else {
      const castedItem = lib as PluginLibrarySchemaType;
      const assemblyFullName = castedItem.items.item.find(
        (i) => i["@_name"] === "AssemblyFullName"
      );
      const assemblyVersion = castedItem.items.item.find(
        (i) => i["@_name"] === "AssemblyVersion"
      );
      const author = castedItem.items.item.find(
        (i) => i["@_name"] === "Author"
      );
      const id = castedItem.items.item.find((i) => i["@_name"] === "Id");
      const name = castedItem.items.item.find((i) => i["@_name"] === "Name");
      const version = castedItem.items.item.find(
        (i) => i["@_name"] === "Version"
      );

      pluginLibs.push({
        assemblyFullName: assemblyFullName?.["#text"] ?? "",
        assemblyVersion: assemblyVersion?.["#text"] ?? "",
        author: author?.["#text"] ?? "",
        id: id?.["#text"] ?? "",
        name: name?.["#text"] ?? "",
        version: version?.["#text"] ?? "",
      });
    }
  });

  return {
    vanilaLibs: vanilaLibs,
    pluginLibs: pluginLibs,
    libsCount: pluginLibs.length,
  };
}
