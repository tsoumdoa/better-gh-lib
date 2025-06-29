"use client";
import { api } from "@/trpc/react";
import FilterTagDisplay from "./user-tag-display";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import useTagFilters from "../hooks/use-tag-filters";
import { LoadingSpinner } from "./loading-spinner";

export default function UserTags(props: { tagFilters: string[] }) {
	const { data, refetch } = api.post.getUserTags.useQuery();

	const {
		tagFilters,
		setTagFilters,
		updateSearchParam,
		removeSearchParam,
		params,
		pathname,
		replace,
		isPending,
		startTransition,
	} = useTagFilters();

	useEffect(() => {
		setTagFilters(props.tagFilters);
	}, [props.tagFilters]);

	useEffect(() => {
		const tagFilterIsStale = params.get("tagFilterIsStale");
		if (tagFilterIsStale === "true") {
			const newParams = new URLSearchParams(params);
			newParams.delete("tagFilterIsStale");
			startTransition(() => {
				replace(`${pathname}?${newParams.toString()}`);
				refetch();
			});
		}
	}, [tagFilters, pathname, replace, params, refetch]);

	if (!data)
		return (
			<FilterTagDisplay
				userTag={{ tag: "Loading...", count: 0 }}
				tagFilters={tagFilters}
				setTagFilters={setTagFilters}
				updatePath={updateSearchParam}
			/>
		);
	return (
		<div className={`flex w-full flex-wrap items-center gap-2`}>
			{data?.map((t, i) => (
				<FilterTagDisplay
					key={`tag-${i}-${t.tag}`}
					tagFilters={tagFilters}
					userTag={t}
					setTagFilters={setTagFilters}
					updatePath={updateSearchParam}
				/>
			))}
			{!isPending && tagFilters.length > 0 && (
				<Button
					onClick={() => removeSearchParam()}
					className="h-6 px-2 py-1 text-sm font-bold text-neutral-100 hover:cursor-pointer hover:bg-neutral-700 hover:text-neutral-300"
				>
					Clear
				</Button>
			)}
			{isPending && <LoadingSpinner variant={"regular"} />}
		</div>
	);
}
