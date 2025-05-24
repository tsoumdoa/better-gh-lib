import { api } from "@/trpc/react";
import { uploadToR2 } from "../utils/upload-to-r2";
import { useEffect, useRef, useState } from "react";

export function useUploadToR2(setAddError: (s: string) => void) {
  const gzipRef = useRef<null | Uint8Array<ArrayBufferLike>>(null);
  const [uploading, setUploading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { isSuccess, data, mutate, isError } =
    api.post.getPutPresignedUrl.useMutation();

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

  return { mutate, uploading, uploadSuccess, data, gzipRef };
}
