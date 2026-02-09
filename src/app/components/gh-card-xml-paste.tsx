import { X } from "lucide-react";
import { useEffect } from "react";
import posthog from "posthog-js";
import { validateGhXml } from "../utils/gh-xml";

export function GhCardXmlPaste(props: {
	xmlData: string | undefined;
	setXmlData: (data: string | undefined) => void;
	isValidXml: boolean;
	xmlError: string;
	setXmlError: (error: string) => void;
	handlePasteFromClipboard: () => void;
	isEditMode?: boolean;
}) {
	const { xmlData, isValidXml, setXmlError } = props;

	useEffect(() => {
		if (xmlData && isValidXml) {
			setXmlError("");
		}
	}, [xmlData, isValidXml, setXmlError]);

	const handleClear = () => {
		props.setXmlData(undefined);
		props.setXmlError("");
	};

	return (
		<div className="text-sm">
			{props.xmlData ? (
				<div className="space-y-2">
					{props.isValidXml ? (
						<div className="flex flex-row items-center gap-x-2">
							<button
								className="flex flex-row items-center gap-x-1 text-sm text-red-500"
								onClick={handleClear}
							>
								{props.isEditMode ? "Delete/Replace XML" : "Delete pasted XML"}
								<X size={16} />
							</button>
							<span className="text-sm text-green-600">
								✓ XML pasted and validated
							</span>
						</div>
					) : (
						<div className="flex flex-row items-center gap-x-2">
							<button
								className="flex flex-row items-center gap-x-1 text-sm text-red-500"
								onClick={handleClear}
							>
								Delete invalid XML
								<X size={16} />
							</button>
						</div>
					)}
				</div>
			) : (
				<button
					type="button"
					onClick={props.handlePasteFromClipboard}
					className="animate border-input rounded-md border bg-neutral-100 p-2 font-medium text-neutral-500 shadow-xs transition-all hover:text-neutral-700"
				>
					{props.isEditMode
						? "Paste/Replace GH XML from Clipboard"
						: "Paste GH XML from Clipboard"}
				</button>
			)}
			{props.xmlError.length > 0 && (
				<div className="mt-2 text-sm text-red-500">{props.xmlError}</div>
			)}
		</div>
	);
}

export function useXmlPasteHandler(
	setXmlData: (data: string | undefined) => void,
	setIsValidXml: (valid: boolean) => void,
	setXmlError: (error: string) => void
) {
	const handlePasteFromClipboard = async () => {
		setXmlError("");
		setXmlData("");
		setIsValidXml(false);

		posthog.capture("user_pasted");

		try {
			const text = await navigator.clipboard.readText();
			if (text.length === 0) {
				setXmlError("Clipboard is empty");
				return;
			}

			const { isValid, errorMsg } = validateGhXml(text);

			if (isValid) {
				setIsValidXml(true);
				setXmlData(text);
			} else {
				setIsValidXml(false);
				setXmlError("XML is not valid: \n" + errorMsg);
			}
		} catch (err) {
			setXmlError("Failed to read clipboard contents: \n" + String(err));
		}
	};

	return { handlePasteFromClipboard };
}
