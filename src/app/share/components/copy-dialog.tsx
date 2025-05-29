import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function CopiedDialog(props: {
  open: boolean;
  setOpen: () => void;
  presignedUrl: string;
  uid: string;
}) {
  const { refetch, isLoading, isSuccess, isError } = useQuery({
    queryKey: [props.uid],
    queryFn: async () => {
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
    if (props.open) {
      refetch();
    }
  }, [props.open, refetch]);

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
