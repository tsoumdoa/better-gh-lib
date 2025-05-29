"use client";
import { useValidateUid } from "../hooks/use-validate-uid";
import GhShareCard from "./share-card";

export default function ShareView() {
  const { isValidUid, uidRef } = useValidateUid();

  if (!isValidUid) {
    return <div>Loading...</div>;
  }

  if (isValidUid) {
    return (
      <div className="flex w-full max-w-xl px-2">
        {uidRef.current && <GhShareCard uid={uidRef.current} />}
      </div>
    );
  }
}
