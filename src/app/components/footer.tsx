import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto h-fit w-full pt-4 md:h-5 md:pt-0">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <nav className="flex gap-x-2">
          <Link
            href="/privacy"
            className="text-xs text-neutral-600 hover:text-neutral-700"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-xs text-neutral-600 hover:text-neutral-700"
          >
            Term of Service
          </Link>
        </nav>
        <div className="text-xs text-neutral-600">
          © {new Date().getFullYear()} HopperClip. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
