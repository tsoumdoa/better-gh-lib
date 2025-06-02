"use client";
import { useEffect, useRef, useState } from "react";
import { useXmlPaste } from "../../hooks/use-xml-paste";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GhXmlValidatorButtons } from "@/app/components/paste-ghxml";
import { ValidatedResult } from "@/app/components/valiation-resul";
import { ExtractedCode, GhXmlType } from "@/types/types";
import { extractCode } from "../utils/extract-code";

function DisplayCode(props: {
  code: ExtractedCode;
  totalItemLength: number;
  current: number;
  handleSelectorClick: (i: number) => void;
}) {
  return (
    <div className="whitespace-pre-wrap text-white">
      <div className="flex flex-row justify-end gap-x-2 pb-4">
        {props.code &&
          Array.from({ length: props.totalItemLength }, (_, i) => (
            <button
              className={`animate h-fit w-6 rounded-sm bg-white text-center text-lg font-bold text-neutral-800 transition-all hover:bg-neutral-200 ${
                i === props.current ? "" : "opacity-50"
              } `}
              key={"codeSelector" + i}
              onClick={() => props.handleSelectorClick(i)}
            >
              {i + 1}
            </button>
          ))}
      </div>
      {props.code && (
        <div className="">
          <p className="rounded-t-lg bg-neutral-800 p-2 pb-1 text-lg font-bold text-white">
            {props.code.language.version}
          </p>
          <div className="overflow-y-auto bg-[#282A36] p-2 font-mono">
            <div
              className="[&_ol]:space-y-3 [&_ol]:pl-3 [&_ul]:space-y-3 [&_ul]:pl-3 [&>div>pre]:mb-5 [&>div>pre]:overflow-x-auto [&>div>pre]:p-5 [&>div>pre]:text-sm [&>li]:pb-2 [&>li]:text-xs [&>ol]:pb-2 [&>p]:pb-5"
              dangerouslySetInnerHTML={{ __html: props.code.htmlString }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function GhXmlStudio() {
  const [error, setError] = useState("");
  //for now
  console.log(error);

  const data = useRef<ExtractedCode[]>([]);
  const [currentCode, setCurrentCode] = useState<ExtractedCode>();
  const [selector, setSelector] = useState<number>(0);

  const {
    run,
    isValidXml,
    handlePasteFromClipboard,
    handleClear,
    validatedJson,
    parsedJson,
  } = useXmlPaste(setError, () => {});

  useEffect(() => {
    const runValidator = async () => {
      const parsedRes = await extractCode(parsedJson as GhXmlType);
      if (Array.isArray(parsedRes)) {
        data.current = parsedRes;
        setCurrentCode(parsedRes[selector]);
      }
    };
    validatedJson && runValidator();
    if (!validatedJson) {
      data.current = [];
      setCurrentCode(undefined);
    }
  }, [validatedJson]);

  function handleSelectorClick(i: number) {
    setSelector(i);
    setCurrentCode(data.current[i]);
  }

  return (
    <div className="w-full max-w-5xl">
      <Card className="gap-2 border-neutral-800 bg-neutral-900">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-3xl font-semibold text-white">
              GhCode Scan
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
          {currentCode && (
            <DisplayCode
              code={currentCode}
              totalItemLength={data.current.length}
              current={selector}
              handleSelectorClick={handleSelectorClick}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
