import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export default function Header() {
	return (
        <header className="flex w-full items-center justify-between pb-8">
            <Link className="text-2xl font-bold md:text-4xl" href="/">
				Hopper Clip
			</Link>
            <div className="flex items-center gap-3">
				<Show when="signed-out">
					<SignInButton>
						<button className="flex h-8 w-20 items-center justify-center rounded-full border-2 border-white bg-black font-semibold transition-all hover:bg-neutral-400">
							Sign in
						</button>
					</SignInButton>

					<SignUpButton>
						<button className="flex h-8 w-20 items-center justify-center rounded-full border-2 border-white bg-black font-semibold transition-all hover:bg-neutral-400">
							Sign up
						</button>
					</SignUpButton>
				</Show>
				<Show when="signed-in">
					<UserButton />
				</Show>
			</div>
        </header>
    );
}
