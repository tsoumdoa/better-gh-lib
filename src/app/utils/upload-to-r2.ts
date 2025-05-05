import { Effect } from "effect";

class UploadToR2Error {
  readonly _tag = "UploadToR2Error";
}

const putToR2 = (url: string) =>
  Effect.tryPromise({
    try: () => {
      return fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "test",
          description: "test",
          // name: name,
          // description: description,
        }),
      });
    },
    catch: () => new UploadToR2Error(),
  });

export async function uploadToR2(url: string) {
  const res = await Effect.runPromiseExit(putToR2(url));
  if (res._tag === "Success") {
    return true;
  } else if (res._tag === "Failure") {
    if (res.cause instanceof UploadToR2Error) {
      return false;
    }
  }

  return false;
}
