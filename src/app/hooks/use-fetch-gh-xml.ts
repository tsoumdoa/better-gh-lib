import { useMutation } from "@tanstack/react-query";

const decompress = async (data: ArrayBuffer): Promise<Uint8Array> => {
	//check if it's already decompressed
	const view = new Uint8Array(data);
	const isGzipped = view[0] === 0x1f && view[1] === 0x8b;
	if (!isGzipped) {
		return view;
	}

	const stream = new Response(data).body!.pipeThrough(
		new DecompressionStream("gzip")
	);
	const decompressed = await new Response(stream).arrayBuffer();
	return new Uint8Array(decompressed);
};

export function useFetchGhXml() {
	const { mutateAsync: downloadData, data: decoded } = useMutation({
		mutationFn: async (url: string) => {
			const res = await fetch(url, {
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
	return { downloadData, decoded };
}
