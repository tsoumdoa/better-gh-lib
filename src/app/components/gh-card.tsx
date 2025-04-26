"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";

//todo find better place for this zod schema
const GhCard = z.object({
  name: z.string().min(3).max(30),
  description: z.string().max(150),
});

function InvalidValueDialog(props: { open: boolean; setOpen: () => void }) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Invalid Input</AlertDialogTitle>
          <AlertDialogDescription>
            Name must be between 3 and 30 characters long and in PascalCase.
            Description must be between 1 and 150 characters long.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function GHCard(props: {
  id: number;
  name: string;
  description: string;
}) {
  const [editMode, setEditMode] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [ghInfo, setGhInfo] = useState({
    name: props.name,
    description: props.description,
  });

  const updateData = api.post.edit.useMutation({
    onSuccess: async () => {
      setUpdating(false);
    },
    onMutate: async () => {
      setUpdating(true);
    },
    onError: async () => {
      //rollback
      setGhInfo({ name: props.name, description: props.description });
      // console.log(err);
    },
  });

  const handleEditMode = () => {
    if (editMode) {
      try {
        GhCard.parse(ghInfo);
      } catch (err) {
        console.log(err);
        setInvalidInput(true);
        return;
      }
      updateData.mutate({
        id: props.id,
        name: ghInfo.name,
        description: ghInfo.description,
      });
    }
    setEditMode(!editMode);
  };

  const cancelEditMode = () => {
    setEditMode(false);
    setGhInfo({
      name: props.name,
      description: props.description,
    });
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-md p-3 ring-1 ring-neutral-500 ${editMode || updating ? "bg-neutral-500" : "bg-neutral-900"}`}
    >
      <InvalidValueDialog
        open={invalidInput}
        setOpen={() => setInvalidInput(false)}
      />
      <div>
        <p
          className={` ${editMode ? "text-neutral-900" : "text-neutral-500"} `}
        >
          Name
        </p>
        <div
          className={`pb-1 text-lg ${editMode ? "" : "font-semibold"} transition-all`}
        >
          {editMode ? (
            <div>
              <Input
                type="name"
                placeholder="NameOfGhCardInPascalCase"
                className="font-semibold"
                defaultValue={ghInfo.name}
                onChange={(e) => setGhInfo({ ...ghInfo, name: e.target.value })}
              />
              <p className="text-right text-xs text-neutral-100">
                {ghInfo.name.length || 0} / 30 characters
              </p>
            </div>
          ) : (
            ghInfo.name
          )}
        </div>
        <p
          className={` ${editMode ? "text-neutral-900" : "text-neutral-500"} `}
        >
          Description
        </p>
        <div className="h-auto text-neutral-100">
          {editMode ? (
            <div className="space-y-1">
              <Textarea
                placeholder="Type your message here."
                defaultValue={ghInfo.description}
                onChange={(e) =>
                  setGhInfo({ ...ghInfo, description: e.target.value })
                }
              />
              <p className="text-right text-xs text-neutral-100">
                {ghInfo.description?.length || 0} / 300 characters
              </p>
            </div>
          ) : (
            ghInfo.description
          )}
        </div>
      </div>
      <div className="flex items-center justify-end text-neutral-400 transition-all">
        <button
          className={`px-2 font-bold hover:text-neutral-50 ${!editMode ? "" : "hidden"}`}
        >
          copy
        </button>
        <button
          className={`px-2 font-bold hover:text-neutral-50 ${!editMode ? "" : "hidden"}`}
        >
          share
        </button>
        <button
          className={`px-2 font-bold hover:text-neutral-50 ${editMode ? "" : "hidden"}`}
          onClick={() => cancelEditMode()}
        >
          cancel
        </button>
        <button
          className={`px-2 font-bold hover:text-neutral-50 ${editMode ? "" : ""}`}
          onClick={() => handleEditMode()}
        >
          {editMode ? "done" : "edit"}
        </button>
      </div>
    </div>
  );
}
