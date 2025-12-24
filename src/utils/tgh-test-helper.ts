import fs from "node:fs";
import {
	DefinitionObjectResult,
	GhaLibraryDescriptorsResult,
} from "./data-extractor";

export function writeGhaLibsToFiles(
	r: GhaLibraryDescriptorsResult,
	file: string,
	xmlFolder: string
) {
	fs.writeFileSync(
		xmlFolder + `ghaLibs/${file.replace(".xml", ".json")}`,
		JSON.stringify(r.ghaLibs.main, null, 2)
	);

	fs.writeFileSync(
		xmlFolder + `ghaLibsDescriptor/${file.replace(".xml", ".json")}`,
		JSON.stringify(r.descriptor, null, 2)
	);
}

export function writeDefObjTofiles(
	r: DefinitionObjectResult,
	file: string,
	xmlFolder: string
) {
	//write defObj to file
	fs.writeFileSync(
		xmlFolder + `defObj/${file.replace(".xml", ".json")}`,
		JSON.stringify(r.defObj.main[0], null, 2) // exporting the first object for ease of pasrsing the data structure
	);

	//write defObjs to file
	fs.writeFileSync(
		xmlFolder + `defObjs/${file.replace(".xml", ".json")}`,
		JSON.stringify(r.defObj.main, null, 2) // exporting the first object for ease of pasrsing the data structure
	);

	// write identifiers to file
	fs.writeFileSync(
		xmlFolder + `identifiers/${file.replace(".xml", ".json")}`,
		JSON.stringify(r.identifiers, null, 2)
	);

	// write pivots to file
	fs.writeFileSync(
		xmlFolder + `boundAndPivot/${file.replace(".xml", ".json")}`,
		JSON.stringify(
			{
				bounds: r.bounds,
				pivots: r.pivots,
			},
			null,
			2
		)
	);

	// write instanceIdentifiers to file
	fs.writeFileSync(
		xmlFolder + `instanceIdentifiers/${file.replace(".xml", ".json")}`,
		JSON.stringify(r.instanceIdentifiers, null, 2)
	);

	//write interfaceDescriptors to file
	fs.writeFileSync(
		xmlFolder + `interfaceDescriptors/${file.replace(".xml", ".json")}`,
		JSON.stringify(r.interfaceDescriptors, null, 2)
	);

	//write ios to file
	fs.writeFileSync(
		xmlFolder + `ios/${file.replace(".xml", ".json")}`,
		JSON.stringify(r.ios, null, 2)
	);
}
