import { ExtractedParamInfo, ParamNameAndDescription } from "@/types/types";

interface Item {
  "#text"?: string | boolean | number;
  "@_name": string;
  "@_type_name": string;
  "@_type_code": number;
  X?: number;
  Y?: number;
  W?: number;
  H?: number;
}

interface Items {
  item: Item[];
  "@_count": number;
}

interface Chunk {
  items: Items;
  "@_name": string;
}

interface Chunks {
  chunk: Chunk | Chunk[];
  "@_count": number;
}

interface ParamData {
  items: Items;
  chunks: Chunks;
  "@_name": string;
  "@_index": number;
}

export function extractNameDescriptionAndType(
  data: ParamData[]
): ExtractedParamInfo {
  const result = {
    input: [] as ParamNameAndDescription[],
    output: [] as ParamNameAndDescription[],
  };

  for (const param of data) {
    const itemData = param.items.item;
    let name = "";
    let description = "";
    const type = param["@_name"].includes("Input") ? "Input" : "Output";

    for (const item of itemData) {
      if (item["@_name"] === "Name" && typeof item["#text"] === "string") {
        name = item["#text"];
      } else if (
        item["@_name"] === "Description" &&
        typeof item["#text"] === "string"
      ) {
        description = item["#text"];
      }
    }
    if (type === "Input") {
      result.input.push({ name, description });
    } else if (type === "Output") {
      result.output.push({ name, description });
    }
  }
  return result;
}
