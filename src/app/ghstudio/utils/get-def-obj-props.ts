import { GhXmlType } from "@/types/types";
import { getBody } from "./helper-functions";
import { DefPropType } from "@/types/gh-xml-schema";

export function getDefObjProps(ghxml: GhXmlType) {
  const getDefObjProps = getBody(ghxml, "DefinitionProperties") as DefPropType;
  const chunks = getDefObjProps?.chunks;
  const items = getDefObjProps?.items;
  console.log(chunks);
  console.log(items);
}
