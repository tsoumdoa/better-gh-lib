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
import { decompress } from "@/server/api/routers/util/gzip";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

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
	presignedUrl: string;
}) {
	//todo
	//after it fails to load,
	//it should either show a dialog or a toast
	//to let user to decide whether
	//try again or
	//delete the card or
	//update the card...?
	const { refetch, isLoading, isSuccess } = useQuery({
		queryKey: [props.presignedUrl],
		queryFn: async () => {
			const res = await fetch(props.presignedUrl, { cache: "no-store" });
			const arrayBuffer = await res.arrayBuffer();
			const xml = decompress(arrayBuffer);
			const decoded = new TextDecoder().decode(xml);
			navigator.clipboard
				.writeText(decoded)
				.then(() => {
					return true;
				})
				.catch(() => {
					return false;
				});
			return res;
		},
		enabled: false,
	});

	useEffect(() => {
		refetch();
	}, [props.presignedUrl]);

	return (
		<AlertDialog open={props.open} onOpenChange={props.setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{isLoading
							? "Loading..."
							: isSuccess
								? "Copied!"
								: "Failed to copy"}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{isLoading
							? ""
							: isSuccess
								? "copied to your clipboard!"
								: "Something went wrong..."}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Close</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function ShareDialog(props: { open: boolean; setOpen: () => void }) {
	const shareLink = "https://www.hopperclip.com/";
	const handleCopyClick = () => {
		navigator.clipboard.writeText(shareLink);
		alert("Link copied to clipboard!");
	};
	return (
		<AlertDialog open={props.open} onOpenChange={props.setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Share</AlertDialogTitle>
					<AlertDialogDescription>
						<a className="flex items-center space-x-2">
							<Input value={shareLink} readOnly />
							<Button variant="outline" size="sm" onClick={handleCopyClick}>
								Copy
							</Button>
						</a>
						Copy the link to this card and share it with your friends!
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
