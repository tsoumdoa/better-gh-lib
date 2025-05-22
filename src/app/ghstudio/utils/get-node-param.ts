import {
  NodeParamContainerType,
  ParamItemType,
  PivotAttributeType,
} from "@/types/subs/param-object-schema";
import {
  getArrayFromWithKey,
  getKeyNameObj,
  getKeyNameObjArray,
} from "./helper-functions";

export function getNodeParam(
  compoentData: NodeParamContainerType[][],
  //this is not type safe...
  nodeType: "param_input" | "param_output"
) {
  const params = compoentData.map((c) =>
    getKeyNameObjArray(
      c as unknown as NodeParamContainerType[],
      "@_name",
      nodeType
    )
  );

  //handle chunks
  const chunks = params.map((c) =>
    getArrayFromWithKey(
      c as unknown as NodeParamContainerType[],
      (c) => c.chunks.chunk
    )
  );
  const pivotAttributes = chunks.map((c) => {
    return c.map((d) => {
      if (Array.isArray(d)) {
        const att = getKeyNameObjArray(
          d,
          "@_name",
          "Attributes"
        ) as NodeParamContainerType[];
        const itemArray = getArrayFromWithKey(att, (e) => e.items.item);
        return getKeyNameObj(itemArray[0]!, "@_name", "Pivot");
      } else {
        const isAtt =
          Object.keys(d).includes("@_name") && d["@_name"] === "Attributes";
        if (!isAtt) return undefined;
        const item = d.items.item;
        return getKeyNameObj(item, "@_name", "Pivot");
      }
    });
  });

  //handle items
  const itemArray = params.map((c) =>
    getArrayFromWithKey(
      c as unknown as NodeParamContainerType[],
      (e) => e.items.item
    )
  );

  let totalSourceCount = 0;
  const sources = itemArray.map((c) =>
    c.map((d) =>
      d
        .filter((e) => e["@_name"] === "Source")
        .forEach(() => {
          totalSourceCount++;
        })
    )
  );
  // todo think of data structure to map source with node and compoennt for
  // depth sesarch...

  return {
    pivotAtt: pivotAttributes as PivotAttributeType[][],
    nodeProperties: itemArray as ParamItemType[][][],
    totalSourceCount: totalSourceCount,
    sources: sources,
  };
}
