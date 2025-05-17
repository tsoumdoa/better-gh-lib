"use client";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useXmlPaste } from "../../hooks/use-xml-paste";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSyncedScroll } from "../hooks/use-synced-scroll";
import { Toggle } from "@/components/ui/toggle";
import { buildGhXml } from "@/app/utils/gh-xml";
import { GhXmlValidatorButtons } from "@/app/components/paste-ghxml";
import { ValidatedResult } from "@/app/components/valiation-resul";

export default function GhXmlValidator() {
  const [error, setError] = useState("");
  const [displayString, setDisplayString] = useState("");
  // const [schemaCoverage, setSchemaCoverage] = useState(0);
  const [encodedXml, setEncodedXml] = useState("");
  const {
    isValidXml,
    handlePasteFromClipboard,
    handleClear,
    validatedJson,
    parsedJson,
    schemaCoverage,
    run,
  } = useXmlPaste(setError);

  const { textarea1Ref, textarea2Ref, setEnableSync, enableSync } =
    useSyncedScroll();

  useEffect(() => {
    if (validatedJson) {
      console.log("validatedJson");
      const validatedJsonString = JSON.stringify(validatedJson, null, 2);
      setDisplayString(validatedJsonString);
      const xml = buildGhXml(validatedJson);
      setEncodedXml(xml);
    } else {
      setDisplayString(error);
    }
  }, [validatedJson, error, parsedJson]);

  return (
    <div className="max-f-full w-full max-w-6xl">
      <Card className="border-neutral-800 bg-neutral-900">
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-between gap-y-4 sm:flex-row">
            <span className="text-3xl font-semibold text-white">
              GhXml Validator
            </span>
            <div className="flex gap-2 transition-all">
              {run && (
                <ValidatedResult
                  isValidXml={isValidXml}
                  validatedJson={validatedJson}
                  schemaCoverage={schemaCoverage}
                />
              )}
              <GhXmlValidatorButtons
                handlePasteFromClipboard={handlePasteFromClipboard}
                handleClear={handleClear}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex w-1/2 flex-col gap-1.5">
              <span className="font-semibold text-neutral-600">
                Parsed JSON
              </span>
              <Textarea
                ref={textarea1Ref}
                title="Parsed XML"
                placeholder="Use the 'Paste from Clipboard' button to paste your GhXml script."
                className="max-h-1 min-h-[450px] border-neutral-600 bg-neutral-800 p-2 font-mono text-sm text-white"
                value={JSON.stringify(parsedJson, null, 2) || displayString}
                disabled={!displayString}
              />
            </div>
            <div className="flex w-1/2 flex-col gap-1.5">
              <span className="font-semibold text-neutral-600">
                Validated JSON
              </span>
              <Textarea
                ref={textarea2Ref}
                title="Validated XML"
                placeholder="Use the 'Paste from Clipboard' button to paste your GhXml script."
                className="max-h-1 min-h-[450px] border-neutral-600 bg-neutral-800 p-2 font-mono text-sm text-white"
                value={displayString}
                disabled={!displayString}
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-1.5">
            <span className="font-semibold text-neutral-600">
              XML decoded from JSON
            </span>
            <Textarea
              ref={textarea2Ref}
              title="Validated XML"
              placeholder="Use the 'Paste from Clipboard' button to paste your GhXml script."
              className="max-h-1 min-h-[450px] border-neutral-600 bg-neutral-800 p-2 font-mono text-sm text-white"
              value={encodedXml}
              disabled={!displayString}
            />
          </div>
          <div className="flex w-full flex-row justify-between pt-3">
            <Toggle
              size={"sm"}
              aria-label="Toggle bold"
              className="text-neutral-500"
              onClick={() => setEnableSync(!enableSync)}
            >
              Scroll Sync
            </Toggle>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
