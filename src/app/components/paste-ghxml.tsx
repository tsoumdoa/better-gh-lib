import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";

export function GhXmlValidatorButtons(props: {
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
