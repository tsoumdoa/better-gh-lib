"use client";

import { CopiedDialog } from "@/app/components/gh-card-dialog";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAction } from "convex/react";
import { useState } from "react";
import { useFetchGhXmlPublic } from "@/app/hooks/use-fetch-gh-xml-public";
import { GetSharedPost } from "@/types/types";
import { api } from "@/_generated/api";

export default function GhShareCard(props: { sharedPost: GetSharedPost }) {
	const getPresignedUrl = useAction(api.ghPublicAction.generateShareableLink); //TODO: this is not working...

	const [openCopyDialog, setOpenCopyDialog] = useState(false);
	const [isCopied, setIsCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { downloadDataPublic, decodedRef } = useFetchGhXmlPublic();

	const handleCopy = async () => {
		if (!props.sharedPost) return;
		setIsLoading(true);

		const presignedUrl = await getPresignedUrl({
			shareToken: props.sharedPost.shareToken,
		});

		const decoded = await downloadDataPublic(presignedUrl);

		try {
			await navigator.clipboard.writeText(decoded);
			setOpenCopyDialog(true);
			setIsCopied(true);
		} catch {
			setOpenCopyDialog(true);
			setIsCopied(false);
		}

		setIsLoading(false);
	};

	const formatExpiry = (dateStr: string) => {
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = date.getTime() - now.getTime();
		const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
		if (diffHours < 24) {
			return `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
		}
		const diffDays = Math.ceil(diffHours / 24);
		return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
	};

	if (!props.sharedPost) {
		return (
			<div className="flex max-h-3/5 w-full max-w-xl">
				<Card className="w-full gap-2 border-neutral-800 bg-neutral-900 p-4">
					<CardHeader className="px-0">
						<CardTitle className="text-3xl font-semibold text-white">
							Link Expired
						</CardTitle>
					</CardHeader>
					<CardContent className="px-0">
						<p className="text-neutral-400">
							This share link has expired or is invalid.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex max-h-3/5 w-full max-w-xl">
			<CopiedDialog
				open={openCopyDialog}
				setOpen={() => setOpenCopyDialog(false)}
				setIsCopied={(b) => setIsCopied(b)}
				isCopied={isCopied}
				decoded={decodedRef.current ?? undefined}
			/>
			<Card className="w-full gap-2 border-neutral-800 bg-neutral-900 p-4">
				<CardHeader className="px-0">
					<CardTitle className="flex items-center justify-between">
						<span className="text-3xl font-semibold text-white">
							Hopper Clip Share
						</span>

						<CardDescription>
							Expires in {formatExpiry(props.sharedPost.expiryDate)}
						</CardDescription>
					</CardTitle>
				</CardHeader>
				<CardContent className="px-0">
					<div>
						<div className="text-neutral-500">Name</div>
						<div className="pb-1 text-lg font-semibold">
							<p className="overflow-hidden text-ellipsis text-neutral-100">
								{props.sharedPost.post.name}
							</p>
						</div>
						<div className="text-neutral-500">Description</div>
						<div className="h-auto text-neutral-100">
							{props.sharedPost.post.description}
						</div>
					</div>
				</CardContent>
				<AlertDialogFooter>
					<Button
						variant="outline"
						className="w-fit hover:opacity-80"
						onClick={() => handleCopy()}
						disabled={isLoading}
					>
						Copy
					</Button>
				</AlertDialogFooter>
			</Card>
		</div>
	);
}
