import { Textarea } from "@/components/ui/textarea";
import { GhCard } from "@/types/types";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { DateDisplay } from "./gh-card-date-display";

export function NameAndDescription(props: {
  editMode: boolean;
  setEditMode: () => void;
  setGhInfo: (ghInfo: GhCard) => void;
  ghInfo: GhCard;
  isShared: boolean;
  expiryDate: string;
  bucketId: string;
  lastEdited: string | undefined;
  created: string | undefined;
}) {
  const [shareExpired, setShareExpired] = useState(false);
  const router = useRouter();

  const { mutate: revokeLink } = api.post.revokeSharablePublicLink.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setShareExpired(false);
        router.refresh();
      }
    },
  });

  useEffect(() => {
    setShareExpired(false);
    const expiryDate = new Date(props.expiryDate);
    if (props.isShared && new Date() < expiryDate) {
      setShareExpired(true);
    } else {
      if (props.bucketId !== "" && props.isShared) {
        revokeLink({ bucketId: props.bucketId });
      }
    }
  }, [props.expiryDate, props.isShared, props.bucketId, revokeLink]);

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
        {shareExpired && (
          <p
            className={`h-fit w-fit rounded-md bg-green-300 px-2 text-sm font-bold text-neutral-800`}
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
      <div className="h-auto pb-2 text-neutral-100">
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
          props.ghInfo.description || "-"
        )}
      </div>
      <DateDisplay createdDate={props.created} lastModDate={props.lastEdited} />
    </div>
  );
}
