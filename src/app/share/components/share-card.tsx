import { CopiedDialog } from "@/app/components/gh-card-dialog";
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
  const { data, isLoading } = api.post.getSharedPresignedUrlPublic.useQuery({
    publicId: props.uid,
  });

  const [openCopyDialog, setOpenCopyDialog] = useState(false);

  return (
    <div className="flex max-h-3/5 w-full max-w-xl">
      {data && (
        <CopiedDialog
          open={openCopyDialog}
          setOpen={() => setOpenCopyDialog(false)}
          presignedUrl={data.presignedUrl}
          queryKey={props.uid}
        />
      )}
      <Card className="w-full gap-2 border-neutral-800 bg-neutral-900 p-4">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center justify-between">
            <span className="text-3xl font-semibold text-white">
              Hopper Clip Share
            </span>

            <CardDescription>
              Link expires in{" "}
              {(data && data.expirationHours.toFixed(1)) ?? "unknown"} hours
            </CardDescription>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div>
            <div className="text-neutral-500">Name</div>
            <div className={`font-semibol dtransition-all pb-1 text-lg`}>
              <p className="overflow-hidden text-ellipsis text-neutral-100">
                {data && data.name}
              </p>
            </div>
            <div className="text-neutral-500">Description</div>
            <div className="h-auto text-neutral-100">
              {data && data.description}
            </div>
          </div>
        </CardContent>
        <AlertDialogFooter>
          <Button
            variant={"outline"}
            className="w-fit hover:opacity-80"
            onClick={() => setOpenCopyDialog(true)}
            disabled={isLoading}
          >
            Copy
          </Button>
        </AlertDialogFooter>
      </Card>
    </div>
  );
}
