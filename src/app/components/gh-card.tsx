"use client";
import { InvalidValueDialog } from "./gh-card-dialog";
import { Posts } from "@/server/db/schema";
import { NormalButtons } from "./gh-card-normal-buttons";
import { EditButtons } from "./gh-card-edit-buttons";
import { NameAndDescription } from "./gh-card-body";
import useGhCardControl from "../hooks/use-gh-card-control";
import GhCardTags from "./gh-card-tags";

export default function GHCard(props: { id: number; cardInfo: Posts }) {
  const {
    editMode,
    handleEdit,
    deletePost,
    setGhInfo,
    invalidInput,
    setInvalidInput,
    updating,
    deleted,
    setEditMode,
    shareExpired,
  } = useGhCardControl(props.cardInfo, props.id);

  if (deleted) {
    return (
      <div className="relative flex h-full w-full rounded-md bg-neutral-800 p-3 ring-1 ring-neutral-500">
        <NameAndDescription
          editMode={editMode}
          setEditMode={() => setEditMode(!editMode)}
          setGhInfo={setGhInfo}
          ghInfo={{ name: "deleted", description: "deleted" }}
          isShared={false}
          expiryDate={""}
          bucketId={""}
          lastEdited={""}
          created={""}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col justify-between rounded-md p-3 ring-1 ring-neutral-500 ${editMode || updating ? "bg-neutral-500" : "bg-neutral-900"}`}
    >
      {shareExpired && (
        <p
          className={`absolute top-3 right-3 h-fit w-fit rounded-md bg-green-300 px-2 text-sm font-bold text-neutral-800`}
        >
          Shared
        </p>
      )}
      <InvalidValueDialog
        open={invalidInput}
        setOpen={() => setInvalidInput(false)}
      />

      {props.cardInfo.tags && props.cardInfo.tags.length > 0 && (
        <GhCardTags
          tags={props.cardInfo.tags}
          useNarrow={props.cardInfo.isPublicShared ?? false}
        />
      )}

      <NameAndDescription
        editMode={editMode}
        setEditMode={() => setEditMode(!editMode)}
        setGhInfo={setGhInfo}
        ghInfo={{
          name: props.cardInfo.name!,
          description: props.cardInfo.description!,
        }}
        isShared={props.cardInfo.isPublicShared ?? false}
        expiryDate={props.cardInfo.publicShareExpiryDate ?? ""}
        bucketId={props.cardInfo.bucketUrl ?? ""}
        lastEdited={props.cardInfo.dateUpdated!}
        created={props.cardInfo.dateCreated!}
      />
      <div>
        {editMode ? (
          <EditButtons
            editMode={editMode}
            setEditMode={setEditMode}
            setGhInfo={setGhInfo}
            deletePost={() => deletePost()}
            handleEdit={(b) => handleEdit(b)}
            ghInfo={{
              name: props.cardInfo.name!,
              description: props.cardInfo.description!,
            }}
            name={props.cardInfo.name!}
            description={props.cardInfo.description!}
          />
        ) : (
          <NormalButtons
            editMode={editMode}
            bucketId={props.cardInfo.bucketUrl}
            setEditMode={() => setEditMode(!editMode)}
            handleEdit={(b) => handleEdit(b)}
          />
        )}
      </div>
    </div>
  );
}
