import { useMutation } from "@tanstack/react-query";

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
      //browser will automatically decompress gzipped data
      const arrayBuffer = await res.arrayBuffer();
      const decoded = new TextDecoder().decode(arrayBuffer);
      return decoded;
    },
  });
  return { downloadData, decoded };
}
