import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api as convex } from "../../../convex/_generated/api";
import { GhPost } from "@/types/types";

export default function useGhCardControl(cardInfo: GhPost) {
	const deletePostConvex = useMutation(convex.ghCard.deletePost);
	const updatePost = useMutation(convex.ghCard.updatePost);

	const [tag, setTag] = useState<string>("");
	const [editMode, setEditMode] = useState(false);
	const [invalidInput, setInvalidInput] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [deleted, setDeleted] = useState(false);
	const [ghInfo, setGhInfo] = useState({
		name: cardInfo.name,
		description: cardInfo.description,
		tags: cardInfo.tags ?? [],
	});
	const [reset, setReset] = useState(false);
	const [shareExpired, setShareExpired] = useState(false);
	const prevTags = useRef(cardInfo.tags ?? []);
	const newTags = useRef(cardInfo.tags ?? []);

	const publicShareExpiryDate = cardInfo.publicShareExpiryDate ?? "";
	const isShared = cardInfo.isPublicShared ?? false;
	const bucketId = cardInfo.bucketUrl ?? "";

	useEffect(() => {
		setShareExpired(false);
		const expiryDate = new Date(publicShareExpiryDate);
		if (isShared && new Date() > expiryDate && publicShareExpiryDate !== null) {
			// revokeLink({ bucketId: bucketId }); /TODO:
		} else {
			if (isShared) {
				setShareExpired(true);
			}
		}
	}, [publicShareExpiryDate, isShared, bucketId /* , revokeLink */]);

	const handleCancelEditMode = () => {
		setReset(true);
		setEditMode(false);
		setTag("");
		setGhInfo({
			name: cardInfo.name,
			description: cardInfo.description,
			tags: cardInfo.tags ?? [],
		});
	};

	const deletePost = () => {
		deletePostConvex({
			id: cardInfo["_id"],
		});
		//TODO: Handle delete from R2 too

		setTag("");
	};

	const handleEdit = (submit: boolean) => {
		setReset(true);
		if (
			ghInfo.name === cardInfo.name &&
			ghInfo.description === cardInfo.description &&
			newTags.current === prevTags.current
		) {
			setEditMode(false);
			return;
		}
		if (!submit) return;
		if (submit) {
			updatePost({
				id: cardInfo["_id"],
				name: ghInfo.name!,
				description: ghInfo.description!,
				tags: newTags.current,
			});
		}
		setEditMode(!editMode);
	};

	const removeTag = (tag: string, toBeRemoved: boolean) => {
		if (!toBeRemoved) {
			const filteredTags = prevTags.current.filter((t) => t !== tag);
			newTags.current = filteredTags;
		} else {
			newTags.current = [...prevTags.current, tag];
		}
	};

	const addTag = (t: string) => {
		const newTagSet = new Set([...newTags.current, t]);
		const array = [...newTagSet];
		newTags.current = array;
		setGhInfo({ ...ghInfo, tags: array });
		setTag("");
	};

	return {
		editMode,
		setEditMode,
		handleEdit,
		deletePost,
		ghInfo,
		setGhInfo,
		invalidInput,
		setInvalidInput,
		updating,
		setUpdating,
		deleted,
		setDeleted,
		setShareExpired,
		shareExpired,
		removeTag,
		addTag,
		prevTags,
		handleCancelEditMode,
		tag,
		setTag,
		reset,
		setReset,
	};
}
