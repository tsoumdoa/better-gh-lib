import { ChevronDown } from "lucide-react";
import Header from "./components/header";
import { HydrateClient } from "@/trpc/server";
import Link from "next/link";

function FeatureCard(props: {
  title: string;
  description: string;
  go: string;
  href: string;
}) {
  return (
    <Link
      href={props.href}
      className="flex flex-col justify-between rounded-md bg-neutral-900 p-6 ring-1 ring-neutral-500 transition-all hover:bg-neutral-800"
    >
      <div>
        <h2 className="mb-2 text-xl font-bold">{props.title}</h2>
        <p className="text-neutral-400">{props.description}</p>
      </div>
      <div className="mt-4 flex items-center text-sm text-neutral-400">
        <span>Get started - {props.go}</span>
        <ChevronDown className="ml-1 h-4 w-4 rotate-[-90deg]" />
      </div>
    </Link>
  );
}

export default async function Home() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-black p-4 font-sans text-white md:p-6">
        <Header />
        <div className="flex flex-col gap-y-3">
          <h1 className="text-center text-2xl font-bold">
            Welcome to Hopepr Clip!
          </h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="GhCard"
              description="Explore and manage your script library with an intuitive card-based interface."
              href="/ghcards"
              go="MVP, use it at your own risk"
            />
            <FeatureCard
              title="GhJsonViewer"
              description="Validate GhXml data and see how they get parsed and validated to JSON."
              href="/ghviewer"
              go="Works locally, no sign in required"
            />
            <FeatureCard
              title="GhStudio"
              description="Run linting, formatting, and custom rules to maintain code quality."
              href="/ghstudio"
              go="Nothing to see here yet"
            />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
