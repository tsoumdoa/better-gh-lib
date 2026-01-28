import pako from "pako";

export const compress = (data: string) => {
	const gziped = pako.gzip(data);
	return gziped as Uint8Array<ArrayBuffer>;
};

export const decompress = (data: pako.Data) => {
	const decompressed = pako.ungzip(data);
	return decompressed;
};
