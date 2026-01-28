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
    xmlFolder + `debug/ghaLibsDescriptor/${file.replace(".xml", ".json")}`,
    JSON.stringify(r.descriptor, null, 2)
  );
}

export function writeDefObjTofiles(
  r: DefinitionObjectResult,
  file: string,
  xmlFolder: string
) {
  // write identifiers to file
  fs.writeFileSync(
    xmlFolder + `debug/identifiers/${file.replace(".xml", ".json")}`,
    JSON.stringify(r.identifiers, null, 2)
  );

  // write pivots to file
  fs.writeFileSync(
    xmlFolder + `debug/boundAndPivot/${file.replace(".xml", ".json")}`,
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
    xmlFolder + `debug/instanceIdentifiers/${file.replace(".xml", ".json")}`,
    JSON.stringify(r.instanceIdentifiers, null, 2)
  );

  //write ios to file
  fs.writeFileSync(
    xmlFolder + `debug/ios/${file.replace(".xml", ".json")}`,
    JSON.stringify(r.ios, null, 2)
  );
}
