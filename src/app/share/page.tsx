import Header from "../components/header";
import { HydrateClient } from "@/trpc/server";
import ShareView from "./components/share-view";
import { Suspense } from "react";

export default async function GhStudio() {
  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col bg-black p-4 font-sans text-white md:p-6">
        <div className="mx-auto w-full max-w-[100rem]">
          <Header />
        </div>
        <div className="flex h-full w-full flex-grow flex-col items-center justify-center p-4 pb-[72px]">
          <Suspense fallback={<div>Loading...</div>}>
            <ShareView />
          </Suspense>
        </div>
      </div>
    </HydrateClient>
  );
}
