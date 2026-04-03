import { Button } from "@/components/ui/button";
import type { Document } from "@/types/document";
import { CircleCheckBig } from "lucide-react";

export interface Props {
  document: Document;
  onApprove: (id: string) => void;
}

function DocumentAction({ document, onApprove }: Props) {
  return (
    <div>
      {document.verificationStatus === "verified" ? null : (
        <Button
          onClick={() => onApprove(document.documentId)}
          size="sm"
          variant="outline"
        >
          <CircleCheckBig />
        </Button>
      )}
    </div>
  );
}

export default DocumentAction;
