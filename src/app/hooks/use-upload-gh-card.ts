import { useState, useRef } from "react";
import { compress } from "@/server/api/routers/util/gzip";
import { api } from "@/trpc/react";
import { uploadViaWorker } from "../utils/upload-to-r2";
import { useRouter } from "next/navigation";

export function useUploadGhCard(
  setAddError: (s: string) => void,
  setAdding: (b: boolean) => void,
  setOpen: (b: boolean) => void
) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const gzipRef = useRef<null | Uint8Array<ArrayBufferLike>>(null);
  const cardData = useRef<{
    name: string;
    description: string;
    tags: string[];
  }>(null);

  const { mutate: writeToDb } = api.post.add.useMutation({
    onSuccess: () => {
      router.refresh();
      setUploading(false);
      setAdding(false);
      setOpen(false);
    },
    onError: (err) => {
      console.log(err);
      setUploading(false);
      setAdding(false);
      setOpen(false);
    },
  });

  const { mutate: runUpload } = api.post.generateJwtToken.useMutation({
    onSuccess: (data) => {
      if (data.result === "error") {
        // only error expceted here is file size too big
        setAddError(data.error ?? "");
      }
      if (data.result === "ok") {
        setUploading(true);
        const jwt = data.token;
        uploadViaWorker(gzipRef.current!, jwt || "").then((res) => {
          if (res === true) {
            setUploadSuccess(true);
          }
        });
        mutateDb(data.id ?? "");
      }
    },
  });

  const mutateDb = async (id: string) => {
    writeToDb({
      name: cardData.current?.name ?? "",
      description: cardData.current?.description ?? "",
      tags: cardData.current?.tags ?? [],
      nanoid: id,
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
    const size = gzipRef.current.length;
    runUpload({ size });
  };

  return {
    // uploading,
    // uploadSuccess,
    uploadGhCard,
  };
}
