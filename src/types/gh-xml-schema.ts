import { z } from "zod";
import { LibrarySchema } from "./library-type-schema";
import { TypeNameCodeSchema } from "./typenamecode-schema";

export const GenericItemsSchema = z.object({
  "@_count": z.number(),
  item: z.array(z.object({}).catchall(z.union([z.string(), z.number()]))),
});

export const VersionSchema = TypeNameCodeSchema.extend({
  Major: z.number(),
  Minor: z.number(),
  Revision: z.number(),
});

export const DocumentHeaderSchema = z.object({
  "@_name": z.literal("DocumentHeader"),
  items: z.object({
    "@_count": z.union([z.literal(5), z.literal(6)]),
    item: z.array(
      z.union([
        TypeNameCodeSchema.extend({
          "#text": z.string(),
          "@_name": z.union([
            z.literal("DocumentID"),
            z.literal("Preview"),
            z.literal("PreviewFilter"),
          ]),
        }),
        TypeNameCodeSchema.extend({
          "#text": z.number(),
          "@_name": z.literal("PreviewMeshType"),
        }),
        TypeNameCodeSchema.extend({
          ARGB: z.string(),
          "@_name": z.union([
            z.literal("PreviewNormal"),
            z.literal("PreviewSelected"),
          ]),
        }),
      ])
    ),
  }),
});

export const DefinitionPropertiesSchema = z.object({
  "@_name": z.literal("DefinitionProperties"),
  items: z.object({
    "@_count": z.literal(4),
    item: z.array(
      z.union([
        TypeNameCodeSchema.extend({
          "#text": z.string(),
          "@_name": z.literal("Date"),
        }),
        TypeNameCodeSchema.extend({
          "@_name": z.literal("Description"),
        }),
        TypeNameCodeSchema.extend({
          "#text": z.boolean(),
          "@_name": z.literal("KeepOpen"),
        }),
        TypeNameCodeSchema.extend({
          "@_name": z.literal("Name"),
        }),
        z.object({}),
      ])
    ),
  }),
  chunks: z.object({
    "@_count": z.literal(3),
    chunk: z.array(
      z.union([
        z.object({
          items: z.object({
            "@_count": z.literal(1),
            item: TypeNameCodeSchema.extend({
              "@_name": z.literal("RevisionCount"),
            }),
          }),
        }),
        z.object({
          items: z.object({
            "@_count": z.literal(2),
            item: z.array(
              z.union([
                TypeNameCodeSchema.extend({
                  X: z.number(),
                  Y: z.number(),
                  "@_name": z.literal("Target"),
                }),
                TypeNameCodeSchema.extend({
                  "#text": z.number(),
                  "@_name": z.literal("Zoom"),
                }),
              ])
            ),
          }),
        }),
        z.object({
          items: z.object({
            "@_count": z.literal(1),
            item: TypeNameCodeSchema.extend({
              "@_name": z.literal("ViewCount"),
            }),
          }),
        }),
      ])
    ),
  }),
});

export const RcpLayoutSchema = z.object({
  "@_name": z.literal("RcpLayout"),
  items: z.object({
    item: z.object({}).catchall(z.union([z.string(), z.number()])),
    //chunks exist only when remote control exists
    // unsupported for now
    chunks: z
      .object({})
      .catchall(z.union([z.string(), z.number()]))
      .optional(),
  }),
});

export const GhaLibrariesSchema = z.object({
  "@_name": z.literal("GHALibraries"),
  items: z.object({
    item: TypeNameCodeSchema.extend({
      "#text": z.number(),
      "@_name": z.literal("Count"),
    }),
  }),
  chunks: z.object({
    chunk: z.union([z.array(LibrarySchema), LibrarySchema]),
  }),
});

export const DefinitionObjectsSchema = z.object({
  "@_name": z.literal("DefinitionObjects"),
  items: z.object({}),
  chunks: z.object({}),
});

// exists only when valueTable exists
// unsupported for now
export const ValueTableSchema = z.object({
  "@_name": z.literal("ValueTable"),
  items: z.object({}),
});

