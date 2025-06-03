import { getArrayFrom, getBody } from "@/app/ghstudio/utils/helper-functions";
import { DefinitionObjectsSchema } from "@/types/gh-xml-schema";
import { ExtractedCode, GhXmlType } from "@/types/types";
import { codeToHtml } from "shiki";
import DOMPurify from "dompurify";
import { extractNameDescriptionAndType } from "./normalize-input-output-params";

export async function extractCode(parsedJson: GhXmlType) {
  const ghaLibs = getBody(parsedJson, "DefinitionObjects");
  const c1 = DefinitionObjectsSchema.safeParse(ghaLibs);
  if (c1.error) return undefined;
  const chunks = c1.data.chunks;
  const chunk = chunks.chunk;
  const componentArray = getArrayFrom(chunk);
  const r = componentArray.map((c) => c.chunks.chunk);

  const resArray: ExtractedCode[] = [];

  for (const item of r) {
    try {
      if (!Array.isArray(item)) {
        const c3 = item.chunks;
        if (!Array.isArray(c3)) {
          //should fail here if it's not python or csharp node
          const base64EncodedText = c3.chunk[2].items.item[3]["#text"];

          const paramData = c3.chunk[1];
          const InputOutParams = paramData.chunks.chunk;

          const nameAndDescripts =
            extractNameDescriptionAndType(InputOutParams);

          const langSpec = c3.chunk[2].chunks.chunk;
          const lang = langSpec.items.item[0]["#text"];
          const version = langSpec.items.item[1]["#text"];
          const ls = {
            language: lang.includes("python") ? "python" : "csharp",
            version: verionInfo(version),
          };

          const decodedText = atob(base64EncodedText);
          const styledHtml = await codeToHtml(decodedText, {
            lang: ls.language,
            theme: "dracula-soft",
          });
          const sanitizedHtml = DOMPurify.sanitize(styledHtml);
          resArray.push({
            htmlString: sanitizedHtml,
            originalString: decodedText,
            language: ls,
            count: 1,
            ioParams: nameAndDescripts,
          });
        }
      }
    } catch {
      continue;
    }
  }

  const uniqueHtmlStringIndices = new Map(); // Map to store unique string -> first index

  resArray.forEach((item, index) => {
    if (!uniqueHtmlStringIndices.has(item.htmlString)) {
      uniqueHtmlStringIndices.set(item.htmlString, { index: index, count: 1 });
    } else {
      const existingItem = uniqueHtmlStringIndices.get(item.htmlString);
      existingItem.count++;
      uniqueHtmlStringIndices.set(item.htmlString, existingItem);
    }
  });

  const indicesArray = Array.from(uniqueHtmlStringIndices.values());
  const uniqueIndices = indicesArray.map((item) => item.index);
  const filteredRes = resArray.filter((_, index) =>
    uniqueIndices.includes(index)
  );
  const uniqueCounts = indicesArray.map((item) => item.count);
  filteredRes.forEach((item, index) => {
    item.count = uniqueCounts[index];
  });
  return filteredRes;
}

const verionInfo = (version: string) => {
  if (version === "*.*") {
    //when csharp
    return "CSharp";
  }
  if (version === "2.*") {
    return "IronPython 2";
  }
  if (version === "3.*") {
    return "Python 3";
  } else return "";
};
