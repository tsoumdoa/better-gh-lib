import { useState, useRef, useEffect } from "react";
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
  const {
    isSuccess,
    data,
    mutate: getPutPresignedUrl,
    isError,
  } = api.post.getPutPresignedUrl.useMutation({
    onSuccess: async (data) => {
      writeToDb({
        name: cardData.current?.name!,
        description: cardData.current?.description!,
        tags: cardData.current?.tags!,
        nanoid: data.data?.id!,
      });
    },
  });

  useEffect(() => {
    if (isError) {
      setUploading(false);
    }
    if (!data?.ok && data?.error === "FILE_SIZE_TOO_BIG") {
      setUploading(false);
      setUploadSuccess(false);
      setAddError("FILE_SIZE_TOO_BIG, max 1.5mb");
    }
    if (isSuccess && data.ok && data.data) {
      setUploading(true);
      const d = data.data;
      uploadToR2(d.presignedUrl, gzipRef.current!).then((res) => {
        if (res === true) {
          setUploadSuccess(true);
        }
        setUploading(false);
      });
    }
  }, [isSuccess, data, isError, setAddError]);

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
  };

  return {
    uploading,
    uploadSuccess,
    uploadGhCard,
  };
}
