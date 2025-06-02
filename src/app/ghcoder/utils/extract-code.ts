import { getArrayFrom, getBody } from "@/app/ghstudio/utils/helper-functions";
import { DefinitionObjectsSchema } from "@/types/gh-xml-schema";
import { ExtractedCode, GhXmlType } from "@/types/types";
import { codeToHtml } from "shiki";
import DOMPurify from "dompurify";

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
          const base64EncodedText = c3.chunk[2].items.item[3]["#text"];
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
            language: ls,
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
      uniqueHtmlStringIndices.set(item.htmlString, index);
    }
  });

  const indicesArray = Array.from(uniqueHtmlStringIndices.values());
  return resArray.filter((_, index) => indicesArray.includes(index));

  //imrpove code above and add compoennt count too
  //todo add input & export nodes
  //add copy and paste on code
  //add option for paste back formated code (have link to the recomended site..)
  //and then add option for copy back to clipboard
  //
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
