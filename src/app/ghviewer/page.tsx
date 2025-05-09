import Header from "../components/header";
import { HydrateClient } from "@/trpc/server";
import GhXmlValidator from "./components/gh-xml-validator";

export default async function GhViewer() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-black p-4 font-sans text-white md:p-6">
        <Header />
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold">GhViewer</h1>
          <p className="max-w-4xl pb-3 text-center text-neutral-400">
            Analyze and visualize your GitHub scripts with powerful analytics
            tools. Paste your XML script below to validate it.
          </p>
          <GhXmlValidator />
        </div>
      </div>
    </HydrateClient>
  );
}
