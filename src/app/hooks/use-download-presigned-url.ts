import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

export function useDownloadPresignedUrl(bucketId: string) {
  const [presignedUrl, setPresignedUrl] = useState("");
  const { refetch, data, isSuccess } = api.post.getPresignedUrl.useQuery(
    { bucketId: bucketId },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      setPresignedUrl(data);
    }
  }, [isSuccess, data]);

  return {
    presignedUrl,
    refetch,
    isSuccess,
  };
}
