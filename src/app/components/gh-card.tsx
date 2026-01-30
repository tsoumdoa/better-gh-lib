"use client";
import { InvalidValueDialog } from "./gh-card-dialog";
import { NormalButtons } from "./gh-card-normal-buttons";
import { EditButtons } from "./gh-card-edit-buttons";
import { NameDescriptionAndTags } from "./gh-card-body";
import useGhCardControl from "../hooks/use-gh-card-control";
import GhCardTags from "./gh-card-tags";
import { MetricsDialog } from "./metrics-dialog";
import { useDownloadPresignedUrl } from "../hooks/use-download-presigned-url";
import { useFetchGhXml } from "../hooks/use-fetch-gh-xml";
import { buildGhJson } from "@/utils/gh-json-builder";
import { useState } from "react";
import { GhPost } from "@/types/types";

export default function GHCard(props: {
	cardInfo: GhPost;
	tagFilters?: string[];
}) {
	const {
		editMode,
		handleEdit,
		deletePost,
		setGhInfo,
		invalidInput,
		setInvalidInput,
		updating,
		deleted,
		setEditMode,
		shareExpired,
		removeTag,
		handleCancelEditMode,
		ghInfo,
		addTag,
		tag: inputTag,
		setTag: setInputTag,
		reset,
		setReset,
	} = useGhCardControl(props.cardInfo);

	const [openSharedDialog, setOpenSharedDialog] = useState(false);
	const [openMetricsDialog, setOpenMetricsDialog] = useState(false);
	const [metrics, setMetrics] = useState<{
		GhVersion: string;
		componentsCount: number;
		uniqueCount: number;
		ghLibs: Array<{ name: string; author: string; version: string }>;
	} | null>(null);
	const [loadingMetrics, setLoadingMetrics] = useState(false);

	const { refetch: getPresignedUrl } = useDownloadPresignedUrl(
		props.cardInfo.bucketUrl ?? ""
	);
	const { downloadData } = useFetchGhXml();

	const handleShare = () => {
		setOpenSharedDialog(true);
	};

	const handleCardClick = async () => {
		if (editMode) return;
		setLoadingMetrics(true);
		setOpenMetricsDialog(true);

		try {
			const res = await getPresignedUrl();
			if (res.isSuccess && res.data) {
				const decoded = await downloadData(res.data);
				const parsedMetrics = buildGhJson(decoded);
				setMetrics({
					GhVersion: parsedMetrics.GhVersion,
					componentsCount: parsedMetrics.componentsCount,
					uniqueCount: parsedMetrics.uniqueCount,
					ghLibs: parsedMetrics.ghLibs,
				});
			}
		} catch (error) {
			console.error("Failed to load metrics:", error);
		} finally {
			setLoadingMetrics(false);
		}
	};

	if (deleted) {
		return (
			<div className="relative flex h-full w-full rounded-md bg-neutral-800 p-3 ring-1 ring-neutral-500">
				<NameDescriptionAndTags
					editMode={editMode}
					setEditMode={() => setEditMode(!editMode)}
					setGhInfo={setGhInfo}
					ghInfo={{ name: "deleted", description: "deleted", tags: [] }}
					isShared={false}
					expiryDate={""}
					bucketId={""}
					lastEdited={""}
					created={""}
					addTag={addTag}
					tag={inputTag}
					setTag={setInputTag}
					reset={reset}
					setReset={setReset}
				/>
			</div>
		);
	}

	return (
		<>
			<div
				className={`relative flex cursor-pointer flex-col justify-between rounded-md p-3 ring-1 ring-neutral-500 transition-all ${editMode || updating ? "bg-neutral-500" : "bg-neutral-900 hover:bg-neutral-800"}`}
				onClick={handleCardClick}
			>
				{shareExpired && (
					<button
						className={`absolute top-3 right-3 h-fit w-fit rounded-md bg-green-300 px-2 text-sm font-bold text-neutral-800 hover:cursor-pointer`}
						onClick={(e) => {
							e.stopPropagation();
							handleShare();
						}}
					>
						Shared
					</button>
				)}
				<InvalidValueDialog
					open={invalidInput}
					setOpen={() => setInvalidInput(false)}
				/>

				{ghInfo.tags.length > 0 && (
					<GhCardTags
						tags={ghInfo.tags}
						useNarrow={props.cardInfo.isPublicShared ?? false}
						tagFilters={props.tagFilters}
						editMode={editMode}
						removeTag={removeTag}
					/>
				)}

				<NameDescriptionAndTags
					editMode={editMode}
					setEditMode={() => setEditMode(!editMode)}
					setGhInfo={setGhInfo}
					ghInfo={{
						name: props.cardInfo.name!,
						description: props.cardInfo.description!,
						tags: props.cardInfo.tags ?? [],
					}}
					isShared={props.cardInfo.isPublicShared ?? false}
					expiryDate={props.cardInfo.publicShareExpiryDate ?? ""}
					bucketId={props.cardInfo.bucketUrl ?? ""}
					lastEdited={props.cardInfo.dateUpdated!}
					created={props.cardInfo.dateCreated!}
					addTag={addTag}
					tag={inputTag}
					setTag={setInputTag}
					reset={reset}
					setReset={setReset}
				/>
				<div onClick={(e) => e.stopPropagation()}>
					{editMode ? (
						<EditButtons
							editMode={editMode}
							setEditMode={setEditMode}
							setGhInfo={setGhInfo}
							deletePost={() => deletePost()}
							handleEdit={(b) => handleEdit(b)}
							handleCancel={() => handleCancelEditMode()}
							ghInfo={{
								name: props.cardInfo.name!,
								description: props.cardInfo.description!,
								tags: props.cardInfo.tags ?? [],
							}}
						/>
					) : (
						<NormalButtons
							editMode={editMode}
							bucketId={props.cardInfo.bucketUrl}
							setEditMode={() => setEditMode(true)}
							handleEdit={(b) => handleEdit(b)}
							openSharedDialog={openSharedDialog}
							setOpenSharedDialog={setOpenSharedDialog}
							handleShare={handleShare}
						/>
					)}
				</div>
			</div>
			<MetricsDialog
				open={openMetricsDialog}
				setOpen={() => setOpenMetricsDialog(false)}
				metrics={metrics}
				loading={loadingMetrics}
			/>
		</>
	);
}
