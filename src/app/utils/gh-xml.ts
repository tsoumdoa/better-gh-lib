import { GhXml } from "../../types/types";
import { XMLParser } from "fast-xml-parser";

export function validateGhXml(xml: string) {
	const parser = new XMLParser({
		ignoreAttributes: false,
		ignoreDeclaration: false,
		parseTagValue: true,
		parseAttributeValue: true,
		commentPropName: "comments",
		trimValues: true,
	});
	const parsedFromXml = parser.parse(xml);
	const keys = Object.keys(parsedFromXml);
	if (keys.length === 0) {
		return { isVaild: false, errorMsg: "it's not GhXml" };
	}

	const validatedXml = GhXml.safeParse(parsedFromXml);
	delete parsedFromXml["?xml"];
	if (!validatedXml.success) {
		return {
			isVaild: false,
			errorMsg: JSON.stringify(validatedXml.error, null, 2),
			parsedJson: parsedFromXml,
		};
	}

	return {
		isValid: true,
	};
}
