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
import { useEffect, useState } from "react";
import { useValidateNameAndDescription } from "../hooks/use-validate-name-and-description";
import { useUploadToR2 } from "../hooks/use-upload-to-r2";
import { usePostAdd } from "../hooks/use-post-add";
import { useXmlPaste } from "../hooks/use-xml-paste";
import AddXml from "./add-xml";
import { compress } from "@/server/api/routers/util/gzip";

export function AddGhDialog(props: {
  open: boolean;
  setOpen: (b: boolean) => void;
  adding: boolean;
  setAdding: (b: boolean) => void;
}) {
  const [addError, setAddError] = useState("");
  const [posted, setPosted] = useState(false);
  const { name, setName, description, setDescription, isValid } =
    useValidateNameAndDescription();
  const { mutate, uploading, uploadSuccess, data, gzipRef } =
    useUploadToR2(setAddError);
  const postData = usePostAdd(
    setAddError,
    props.setAdding,
    props.setOpen,
    setPosted
  );
  const { xmlData, setXmlData, isValidXml, handlePasteFromClipboard } =
    useXmlPaste(setAddError, props.setAdding);

  //todo it breaks when r2 upload fails
  useEffect(() => {
    if (props.adding && !posted && data && !uploading && data.ok) {
      const id = data.data?.id || "";
      if (uploadSuccess && id.length > 0) {
        postData.mutate({
          name: name,
          description: description,
          nanoid: id,
        });
        setPosted(true);
      } else if (!uploading) {
        setAddError("Failed to upload to R2");
        props.setAdding(false);
      }
    }
  }, [
    uploadSuccess,
    name,
    description,
    postData,
    props,
    posted,
    uploading,
    data,
  ]);

  const handleSubmit = async () => {
    if (isValidXml && isValid && xmlData) {
      setAddError("");
      props.setAdding(true);

      const gziped = compress(xmlData);
      gzipRef.current = gziped;
      const size = gzipRef.current.length;
      //this trigers useUpladToR2 to run
      mutate({ size });
      setXmlData(undefined);
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setAddError("");
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
            onClick={() => handleCancel()}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleSubmit()}
            disabled={!isValid || props.adding || xmlData === undefined}
          >
            Add
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
