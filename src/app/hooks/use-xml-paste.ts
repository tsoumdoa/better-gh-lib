import { useCallback, useState } from "react";
import { validateGhXml } from "../utils/gh-xml";
import { GhXml } from "@/types/types";

export function useXmlPaste(
  setAddError: React.Dispatch<React.SetStateAction<string>>
) {
  const [xmlData, setXmlData] = useState<string>();
  const [validatedJson, setValidatedJson] = useState<GhXml>();
  const [parsedJson, setParsedJson] = useState<GhXml>();
  const [isValidXml, setIsValidXml] = useState(false);
  const handlePasteFromClipboard = useCallback(async () => {
    setAddError("");
    setXmlData("");
    setValidatedJson(undefined);
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
      } else {
        setIsValidXml(false);
        setValidatedJson(undefined);
        setAddError("XML is not valid: \n" + errorMsg);
      }
    } catch (err) {
      setAddError("Failed to read clipboard contents: \n" + err);
    }
  }, [setXmlData, setAddError]);

  const handleClear = () => {
    setXmlData("");
    setValidatedJson(undefined);
    setParsedJson(undefined);
    setAddError("");
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
  };
}
