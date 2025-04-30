import { Textarea } from "@/components/ui/textarea";
import { GhCard } from "@/types";
import { useState } from "react";
import { CopiedDialog, ShareDialog } from "./gh-card-dialog";
import { Input } from "@/components/ui/input";

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
  setEditMode: () => void;
  handleEditMode: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const handleCopy = async () => {
    //todo replace this with actual data

    //todo remove this
    //fake delay for now
    const timeout = new Promise((resolve) => setTimeout(resolve, 500));
    await timeout;
    navigator.clipboard.writeText("HEY HYE");
    setCopied(true);
  };

  const handleShare = async () => {
    //todo replace this with actual data
    navigator.clipboard.writeText("HEY HYE");
    setShared(true);
  };

  return (
    <div className="flex items-center justify-end text-neutral-400 transition-all">
      <CopiedDialog open={copied} setOpen={() => setCopied(!copied)} />
      <ShareDialog open={shared} setOpen={() => setShared(!shared)} />
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
        onClick={() => props.handleEditMode()}
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
  handleEditMode: () => void;
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
        onClick={() => props.handleEditMode()}
      >
        done
      </button>
    </div>
  );
}
