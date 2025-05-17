import { ArchiveVersion, GhXmlType, SchemaNameLiteral } from "@/types/types";

export function getBody(ghxml: GhXmlType, schemaName: SchemaNameLiteral) {
  const chunk = ghxml.Archive.chunks.chunk.chunks.chunk;
  return chunk.find((c) => c["@_name"] === schemaName);
}

export function getArchieveVersion(ghxml: GhXmlType): ArchiveVersion {
  const v = ghxml.Archive.items.item;
  return {
    major: v.Major,
    minor: v.Minor,
    revision: v.Revision,
  };
}
