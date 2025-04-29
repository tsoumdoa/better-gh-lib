"use client";

import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { GhCardSchema } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function AddGhDialog(props: {
  open: boolean;
  setOpen: (b: boolean) => void;
  setAdding: (b: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  const postData = api.post.add.useMutation({
    onMutate: async () => {
      props.setAdding(true);
    },

    onSuccess: async () => {
      // this doesn't refersh cuz the content (DOM) is still the same..
      router.refresh();
      props.setAdding(false);
    },
    onError: async (err) => {
      //todo improve this, probably toast...?
      //or keep it on
      window.alert(err);
      props.setAdding(false);
    },
  });

  const handleSubmit = () => {
    //todo error hanlding, better UX for this...
    postData.mutate({
      name: name,
      description: description,
    });
  };

  useEffect(() => {
    try {
      GhCardSchema.parse({ name: name, description: description });
      setIsValid(true);
    } catch {
      setIsValid(false);
      return;
    }
  }, [name]);

  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent className="fixed top-1/2 left-1/2 z-50 flex h-1/2 w-2/5 max-w-120 -translate-x-1/2 -translate-y-1/2 transform flex-col justify-between rounded-md bg-neutral-900 p-4 text-white ring-1 ring-neutral-500">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Add a new card
          </AlertDialogTitle>
          <AlertDialogDescription>
            <a className="flex flex-col space-y-3">
              <Input
                placeholder="NameOfGhCardInPascalCase"
                className="font-semibold"
                maxLength={30}
                onChange={(e) => setName(e.target.value)}
              />
              <Textarea
                placeholder="Type your description here."
                maxLength={150}
                onChange={(e) => setDescription(e.target.value)}
              />
            </a>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="px-1 font-semibold hover:bg-neutral-800">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={`px-1 font-semibold ${!isValid ? "opacity-50" : "hover:bg-neutral-800"}`}
            onClick={() => handleSubmit()}
            disabled={!isValid}
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
      {open && (
        <div className="fixed top-0 left-0 z-40 flex h-full w-full items-center justify-center bg-black/80">
          <AddGhDialog
            open={open}
            setOpen={(b) => setOpen(b)}
            setAdding={(b) => setAdding(b)}
          />
        </div>
      )}
      {adding ? (
        <div>
          <div className="fixed top-0 left-0 z-40 flex h-full w-full items-center justify-center bg-black/80">
            Adding...
          </div>
        </div>
      ) : (
        <button
          className="rounded-md bg-black px-3 py-1 text-sm font-bold ring-2 ring-neutral-300 transition-all hover:translate-x-0.5 hover:translate-y-0.5"
          onClick={handleAddClick}
        >
          ADD
        </button>
      )}
    </div>
  );
}
