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
import { useValidateNameDescriptionAndTags } from "../hooks/use-validate-name-and-description";
import { useUploadToR2 } from "../hooks/use-upload-to-r2";
import { usePostAdd } from "../hooks/use-post-add";
import { useXmlPaste } from "../hooks/use-xml-paste";
import AddXml from "./add-xml";
import { compress } from "@/server/api/routers/util/gzip";
import { Button } from "@/components/ui/button";
import AddGhTagDisplay, { AvailableGhTagDisplay } from "./add-gh-tag-display";
import { api } from "@/trpc/react";

export function AddGhDialog(props: {
  open: boolean;
  setOpen: (b: boolean) => void;
  adding: boolean;
  setAdding: (b: boolean) => void;
}) {
  const [addError, setAddError] = useState("");
  const [posted, setPosted] = useState(false);
  const { data: userTags } = api.post.getUserTags.useQuery();
  const {
    name,
    setName,
    description,
    setDescription,
    isValid,
    tag,
    tags,
    setTag,
    setTags,
    handleAddTag,
    deleteTag,
    onTagValueChange,
    availableTags,
  } = useValidateNameDescriptionAndTags(setAddError, userTags ?? []);
  const { mutate, uploading, uploadSuccess, data, gzipRef } =
    useUploadToR2(setAddError);
  const postData = usePostAdd(
    setAddError,
    props.setAdding,
    props.setOpen,
    setPosted,
    setTags
  );
  const { xmlData, setXmlData, isValidXml, handlePasteFromClipboard } =
    useXmlPaste(setAddError, props.setAdding);

  //todo it breaks when r2 upload fails
  useEffect(() => {
    if (props.adding && !posted && data && !uploading && data.ok) {
      const id = data.data?.id || "";
      if (uploadSuccess && id.length > 0) {
        console.log("id", id);
        console.log("name", tags);
        postData.mutate({
          name: name,
          description: description,
          nanoid: id,
          tags: tags,
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
    tags,
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
    setTags([]);
    setTag("");
    setXmlData(undefined);
    props.setOpen(false);
  };

  return (
    <AlertDialog open={props.open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">
            {props.adding && addError.length === 0
              ? "Adding..."
              : "Add a new card"}
          </AlertDialogTitle>
          {addError.length > 0 && (
            <AlertDialogDescription>
              <strong className="text-red-500">
                Failed to add, try again. Cause: {addError}
              </strong>
            </AlertDialogDescription>
          )}

          <AlertDialog>
            <div className="flex flex-col space-y-3">
              <AddXml
                setAddError={setAddError}
                isValidXml={isValidXml}
                xmlData={xmlData!}
                setXmlData={setXmlData}
                handlePasteFromClipboard={handlePasteFromClipboard}
              />
              <div className="flex flex-col gap-y-1.5">
                <Input
                  type="text"
                  name="name"
                  placeholder="NameOfGhCardInPascalCase"
                  className="font-semibold"
                  maxLength={30}
                  onChange={(e) => setName(e.target.value)}
                  disabled={props.adding}
                  autoComplete="off"
                />
                <p className="w-full text-right text-xs text-wrap text-neutral-700">
                  {name.length || 0} / 30 characters
                </p>
              </div>
              <div className="flex flex-col gap-y-1.5">
                <Textarea
                  name="description"
                  placeholder="Type your description here."
                  maxLength={150}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={props.adding}
                  autoComplete="off"
                />
                <p className="text-right text-xs text-neutral-700">
                  {description.length || 0} / 300 characters
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag, i) => (
                  <AddGhTagDisplay
                    key={`tag-${i}-${tag}`}
                    tag={tag}
                    handleDeleteTag={deleteTag}
                  />
                ))}

                <div className="flex w-full max-w-3xs items-center gap-2">
                  <Input
                    type="text"
                    name="tag"
                    placeholder="Add a tag"
                    maxLength={20}
                    onChange={(e) => {
                      onTagValueChange(e.target.value);
                    }}
                    autoComplete="off"
                    disabled={props.adding}
                    value={tag}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && tag.length > 0) {
                        handleAddTag(tag);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    onClick={() => handleAddTag(tag)}
                  >
                    Add
                  </Button>
                </div>
              </div>
              {availableTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {availableTags.map((tag, i) => (
                    <AvailableGhTagDisplay
                      key={`availableTag-${i}-${tag}`}
                      tag={tag}
                      handleAddTag={handleAddTag}
                    />
                  ))}
                </div>
              )}
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
