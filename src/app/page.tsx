import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "./components/header";
import Footer from "./components/footer";
import { ArrowRight } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";

export default async function Home() {
	const { userId } = await auth();

	if (userId) {
		redirect("/ghcards");
	}

	return (
		<div className="min-h-screen bg-black font-sans text-white">
			<div className="mx-auto flex min-h-screen max-w-400 flex-col p-4 md:px-6 md:pt-6 md:pb-2">
				<Header />
				<LandingPageContent />
				<Footer />
			</div>
		</div>
	);
}

function LandingPageContent() {
	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center py-12 md:py-20">
			<div className="flex flex-col items-center gap-8 text-center">
				<h1 className="text-4xl font-bold md:text-6xl">
					A lightning-fast pastebin for your Grasshopper logic
				</h1>
				<p className="text-lg text-neutral-400 md:text-xl">
					The quiet, ever-ready shelf for your Grasshopper ideas. Drop a script,
					grab a link, share the magic—no clutter, no fuss.
				</p>
				<SignUpButton>
					<button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-neutral-200 md:text-base">
						Get Started Free
						<ArrowRight className="h-4 w-4" />
					</button>
				</SignUpButton>
				<div className="grid w-full grid-cols-1 gap-6 pt-8 md:grid-cols-3">
					<FeatureCard
						title="Organize"
						description="Keep your Grasshopper scripts organized in one place. Tag, categorize, and find them instantly."
					/>
					<FeatureCard
						title="Share"
						description="Share your scripts with others. Generate shareable links with optional expiration dates."
					/>
					<FeatureCard
						title="Access Anywhere"
						description="Access your script library from any device. Your scripts are always just a click away."
					/>
				</div>
			</div>
		</div>
	);
}

function FeatureCard(props: { title: string; description: string }) {
	return (
		<div className="flex flex-col rounded-md bg-neutral-900 p-6 ring-1 ring-neutral-500">
			<h2 className="pb-2 text-xl font-bold">{props.title}</h2>
			<p className="text-neutral-400">{props.description}</p>
		</div>
	);
}
