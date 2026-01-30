import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { useRef, useState } from "react";

export function InvalidValueDialog(props: {
	open: boolean;
	setOpen: () => void;
}) {
	return (
		<AlertDialog open={props.open} onOpenChange={props.setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Invalid Input</AlertDialogTitle>
					<AlertDialogDescription>
						Name must be between 3 and 30 characters long and in PascalCase.
						Description must be between 1 and 150 characters long.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function CopiedDialog(props: {
	open: boolean;
	setOpen: () => void;
	setIsCopied: (b: boolean) => void;
	isCopied: boolean;
	decoded: string | undefined;
}) {
	function handleCopyClick() {
		navigator.clipboard.writeText(props.decoded!);
		props.setIsCopied(true);
		alert("GhXml copied to clipboard!");
	}

	return (
		<AlertDialog open={props.open} onOpenChange={props.setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{props.isCopied ? "Copied!" : "Failed to copy"}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{props.isCopied
							? "copied to your clipboard!"
							: "Something went wrong, try copy button below"}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					{!props.isCopied && (
						<Button
							className="bg-neutral-800 hover:bg-neutral-700"
							onClick={handleCopyClick}
						>
							Copy
						</Button>
					)}
					<AlertDialogCancel>Close</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function ShareDialog(props: {
	open: boolean;
	setOpen: () => void;
	bucketId: string;
}) {
	const format = (id: string) => {
		if (process.env.NODE_ENV === "development") {
			return `http:localhost:3000/share?uid=${id}`;
		}
		return `${env.NEXT_PUBLIC_HOSTING_DOMAIN}/share?uid=${id}`;
	};

	const [shareLink, setShareLink] = useState("generating...");
	const shareLinkRef = useRef(shareLink);
	const [copied, setCopied] = useState(false);
	const [revoking, setRevoking] = useState(false);
	const [isRevoked, setIsRevoked] = useState(false);
	const [isGenerated, setIsGenerated] = useState(false);

	const handleCopyClick = () => {
		navigator.clipboard.writeText(shareLinkRef.current);
		setCopied(true);
		alert("Link copied to clipboard!");
	};

	const handleRevokeClick = () => {
		setShareLink("revoking...");
	};

	return (
		<AlertDialog open={props.open} onOpenChange={props.setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Share</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>
					<a className="flex items-center space-x-2 pb-2">
						<Input className="truncate" value={shareLink} readOnly />
						{!isRevoked && (
							<Button
								variant="outline"
								size="sm"
								onClick={handleCopyClick}
								disabled={revoking}
							>
								{copied ? "Copied!" : "Copy"}
							</Button>
						)}
					</a>
					{isRevoked
						? "You can now close"
						: "Copy the link to this card and share it with your friends!"}
				</AlertDialogDescription>
				<AlertDialogFooter>
					{isGenerated && !isRevoked && (
						<Button
							className="bg-pink-500 hover:bg-pink-600"
							onClick={handleRevokeClick}
							disabled={revoking}
						>
							Revoke
						</Button>
					)}
					<AlertDialogAction disabled={revoking}>Close</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
