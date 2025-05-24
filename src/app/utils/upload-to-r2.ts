import { Effect } from "effect";

class UploadToR2Error {
  readonly _tag = "UploadToR2Error";
}

const putToR2 = (url: string, gziped: Uint8Array) =>
  //this is bad btw, use the proper API from effect...
  Effect.tryPromise({
    try: () => {
      const size = gziped.length;
      console.log(size);
      return fetch(url, {
        method: "PUT",
        headers: {
          "Content-Encoding": "gzip",
          "Content-Type": "application/gzip",
          "Content-Length": size.toString(),
        },
        body: gziped,
      });
    },
    catch: () => new UploadToR2Error(),
  });

export async function uploadToR2(
  url: string,
  gziped: Uint8Array<ArrayBufferLike>
) {
  const res = await Effect.runPromiseExit(putToR2(url, gziped));
  if (res._tag === "Success") {
    return true;
  } else if (res._tag === "Failure") {
    if (res.cause instanceof UploadToR2Error) {
      return false;
    }
  }
  return false;
}
