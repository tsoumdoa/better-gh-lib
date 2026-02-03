import { ShareLinkUidSchema } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import {
	useRouter,
	useSearchParams,
} from "next/dist/client/components/navigation";

export function useValidateShareToken() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const tokenRef = useRef(token);
	const [isValidToken, setIsValidToken] = useState(false);

	useEffect(() => {
		if (!token) {
			router.push("/");
			return;
		}
		const isValid = ShareLinkUidSchema.safeParse(token);
		if (!isValid.success) {
			router.push("/");
		} else {
			setIsValidToken(true);
			tokenRef.current = token as string;
		}
	}, [token, router]);

	return {
		isValidToken,
		tokenRef,
	};
}
