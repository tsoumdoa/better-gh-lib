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

export function CopiedDialog(props: { open: boolean; setOpen: () => void }) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Copied!</AlertDialogTitle>
          <AlertDialogDescription>
            ... to your clipboard!
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

export function ShareDialog(props: { open: boolean; setOpen: () => void }) {
  const shareLink = "https://github.com/tomohirosugeta/better-gh-lib";
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
            <div className="flex items-center space-x-2">
              <Input value={shareLink} readOnly />
              <Button variant="outline" size="sm" onClick={handleCopyClick}>
                Copy
              </Button>
            </div>
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
