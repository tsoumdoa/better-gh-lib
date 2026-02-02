"use client";
import { useValidateShareToken } from "../hooks/use-validate-uid";
import GhShareCard from "./share-card";
import { useQuery } from "convex/react";
import { api } from "@/_generated/api";

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
