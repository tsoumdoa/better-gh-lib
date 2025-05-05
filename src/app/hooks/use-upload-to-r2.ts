import { api } from "@/trpc/react";
import { uploadToR2 } from "../utils/upload-to-r2";
import { useEffect, useState } from "react";

export function useUploadToR2(nanoId: string) {
  const [uploading, setUploading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { isSuccess, data, refetch, isError } =
    api.post.getPutPresignedUrl.useQuery(
      {
        nanoId: nanoId,
      },
      {
        enabled: false,
      }
    );

  useEffect(() => {
    if (isError) {
      setUploading(false);
    }
    if (isSuccess && data) {
      setUploading(true);
      uploadToR2(data).then((res) => {
        if (res === true) {
          setUploadSuccess(true);
        }
        setUploading(false);
      });
    }
  }, [isSuccess, data, isError]);

  return { refetch, uploading, uploadSuccess };
}
