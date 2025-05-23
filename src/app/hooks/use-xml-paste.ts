import { useCallback, useState } from "react";
import { validateGhXml } from "../utils/gh-xml";
import { GhXmlType, XmlMetrics } from "@/types/types";
import { getXmlMetrics } from "../ghstudio/utils/get-xml-metrics";

export function useXmlPaste(
  setAddError: React.Dispatch<React.SetStateAction<string>>
) {
  const [xmlData, setXmlData] = useState<string>();
  const [run, setRun] = useState(false);
  const [validatedJson, setValidatedJson] = useState<GhXmlType>();
  const [parsedJson, setParsedJson] = useState<GhXmlType>();
  const [schemaCoverage, setSchemaCoverage] = useState(0);
  const [isValidXml, setIsValidXml] = useState(false);
  const [metrics, setMetrics] = useState<XmlMetrics>();

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

        const validatedJsonString = JSON.stringify(validatedJson, null, 2);
        const parsedJsonString = JSON.stringify(parsedJson, null, 2);
        const sc =
          Math.round(
            (validatedJsonString.length / parsedJsonString.length) * 1000
          ) / 10;
        setSchemaCoverage(sc);
        const metrics = getXmlMetrics(validatedJson);
        setMetrics(metrics);
      } else {
        setIsValidXml(false);
        setValidatedJson(undefined);
        setAddError("XML is not valid: \n" + errorMsg);
      }
    } catch (err) {
      setAddError("Failed to read clipboard contents: \n" + err);
    }
    setRun(true);
  }, [setXmlData, setAddError]);

  const handleClear = () => {
    setXmlData("");
    setValidatedJson(undefined);
    setParsedJson(undefined);
    setMetrics(undefined);
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
    metrics,
  };
}
