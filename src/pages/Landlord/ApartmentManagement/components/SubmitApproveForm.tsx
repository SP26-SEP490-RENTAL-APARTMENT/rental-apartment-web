import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type Props = {
  note: string;
  setNote: (note: string) => void;
  apartmentId: string;
  onSubmit: () => void;
  isOpen: boolean;
  onClose: () => void;
};
function SubmitApproveForm({
  note,
  setNote,
  apartmentId,
  onSubmit,
  isOpen,
  onClose,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit for review</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="apartmentId">Apartment</Label>
              <Input value={apartmentId} disabled id="apartmentId" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="note">Note</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                id="note"
              />
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SubmitApproveForm;
