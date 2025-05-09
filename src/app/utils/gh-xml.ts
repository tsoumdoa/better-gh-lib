import { GhXml } from "@/types";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

export function validateGhXml(xml: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    ignoreDeclaration: false,
    parseTagValue: true,
    parseAttributeValue: true,
    commentPropName: "comments",
    trimValues: true,
  });
  const result = parser.parse(xml);
  const keys = Object.keys(result);
  if (keys.length === 0) {
    return { isVaild: false, data: "it's not GhXml" };
  }

  //temporal hack
  return { isValid: true, data: "ok" };

  // const validatedXml = GhXml.safeParse(result);
  // if (!validatedXml.success) {
  //   console.log(validatedXml.error);
  //   return { isVaild: false, data: validatedXml.error };
  // }
  //
  // buildGhXml(result);
  //
  // //before
  // console.log(result.Archive.chunks.chunk.chunks.chunk);
  // //after
  // const d = validatedXml.data.Archive.chunks.chunk.chunks.chunk;
  // console.log(d);
  //
  // return { isValid: true, data: validatedXml.data };
}

export function buildGhXml(parsedXml: GhXml) {
  const builder = new XMLBuilder({
    attributeNamePrefix: "@_",
    ignoreAttributes: false,
    commentPropName: "comments",
    format: true,
    indentBy: "  ",
    suppressEmptyNode: false,
    preserveOrder: false,
    suppressUnpairedNode: false,
  });

  //workaround for type issue for now...
  const deepCopy = JSON.parse(JSON.stringify(parsedXml));
  deepCopy["?xml"] = {
    "@_version": "1.0",
    "@_encoding": "UTF-8",
    "@_standalone": "yes",
  };

  const xmlOutput = builder.build(deepCopy);
  console.log(xmlOutput);
}
