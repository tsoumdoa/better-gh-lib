"use client";
import { useState } from "react";
import { api } from "@/trpc/react";
import { GhCardSchema } from "@/types";
import { InvalidValueDialog } from "./gh-card-dialog";
import { EditButtons, NameAndDescription, NormalButtons } from "./gh-card-body";
import { addNanoId } from "@/server/api/routers/util/ensureUniqueName";
import { useRouter } from "next/navigation";

export default function GHCard(props: {
  id: number;
  name: string;
  description: string;
}) {
  const [editMode, setEditMode] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [ghInfo, setGhInfo] = useState({
    name: props.name,
    description: props.description,
  });
  const router = useRouter();

  const updateData = api.post.edit.useMutation({
    onSuccess: async () => {
      setUpdating(false);
    },
    onMutate: async () => {
      setUpdating(true);
    },
    onError: async (err) => {
      console.log("hey", err.message);
      if (err.message === "AUTH_FAILED") {
        router.push("/");
      }
      setGhInfo({ name: props.name, description: props.description });
      if (err.message === "DUPLICATED_NAME") {
        const newName = addNanoId(ghInfo.name);
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
      setGhInfo({ name: props.name, description: props.description });
      setEditMode(false);
      setUpdating(false);
    },
  });

  const deletePost = () => {
    deleteData.mutate({
      id: props.id,
      name: props.name,
    });
  };

  const handleEditMode = () => {
    if (editMode) {
      try {
        GhCardSchema.parse(ghInfo);
      } catch (err) {
        console.log(err);
        setInvalidInput(true);
        return;
      }

      if (
        ghInfo.name === props.name &&
        ghInfo.description === props.description
      ) {
        setEditMode(false);
        return;
      }
    }
    //todo add error boundary...
    updateData.mutate({
      id: props.id,
      name: ghInfo.name,
      description: ghInfo.description,
    });
    setEditMode(!editMode);
  };

  if (deleted) {
    return (
      <div className="relative flex h-full w-full rounded-md bg-neutral-800 p-3 ring-1 ring-neutral-500">
        <NameAndDescription
          editMode={editMode}
          setEditMode={() => setEditMode(!editMode)}
          setGhInfo={setGhInfo}
          ghInfo={{ name: "deleted", description: "deleted" }}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col justify-between rounded-md p-3 ring-1 ring-neutral-500 ${editMode || updating ? "bg-neutral-500" : "bg-neutral-900"}`}
    >
      <InvalidValueDialog
        open={invalidInput}
        setOpen={() => setInvalidInput(false)}
      />
      <NameAndDescription
        editMode={editMode}
        setEditMode={() => setEditMode(!editMode)}
        setGhInfo={setGhInfo}
        ghInfo={ghInfo}
      />
      <div>
        {editMode ? (
          <EditButtons
            editMode={editMode}
            setEditMode={setEditMode}
            setGhInfo={setGhInfo}
            deletePost={() => deletePost()}
            handleEditMode={handleEditMode}
            ghInfo={ghInfo}
            name={props.name}
            description={props.description}
          />
        ) : (
          <NormalButtons
            editMode={editMode}
            setEditMode={() => setEditMode(!editMode)}
            handleEditMode={handleEditMode}
          />
        )}
      </div>
    </div>
  );
}
