import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: { decision: string; reason: string };
  setForm: (form: any) => void;
}
function ReviewForm({ open, onClose, onSubmit, form, setForm }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review form</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Decision</Label>
              <RadioGroup
                value={form.decision}
                onValueChange={(value) => setForm({ ...form, decision: value })}
              >
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="approve" id="approve" />
                    <Label htmlFor="approve">Approve</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="reject" id="reject" />
                    <Label htmlFor="reject">Reject</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {form.decision === "reject" && (
              <div className="space-y-2">
                <Label>Reason</Label>
                <Input
                  placeholder="Enter reason"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>
            )}

            <DialogFooter>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewForm;