// exists only when previewBoundary exists
// unsupported for now
export const PreviewBoundarySchema = z.object({
  "@_name": z.literal("PreviewBoundary"),
  items: z.object({}),
});

//             {
//               "items": {
//                 "item": {
//                   "#text": 1,
//                   "@_name": "ObjectCount",
//                   "@_type_name": "gh_int32",
//                   "@_type_code": 3
//                 },
//                 "@_count": 1
//               },
//               "chunks": {
//                 "chunk": {
//                   "items": {
//                     "item": [
//                       {
//                         "#text": "298e0adf-625a-4207-9d0f-c22212480c4c",
//                         "@_name": "GUID",
//                         "@_type_name": "gh_guid",
//                         "@_type_code": 9
//                       },
//                       {
//                         "#text": "Colour Gradient",
//                         "@_name": "Name",
//                         "@_type_name": "gh_string",
//                         "@_type_code": 10
//                       }
//                     ],
//                     "@_count": 2
//                   },
//                   "chunks": {
//                     "chunk": {
//                       "items": {
//                         "item": [
//                           {
//                             "#text": "Colour Gradient",
//                             "@_name": "Description",
//                             "@_type_name": "gh_string",
//                             "@_type_code": 10
//                           },
//                           {
//                             "#text": "7f93dea1-5e7d-4cfa-b636-d53a41433872",
//                             "@_name": "InstanceGuid",
//                             "@_type_name": "gh_guid",
//                             "@_type_code": 9
//                           },
//                           {
//                             "#text": "Colour Gradient",
//                             "@_name": "Name",
//                             "@_type_name": "gh_string",
//                             "@_type_code": 10
//                           },
//                           {
//                             "#text": "Colour Gradient",
//                             "@_name": "NickName",
//                             "@_type_name": "gh_string",
//                             "@_type_code": 10
//                           },
//                           {
//                             "#text": "IOComponents, Version=8.18.25100.11002",
//                             "@_name": "VariableParameterScheme",
//                             "@_type_name": "gh_string",
//                             "@_type_code": 10
//                           }
//                         ],
//                         "@_count": 5
//                       },
//                       "chunks": {
//                         "chunk": [
//                           {
//                             "items": {
//                               "item": [
//                                 {
//                                   "X": 407,
//                                   "Y": 16,
//                                   "W": 57,
//                                   "H": 124,
//                                   "@_name": "Bounds",
//                                   "@_type_name": "gh_drawing_rectanglef",
//                                   "@_type_code": 35
//                                 },
//                                 {
//                                   "X": 434,
//                                   "Y": 78,
//                                   "@_name": "Pivot",
//                                   "@_type_name": "gh_drawing_pointf",
//                                   "@_type_code": 31
//                                 },
//                                 {
//                                   "#text": true,
//                                   "@_name": "Selected",
//                                   "@_type_name": "gh_bool",
//                                   "@_type_code": 1
//                                 }
//                               ],
//                               "@_count": 3
//                             },
//                             "@_name": "Attributes"
//                           },
//                           {
//                             "items": {
//                               "item": [
//                                 {
//                                   "#text": 6,
//                                   "@_name": "InputCount",
//                                   "@_type_name": "gh_int32",
//                                   "@_type_code": 3
//                                 },
//                                 {
//                                   "#text": "ffa1d4f8-1dd2-4495-8f2f-2e741aba7c54",
//                                   "@_name": "InputId",
//                                   "@_index": 0,
//                                   "@_type_name": "gh_guid",
//                                   "@_type_code": 9
//                                 },
//                                 {
//                                   "#text": "fbac3e32-f100-4292-8692-77240a42fd1a",
//                                   "@_name": "InputId",
//                                   "@_index": 1,
//                                   "@_type_name": "gh_guid",
//                                   "@_type_code": 9
//                                 },
//                                 {
//                                   "#text": "fbac3e32-f100-4292-8692-77240a42fd1a",
//                                   "@_name": "InputId",
//                                   "@_index": 2,
//                                   "@_type_name": "gh_guid",
//                                   "@_type_code": 9
//                                 },
//                                 {
//                                   "#text": "3e8ca6be-fda8-4aaf-b5c0-3c54c8bb7312",
//                                   "@_name": "InputId",
//                                   "@_index": 3,
//                                   "@_type_name": "gh_guid",
//                                   "@_type_code": 9
//                                 },
//                                 {
//                                   "#text": "2e3ab970-8545-46bb-836c-1c11e5610bce",
//                                   "@_name": "InputId",
//                                   "@_index": 4,
//                                   "@_type_name": "gh_guid",
//                                   "@_type_code": 9
//                                 },
//                                 {
//                                   "#text": "ad13f223-bb9e-48d8-a5ab-51b2557bd69e",
//                                   "@_name": "InputId",
//                                   "@_index": 5,
//                                   "@_type_name": "gh_guid",
//                                   "@_type_code": 9
//                                 },
//                                 {
//                                   "#text": 6,
//                                   "@_name": "OutputCount",
//                                   "@_type_name": "gh_int32",
//                                   "@_type_code": 3
//                                 },
//                                 {
//                                   "#text": "ffa1d4f8-1dd2-4495-8f2f-2e741aba7c54",
//                                   "@_name": "OutputId",
//                                   "@_index": 0,
//                                   "@_type_name": "gh_guid",
//                                   "@_type_code": 9
//                                 },
//                                 {
//                                   "#text": "fbac3e32-f100-4292-8692-77240a42fd1a",
//                                   "@_name": "OutputId",
//                                   "@_index": 1,
//                                   "@_type_name": "gh_guid",
//                                   "@_type_code": 9
//                                 },
//                                 {
//                                   "#text": "fbac3e32-f100-4292-8692-77240a42fd1a",
//                                   "@_name": "OutputId",
//                                   "@_index": 2,
//                                   "@_type_name": "gh_guid",
//                                   "@_type_code": 9
//                                 },
//                                 {
//                                   "#text": "3e8ca6be-fda8-4aaf-b5c0-3c54c8bb7312",
//                                   "@_name": "OutputId",
//                                   "@_index": 3,
//                                   "@_type_name": "gh_guid",
//                                   "@_type_code": 9
//                                 },
//                                 {
//                                   "#text": "2e3ab970-8545-46bb-836c-1c11e5610bce",
//                                   "@_name": "OutputId",
//                                   "@_index": 4,
//                                   "@_type_name": "gh_guid",
//                                   "@_type_code": 9
//                                 },
//                                 {
//                                   "#text": "ad13f223-bb9e-48d8-a5ab-51b2557bd69e",
//                                   "@_name": "OutputId",
//                                   "@_index": 5,
//                                   "@_type_name": "gh_guid",
//                                   "@_type_code": 9
//                                 }
//                               ],
//                               "@_count": 14
//                             },
//                             "chunks": {
//                               "chunk": [
//                                 {
//                                   "items": {
//                                     "item": [
//                                       {
//                                         "#text": "Color Gradient",
//                                         "@_name": "Description",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "d51d6472-52f0-45a1-bb35-2f66d7342f79",
//                                         "@_name": "InstanceGuid",
//                                         "@_type_name": "gh_guid",
//                                         "@_type_code": 9
//                                       },
//                                       {
//                                         "#text": "Gradient",
//                                         "@_name": "Name",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "G",
//                                         "@_name": "NickName",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": true,
//                                         "@_name": "Optional",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": 0,
//                                         "@_name": "SourceCount",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       }
//                                     ],
//                                     "@_count": 6
//                                   },
//                                   "chunks": {
//                                     "chunk": {
//                                       "items": {
//                                         "item": [
//                                           {
//                                             "X": 409,
//                                             "Y": 18,
//                                             "W": 10,
//                                             "H": 20,
//                                             "@_name": "Bounds",
//                                             "@_type_name": "gh_drawing_rectanglef",
//                                             "@_type_code": 35
//                                           },
//                                           {
//                                             "X": 415.5,
//                                             "Y": 28,
//                                             "@_name": "Pivot",
//                                             "@_type_name": "gh_drawing_pointf",
//                                             "@_type_code": 31
//                                           },
//                                           {
//                                             "#text": true,
//                                             "@_name": "Selected",
//                                             "@_type_name": "gh_bool",
//                                             "@_type_code": 1
//                                           }
//                                         ],
//                                         "@_count": 3
//                                       },
//                                       "@_name": "Attributes"
//                                     },
//                                     "@_count": 1
//                                   },
//                                   "@_name": "InputParam",
//                                   "@_index": 0
//                                 },
//                                 {
//                                   "items": {
//                                     "item": [
//                                       {
//                                         "#text": "Start point of the color gradient",
//                                         "@_name": "Description",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": true,
//                                         "@_name": "Hidden",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": "321133fc-8ead-44f4-ba42-05a5459d52f0",
//                                         "@_name": "InstanceGuid",
//                                         "@_type_name": "gh_guid",
//                                         "@_type_code": 9
//                                       },
//                                       {
//                                         "#text": "Start Point",
//                                         "@_name": "Name",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "S",
//                                         "@_name": "NickName",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": true,
//                                         "@_name": "Optional",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": 0,
//                                         "@_name": "SourceCount",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       }
//                                     ],
//                                     "@_count": 7
//                                   },
//                                   "chunks": {
//                                     "chunk": {
//                                       "items": {
//                                         "item": [
//                                           {
//                                             "X": 409,
//                                             "Y": 38,
//                                             "W": 10,
//                                             "H": 20,
//                                             "@_name": "Bounds",
//                                             "@_type_name": "gh_drawing_rectanglef",
//                                             "@_type_code": 35
//                                           },
//                                           {
//                                             "X": 415.5,
//                                             "Y": 48,
//                                             "@_name": "Pivot",
//                                             "@_type_name": "gh_drawing_pointf",
//                                             "@_type_code": 31
//                                           },
//                                           {
//                                             "#text": true,
//                                             "@_name": "Selected",
//                                             "@_type_name": "gh_bool",
//                                             "@_type_code": 1
//                                           }
//                                         ],
//                                         "@_count": 3
//                                       },
//                                       "@_name": "Attributes"
//                                     },
//                                     "@_count": 1
//                                   },
//                                   "@_name": "InputParam",
//                                   "@_index": 1
//                                 },
//                                 {
//                                   "items": {
//                                     "item": [
//                                       {
//                                         "#text": "End point of the color gradient",
//                                         "@_name": "Description",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": true,
//                                         "@_name": "Hidden",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": "f97c7aa9-84e0-42f2-95c0-e6a822f61a17",
//                                         "@_name": "InstanceGuid",
//                                         "@_type_name": "gh_guid",
//                                         "@_type_code": 9
//                                       },
//                                       {
//                                         "#text": "End Point",
//                                         "@_name": "Name",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "E",
//                                         "@_name": "NickName",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": true,
//                                         "@_name": "Optional",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": 0,
//                                         "@_name": "SourceCount",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       }
//                                     ],
//                                     "@_count": 7
//                                   },
//                                   "chunks": {
//                                     "chunk": {
//                                       "items": {
//                                         "item": [
//                                           {
//                                             "X": 409,
//                                             "Y": 58,
//                                             "W": 10,
//                                             "H": 20,
//                                             "@_name": "Bounds",
//                                             "@_type_name": "gh_drawing_rectanglef",
//                                             "@_type_code": 35
//                                           },
//                                           {
//                                             "X": 415.5,
//                                             "Y": 68,
//                                             "@_name": "Pivot",
//                                             "@_type_name": "gh_drawing_pointf",
//                                             "@_type_code": 31
//                                           },
//                                           {
//                                             "#text": true,
//                                             "@_name": "Selected",
//                                             "@_type_name": "gh_bool",
//                                             "@_type_code": 1
//                                           }
//                                         ],
//                                         "@_count": 3
//                                       },
//                                       "@_name": "Attributes"
//                                     },
//                                     "@_count": 1
//                                   },
//                                   "@_name": "InputParam",
//                                   "@_index": 2
//                                 },
//                                 {
//                                   "items": {
//                                     "item": [
//                                       {
//                                         "#text": "Repeat factor for gradient. [1.0, ∞)",
//                                         "@_name": "Description",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "26ad50cf-0c8f-414d-9d3a-e324ca8311f1",
//                                         "@_name": "InstanceGuid",
//                                         "@_type_name": "gh_guid",
//                                         "@_type_code": 9
//                                       },
//                                       {
//                                         "#text": "Repeat",
//                                         "@_name": "Name",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "R",
//                                         "@_name": "NickName",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": true,
//                                         "@_name": "Optional",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": 0,
//                                         "@_name": "SourceCount",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       }
//                                     ],
//                                     "@_count": 6
//                                   },
//                                   "chunks": {
//                                     "chunk": {
//                                       "items": {
//                                         "item": [
//                                           {
//                                             "X": 409,
//                                             "Y": 78,
//                                             "W": 10,
//                                             "H": 20,
//                                             "@_name": "Bounds",
//                                             "@_type_name": "gh_drawing_rectanglef",
//                                             "@_type_code": 35
//                                           },
//                                           {
//                                             "X": 415.5,
//                                             "Y": 88,
//                                             "@_name": "Pivot",
//                                             "@_type_name": "gh_drawing_pointf",
//                                             "@_type_code": 31
//                                           },
//                                           {
//                                             "#text": true,
//                                             "@_name": "Selected",
//                                             "@_type_name": "gh_bool",
//                                             "@_type_code": 1
//                                           }
//                                         ],
//                                         "@_count": 3
//                                       },
//                                       "@_name": "Attributes"
//                                     },
//                                     "@_count": 1
//                                   },
//                                   "@_name": "InputParam",
//                                   "@_index": 3
//                                 },
//                                 {
//                                   "items": {
//                                     "item": [
//                                       {
//                                         "#text": "Gradient Type:\n0) Solid\n1) Linear Reflected\n2) Linear Wrapped\n3) Radial Reflected\n4) Radial Wrapped",
//                                         "@_name": "Description",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "b3edd36a-97d6-4140-bb59-e4eb0979fa81",
//                                         "@_name": "InstanceGuid",
//                                         "@_type_name": "gh_guid",
//                                         "@_type_code": 9
//                                       },
//                                       {
//                                         "#text": "Type",
//                                         "@_name": "Name",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "T",
//                                         "@_name": "NickName",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": true,
//                                         "@_name": "Optional",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": 0,
//                                         "@_name": "SourceCount",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       }
//                                     ],
//                                     "@_count": 6
//                                   },
//                                   "chunks": {
//                                     "chunk": {
//                                       "items": {
//                                         "item": [
//                                           {
//                                             "X": 409,
//                                             "Y": 98,
//                                             "W": 10,
//                                             "H": 20,
//                                             "@_name": "Bounds",
//                                             "@_type_name": "gh_drawing_rectanglef",
//                                             "@_type_code": 35
//                                           },
//                                           {
//                                             "X": 415.5,
//                                             "Y": 108,
//                                             "@_name": "Pivot",
//                                             "@_type_name": "gh_drawing_pointf",
//                                             "@_type_code": 31
//                                           },
//                                           {
//                                             "#text": true,
//                                             "@_name": "Selected",
//                                             "@_type_name": "gh_bool",
//                                             "@_type_code": 1
//                                           }
//                                         ],
//                                         "@_count": 3
//                                       },
//                                       "@_name": "Attributes"
//                                     },
//                                     "@_count": 1
//                                   },
//                                   "@_name": "InputParam",
//                                   "@_index": 4
//                                 },
//                                 {
//                                   "items": {
//                                     "item": [
//                                       {
//                                         "#text": 1,
//                                         "@_name": "Access",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       },
//                                       {
//                                         "#text": "The colour stops used to define the gradient",
//                                         "@_name": "Description",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "d585309d-44f2-4734-ba79-909b352aba76",
//                                         "@_name": "InstanceGuid",
//                                         "@_type_name": "gh_guid",
//                                         "@_type_code": 9
//                                       },
//                                       {
//                                         "#text": "Colours",
//                                         "@_name": "Name",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "C",
//                                         "@_name": "NickName",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": true,
//                                         "@_name": "Optional",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": 0,
//                                         "@_name": "SourceCount",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       }
//                                     ],
//                                     "@_count": 7
//                                   },
//                                   "chunks": {
//                                     "chunk": {
//                                       "items": {
//                                         "item": [
//                                           {
//                                             "X": 409,
//                                             "Y": 118,
//                                             "W": 10,
//                                             "H": 20,
//                                             "@_name": "Bounds",
//                                             "@_type_name": "gh_drawing_rectanglef",
//                                             "@_type_code": 35
//                                           },
//                                           {
//                                             "X": 415.5,
//                                             "Y": 128,
//                                             "@_name": "Pivot",
//                                             "@_type_name": "gh_drawing_pointf",
//                                             "@_type_code": 31
//                                           },
//                                           {
//                                             "#text": true,
//                                             "@_name": "Selected",
//                                             "@_type_name": "gh_bool",
//                                             "@_type_code": 1
//                                           }
//                                         ],
//                                         "@_count": 3
//                                       },
//                                       "@_name": "Attributes"
//                                     },
//                                     "@_count": 1
//                                   },
//                                   "@_name": "InputParam",
//                                   "@_index": 5
//                                 },
//                                 {
//                                   "items": {
//                                     "item": [
//                                       {
//                                         "#text": "Color Gradient",
//                                         "@_name": "Description",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "5e7313ce-16bd-49d1-8d90-f8287261d36a",
//                                         "@_name": "InstanceGuid",
//                                         "@_type_name": "gh_guid",
//                                         "@_type_code": 9
//                                       },
//                                       {
//                                         "#text": "Gradient",
//                                         "@_name": "Name",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "G",
//                                         "@_name": "NickName",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": false,
//                                         "@_name": "Optional",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": 0,
//                                         "@_name": "SourceCount",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       }
//                                     ],
//                                     "@_count": 6
//                                   },
//                                   "chunks": {
//                                     "chunk": {
//                                       "items": {
//                                         "item": [
//                                           {
//                                             "X": 449,
//                                             "Y": 18,
//                                             "W": 13,
//                                             "H": 20,
//                                             "@_name": "Bounds",
//                                             "@_type_name": "gh_drawing_rectanglef",
//                                             "@_type_code": 35
//                                           },
//                                           {
//                                             "X": 455.5,
//                                             "Y": 28,
//                                             "@_name": "Pivot",
//                                             "@_type_name": "gh_drawing_pointf",
//                                             "@_type_code": 31
//                                           },
//                                           {
//                                             "#text": true,
//                                             "@_name": "Selected",
//                                             "@_type_name": "gh_bool",
//                                             "@_type_code": 1
//                                           }
//                                         ],
//                                         "@_count": 3
//                                       },
//                                       "@_name": "Attributes"
//                                     },
//                                     "@_count": 1
//                                   },
//                                   "@_name": "OutputParam",
//                                   "@_index": 0
//                                 },
//                                 {
//                                   "items": {
//                                     "item": [
//                                       {
//                                         "#text": "Start point of the color gradient",
//                                         "@_name": "Description",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": true,
//                                         "@_name": "Hidden",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": "329eed38-223f-4b9e-a91f-652eab947ff3",
//                                         "@_name": "InstanceGuid",
//                                         "@_type_name": "gh_guid",
//                                         "@_type_code": 9
//                                       },
//                                       {
//                                         "#text": "Start Point",
//                                         "@_name": "Name",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "S",
//                                         "@_name": "NickName",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": false,
//                                         "@_name": "Optional",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": 0,
//                                         "@_name": "SourceCount",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       }
//                                     ],
//                                     "@_count": 7
//                                   },
//                                   "chunks": {
//                                     "chunk": {
//                                       "items": {
//                                         "item": [
//                                           {
//                                             "X": 449,
//                                             "Y": 38,
//                                             "W": 13,
//                                             "H": 20,
//                                             "@_name": "Bounds",
//                                             "@_type_name": "gh_drawing_rectanglef",
//                                             "@_type_code": 35
//                                           },
//                                           {
//                                             "X": 455.5,
//                                             "Y": 48,
//                                             "@_name": "Pivot",
//                                             "@_type_name": "gh_drawing_pointf",
//                                             "@_type_code": 31
//                                           },
//                                           {
//                                             "#text": true,
//                                             "@_name": "Selected",
//                                             "@_type_name": "gh_bool",
//                                             "@_type_code": 1
//                                           }
//                                         ],
//                                         "@_count": 3
//                                       },
//                                       "@_name": "Attributes"
//                                     },
//                                     "@_count": 1
//                                   },
//                                   "@_name": "OutputParam",
//                                   "@_index": 1
//                                 },
//                                 {
//                                   "items": {
//                                     "item": [
//                                       {
//                                         "#text": "End point of the color gradient",
//                                         "@_name": "Description",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": true,
//                                         "@_name": "Hidden",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": "3f4f28e9-29f8-466d-8830-fd9377a10c54",
//                                         "@_name": "InstanceGuid",
//                                         "@_type_name": "gh_guid",
//                                         "@_type_code": 9
//                                       },
//                                       {
//                                         "#text": "End Point",
//                                         "@_name": "Name",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "E",
//                                         "@_name": "NickName",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": false,
//                                         "@_name": "Optional",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": 0,
//                                         "@_name": "SourceCount",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       }
//                                     ],
//                                     "@_count": 7
//                                   },
//                                   "chunks": {
//                                     "chunk": {
//                                       "items": {
//                                         "item": [
//                                           {
//                                             "X": 449,
//                                             "Y": 58,
//                                             "W": 13,
//                                             "H": 20,
//                                             "@_name": "Bounds",
//                                             "@_type_name": "gh_drawing_rectanglef",
//                                             "@_type_code": 35
//                                           },
//                                           {
//                                             "X": 455.5,
//                                             "Y": 68,
//                                             "@_name": "Pivot",
//                                             "@_type_name": "gh_drawing_pointf",
//                                             "@_type_code": 31
//                                           },
//                                           {
//                                             "#text": true,
//                                             "@_name": "Selected",
//                                             "@_type_name": "gh_bool",
//                                             "@_type_code": 1
//                                           }
//                                         ],
//                                         "@_count": 3
//                                       },
//                                       "@_name": "Attributes"
//                                     },
//                                     "@_count": 1
//                                   },
//                                   "@_name": "OutputParam",
//                                   "@_index": 2
//                                 },
//                                 {
//                                   "items": {
//                                     "item": [
//                                       {
//                                         "#text": "Repeat factor for gradient.",
//                                         "@_name": "Description",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "66a20933-c9fd-4df6-bf14-a102a94d69bc",
//                                         "@_name": "InstanceGuid",
//                                         "@_type_name": "gh_guid",
//                                         "@_type_code": 9
//                                       },
//                                       {
//                                         "#text": "Repeat",
//                                         "@_name": "Name",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "R",
//                                         "@_name": "NickName",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": false,
//                                         "@_name": "Optional",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": 0,
//                                         "@_name": "SourceCount",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       }
//                                     ],
//                                     "@_count": 6
//                                   },
//                                   "chunks": {
//                                     "chunk": {
//                                       "items": {
//                                         "item": [
//                                           {
//                                             "X": 449,
//                                             "Y": 78,
//                                             "W": 13,
//                                             "H": 20,
//                                             "@_name": "Bounds",
//                                             "@_type_name": "gh_drawing_rectanglef",
//                                             "@_type_code": 35
//                                           },
//                                           {
//                                             "X": 455.5,
//                                             "Y": 88,
//                                             "@_name": "Pivot",
//                                             "@_type_name": "gh_drawing_pointf",
//                                             "@_type_code": 31
//                                           },
//                                           {
//                                             "#text": true,
//                                             "@_name": "Selected",
//                                             "@_type_name": "gh_bool",
//                                             "@_type_code": 1
//                                           }
//                                         ],
//                                         "@_count": 3
//                                       },
//                                       "@_name": "Attributes"
//                                     },
//                                     "@_count": 1
//                                   },
//                                   "@_name": "OutputParam",
//                                   "@_index": 3
//                                 },
//                                 {
//                                   "items": {
//                                     "item": [
//                                       {
//                                         "#text": "Gradient Type:\n0) Solid\n1) Linear Reflected\n2) Linear Wrapped\n3) Radial Reflected\n4) Radial Wrapped",
//                                         "@_name": "Description",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "94b2172b-f68d-41c9-a356-a92b2f88d30a",
//                                         "@_name": "InstanceGuid",
//                                         "@_type_name": "gh_guid",
//                                         "@_type_code": 9
//                                       },
//                                       {
//                                         "#text": "Type",
//                                         "@_name": "Name",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "T",
//                                         "@_name": "NickName",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": false,
//                                         "@_name": "Optional",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": 0,
//                                         "@_name": "SourceCount",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       }
//                                     ],
//                                     "@_count": 6
//                                   },
//                                   "chunks": {
//                                     "chunk": {
//                                       "items": {
//                                         "item": [
//                                           {
//                                             "X": 449,
//                                             "Y": 98,
//                                             "W": 13,
//                                             "H": 20,
//                                             "@_name": "Bounds",
//                                             "@_type_name": "gh_drawing_rectanglef",
//                                             "@_type_code": 35
//                                           },
//                                           {
//                                             "X": 455.5,
//                                             "Y": 108,
//                                             "@_name": "Pivot",
//                                             "@_type_name": "gh_drawing_pointf",
//                                             "@_type_code": 31
//                                           },
//                                           {
//                                             "#text": true,
//                                             "@_name": "Selected",
//                                             "@_type_name": "gh_bool",
//                                             "@_type_code": 1
//                                           }
//                                         ],
//                                         "@_count": 3
//                                       },
//                                       "@_name": "Attributes"
//                                     },
//                                     "@_count": 1
//                                   },
//                                   "@_name": "OutputParam",
//                                   "@_index": 4
//                                 },
//                                 {
//                                   "items": {
//                                     "item": [
//                                       {
//                                         "#text": 1,
//                                         "@_name": "Access",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       },
//                                       {
//                                         "#text": "The colour stops used to define the gradient",
//                                         "@_name": "Description",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "18de0c03-93e8-4c06-af84-b5b35369273f",
//                                         "@_name": "InstanceGuid",
//                                         "@_type_name": "gh_guid",
//                                         "@_type_code": 9
//                                       },
//                                       {
//                                         "#text": "Colours",
//                                         "@_name": "Name",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": "C",
//                                         "@_name": "NickName",
//                                         "@_type_name": "gh_string",
//                                         "@_type_code": 10
//                                       },
//                                       {
//                                         "#text": false,
//                                         "@_name": "Optional",
//                                         "@_type_name": "gh_bool",
//                                         "@_type_code": 1
//                                       },
//                                       {
//                                         "#text": 0,
//                                         "@_name": "SourceCount",
//                                         "@_type_name": "gh_int32",
//                                         "@_type_code": 3
//                                       }
//                                     ],
//                                     "@_count": 7
//                                   },
//                                   "chunks": {
//                                     "chunk": {
//                                       "items": {
//                                         "item": [
//                                           {
//                                             "X": 449,
//                                             "Y": 118,
//                                             "W": 13,
//                                             "H": 20,
//                                             "@_name": "Bounds",
//                                             "@_type_name": "gh_drawing_rectanglef",
//                                             "@_type_code": 35
//                                           },
//                                           {
//                                             "X": 455.5,
//                                             "Y": 128,
//                                             "@_name": "Pivot",
//                                             "@_type_name": "gh_drawing_pointf",
//                                             "@_type_code": 31
//                                           },
//                                           {
//                                             "#text": true,
//                                             "@_name": "Selected",
//                                             "@_type_name": "gh_bool",
//                                             "@_type_code": 1
//                                           }
//                                         ],
//                                         "@_count": 3
//                                       },
//                                       "@_name": "Attributes"
//                                     },
//                                     "@_count": 1
//                                   },
//                                   "@_name": "OutputParam",
//                                   "@_index": 5
//                                 }
//                               ],
//                               "@_count": 12
//                             },
//                             "@_name": "ParameterData"
//                           }
//                         ],
//                         "@_count": 2
//                       },
//                       "@_name": "Container"
//                     },
//                     "@_count": 1
//                   },
//                   "@_name": "Object",
//                   "@_index": 0
//                 },
//                 "@_count": 1
//               },
//               "@_name": "DefinitionObjects"
//             }
//
