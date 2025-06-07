import { CopiedDialog } from "@/app/components/gh-card-dialog";
import { useFetchGhXml } from "@/app/hooks/use-fetch-gh-xml";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useState } from "react";
export default function GhShareCard(props: { uid: string }) {
  const queryRes = api.post.getSharedPresignedUrlPublic.useSuspenseQuery(
    {
      publicId: props.uid,
    },
    {
      retry: false,
    }
  );

  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { downloadData, decoded } = useFetchGhXml();

  const handleCopy = async () => {
    setIsLoading(true);
    const decoded = await downloadData(queryRes[0].presignedUrl);
    try {
      await navigator.clipboard.writeText(decoded);
      setOpenCopyDialog(true);
      setIsLoading(false);
      setIsCopied(true);
    } catch {
      setOpenCopyDialog(true);
      setIsLoading(false);
      setIsCopied(false);
    }
  };

  if (!queryRes[0]) {
    return <div>Error...</div>;
  }

  return (
    <div className="flex max-h-3/5 w-full max-w-xl">
      <CopiedDialog
        open={openCopyDialog}
        setOpen={() => setOpenCopyDialog(false)}
        setIsCopied={(b) => setIsCopied(b)}
        isCopied={isCopied}
        decoded={decoded}
      />
      <Card className="w-full gap-2 border-neutral-800 bg-neutral-900 p-4">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center justify-between">
            <span className="text-3xl font-semibold text-white">
              Hopper Clip Share
            </span>

            <CardDescription>
              Link expires in{" "}
              {queryRes[0].expirationHours.toFixed(1) ?? "unknown"} hours
            </CardDescription>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div>
            <div className="text-neutral-500">Name</div>
            <div className={`font-semibol dtransition-all pb-1 text-lg`}>
              <p className="overflow-hidden text-ellipsis text-neutral-100">
                {queryRes[0].name}
              </p>
            </div>
            <div className="text-neutral-500">Description</div>
            <div className="h-auto text-neutral-100">
              {queryRes[0].description}
            </div>
          </div>
        </CardContent>
        <AlertDialogFooter>
          <Button
            variant={"outline"}
            className="w-fit hover:opacity-80"
            onClick={() => handleCopy()}
            disabled={isLoading}
          >
            Copy
          </Button>
        </AlertDialogFooter>
      </Card>
    </div>
  );
}
