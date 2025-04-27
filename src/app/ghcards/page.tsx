import { ChevronDown } from "lucide-react";
import SeedTestData from "../components/seed-test-data";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import GHCard from "../components/gh-card";
import Header from "../components/header";
import AddGHCard from "../components/add-gh-card";
import { auth } from "@clerk/nextjs/server";

async function MainCard() {
  "use server";
  const { userId, redirectToSignIn } = await auth();
  //todo this is where I left of
  if (!userId) return redirectToSignIn();
  console.log("userId", userId);
  const ghCards = await api.post.getAll();
  return (
    <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {ghCards.map((item, i: number) => (
        <GHCard
          key={i}
          id={item.id}
          name={item.name!.replaceAll(" ", "")}
          description={item.description!}
        />
      ))}
    </div>
  );
}

function MainCardSkeleton() {
  return (
    <div className="h-ful mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 15 }).map((_, i) => (
        <GHCard key={i} id={0} name={"Loading..."} description={"Loading..."} />
      ))}
    </div>
  );
}

export default async function Home() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-black p-4 font-sans text-white md:p-6">
        <Header />
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2 text-lg font-medium">
            <span>Tomo&apos;s</span>
            <span>&gt;</span>
            <span>Fav</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-1 text-sm ring-1 ring-neutral-500 transition-all">
              <span>sort by</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <AddGHCard />
            <SeedTestData />
          </div>
        </div>
        <Suspense fallback={<MainCardSkeleton />}>
          <MainCard />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
