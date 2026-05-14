import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

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
  const {t} = useTranslation('landlord');
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("approve.title")}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="space-y-4">

              <Input
                value={apartmentId}
                type="hidden"
                disabled
                id="apartmentId"
              />


            <div className="grid gap-2">
              <Label htmlFor="note">{t("approve.note")}</Label>
              <Textarea
                placeholder={t("approve.placeholderNote")}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                id="note"
              />
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <Button type="submit">{t("approve.submit")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SubmitApproveForm;
