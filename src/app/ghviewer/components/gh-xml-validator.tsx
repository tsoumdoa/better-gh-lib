"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useXmlPaste } from "../../hooks/use-xml-paste";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clipboard } from "lucide-react";
import { GhXml } from "@/types/types";
import { useSyncedScroll } from "../hooks/use-synced-scroll";
import { Toggle } from "@/components/ui/toggle";

function GhXmlValidatorButtons(props: {
  handlePasteFromClipboard: () => void;
  handleClear: () => void;
}) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={props.handlePasteFromClipboard}
        className="flex items-center gap-1 transition-all hover:opacity-80"
      >
        <Clipboard className="h-4 w-4" />
        Paste from Clipboard
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={props.handleClear}
        className="transition-all hover:opacity-80"
      >
        Clear
      </Button>
    </div>
  );
}

function ValidatedResult(props: {
  isValidXml: boolean;
  validatedJson: GhXml | undefined;
}) {
  return (
    <div className="rounded-md bg-neutral-800 p-2 text-sm font-semibold">
      <div className="flex items-center gap-2">
        {props.isValidXml ? (
          <div className="flex items-center text-green-500">
            <CheckCircle className="h-5 w-5 pr-1" />
            Valid GhXml
          </div>
        ) : (
          <div className="flex items-center text-red-500">
            <XCircle className="mr-1 h-5 w-5" />
            Invalid GhXml
          </div>
        )}
      </div>
    </div>
  );
}

export default function GhXmlValidator() {
  const [error, setError] = useState("");
  const [displayString, setDisplayString] = useState("");
  const {
    isValidXml,
    handlePasteFromClipboard,
    handleClear,
    validatedJson,
    parsedJson,
  } = useXmlPaste(setError);
  const { textarea1Ref, textarea2Ref, setEnableSync, enableSync } =
    useSyncedScroll();

  useEffect(() => {
    if (validatedJson) {
      setDisplayString(JSON.stringify(validatedJson, null, 2));
    } else {
      setDisplayString(error);
    }
  }, [validatedJson, error]);

  return (
    <div className="max-f-full w-full max-w-6xl">
      <Card className="border-neutral-800 bg-neutral-900">
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-between gap-y-4 sm:flex-row">
            <span className="text-3xl font-semibold text-white">
              GhXml Validator
            </span>
            <GhXmlValidatorButtons
              handlePasteFromClipboard={handlePasteFromClipboard}
              handleClear={handleClear}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
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
          <div className="flex w-full flex-row justify-between pt-3">
            <Toggle
              size={"sm"}
              aria-label="Toggle bold"
              className="text-neutral-500"
              onClick={() => setEnableSync(!enableSync)}
            >
              Scroll Sync
            </Toggle>
            {displayString && (
              <ValidatedResult
                isValidXml={isValidXml}
                validatedJson={validatedJson}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
