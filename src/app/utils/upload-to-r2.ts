import { Effect } from "effect";
import { env } from "@/env";

class UploadToR2Error {
  readonly _tag = "UploadToR2Error";
}

const postToWorker = (url: string, gziped: Uint8Array, token: string) =>
  Effect.tryPromise({
    try: () => {
      const size = gziped.length;
      // const test = "http://localhost:8787";
      // return fetch(test, {
      return fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "content-encoding": "gzip",
          "content-type": "application/gzip",
          "content-length": size.toString(),
          authorization: `Bearer ${token}`,
        },
        body: gziped,
      });
    },
    catch: () => new UploadToR2Error(),
  });

export async function uploadViaWorker(
  gziped: Uint8Array<ArrayBufferLike>,
  token: string
) {
  const workerUrl = env.NEXT_PUBLIC_CF_WORKER;
  const res = await Effect.runPromiseExit(
    postToWorker(workerUrl, gziped, token)
  );
  console.log(res);
  if (res._tag === "Success") {
    return true;
  } else if (res._tag === "Failure") {
    if (res.cause instanceof UploadToR2Error) {
      return false;
    }
  }
}
