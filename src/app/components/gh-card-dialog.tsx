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
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

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
  presignedUrl: string;
  bucketId: string;
}) {
  const { refetch, isLoading, isSuccess, isError } = useQuery({
    queryKey: [props.bucketId],
    queryFn: async () => {
      console.log(props.presignedUrl);
      const res = await fetch(props.presignedUrl, {
        cache: "no-store",
        headers: {
          "Content-Encoding": "gzip",
          "Content-Type": "application/gzip",
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      //browser will automatically decompress gzipped data
      const arrayBuffer = await res.arrayBuffer();
      const decoded = new TextDecoder().decode(arrayBuffer);
      console.log(decoded);
      navigator.clipboard
        .writeText(decoded)
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
      return res;
    },
    enabled: false,
  });

  useEffect(() => {
    if (props.presignedUrl.length) {
      refetch();
    }
    // I think i know what i'm doing here...
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.presignedUrl]);

  //todo, this is bad....
  //improve the loading state display better...
  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isLoading && !isError
              ? "Loading..."
              : isSuccess
                ? "Copied!"
                : "Failed to copy"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isLoading
              ? ""
              : isSuccess || !isError
                ? "copied to your clipboard!"
                : "Something went wrong..."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ShareDialog(props: { open: boolean; setOpen: () => void }) {
  const shareLink = "Sorry, not yet implemented";
  const handleCopyClick = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  };
  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Share</AlertDialogTitle>
          <AlertDialogDescription>
            <a className="flex items-center space-x-2">
              <Input value={shareLink} readOnly />
              <Button variant="outline" size="sm" onClick={handleCopyClick}>
                Copy
              </Button>
            </a>
            Copy the link to this card and share it with your friends!
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
