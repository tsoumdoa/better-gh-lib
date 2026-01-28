import { GhXml, GhXmlType } from "../../types/types";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

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
		validatedJson: validatedXml.data,
		parsedJson: parsedFromXml,
	};
}

export function buildGhXml(parsedXml: GhXmlType) {
	const builder = new XMLBuilder({
		attributeNamePrefix: "@_",
		ignoreAttributes: false,
		commentPropName: "comments",
		format: true,
		indentBy: "  ",
		suppressEmptyNode: false,
	});

	//manually add the xml header back
	const xmlHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

	const xmlOutput = builder.build(parsedXml);
	return xmlHeader + xmlOutput;
}
