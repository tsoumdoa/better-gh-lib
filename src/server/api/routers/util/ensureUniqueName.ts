import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet(
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	8
);

export function addNanoId(name: string) {
	const id = nanoid(); //=> "4f90d13a42"
	return `${name}_${id}`;
}

export function ensureUniqueName(names: string[]) {
	const duplicated = findDuplicates(names);
	const uniqueNames: string[] = [];

	if (duplicated.length === 0) {
		return names;
	} else {
		names.map((name) => {
			if (!duplicated.includes(name)) {
				uniqueNames.push(name);
			} else {
				uniqueNames.push(addNanoId(name));
			}
		});
		return uniqueNames;
	}
}

export function findDuplicates(arr: string[]): string[] {
	const counts = new Map();
	const duplicates = [];

	arr.map((str) => {
		counts.set(str, (counts.get(str) || 0) + 1);
	});

	for (const [str, count] of counts) {
		if (count > 1) {
			duplicates.push(str);
		}
	}
	return duplicates;
}
