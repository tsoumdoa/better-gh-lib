import { ShareLinkUid } from "@/types/types";
import { customAlphabet } from "nanoid";

export function generateSharableLinkUid() {
	const customAlphabetString = "0123456789abcdefghijklmnopqrstuvwxyz";
	const customIdLength = 10;

	const generateCustomNanoid = customAlphabet(
		customAlphabetString,
		customIdLength
	);

	return generateCustomNanoid() as ShareLinkUid;
}
