import { useCallback, useState } from "react";
import { validateGhXml } from "../utils/gh-xml";
import { GhXmlType } from "@/types/types";
import posthog from "posthog-js";

export function useXmlPaste(
  setAddError: React.Dispatch<React.SetStateAction<string>>,
  setAdding: (b: boolean) => void
) {
  const [xmlData, setXmlData] = useState<string>();
  const [run, setRun] = useState(false);
  const [validatedJson, setValidatedJson] = useState<GhXmlType>();
  const [parsedJson, setParsedJson] = useState<GhXmlType>();
  const [schemaCoverage, setSchemaCoverage] = useState(0);
  const [isValidXml, setIsValidXml] = useState(false);

  const handlePasteFromClipboard = useCallback(async () => {
    setAddError("");
    setXmlData("");
    setAdding(false);
    setValidatedJson(undefined);

    posthog.capture("user_pasted");

    try {
      const text = await navigator.clipboard.readText();
      if (text.length === 0) {
        setAddError("Clipboard is empty");
        return;
      }

      const { isValid, validatedJson, errorMsg, parsedJson } =
        validateGhXml(text);

      setParsedJson(parsedJson);
      if (isValid) {
        setIsValidXml(true);
        setXmlData(text);
        setValidatedJson(validatedJson);

        const validatedJsonString = JSON.stringify(validatedJson, null, 2);
        const parsedJsonString = JSON.stringify(parsedJson, null, 2);
        const sc =
          Math.round(
            (validatedJsonString.length / parsedJsonString.length) * 1000
          ) / 10;
        setSchemaCoverage(sc);
      } else {
        setIsValidXml(false);
        setValidatedJson(undefined);
        setAddError("XML is not valid: \n" + errorMsg);
      }
    } catch (err) {
      setAddError("Failed to read clipboard contents: \n" + err);
    }
    setRun(true);
  }, [setXmlData, setAddError, setAdding]);

  const handleClear = () => {
    setXmlData("");
    setValidatedJson(undefined);
    setParsedJson(undefined);
    setAddError("");
    setRun(false);
  };

  return {
    xmlData,
    setXmlData,
    isValidXml,
    handlePasteFromClipboard,
    handleClear,
    validatedJson,
    setValidatedJson,
    parsedJson,
    run,
    schemaCoverage,
  };
}
