import Header from "../components/header";
import { HydrateClient } from "@/trpc/server";
import GhXmlStudio from "./components/studio-main";

export default async function GhStudio() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-black p-4 font-sans text-white md:p-6">
        <div className="mx-auto max-w-[100rem]">
          <Header />
          <div className="flex flex-col items-center justify-center gap-y-4">
            <h1 className="text-2xl font-bold">GhStudio</h1>
            <p className="mb-6 max-w-2xl text-center text-neutral-400">
              Run linting, formatting, and custom rules to maintain code
              quality. Paste your GhXML script below to analyze it.
            </p>

            <GhXmlStudio />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
