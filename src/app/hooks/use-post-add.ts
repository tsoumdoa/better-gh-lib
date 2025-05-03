import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export function usePostAdd(
  setAddError: (err: string) => void,
  setAdding: (b: boolean) => void,
  setOpen: (b: boolean) => void
) {
  const router = useRouter();

  const postData = api.post.add.useMutation({
    onSuccess: async () => {
      router.refresh();
      setOpen(false);
      setAdding(false);
    },

    onError: async (err) => {
      setAddError(err.message);
      setAdding(false);
    },
  });
  return postData;
}
