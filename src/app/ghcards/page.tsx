import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import GHCard from "../components/gh-card";
import Header from "../components/header";
import AddGHCard from "../components/add-gh-card";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GhCardDisplay from "./components/gh-card-display";
import SortDropDown from "./components/sort-drop-down";
import { SortOrder, SORT_ORDERS } from "@/types/types";
import UserTags from "./components/user-tags";
import { FilterHint } from "./components/filter-hint";

async function MainCard(props: { sortKey: SortOrder; tagFilters: string[] }) {
	try {
		const ghCards = await api.post.getAll({ sortOrder: props.sortKey });
		if (props.tagFilters.length > 0) {
			const filtered = ghCards?.filter((card) => {
				for (const tag of props.tagFilters) {
					if (card.tags?.includes(tag)) {
						return true;
					}
				}
			});
			return <GhCardDisplay ghCards={filtered} tagFilters={props.tagFilters} />;
		}
		return <GhCardDisplay ghCards={ghCards} />;
	} catch (err: unknown) {
		if (err instanceof Error) {
			if (err.message === "UNAUTHORIZED") {
				redirect("/");
			}
		}
	}
}

function MainCardSkeleton() {
	return (
		<div className="h-ful mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
			{Array.from({ length: 12 }).map((_, i) => (
				<GHCard
					key={i}
					id={0}
					cardInfo={{
						name: "Loading...",
						description: "Loading...",
						bucketUrl: "",
						clerkUserId: "",
						isPublicShared: false,
						publicShareExpiryDate: "",
						dateCreated: "",
						dateUpdated: "",
					}}
				/>
			))}
		</div>
	);
}

export default async function Home(props: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	//check it is a user
	const { userId, redirectToSignIn } = await auth();
	if (!userId) return redirectToSignIn();

	//validate sort order search param
	const searchParams = await props.searchParams;
	const sortParam = searchParams.sort ?? "ascLastEdited";
	let sortKey: SortOrder = "ascLastEdited";
	if (Array.isArray(sortParam)) {
		redirect(`/ghcards`);
	} else sortKey = sortParam as SortOrder;
	const isValidSortKey = SORT_ORDERS.map((item) => item.value).includes(
		sortKey
	);

	const tagFilterParam = searchParams.tagFilter ?? [];
	let sanitizedTagFilter: string[] = [];
	if (Array.isArray(tagFilterParam)) {
		sanitizedTagFilter = tagFilterParam;
	} else sanitizedTagFilter = tagFilterParam.split(",");

	if (!isValidSortKey) {
		redirect("/ghcards");
	}

	//get user info
	const user = await currentUser();
	const username = user?.username || user?.firstName || "User";

	return (
		<HydrateClient>
			<div className="min-h-screen bg-black p-4 font-sans text-white md:p-6">
				<div className="mx-auto max-w-[100rem]">
					<Header />
					<div className="flex flex-col items-start justify-between gap-2 pb-4 sm:flex-row sm:items-center sm:gap-4">
						<div className="flex items-center gap-2 text-lg font-medium">
							<span>{`${username}'s Fav`}</span>
						</div>
						<div className="flex items-center gap-4">
							<FilterHint />
							<SortDropDown />
							<AddGHCard />
						</div>
					</div>
					<div className="flex flex-row flex-wrap items-start justify-start gap-2 pb-4">
						<UserTags tagFilters={sanitizedTagFilter} />
					</div>
					<Suspense fallback={<MainCardSkeleton />}>
						<MainCard sortKey={sortKey} tagFilters={sanitizedTagFilter} />
					</Suspense>
				</div>
			</div>
		</HydrateClient>
	);
}
