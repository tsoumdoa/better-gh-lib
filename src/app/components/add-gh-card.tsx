"use client";

import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useValidateNameAndDescription } from "../hooks/use-validate-name-and-description";

function AddGhDialog(props: {
  open: boolean;
  setOpen: (b: boolean) => void;
  adding: boolean;
  setAdding: (b: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const isValid = useValidateNameAndDescription(name, description);
  const [addError, setAddError] = useState("");
  const router = useRouter();

  const postData = api.post.add.useMutation({
    onMutate: async () => {
      setAddError("");
      props.setAdding(true);
    },

    onSuccess: async () => {
      router.refresh();
      props.setOpen(false);
      props.setAdding(false);
    },

    onError: async (err) => {
      setAddError(err.message);
      props.setAdding(false);
    },
  });

  const handleSubmit = () => {
    postData.mutate({
      name: name,
      description: description,
    });
  };

  return (
    <AlertDialog open={props.open}>
      <AlertDialogContent className="">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">
            {props.adding && addError.length === 0
              ? "Adding..."
              : "Add a new card"}
            {addError.length > 0 && (
              <div className="text-red-500">
                Failed to add, try again. Cause: {addError}
              </div>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <a className="flex flex-col space-y-3">
              <Input
                placeholder="NameOfGhCardInPascalCase"
                className="font-semibold"
                maxLength={30}
                onChange={(e) => setName(e.target.value)}
                disabled={props.adding}
              />
              <Textarea
                placeholder="Type your description here."
                maxLength={150}
                onChange={(e) => setDescription(e.target.value)}
                disabled={props.adding}
              />
            </a>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={props.adding} hidden={props.adding}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleSubmit()}
            disabled={!isValid || props.adding}
            hidden={props.adding}
          >
            Add
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function AddGHCard() {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const handleAddClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <AddGhDialog
        open={open}
        setOpen={(b) => setOpen(b)}
        setAdding={(b) => setAdding(b)}
        adding={adding}
      />
      <button
        className="rounded-md bg-black px-3 py-1 text-sm font-bold ring-2 ring-neutral-300 transition-all hover:translate-x-0.5 hover:translate-y-0.5"
        onClick={handleAddClick}
      >
        {adding ? "Adding..." : "Add"}
      </button>
    </div>
  );
}
