import { useState } from "react";
import { useDownloadPresignedUrl } from "../hooks/use-download-presigned-url";
import { useFetchGhXml } from "../hooks/use-fetch-gh-xml";
import { CopiedDialog, ShareDialog } from "./gh-card-dialog";

export function NormalButtons(props: {
	editMode: boolean;
	bucketId: string;
	setEditMode: () => void;
	handleEdit: (b: boolean) => void;
	openSharedDialog: boolean;
	setOpenSharedDialog: (b: boolean) => void;
	handleShare: () => void;
}) {
	const [openCopyDialog, setOpenCopyDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isCopied, setIsCopied] = useState(false);
	const { refetch: getPresignedUrl } = useDownloadPresignedUrl(props.bucketId);
	const { downloadData, decoded } = useFetchGhXml();

	const handleCopy = async () => {
		setIsLoading(true);
		const res = await getPresignedUrl();
		if (res.isSuccess) {
			const decoded = await downloadData(res.data);
			try {
				await navigator.clipboard.writeText(decoded);
				setOpenCopyDialog(true);
				setIsLoading(false);
				setIsCopied(true);
			} catch {
				setOpenCopyDialog(true);
				setIsLoading(false);
				setIsCopied(false);
			}
		}
	};

	return (
		<div className="flex items-center justify-end text-neutral-400 transition-all">
			<CopiedDialog
				open={openCopyDialog}
				setOpen={() => setOpenCopyDialog(!openCopyDialog)}
				setIsCopied={(b) => setIsCopied(b)}
				isCopied={isCopied}
				decoded={decoded}
			/>
			<ShareDialog
				open={props.openSharedDialog}
				setOpen={() => props.setOpenSharedDialog(!props.openSharedDialog)}
				bucketId={props.bucketId}
			/>
			<button
				className={`px-2 font-bold hover:text-neutral-50`}
				onClick={handleCopy}
				disabled={isLoading}
			>
				{isLoading ? "Loading..." : "copy"}
			</button>
			<button
				className={`px-2 font-bold hover:text-neutral-50`}
				onClick={props.handleShare}
			>
				share
			</button>
			<button
				className={`px-2 font-bold hover:text-neutral-50`}
				onClick={() => props.setEditMode()}
			>
				edit
			</button>
		</div>
	);
}
