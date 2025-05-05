import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useRef, useState } from "react";
import { useValidateNameAndDescription } from "../hooks/use-validate-name-and-description";
import { nanoid } from "nanoid";
import { useUploadToR2 } from "../hooks/use-upload-to-r2";
import { usePostAdd } from "../hooks/use-post-add";

export function AddGhDialog(props: {
  open: boolean;
  setOpen: (b: boolean) => void;
  adding: boolean;
  setAdding: (b: boolean) => void;
}) {
  const id = useRef(nanoid());
  const [addError, setAddError] = useState("");
  const [posted, setPosted] = useState(false);
  const { name, setName, description, setDescription, isValid } =
    useValidateNameAndDescription();
  const { refetch, uploading, uploadSuccess } = useUploadToR2(id.current);
  const postData = usePostAdd(
    setAddError,
    props.setAdding,
    props.setOpen,
    setPosted
  );

  //probably convoluted way to do this, but it works...
  useEffect(() => {
    if (props.adding && !posted) {
      if (uploadSuccess) {
        postData.mutate({
          name: name,
          description: description,
          nanoid: id.current,
        });
        setPosted(true);
      } else if (!uploading) {
        setAddError("Failed to upload to R2");
        props.setAdding(false);
      }
    }
  }, [uploadSuccess, name, description, postData, props, posted, uploading]);

  const handleSubmit = async () => {
    setAddError("");
    props.setAdding(true);
    //this trigers useUpladToR2 to run
    refetch();
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    props.setOpen(false);
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
          <AlertDialogCancel
            disabled={props.adding}
            hidden={props.adding}
            onClick={() => handleCancel()}
          >
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
