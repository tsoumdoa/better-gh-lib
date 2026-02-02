"use client";
import { api } from "@convex/_generated/api";
import { useValidateShareToken } from "../hooks/use-validate-uid";
import GhShareCard from "./share-card";
import { useQuery } from "convex/react";

export default function ShareView() {
	const { isValidToken, tokenRef } = useValidateShareToken();

	const sharedPost = useQuery(api.ghCard.getSharedPost, {
		shareToken: tokenRef.current!,
	});

	if (!isValidToken || !sharedPost) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex w-full max-w-xl px-2">
			<GhShareCard sharedPost={sharedPost} />
		</div>
	);
}
