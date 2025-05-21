import {
  ParamChunkType,
  ParamItemType,
  ScriptContainerType,
  ScriptParameterContainerType,
} from "@/types/subs/param-object-schema";
import { getKeyNameObjArray } from "./helper-functions";

export function getScriptParam(
  container: ScriptContainerType[][] | ScriptParameterContainerType[][]
) {
  const scriptData = container.map((c) =>
    getKeyNameObjArray(
      c as unknown as ScriptContainerType[],
      "@_name",
      "Script"
    )
  ) as unknown as ScriptContainerType[][];

  const paramData = container.map((c) =>
    getKeyNameObjArray(
      c as unknown as ScriptParameterContainerType[],
      "@_name",
      "ParameterData"
    )
  ) as unknown as ScriptParameterContainerType[][];

  const params = getScriptParams(paramData);

  return {
    scriptParam: (params && params.scriptParams) || undefined,
    totalScriptSourceCount: (params && params.totalSourceCount) || 0,
  };
}

function getScriptParams(container: ScriptParameterContainerType[][]) {
  const paramDataChunkArray = container.map((c) => {
    const d = c[0];
    if (!d) return undefined;
    const chunk = d?.chunks?.chunk!;
    return getInputOutputParams(chunk);
  });

  const totalSourceCount =
    paramDataChunkArray.map((c) => c?.count ?? 0).reduce((a, b) => a + b, 0) ??
    undefined;

  return {
    scriptParams: paramDataChunkArray,
    totalSourceCount: totalSourceCount,
  };
}

function getInputOutputParams(chunk: ParamChunkType | ParamChunkType[]) {
  let sourceCount = 0;
  const inputParam: ParamChunkType[] = [];
  const inputSource: (ParamItemType[] | undefined)[] = [];
  const outputParam: ParamChunkType[] = [];

  const addToArray = (c: ParamChunkType) => {
    if (Object.keys(c).includes("@_name") && c["@_name"] === "InputParam") {
      inputParam.push(c);
      extractSource(c);
    } else {
      outputParam.push(c);
    }
  };

  const extractSource = (c: ParamChunkType) => {
    const itemArray = c.items.item;
    const sourceArray = itemArray.filter(
      (e: ParamItemType) => e["@_name"] === "Source"
    );
    sourceCount += sourceArray.length;
    inputSource.push(sourceArray);
  };

  if (Array.isArray(chunk)) {
    chunk.map((c) => {
      addToArray(c);
    });
  } else {
    addToArray(chunk);
  }

  return {
    inputParam: inputParam.length === 0 ? undefined : inputParam,
    inputSource: inputSource.length === 0 ? undefined : inputSource,
    outputParam: outputParam.length === 0 ? undefined : outputParam,
    count: sourceCount,
  };
}
