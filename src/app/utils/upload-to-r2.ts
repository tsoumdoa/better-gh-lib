import { Effect } from "effect";
import { env } from "@/env";

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

const postToWorker = (url: string, gziped: Uint8Array, token: string) =>
  Effect.tryPromise({
    try: () => {
      const size = gziped.length;
      return fetch(url, {
        method: "POST",
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

export async function uploadViaWorker(
  gziped: Uint8Array<ArrayBufferLike>,
  token: string
) {
  const workerUrl = env.NEXT_PUBLIC_CF_WORKER;
  const res = await Effect.runPromiseExit(
    postToWorker(workerUrl, gziped, token)
  );
  if (res._tag === "Success") {
    return true;
  } else if (res._tag === "Failure") {
    if (res.cause instanceof UploadToR2Error) {
      return false;
    }
  }
}
