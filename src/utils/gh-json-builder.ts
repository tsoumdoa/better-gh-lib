import {
  getDefObj,
  getGhaLibraryDescriptors,
  getVersion,
} from "./data-extractor";
import { ghXmlParser } from "./gh-xml-parser";

export function buildGhJson(xml: any) {
  const jsonXml = ghXmlParser.parse(xml);

  const version = getVersion(jsonXml);
  const defObjs = getDefObj(jsonXml);
  const ghLibs = getGhaLibraryDescriptors(jsonXml);

  const identifiers = defObjs.identifiers;
  const pivots = defObjs.pivots;
  const bounds = defObjs.bounds;
  const instanceIdentifiers = defObjs.instanceIdentifiers;

  const zipIos = defObjs.ios.map((c) => {
    if (!c.isZui) {
      return {
        in: {
          inputParams: c.params.inputParams,
          inputBounds: c.bounds.input,
          inputPivots: c.pivots.input,
        },
        out: {
          outputParams: c.params.outputParams,
          outputBounds: c.bounds.output,
          outputPivots: c.pivots.output,
        },
      };
    }
    return {
      in: {
        inputParams: c.params.inputParams,
        //@ts-ignore
        inputParamsZui: c.zuiDescriptor.inputIdentifiers,
        inputBounds: c.bounds.input,
        inputPivots: c.pivots.input,
      },
      out: {
        outputParams: c.params.outputParams,
        //@ts-ignore
        outputParamsZui: c.zuiDescriptor.outputIdentifiers,
        outputBounds: c.bounds.output,
        outputPivots: c.pivots.output,
      },
    };
  });

  const zipped = identifiers.map((c, i) => {
    return {
      ...instanceIdentifiers[i],
      identifier: c,
      pivot: {
        x: pivots[i].x,
        y: pivots[i].y,
      },
      bounds: {
        x: bounds[i].x,
        y: bounds[i].y,
        width: bounds[i].width,
        height: bounds[i].height,
      },
      ...zipIos[i],
    };
  });

  return {
    GhVersion: `${version.major}.${version.minor}.${version.revision}`,
    componentsCount: defObjs.componenentCount,
    uniqueCount: defObjs.uniqueCount,
    ghLibs: ghLibs.descriptor,
    ghs: zipped,
    scripts: defObjs.scripts,
  };
}
