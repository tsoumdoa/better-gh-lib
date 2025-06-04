import { Textarea } from "@/components/ui/textarea";
import { GhCard } from "@/types/types";
import { useState } from "react";
import { CopiedDialog, ShareDialog } from "./gh-card-dialog";
import { Input } from "@/components/ui/input";
import { useDownloadPresignedUrl } from "../hooks/use-download-presigned-url";

export function NameAndDescription(props: {
  editMode: boolean;
  setEditMode: () => void;
  setGhInfo: (ghInfo: GhCard) => void;
  ghInfo: GhCard;
  isShared: boolean;
  expiryDate: string;
}) {
  return (
    <div>
      <div className="items-top flex flex-row justify-between">
        <div>
          <p
            className={` ${props.editMode ? "text-neutral-900" : "text-neutral-500"} `}
          >
            Name
          </p>
          <div
            className={`pb-1 text-lg ${props.editMode ? "" : "font-semibold"} transition-all`}
          >
            {props.editMode ? (
              <div>
                <Input
                  type="name"
                  placeholder="NameOfGhCardInPascalCase"
                  className="font-semibold"
                  defaultValue={props.ghInfo.name}
                  onChange={(e) =>
                    props.setGhInfo({ ...props.ghInfo, name: e.target.value })
                  }
                />
                <p className="text-right text-xs text-neutral-100">
                  {props.ghInfo.name.length || 0} / 30 characters
                </p>
              </div>
            ) : (
              <p className="overflow-hidden text-ellipsis">
                {props.ghInfo.name}
              </p>
            )}
          </div>
        </div>
        {props.isShared && (
          <p
            className={`h-fit w-fit rounded-md bg-neutral-200 px-2 text-sm font-bold text-neutral-800`}
          >
            Shared
          </p>
        )}
      </div>
      <p
        className={` ${props.editMode ? "text-neutral-900" : "text-neutral-500"} `}
      >
        Description
      </p>
      <div className="h-auto text-neutral-100">
        {props.editMode ? (
          <div className="space-y-1">
            <Textarea
              placeholder="Type your message here."
              defaultValue={props.ghInfo.description}
              onChange={(e) =>
                props.setGhInfo({
                  ...props.ghInfo,
                  description: e.target.value,
                })
              }
            />
            <p className="text-right text-xs text-neutral-100">
              {props.ghInfo.description?.length || 0} / 300 characters
            </p>
          </div>
        ) : (
          props.ghInfo.description
        )}
      </div>
    </div>
  );
}

export function NormalButtons(props: {
  editMode: boolean;
  bucketId: string;
  setEditMode: () => void;
  handleEdit: (b: boolean) => void;
}) {
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [openSharedDialog, setOpenSharedDialog] = useState(false);
  const { presignedUrl, refetch, isSuccess } = useDownloadPresignedUrl(
    props.bucketId
  );

  const handleCopy = () => {
    refetch();
    setOpenCopyDialog(true);
  };

  const handleShare = () => {
    //todo replace this with actual data
    setOpenSharedDialog(true);
  };

  return (
    <div className="flex items-center justify-end text-neutral-400 transition-all">
      {isSuccess && (
        <CopiedDialog
          open={openCopyDialog}
          setOpen={() => setOpenCopyDialog(!openCopyDialog)}
          presignedUrl={presignedUrl}
          queryKey={props.bucketId}
        />
      )}
      <ShareDialog
        open={openSharedDialog}
        setOpen={() => setOpenSharedDialog(!openSharedDialog)}
        bucketId={props.bucketId}
      />
      <button
        className={`px-2 font-bold hover:text-neutral-50`}
        onClick={handleCopy}
      >
        copy
      </button>
      <button
        className={`px-2 font-bold hover:text-neutral-50`}
        onClick={handleShare}
      >
        share
      </button>
      <button
        className={`px-2 font-bold hover:text-neutral-50`}
        onClick={() => props.handleEdit(false)}
      >
        edit
      </button>
    </div>
  );
}

export function EditButtons(props: {
  editMode: boolean;
  setEditMode: (b: boolean) => void;
  setGhInfo: (ghInfo: GhCard) => void;
  handleEdit: (b: boolean) => void;
  deletePost: () => void;
  ghInfo: GhCard;
  name: string;
  description: string;
}) {
  const cancelEditMode = () => {
    props.setEditMode(false);
    props.setGhInfo({
      name: props.name,
      description: props.description,
    });
  };

  return (
    <div className="flex items-center justify-end text-neutral-400 transition-all">
      <button
        className={`px-2 font-bold hover:text-neutral-50`}
        onClick={() => props.deletePost()}
      >
        delete
      </button>
      <button
        className={`px-2 font-bold hover:text-neutral-50`}
        onClick={() => cancelEditMode()}
      >
        cancel
      </button>
      <button
        className={`px-2 font-bold hover:text-neutral-50`}
        onClick={() => props.handleEdit(true)}
      >
        done
      </button>
    </div>
  );
}
