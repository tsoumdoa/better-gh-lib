"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function SeedTestData() {
  const router = useRouter();
  const seedData = api.post.seed.useMutation({
    onSuccess: async (data) => {
      router.refresh();
    },
    onError: async (err) => {
      router.replace("/");
      console.log(err);
    },
  });

  const handleSeedClick = () => {
    seedData.mutate();
  };

  return (
    <button
      className="rounded-md bg-pink-500 px-3 py-1 text-sm font-bold ring-2 ring-neutral-300 transition-all hover:translate-x-0.5 hover:translate-y-0.5"
      onClick={handleSeedClick}
    >
      SEED
    </button>
  );
}
