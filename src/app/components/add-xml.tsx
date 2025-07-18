import { X } from "lucide-react";

export default function AddXml(props: {
  setAddError: React.Dispatch<React.SetStateAction<string>>;
  isValidXml: boolean;
  xmlData: string;
  setXmlData: React.Dispatch<React.SetStateAction<string | undefined>>;
  handlePasteFromClipboard: () => void;
}) {
  return (
    <div className="text-sm">
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
          className="animate border-input rounded-md border bg-neutral-100 p-2 font-medium text-neutral-500 shadow-xs transition-all hover:text-neutral-700"
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
// file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive font-semibold
