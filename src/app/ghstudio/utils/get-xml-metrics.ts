import {
  ArchiveVersion,
  GhXmlType,
  SchemaNameLiteral,
  XmlMetrics,
} from "@/types/types";

export function getXmlMetrics(
  ghxml: GhXmlType,
  schemaCoverage: number
): XmlMetrics {
  const archiveVersion = getArchieveVersion(ghxml);
  const rcpLayout = getBody(ghxml, "RcpLayout");

  return {
    archiveVersion: archiveVersion,
    componentCount: undefined,
    plugins: undefined,
    pluginsCount: undefined,
    totalNodes: undefined,
    maxDepth: undefined,
    schemaCoverage: schemaCoverage,
  };
}

function getArchieveVersion(ghxml: GhXmlType): ArchiveVersion {
  const v = ghxml.Archive.items.item;
  return {
    major: v.Major,
    minor: v.Minor,
    revision: v.Revision,
  };
}

function getBody(ghxml: GhXmlType, schemaName: SchemaNameLiteral) {
  const chunk = ghxml.Archive.chunks.chunk.chunks.chunk;
  const f = chunk.find((c) => c["@_name"] === schemaName);
  return f;
}
// "GHALibraries",
// list out plugins
//
//
// "DefinitionObjects",
//
