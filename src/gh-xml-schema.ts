import { z } from "zod";
export const GenericItemsSchema = z.object({
  "@_count": z.number(),
  item: z.array(z.object({}).catchall(z.union([z.string(), z.number()]))),
});

const TypeNameCodeSchema = z.object({
  "@_name": z.string(),
  "@_type_name": z.string(),
  "@_type_code": z.number(),
});

export const VersionSchema = TypeNameCodeSchema.extend({
  Major: z.number(),
  Minor: z.number(),
  Revision: z.number(),
});

export const DocumentHeaderSchema = z.object({
  "@_name": z.literal("DocumentHeader"),
  items: z.object({
    "@_count": z.literal(5),
    item: z.array(
      z.union([
        TypeNameCodeSchema.extend({
          "#text": z.string(),
          "@_name": z.union([z.literal("DocumentID"), z.literal("Preview")]),
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
  chunks: z.object({}),
  items: z.object({}),
});

export const RcpLayoutSchema = z.object({
  "@_name": z.literal("RcpLayout"),
  items: z.object({}),
});

export const GhaLibrariesSchema = z.object({
  "@_name": z.literal("GHALibraries"),
  chunks: z.object({}),
  items: z.object({}),
});

export const DefinitionObjectsSchema = z.object({
  "@_name": z.literal("DefinitionObjects"),
  chunks: z.object({}),
  items: z.object({}),
});

// const d = [
//   {
//     items: {
//       item: [
//         {
//           "#text": "638821663023856760",
//           "@_name": "Date",
//           "@_type_name": "gh_date",
//           "@_type_code": 8,
//         },
//         {
//           "@_name": "Description",
//           "@_type_name": "gh_string",
//           "@_type_code": 10,
//         },
//         {
//           "#text": false,
//           "@_name": "KeepOpen",
//           "@_type_name": "gh_bool",
//           "@_type_code": 1,
//         },
//         {
//           "@_name": "Name",
//           "@_type_name": "gh_string",
//           "@_type_code": 10,
//         },
//       ],
//       "@_count": 4,
//     },
//     chunks: {
//       chunk: [
//         {
//           items: {
//             item: {
//               "#text": 0,
//               "@_name": "RevisionCount",
//               "@_type_name": "gh_int32",
//               "@_type_code": 3,
//             },
//             "@_count": 1,
//           },
//           "@_name": "Revisions",
//         },
//         {
//           items: {
//             item: [
//               {
//                 X: 10,
//                 Y: 10,
//                 "@_name": "Target",
//                 "@_type_name": "gh_drawing_point",
//                 "@_type_code": 30,
//               },
//               {
//                 "#text": 1,
//                 "@_name": "Zoom",
//                 "@_type_name": "gh_single",
//                 "@_type_code": 5,
//               },
//             ],
//             "@_count": 2,
//           },
//           "@_name": "Projection",
//         },
//         {
//           items: {
//             item: {
//               "#text": 0,
//               "@_name": "ViewCount",
//               "@_type_name": "gh_int32",
//               "@_type_code": 3,
//             },
//             "@_count": 1,
//           },
//           "@_name": "Views",
//         },
//       ],
//       "@_count": 3,
//     },
//     "@_name": "DefinitionProperties",
//   },
//   {
//     items: {
//       item: {
//         "#text": 0,
//         "@_name": "GroupCount",
//         "@_type_name": "gh_int32",
//         "@_type_code": 3,
//       },
//       "@_count": 1,
//     },
//     "@_name": "RcpLayout",
//   },
//   {
//     items: {
//       item: {
//         "#text": 1,
//         "@_name": "Count",
//         "@_type_name": "gh_int32",
//         "@_type_code": 3,
//       },
//       "@_count": 1,
//     },
//     chunks: {
//       chunk: {
//         items: {
//           item: [
//             {
//               "#text": "Robert McNeel & Associates",
//               "@_name": "Author",
//               "@_type_name": "gh_string",
//               "@_type_code": 10,
//             },
//             {
//               "#text": "00000000-0000-0000-0000-000000000000",
//               "@_name": "Id",
//               "@_type_name": "gh_guid",
//               "@_type_code": 9,
//             },
//             {
//               "#text": "Grasshopper",
//               "@_name": "Name",
//               "@_type_name": "gh_string",
//               "@_type_code": 10,
//             },
//             {
//               "#text": "8.18.25100.11002",
//               "@_name": "Version",
//               "@_type_name": "gh_string",
//               "@_type_code": 10,
//             },
//           ],
//           "@_count": 4,
//         },
//         "@_name": "Library",
//         "@_index": 0,
//       },
//       "@_count": 1,
//     },
//     "@_name": "GHALibraries",
//   },
//   {
//     items: {
//       item: {
//         "#text": 1,
//         "@_name": "ObjectCount",
//         "@_type_name": "gh_int32",
//         "@_type_code": 3,
//       },
//       "@_count": 1,
//     },
//     chunks: {
//       chunk: {
//         items: {
//           item: [
//             {
//               "#text": "ab898d46-b8b3-4ed5-b28f-4f8047920262",
//               "@_name": "GUID",
//               "@_type_name": "gh_guid",
//               "@_type_code": 9,
//             },
//             {
//               "#text": "Calendar",
//               "@_name": "Name",
//               "@_type_name": "gh_string",
//               "@_type_code": 10,
//             },
//           ],
//           "@_count": 2,
//         },
//         chunks: {
//           chunk: {
//             items: {
//               item: [
//                 {
//                   "#text": "Represents a calendar",
//                   "@_name": "Description",
//                   "@_type_name": "gh_string",
//                   "@_type_code": 10,
//                 },
//                 {
//                   "#text": "64b14176-a8fd-45db-a268-f571a3b6cc71",
//                   "@_name": "InstanceGuid",
//                   "@_type_name": "gh_guid",
//                   "@_type_code": 9,
//                 },
//                 {
//                   "#text": "638839872000000001",
//                   "@_name": "LocalDate",
//                   "@_type_name": "gh_date",
//                   "@_type_code": 8,
//                 },
//                 {
//                   "#text": "Calendar",
//                   "@_name": "Name",
//                   "@_type_name": "gh_string",
//                   "@_type_code": 10,
//                 },
//                 {
//                   "@_name": "NickName",
//                   "@_type_name": "gh_string",
//                   "@_type_code": 10,
//                 },
//                 {
//                   "#text": false,
//                   "@_name": "Optional",
//                   "@_type_name": "gh_bool",
//                   "@_type_code": 1,
//                 },
//                 {
//                   "#text": 0,
//                   "@_name": "SourceCount",
//                   "@_type_name": "gh_int32",
//                   "@_type_code": 3,
//                 },
//               ],
//               "@_count": 7,
//             },
//             chunks: {
//               chunk: {
//                 items: {
//                   item: [
//                     {
//                       X: 141,
//                       Y: 20,
//                       W: 214,
//                       H: 262,
//                       "@_name": "Bounds",
//                       "@_type_name": "gh_drawing_rectanglef",
//                       "@_type_code": 35,
//                     },
//                     {
//                       "#text": 5,
//                       "@_name": "DisplayMonth",
//                       "@_type_name": "gh_decimal",
//                       "@_type_code": 7,
//                     },
//                     {
//                       "#text": 2025,
//                       "@_name": "DisplayYear",
//                       "@_type_name": "gh_decimal",
//                       "@_type_code": 7,
//                     },
//                     {
//                       "#text": true,
//                       "@_name": "Selected",
//                       "@_type_name": "gh_bool",
//                       "@_type_code": 1,
//                     },
//                   ],
//                   "@_count": 4,
//                 },
//                 "@_name": "Attributes",
//               },
//               "@_count": 1,
//             },
//             "@_name": "Container",
//           },
//           "@_count": 1,
//         },
//         "@_name": "Object",
//         "@_index": 0,
//       },
//       "@_count": 1,
//     },
//     "@_name": "DefinitionObjects",
//   },
// ];
