import { Textarea } from "@/components/ui/textarea";
import { GhCard } from "@/types";
import { useEffect, useState } from "react";
import { CopiedDialog, ShareDialog } from "./gh-card-dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

export function NameAndDescription(props: {
  editMode: boolean;
  setEditMode: () => void;
  setGhInfo: (ghInfo: GhCard) => void;
  ghInfo: GhCard;
}) {
  return (
    <div>
      <div
        className={` ${props.editMode ? "text-neutral-900" : "text-neutral-500"} `}
      >
        Name
      </div>
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
          <p className="overflow-hidden text-ellipsis">{props.ghInfo.name}</p>
        )}
      </div>
      <div
        className={` ${props.editMode ? "text-neutral-900" : "text-neutral-500"} `}
      >
        Description
      </div>
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

  const { refetch, data, isSuccess, isError } =
    api.post.getPresignedUrl.useQuery(
      { bucketId: props.bucketId },
      {
        enabled: false,
      }
    );

  useEffect(() => {
    if (isSuccess) {
      //todo put url clipboard for now, need to fetch data and errr shit in the
      //future...
      navigator.clipboard.writeText(data);
    }
  }, [isSuccess, isError, data]);

  const handleCopy = async () => {
    refetch();
    setOpenCopyDialog(true);
  };

  const handleShare = async () => {
    //todo replace this with actual data
    navigator.clipboard.writeText("HEY HYE");
    setOpenSharedDialog(true);
  };

  return (
    <div className="flex items-center justify-end text-neutral-400 transition-all">
      <CopiedDialog
        open={openCopyDialog}
        setOpen={() => setOpenCopyDialog(!openCopyDialog)}
      />
      <ShareDialog
        open={openSharedDialog}
        setOpen={() => setOpenSharedDialog(!openSharedDialog)}
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
