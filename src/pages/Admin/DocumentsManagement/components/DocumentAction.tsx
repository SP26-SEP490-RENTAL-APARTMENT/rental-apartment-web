import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Document } from "@/types/document";
import { CircleCheckBig, Eye } from "lucide-react";
import DocumentViewer from "./DocumentViewer";

export interface Props {
  document: Document;
  onApprove: (id: string) => void;
}

function DocumentAction({ document, onApprove }: Props) {
  return (
    <div className="flex gap-2">
      {document.verificationStatus === "verified" ? null : (
        <Button
          onClick={() => onApprove(document.documentId)}
          size="sm"
          variant="outline"
        >
          <CircleCheckBig />
        </Button>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Eye />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document</DialogTitle>
          </DialogHeader>
          <DocumentViewer doc={document} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DocumentAction;
