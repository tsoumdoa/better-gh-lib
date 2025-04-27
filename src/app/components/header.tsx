import { Search, Circle } from "lucide-react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <Link className="text-2xl font-bold md:text-4xl" href="/">
        Better GH Library
      </Link>

      <div className="flex items-center gap-3">
        <div className="relative flex w-56 items-center overflow-hidden rounded-md bg-neutral-500 ring-1 ring-neutral-500">
          <Search className="absolute left-3 h-4 w-4 text-white" />
          <input
            type="text"
            placeholder="search"
            className="w-full border-none bg-transparent py-1.5 pl-9 text-sm outline-none"
          />
          <div className="bg-black px-2 py-1.5 text-sm text-white">#K</div>
        </div>

        <SignedOut>
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
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
