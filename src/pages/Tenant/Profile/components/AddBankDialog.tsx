import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bankList } from "@/constants/bankList";
import { indentityApi } from "@/services/privateApi/tenantApi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  refetchProfile: () => void;
}

function AddBankDialog({ open, onClose, refetchProfile }: Props) {
  const { t } = useTranslation("user");
  const [form, setForm] = useState({
    bankAccountNumber: "",
    bankBin: "",
  });

  const handleSelectBank = (bin: string) => {
    setForm({
      ...form,
      bankBin: form.bankBin === bin ? "" : bin,
    });
  };

  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await indentityApi.addBankAcc(form);
      toast.success(t("bankDialog.successMessage"));
      onClose();
      refetchProfile();
    } catch (error) {
      toast.error(t("bankDialog.errorMessage"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("bankDialog.title")}</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleAddBank}>
          <div>
            <Label className="mb-4 block">{t("bankDialog.selectBank")}</Label>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {bankList.map((bank) => (
                <button
                  key={bank.bin}
                  type="button"
                  onClick={() => handleSelectBank(bank.bin)}
                  className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all cursor-pointer ${
                    form.bankBin === bank.bin
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  title={bank.name}
                >
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    className="w-10 h-10 object-contain mb-2"
                  />
                  <span className="text-xs text-center line-clamp-2">
                    {bank.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {form.bankBin && (
            <div className="grid gap-2">
              <Label>{t("bankDialog.bankAccountNumber")}</Label>
              <Input
                type="number"
                placeholder={t("bankDialog.accountNumberPlaceholder")}
                value={form.bankAccountNumber}
                onChange={(e) =>
                  setForm({ ...form, bankAccountNumber: e.target.value })
                }
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              {t("bankDialog.cancelButton")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            >
              {t("bankDialog.addButton")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddBankDialog;
