import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: any;
  setForm: (form: any) => void;
}
function CheckoutDialog({ open, onClose, onSubmit, form, setForm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout form</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {/* Renewal Type */}
          <div className="space-y-2">
            <Label>Renewal Type</Label>
            <Select
              value={form.renewalType}
              onValueChange={(value) =>
                setForm({ ...form, renewalType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select renewal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auto Renew */}
          <div className="flex items-center justify-between">
            <Label>Auto renew</Label>
            <Switch
              checked={form.autoRenew}
              onCheckedChange={(checked) =>
                setForm({ ...form, autoRenew: checked })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>Confirm Checkout</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CheckoutDialog;
