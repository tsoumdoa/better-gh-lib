"use client";
import FilterTagDisplay from "./user-tag-display";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useTagFilters from "../hooks/use-tag-filters";
import { LoadingSpinner } from "./loading-spinner";
import { useQuery } from "convex/react";
import { api as convex } from "../../../../convex/_generated/api";

export default function UserTags(props: { tagFilters: string[] }) {
	const [hideFilter, setHideFilter] = useState(false);

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

	const filterOn = params.get("searchFilterOn");
	useEffect(() => {
		if (filterOn === "true") {
			setHideFilter(true);
		} else {
			setHideFilter(false);
		}

		const tagFilterIsStale = params.get("tagFilterIsStale");
		if (tagFilterIsStale === "true") {
			const newParams = new URLSearchParams(params);
			newParams.delete("tagFilterIsStale");
			startTransition(() => {
				replace(`${pathname}?${newParams.toString()}`);
			});
		}
	}, [pathname, replace, params, props.tagFilters]);

	const userTags = useQuery(convex.ghCard.getUserTags, {});

	if (hideFilter) return null;
	if (!userTags)
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
			{userTags.map((t, i) => (
				<FilterTagDisplay
					key={`tag-${i}-${t}`}
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
