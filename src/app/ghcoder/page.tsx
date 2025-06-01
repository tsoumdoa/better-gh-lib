import Header from "../components/header";
import { HydrateClient } from "@/trpc/server";
import GhCoder from "./components/ghcoder-main";

export default async function GhStudio() {
	return (
		<HydrateClient>
			<div className="min-h-screen bg-black p-4 font-sans text-white md:p-6">
				<Header />
				<div className="flex flex-col items-center justify-center gap-y-4">
					<h1 className="text-2xl font-bold">GhCoder</h1>
					<p className="mb-6 max-w-2xl text-center text-neutral-400">
						Get C# or Python code from GhXml
					</p>

					<GhCoder />
				</div>
			</div>
		</HydrateClient>
	);
}
