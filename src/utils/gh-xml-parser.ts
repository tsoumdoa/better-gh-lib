import { XMLParser } from "fast-xml-parser";
export const ghXmlParser = new XMLParser({
  ignoreAttributes: false,
  ignoreDeclaration: false,
  parseTagValue: true,
  parseAttributeValue: true,
  commentPropName: "comments",
  trimValues: true,
  isArray: (name) => {
    const arrayTags = ["item", "chunk"]; //if item or chunk, it shouls be in an array
    if (arrayTags.includes(name)) {
      return true;
    }
    return false;
  },
});
