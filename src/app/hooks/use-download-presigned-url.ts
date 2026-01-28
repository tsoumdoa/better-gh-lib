import { api } from "@/trpc/react";

export function useDownloadPresignedUrl(bucketId: string) {
	const {
		refetch,
		data: presignedUrl,
		isSuccess,
	} = api.post.getPresignedUrl.useQuery(
		{ bucketId: bucketId },
		{
			enabled: false,
		}
	);

	return {
		presignedUrl,
		refetch,
		isSuccess,
	};
}
