import { compress } from "@/server/api/routers/util/gzip";
import { Effect } from "effect";

class UploadToR2Error {
  readonly _tag = "UploadToR2Error";
}

const putToR2 = (url: string, gziped: Uint8Array) =>
  Effect.tryPromise({
    try: () => {
      return fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/gzip",
        },
        body: gziped,
      });
    },
    catch: () => new UploadToR2Error(),
  });

export async function uploadToR2(url: string, xml: string) {
  const gziped = compress(xml);
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
