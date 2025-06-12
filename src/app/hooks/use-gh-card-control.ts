import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { GhCardSchema } from "@/types/types";
import { addNanoId } from "@/server/api/routers/util/ensureUniqueName";
import { useRouter } from "next/navigation";
import { Posts } from "@/server/db/schema";

export default function useGhCardControl(cardInfo: Posts, id: number) {
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [ghInfo, setGhInfo] = useState({
    name: cardInfo.name,
    description: cardInfo.description,
  });
  const [shareExpired, setShareExpired] = useState(false);

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
      setGhInfo(ctx);
      router.refresh();
    },
    onMutate: async () => {
      setUpdating(true);
    },
    onError: async (err) => {
      console.log("hey", err.message);
      if (err.message === "AUTH_FAILED") {
        router.push("/");
      }
      setGhInfo({
        name: cardInfo.name,
        description: cardInfo.description,
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
      });

      await new Promise((r) => setTimeout(r, 1200));
      setGhInfo({
        name: cardInfo.name,
        description: cardInfo.description,
      });
    },
  });

  const deletePost = () => {
    deleteData.mutate({
      id: id,
      name: cardInfo.name!,
      bucketId: cardInfo.bucketUrl!,
    });
  };

  const handleEdit = (submit: boolean) => {
    if (editMode) {
      try {
        GhCardSchema.parse(ghInfo);
      } catch (err) {
        console.log(err);
        setInvalidInput(true);
        return;
      }

      if (
        ghInfo.name === cardInfo.name &&
        ghInfo.description === cardInfo.description
      ) {
        setEditMode(false);
        return;
      }
    }
    if (submit) {
      //todo add error boundary...
      updateData.mutate({
        id: id,
        name: ghInfo.name!,
        prevName: cardInfo.name!,
        description: ghInfo.description!,
      });
    }
    setEditMode(!editMode);
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
  };
}
