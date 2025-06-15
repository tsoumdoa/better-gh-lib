import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { env } from "@/env";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function InvalidValueDialog(props: {
  open: boolean;
  setOpen: () => void;
}) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Invalid Input</AlertDialogTitle>
          <AlertDialogDescription>
            Name must be between 3 and 30 characters long and in PascalCase.
            Description must be between 1 and 150 characters long.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function CopiedDialog(props: {
  open: boolean;
  setOpen: () => void;
  setIsCopied: (b: boolean) => void;
  isCopied: boolean;
  decoded: string | undefined;
}) {
  function handleCopyClick() {
    navigator.clipboard.writeText(props.decoded!);
    props.setIsCopied(true);
    alert("GhXml copied to clipboard!");
  }

  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {props.isCopied ? "Copied!" : "Failed to copy"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {props.isCopied
              ? "copied to your clipboard!"
              : "Something went wrong, try copy button below"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!props.isCopied && (
            <Button
              className="bg-neutral-800 hover:bg-neutral-700"
              onClick={handleCopyClick}
            >
              Copy
            </Button>
          )}
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ShareDialog(props: {
  open: boolean;
  setOpen: () => void;
  bucketId: string;
}) {
  const format = (id: string) => {
    if (process.env.NODE_ENV === "development") {
      return `http:localhost:3000/share?uid=${id}`;
    }
    return `${env.NEXT_PUBLIC_HOSTING_DOMAIN}/share?uid=${id}`;
  };

  const { mutate: generateLink, isSuccess: isGenerated } =
    api.post.generateSharablePublicLink.useMutation({
      onSuccess: (data) => {
        const url = format(data);
        shareLinkRef.current = url;
        setShareLink(url);
        router.refresh();
      },
    });

  const router = useRouter();
  const {
    mutate: revokeLink,
    isSuccess: revoked,
    reset,
  } = api.post.revokeSharablePublicLink.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        shareLinkRef.current = "";
        setShareLink("Revoked successfully!");
      } else {
        setShareLink("failed to revoke - " + shareLinkRef.current);
        setRevoking(false);
      }
      props.setOpen();
      router.refresh();
    },
    onSettled: () => {
      setRevoking(false);
    },
    onError: () => {
      setRevoking(false);
      setShareLink("failed to revoke for unknown reason, close and try again");
    },
  });

  const [shareLink, setShareLink] = useState("generating...");
  const shareLinkRef = useRef(shareLink);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shareLinkRef.current);
    setCopied(true);
    alert("Link copied to clipboard!");
  };

  const handleRevokeClick = () => {
    setShareLink("revoking...");
    revokeLink({ bucketId: props.bucketId });
  };

  useEffect(() => {
    if (props.open) {
      reset(); //reset the sate from the previous run
      setRevoking(false);
      setShareLink("generating...");
      generateLink({ bucketId: props.bucketId });
    }
  }, [props.open, generateLink, props.bucketId, reset]);

  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Share</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <a className="flex items-center space-x-2 pb-2">
            <Input className="truncate" value={shareLink} readOnly />
            {!revoked && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyClick}
                disabled={revoking}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </a>
          {revoked
            ? "You can now close"
            : "Copy the link to this card and share it with your friends!"}
        </AlertDialogDescription>
        <AlertDialogFooter>
          {isGenerated && !revoked && (
            <Button
              className="bg-pink-500 hover:bg-pink-600"
              onClick={handleRevokeClick}
              disabled={revoking}
            >
              Revoke
            </Button>
          )}
          <AlertDialogAction disabled={revoking}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
