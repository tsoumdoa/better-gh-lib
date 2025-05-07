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
import { useXmlPaste } from "../hooks/use-xml-paste";
import AddXml from "./add-xml";

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
  const { refetch, uploading, uploadSuccess, xmlRef } = useUploadToR2(
    id.current
  );
  const postData = usePostAdd(
    setAddError,
    props.setAdding,
    props.setOpen,
    setPosted
  );
  const { xmlData, setXmlData, isValidXml, handlePasteFromClipboard } =
    useXmlPaste(setAddError);

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
    if (isValidXml && isValid && xmlData) {
      setAddError("");
      props.setAdding(true);
      xmlRef.current = xmlData;
      //this trigers useUpladToR2 to run
      refetch();
      setXmlData(undefined);
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setXmlData(undefined);
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
          </AlertDialogTitle>
          <AlertDialogDescription>
            {addError.length > 0 && (
              <strong className="text-red-500">
                Failed to add, try again. Cause: {addError}
              </strong>
            )}
          </AlertDialogDescription>

          <AlertDialog>
            <div className="flex flex-col space-y-3">
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
              <AddXml
                setAddError={setAddError}
                isValidXml={isValidXml}
                xmlData={xmlData!}
                setXmlData={setXmlData}
                handlePasteFromClipboard={handlePasteFromClipboard}
              />
            </div>
          </AlertDialog>
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
            disabled={!isValid || props.adding || xmlData === undefined}
            hidden={props.adding}
          >
            Add
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
