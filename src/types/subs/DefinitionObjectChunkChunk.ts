import { z } from "../../../node_modules/zod/lib/external";
import { AttributeChunk } from "./param-object-schema";

export const DefinitionObjectChunkChunk = z.union([
	AttributeChunk,
	ParamInputChunk,
	ParamOutputChunk,

	z.object({}),
]);

