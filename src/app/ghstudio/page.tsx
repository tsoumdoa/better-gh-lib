import Header from "../components/header";
import { HydrateClient } from "@/trpc/server";

export default async function GhStudio() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-black p-4 font-sans text-white md:p-6">
        <Header />
        <div className="flex flex-col items-center justify-center gap-y-4">
          <h1 className="text-2xl font-bold">GhStudio</h1>
          <p className="text-neutral-400">
            Run linting, formatting, and custom rules to maintain code quality.
          </p>
          <div className="mt-8 text-center text-neutral-500">
            Coming soon...
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
