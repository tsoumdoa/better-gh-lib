import { useState, useRef } from "react";
import { compress } from "@/server/api/routers/util/gzip";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export function useUploadGhCard(
  setAddError: (s: string) => void,
  setAdding: (b: boolean) => void,
  setOpen: (b: boolean) => void
) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const gzipRef = useRef<null | Uint8Array<ArrayBuffer>>(null);
  const cardData = useRef<{
    name: string;
    description: string;
    tags: string[];
  }>(null);

  const { mutate: writeToDb } = api.post.add.useMutation({
    onSuccess: () => {
      router.refresh();
      setUploading(false);
      setUploadSuccess(true);
      setAdding(false);
      setOpen(false);
    },
    onError: (err) => {
      console.log(err);
      setUploading(false);
      setAdding(false);
      setOpen(false);
      setAddError(err.message);
    },
  });

  const mutateDb = async () => {
    writeToDb({
      name: cardData.current?.name ?? "",
      description: cardData.current?.description ?? "",
      tags: cardData.current?.tags ?? [],
      gziped: gzipRef.current!,
    });
  };

  const uploadGhCard = async (
    name: string,
    description: string,
    tags: string[],
    xml: string
  ) => {
    const gziped = compress(xml);
    gzipRef.current = gziped;
    cardData.current = { name, description, tags };
    await mutateDb();
  };

  return {
    uploading,
    uploadSuccess,
    uploadGhCard,
  };
}
