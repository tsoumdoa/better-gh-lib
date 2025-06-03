"use client";
import { useEffect, useRef, useState } from "react";
import { useXmlPaste } from "../../hooks/use-xml-paste";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GhXmlValidatorButtons } from "@/app/components/paste-ghxml";
import { ValidatedResult } from "@/app/components/valiation-resul";
import { ExtractedCode, GhXmlType } from "@/types/types";
import { extractCode } from "../utils/extract-code";
import { Check, Copy } from "lucide-react";

function CopyIcon(props: { content: string }) {
  const [copied, setCopied] = useState(false);
  if (copied) {
    return <Check className="animate h-6 w-6 rounded-sm p-1 transition-all" />;
  } else {
    return (
      <Copy
        className="animate h-6 w-6 rounded-sm p-1 transition-all hover:bg-neutral-700"
        onClick={() => {
          navigator.clipboard.writeText(props.content);
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1000);
        }}
      />
    );
  }
}

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
              className={`animate text-md h-fit w-6 rounded-sm bg-white text-center font-bold text-neutral-800 transition-all hover:bg-neutral-200 ${
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
        <div className="w-full">
          <div className="flex w-full flex-col justify-start gap-x-8 gap-y-2 pb-4 md:flex-row">
            {props.code.ioParams.input.length > 0 && (
              <div>
                <p className="text-md w-fit rounded-lg bg-neutral-800 px-2 py-1 font-bold text-white">
                  {props.code.ioParams.input.length === 1
                    ? "Input Param"
                    : "Input Params"}
                </p>
                {props.code.ioParams.input.map((param, i) => (
                  <div
                    className="flex flex-row items-center gap-2 pl-2"
                    key={i}
                  >
                    <p className="font-bold">{param.name}:</p>
                    <p className="text-sm text-neutral-200">
                      {param.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {props.code.ioParams.output.length > 0 && (
              <div>
                <p className="text-md w-fit rounded-lg bg-neutral-800 px-2 py-1 font-bold text-white">
                  {props.code.ioParams.output.length === 1
                    ? "Output Param"
                    : "Output Params"}
                </p>
                {props.code.ioParams.output.map((param, i) => (
                  <div
                    className="flex flex-row items-center gap-2 pl-2"
                    key={i}
                  >
                    <p className="font-bold">{param.name}:</p>
                    <p className="text-sm text-neutral-200">
                      {param.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="text-md flex h-full w-full flex-row items-center-safe justify-between rounded-t-lg bg-neutral-800 p-2 pb-1 font-bold text-white">
            <div className="flex flex-row items-center gap-2">
              <p className="">{props.code.language.version}</p>
              <p className="text-sm">
                - number of duplicates: {props.code.count}
              </p>
            </div>
            <CopyIcon content={props.code.originalString} />
          </div>
          <div className="overflow-y-auto bg-[#282A36] p-2 font-mono">
            <div
              className="text-sm [&_ol]:space-y-3 [&_ol]:pl-3 [&_ul]:space-y-3 [&_ul]:pl-3 [&>div>pre]:mb-5 [&>div>pre]:overflow-x-auto [&>div>pre]:p-5 [&>div>pre]:text-sm [&>li]:pb-2 [&>li]:text-xs [&>ol]:pb-2 [&>p]:pb-5"
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
        setSelector(0);
        setCurrentCode(parsedRes[0]);
      }
    };
    if (validatedJson) {
      runValidator();
    }
    if (!validatedJson) {
      data.current = [];
      setCurrentCode(undefined);
    }
  }, [validatedJson, parsedJson]);

  function handleSelectorClick(i: number) {
    setSelector(i);
    setCurrentCode(data.current[i]);
  }

  return (
    <div className="w-full max-w-5xl">
      <Card className="gap-2 border-neutral-800 bg-neutral-900">
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-between gap-2 sm:flex-row">
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
