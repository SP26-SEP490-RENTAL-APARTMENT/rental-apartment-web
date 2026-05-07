import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supportManagementApi } from "@/services/privateApi/adminApi";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  supportId: string;
}

function ResolveForm({ open, onClose, refetch, supportId }: Props) {
  const [solution, setSolution] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    setLoading(true);
    try {
      await supportManagementApi.resolveProblem(supportId, solution);
      toast.success("Problem resolved successfully");
      onClose();
      refetch();
      setSolution("");
    } catch (error) {
      toast.error("Failed to resolve problem");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve Problem</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label>Solution Notes</Label>
            <Textarea
              placeholder="Write your solution here..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleResolve} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ResolveForm;
