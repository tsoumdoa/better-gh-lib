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

async function MainCard(props: { sortKey: SortOrder }) {
  //if failed to get data, redirect to home
  try {
    const ghCards = await api.post.getAll({ sortOrder: props.sortKey });
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
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 text-lg font-medium">
              <span>{`${username}'s Fav`}</span>
            </div>
            <div className="flex items-center gap-4">
              <SortDropDown />
              <AddGHCard />
            </div>
          </div>
          <Suspense fallback={<MainCardSkeleton />}>
            <MainCard sortKey={sortKey} />
          </Suspense>
        </div>
      </div>
    </HydrateClient>
  );
}
