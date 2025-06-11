import Header from "../components/header";
import { HydrateClient } from "@/trpc/server";
import GhXmlValidator from "./components/gh-xml-validator";

export default async function GhViewer() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-black p-4 font-sans text-white md:p-6">
        <div className="mx-auto max-w-7xl">
          <Header />
          <div className="flex flex-col items-center justify-center gap-y-2">
            <h1 className="text-2xl font-bold">GhJsonViewer</h1>
            <p className="max-w-2xl pb-3 text-center text-neutral-400">
              Use this tool to check that schema can parse json from xml and
              then build xml from json. Paste your XML script below to validate
              it.
            </p>
            <GhXmlValidator />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
