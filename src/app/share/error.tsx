"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Header from "../components/header";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  // reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 800);
  }, [error, router]);
  return (
    <div className="flex min-h-screen flex-col bg-black p-4 font-sans text-white md:p-6">
      <Header />
      <div className="flex h-full w-full flex-grow flex-col items-center justify-center p-4 pb-[72px]">
        Something went wrong! Redirecting...
      </div>
    </div>
  );
}
