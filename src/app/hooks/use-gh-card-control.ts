import { useState, useEffect, useRef, startTransition, useMemo } from "react";
import { api } from "@/trpc/react";
import { GhCardSchema } from "@/types/types";
import { addNanoId } from "@/server/api/routers/util/ensureUniqueName";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Posts } from "@/server/db/schema";

export default function useGhCardControl(cardInfo: Posts, id: number) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const pathname = usePathname();
  const { replace } = useRouter();

  const [tag, setTag] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [ghInfo, setGhInfo] = useState({
    name: cardInfo.name,
    description: cardInfo.description,
    tags: cardInfo.tags ?? [],
  });
  const [reset, setReset] = useState(false);
  const [shareExpired, setShareExpired] = useState(false);
  const prevTags = useRef(cardInfo.tags ?? []);
  const newTags = useRef(cardInfo.tags ?? []);

  const { mutate: revokeLink } = api.post.revokeSharablePublicLink.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setShareExpired(false);
        router.refresh();
      }
    },
  });

  const publicShareExpiryDate = cardInfo.publicShareExpiryDate ?? "";
  const isShared = cardInfo.isPublicShared ?? false;
  const bucketId = cardInfo.bucketUrl ?? "";

  useEffect(() => {
    setShareExpired(false);
    const expiryDate = new Date(publicShareExpiryDate);
    if (isShared && new Date() < expiryDate) {
      setShareExpired(true);
    } else {
      if (bucketId !== "" && isShared) {
        revokeLink({ bucketId: bucketId });
      }
    }
  }, [publicShareExpiryDate, isShared, bucketId, revokeLink]);

  const updateData = api.post.edit.useMutation({
    onSuccess: async (ctx) => {
      setUpdating(false);
      //this is kinda bad, tags are from client, while the name and description are from the server
      setGhInfo({
        ...ctx,
        tags: newTags.current,
      });
      setTag("");
      router.refresh();
    },
    onMutate: async () => {
      setTag("");
      setUpdating(true);
    },
    onError: async (err) => {
      setTag("");
      console.log("hey", err.message);
      if (err.message === "AUTH_FAILED") {
        router.push("/");
      }
      setGhInfo({
        name: cardInfo.name,
        description: cardInfo.description,
        tags: cardInfo.tags ?? [],
      });
      if (err.message === "DUPLICATED_NAME") {
        const newName = addNanoId(ghInfo.name ?? "");
        setGhInfo({ ...ghInfo, name: newName });
      }
      setUpdating(false);
      setEditMode(true);
    },
  });

  const deleteData = api.post.delete.useMutation({
    onSuccess: async () => {
      setUpdating(false);
      setDeleted(true);
      setEditMode(false);
      setUpdating(false);
    },
    onMutate: async () => {
      setUpdating(true);
    },
    onError: async () => {
      //todo let user know the delete failed better...
      setUpdating(false);
      setEditMode(false);
      setGhInfo({
        name: "Failed to delete",
        description:
          "Failed to delete. Try again, or cancel and try again later",
        tags: cardInfo.tags ?? [],
      });

      await new Promise((r) => setTimeout(r, 1200));
      setGhInfo({
        name: cardInfo.name,
        description: cardInfo.description,
        tags: cardInfo.tags ?? [],
      });
    },
  });

  const handleCancelEditMode = () => {
    setReset(true);
    setEditMode(false);
    setTag("");
    setGhInfo({
      name: cardInfo.name,
      description: cardInfo.description,
      tags: cardInfo.tags ?? [],
    });
  };

  const deletePost = () => {
    setTag("");
    deleteData.mutate({
      id: id,
      name: cardInfo.name!,
      bucketId: cardInfo.bucketUrl!,
    });
    params.set("tagFilterIsStale", "true");
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleEdit = (submit: boolean) => {
    setReset(true);
    if (editMode) {
      try {
        GhCardSchema.parse(ghInfo);
      } catch (err) {
        console.log(err);
        setInvalidInput(true);
        return;
      }

      //don't run if the data are all the same
      if (
        ghInfo.name === cardInfo.name &&
        ghInfo.description === cardInfo.description &&
        newTags.current === prevTags.current
      ) {
        setEditMode(false);
        return;
      }
    }
    if (submit) {
      if (newTags.current === prevTags.current) {
        updateData.mutate({
          id: id,
          name: ghInfo.name!,
          prevName: cardInfo.name!,
          description: ghInfo.description!,
        });
      } else {
        updateData.mutate({
          id: id,
          name: ghInfo.name!,
          prevName: cardInfo.name!,
          description: ghInfo.description!,
          tags: newTags.current,
        });
      }
      params.set("tagFilterIsStale", "true");
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    }
    setEditMode(!editMode);
  };

  const removeTag = (tag: string, toBeRemoved: boolean) => {
    if (!toBeRemoved) {
      const filteredTags = prevTags.current.filter((t) => t !== tag);
      newTags.current = filteredTags;
    } else {
      newTags.current = [...prevTags.current, tag];
    }
  };

  const addTag = (t: string) => {
    const newTagSet = new Set([...ghInfo.tags, t]);
    const array = [...newTagSet];
    newTags.current = array;
    setGhInfo({ ...ghInfo, tags: array });
    setTag("");
  };

  return {
    editMode,
    setEditMode,
    handleEdit,
    deletePost,
    ghInfo,
    setGhInfo,
    invalidInput,
    setInvalidInput,
    updating,
    setUpdating,
    deleted,
    setDeleted,
    setShareExpired,
    shareExpired,
    removeTag,
    addTag,
    prevTags,
    handleCancelEditMode,
    tag,
    setTag,
    reset,
    setReset,
  };
}
