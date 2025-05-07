import { X } from "lucide-react";

export default function AddXml(props: {
  setAddError: React.Dispatch<React.SetStateAction<string>>;
  isValidXml: boolean;
  xmlData: string;
  setXmlData: React.Dispatch<React.SetStateAction<string | undefined>>;
  handlePasteFromClipboard: () => void;
}) {
  return (
    <div className="text-sm text-neutral-500">
      {props.xmlData ? (
        <button
          className="flex flex-row items-center gap-x-1 text-sm text-red-500"
          onClick={() => props.setXmlData("")}
        >
          Delete pasted XML
          <X size={16} />
        </button>
      ) : (
        <button
          type="button"
          onClick={props.handlePasteFromClipboard}
          className="text-neutral-500 hover:text-neutral-900"
        >
          Paste GH XML from Clipboard
        </button>
      )}
      {props.xmlData && (
        <div className="text-sm text-neutral-500">
          {props.xmlData && "GhXml pasted from clipboard"}
        </div>
      )}
    </div>
  );
}
