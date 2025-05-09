import { useEffect, useRef, useState } from "react";

export const useSyncedScroll = () => {
  const [enableSync, setEnableSync] = useState(false);
  const textarea1Ref = useRef<HTMLTextAreaElement>(null);
  const textarea2Ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!enableSync) {
      return;
    }

    const textarea1 = textarea1Ref.current;
    const textarea2 = textarea2Ref.current;

    if (!textarea1 || !textarea2) {
      return;
    }

    const abortController = new AbortController();
    const signal = abortController.signal;

    const syncScroll = (
      scrolledElement: HTMLTextAreaElement,
      elementToScroll: HTMLTextAreaElement
    ) => {
      elementToScroll.scrollTop = scrolledElement.scrollTop;
      elementToScroll.scrollLeft = scrolledElement.scrollLeft;
    };

    const handleScroll1 = () => {
      syncScroll(textarea1, textarea2);
    };

    const handleScroll2 = () => {
      syncScroll(textarea2, textarea1);
    };

    textarea1.addEventListener("scroll", handleScroll1, { signal });
    textarea2.addEventListener("scroll", handleScroll2, { signal });

    return () => {
      abortController.abort();
    };
  }, [enableSync]);

  return { textarea1Ref, textarea2Ref, setEnableSync, enableSync };
};
