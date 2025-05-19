import { GhXmlType, XmlMetrics } from "@/types/types";
import { getPluginInfo } from "./get-plugin-info";
import { getArchieveVersion } from "./helper-functions";
import { getDefObjects } from "./get-def-objects";

export function getXmlMetrics(
  ghxml: GhXmlType,
  schemaCoverage: number
): XmlMetrics {
  const archiveVersion = getArchieveVersion(ghxml);
  const plugnInfo = getPluginInfo(ghxml);
  // const defProps = getDefObjProps(ghxml);/* general info abt the script, not so useful */
  const defObjs = getDefObjects(ghxml);

  return {
    archiveVersion: archiveVersion,
    componentCount: defObjs?.componentCount,
    plugins: plugnInfo?.pluginLibs,
    pluginsCount: plugnInfo?.libsCount,
    totalNodes: undefined,
    maxDepth: undefined,
    schemaCoverage: schemaCoverage,
  };
}

// "GHALibraries",
// list out plugins
//
//
// "DefinitionObjects",
//
