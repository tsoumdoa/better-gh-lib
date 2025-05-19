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

export function getArrayFrom<T>(chunks: T[] | T): T[] {
  const chunkArray: T[] = [];
  if (Array.isArray(chunks)) {
    const casted = chunks as T[];
    chunkArray.push(...casted);
  } else {
    chunkArray.push(chunks as T);
  }
  return chunkArray;
}

export function getArrayFromWithKey<T, U>(
  chunkArray: T[],
  mapFn: (item: T) => U
): U[] {
  const chunks = chunkArray.map(mapFn);
  return getArrayFrom(chunks);
}

export function getKeyNameObj<T>(obj: T[], key: keyof T, name: string) {
  if (obj === undefined) return undefined;
  const objWithName = obj.find((o) => o[key] === name) as T;
  return (objWithName as T) ?? undefined;
}

export function getKeyNameObjArray<T>(obj: T[], key: keyof T, name: string) {
  if (obj === undefined) return undefined;
  const objWithName = obj.filter((o) => o[key] === name) as T;
  return (objWithName as T) ?? undefined;
}
