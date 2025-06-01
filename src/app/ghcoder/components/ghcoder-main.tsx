"use client";
import { useEffect, useState } from "react";
import { useXmlPaste } from "../../hooks/use-xml-paste";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GhXmlValidatorButtons } from "@/app/components/paste-ghxml";
import { ValidatedResult } from "@/app/components/valiation-resul";
import { GhXmlType } from "@/types/types";
import { getArrayFrom, getBody } from "@/app/ghstudio/utils/helper-functions";
import { DefinitionObjectsSchema } from "@/types/gh-xml-schema";
import { codeToHtml } from "shiki";
import DOMPurify from "dompurify";

export default function GhXmlStudio() {
  const [error, setError] = useState("");
  //for now
  console.log(error);

  const [data, setData] = useState<any>();

  const {
    run,
    isValidXml,
    handlePasteFromClipboard,
    handleClear,
    validatedJson,
    parsedJson,
  } = useXmlPaste(setError, () => {});

  useEffect(() => {
    //todo decouple and imporve function
    //only c# or python passe, otherwise error or undefined...
    const d = async () => {
      if (validatedJson) {
        const ghaLibs = getBody(parsedJson as GhXmlType, "DefinitionObjects");
        const c1 = DefinitionObjectsSchema.safeParse(ghaLibs);
        if (c1.error) return undefined;
        const chunks = c1.data.chunks;
        const chunk = chunks.chunk;
        const chunkArray = getArrayFrom(chunk);
        const c2 = chunkArray[0].chunks.chunk;
        if (!Array.isArray(c2)) {
          const c3 = c2.chunks;
          if (!Array.isArray(c3)) {
            const base64EncodedText = c3.chunk[2].items.item[3]["#text"];
            const langSpec = c3.chunk[2].chunks.chunk;
            console.log(langSpec);
            const lang = langSpec.items.item[0]["#text"];
            const version = langSpec.items.item[1]["#text"];
            const ls = {
              language: lang,
              version: version,
            };
            console.log(ls);

            const decodedText = atob(base64EncodedText);

            const styledHtml = await codeToHtml(decodedText, {
              // lang: "csharp",
              lang: "python",
              theme: "dracula-soft",
            });
            const sanitizedHtml = DOMPurify.sanitize(styledHtml);
            setData({ __html: sanitizedHtml });
          }
        }
      }
    };
    d();
  }, [validatedJson]);

  return (
    <div className="w-full max-w-3xl">
      <Card className="border-neutral-800 bg-neutral-900">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-3xl font-semibold text-white">
              GhXML Studio
            </span>
            <div className="flex gap-2">
              {run && (
                <ValidatedResult
                  isValidXml={isValidXml}
                  validatedJson={validatedJson}
                  schemaCoverage={undefined}
                />
              )}
              <GhXmlValidatorButtons
                handlePasteFromClipboard={handlePasteFromClipboard}
                handleClear={handleClear}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-white">
            {data && (
              <div className="bg-[#282A36] p-2 font-mono">
                <div
                  className="[&_ol]:space-y-3 [&_ol]:pl-3 [&_ul]:space-y-3 [&_ul]:pl-3 [&>div>pre]:mb-5 [&>div>pre]:overflow-x-auto [&>div>pre]:p-5 [&>div>pre]:text-sm [&>li]:pb-2 [&>li]:text-xs [&>ol]:pb-2 [&>p]:pb-5"
                  dangerouslySetInnerHTML={data}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
