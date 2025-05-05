import {
  addNanoId,
  ensureUniqueName,
  findDuplicates,
} from "./ensureUniqueName";
import { expect, test } from "vitest";

test("addNanoId", () => {
  const d = addNanoId("RunPar");
  const nanoId = d.split("_")[1];
  expect(nanoId).toHaveLength(8);
});

test("ensureUniqueName", () => {
  const names = ["RunPar", "RunPar", "RunPar_2", "RunPar_3"];
  const duplicated = findDuplicates(names);
  const uniqueNames = ensureUniqueName(names);

  names.map((name, index) => {
    if (duplicated.includes(name)) {
      const expectedNanoId = uniqueNames[index].split("_");
      const nanoId = expectedNanoId.at(-1);
      expect(nanoId).toHaveLength(8);
    }
  });
});

test("should return an empty array when there are no duplicates", () => {
  const arr: string[] = ["apple", "banana", "orange"];
  const result: string[] = findDuplicates(arr);
  expect(result).toEqual([]);
});

test("should return an array of duplicates when they exist", () => {
  const arr: string[] = ["apple", "banana", "apple", "orange", "banana"];
  const result: string[] = findDuplicates(arr);
  expect(result).toEqual(["apple", "banana"]);
});

test("should handle an empty input array", () => {
  const arr: string[] = [];
  const result: string[] = findDuplicates(arr);
  expect(result).toEqual([]);
});

test("should handle an array with all the same elements", () => {
  const arr: string[] = ["apple", "apple", "apple"];
  const result: string[] = findDuplicates(arr);
  expect(result).toEqual(["apple"]);
});

test("should handle an array with mixed-case duplicates", () => {
  const arr: string[] = ["apple", "Apple", "apple"];
  const result: string[] = findDuplicates(arr);
  expect(result).toEqual(["apple"]);
});

test("should work with numbers as strings", () => {
  const arr: string[] = ["1", "2", "1", "3", "2"];
  const result: string[] = findDuplicates(arr);
  expect(result).toEqual(["1", "2"]);
});
