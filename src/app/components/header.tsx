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
        Hopepr Clip
      </Link>

      <div className="flex items-center gap-3">
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
