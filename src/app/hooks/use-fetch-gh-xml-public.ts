import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { decompress } from "../utils/gzip";

export function useFetchGhXmlPublic() {
	const decodedRef = useRef<string | undefined>(undefined);
	const { mutateAsync: downloadDataPublic } = useMutation({
		mutationFn: async (presignedUrl: string) => {
			const res = await fetch(presignedUrl, {
				cache: "no-store",
				headers: {
					"Content-Encoding": "gzip",
					"Content-Type": "application/gzip",
				},
			});
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			const blob = await res.blob();
			const uncompressed = await decompress(await blob.arrayBuffer());
			const decoded = new TextDecoder().decode(uncompressed);
			return decoded;
		},
	});
	return { downloadDataPublic, decodedRef };
}
