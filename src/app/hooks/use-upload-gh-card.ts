import { useState, useRef } from "react";
import { compress } from "@/server/api/routers/util/gzip";
import { api } from "@/trpc/react";
import { uploadToR2 } from "../utils/upload-to-r2";
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
      setAdding(false);
      setOpen(false);
    },
  });

  const { mutate: getPutPresignedUrl } =
    api.post.getPutPresignedUrl.useMutation({
      onSuccess: async (data) => {
        const d = data.data;
        uploadToR2(d?.presignedUrl || "", gzipRef.current!).then((res) => {
          if (res === true) {
            setUploadSuccess(true);
          }
        });
        mutateDb(d?.id ?? "");
        if (!data?.ok && data?.error === "FILE_SIZE_TOO_BIG") {
          setAddError("FILE_SIZE_TOO_BIG, max 1.5mb");
        }
      },
      onError: (err) => {
        setUploading(false);
        setAddError(err.message);
      },
    });

  const { mutate: generateJwtToken } = api.post.generateJwtToken.useMutation({
    onSuccess: (data) => {
      if (data.result === "error") {
        // only error expceted here is file size too big
        setAddError(data.error ?? "");
      }
      if (data.result === "ok") {
        const jwt = data.token;
        console.log(jwt);
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
    getPutPresignedUrl({ size });
    generateJwtToken({ size });
  };

  return {
    uploading,
    uploadSuccess,
    uploadGhCard,
  };
}
