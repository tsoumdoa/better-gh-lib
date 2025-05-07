import { useCallback, useState } from "react";
import { validateGhXml } from "../utils/gh-xml";

export function useXmlPaste(
  setAddError: React.Dispatch<React.SetStateAction<string>>
) {
  const [xmlData, setXmlData] = useState<string>();
  const [isValidXml, setIsValidXml] = useState(false);
  const handlePasteFromClipboard = useCallback(async () => {
    setAddError("");
    setXmlData(undefined);
    try {
      const text = await navigator.clipboard.readText();
      if (text.length === 0) {
        setAddError("Clipboard is empty");
        return;
      }

      //this returns validated json as data for further processing...
      const { isValid } = validateGhXml(text);

      if (isValid) {
        setIsValidXml(true);
        setXmlData(text);
      } else {
        setIsValidXml(false);
        setAddError("XML is not valid");
      }
    } catch (err) {
      setAddError("Failed to read clipboard contents" + err);
    }
  }, [setXmlData, setAddError]);

  return { xmlData, setXmlData, isValidXml, handlePasteFromClipboard };
}
