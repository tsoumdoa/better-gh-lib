import { Clipboard } from "lucide-react";

export function PasteButton() {
	return (
		<div className="flex items-center gap-2">
			<Clipboard className="h-4 w-4" />
			Paste GhXml from Clipboard
		</div>
	);
}
