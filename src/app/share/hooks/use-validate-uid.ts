import { ShareLinkUidSchema } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/dist/client/components/navigation";

export function useValidateUid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const uidRef = useRef(uid);
  const [isValidUid, setIsValidUid] = useState(false);

  useEffect(() => {
    if (!uid) {
      router.push("/");
    }
    const isValid = ShareLinkUidSchema.safeParse(uid);
    if (!isValid.success) {
      router.push("/");
    } else {
      setIsValidUid(true);
      uidRef.current = uid as string;
    }
  }, [uid, router]);

  return {
    isValidUid,
    uidRef,
  };
}
