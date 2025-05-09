import { api } from "@/trpc/react";
import { uploadToR2 } from "../utils/upload-to-r2";
import { useEffect, useRef, useState } from "react";

export function useUploadToR2() {
  const xmlRef = useRef<null | string>(null);
  const [uploading, setUploading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const {
    isSuccess,
    data,
    refetch: runUpload,
    isError,
  } = api.post.getPutPresignedUrl.useQuery(undefined, {
    enabled: false,
  });

  useEffect(() => {
    if (isError) {
      setUploading(false);
    }
    if (isSuccess && data) {
      setUploading(true);
      uploadToR2(data.presignedUrl, xmlRef.current!).then((res) => {
        if (res === true) {
          setUploadSuccess(true);
        }
        setUploading(false);
      });
    }
  }, [isSuccess, data, isError]);

  return { runUpload, uploading, uploadSuccess, data, xmlRef };
}
