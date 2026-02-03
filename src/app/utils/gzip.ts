import pako from "pako";

export const compress = (data: string) => {
	const gziped = pako.gzip(data);
	return gziped as Uint8Array<ArrayBuffer>;
};

export const decompress = async (data: ArrayBuffer): Promise<Uint8Array> => {
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
