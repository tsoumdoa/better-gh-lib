import Header from "../components/header";
import { HydrateClient } from "@/trpc/server";
import GhXmlStudio from "./components/ghcoder-main";

export default async function GhCoder() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-black p-4 font-sans text-white md:p-6">
        <Header />
        <div className="flex flex-col items-center justify-center gap-y-4">
          <GhXmlStudio />
        </div>
      </div>
    </HydrateClient>
  );
}
