import { ChevronDown } from "lucide-react";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import GHCard from "../components/gh-card";
import Header from "../components/header";
import AddGHCard from "../components/add-gh-card";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GhCardDisplay from "./components/gh-card-display";
import SortDropDown from "./components/sort-drop-down";

async function MainCard() {
  "use server";
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  try {
    const ghCards = await api.post.getAll();
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
    <div className="h-ful mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 15 }).map((_, i) => (
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
          }}
        />
      ))}
    </div>
  );
}

export default async function Home() {
  const user = await currentUser();
  const username = user?.username || user?.firstName || "User";

  return (
    <HydrateClient>
      <div className="min-h-screen bg-black p-4 font-sans text-white md:p-6">
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
          <MainCard />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
