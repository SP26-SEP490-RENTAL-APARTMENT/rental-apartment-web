import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check } from "lucide-react";
import { myWalletApi } from "@/services/privateApi/landlordApi";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
  refetchWallet?: () => void;
  refetchPayouts?: () => void;
}

const bankList = [
  {
    code: "VCB",
    bin: "970436",
    name: "Vietcombank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/VCB.png",
  },
  {
    code: "CTG",
    bin: "970415",
    name: "Vietinbank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/CTG.png",
  },
  {
    code: "TCB",
    bin: "970407",
    name: "Techcombank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/TCB.png",
  },
  {
    code: "BIDV",
    bin: "970418",
    name: "BIDV",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/BIDV.png",
  },
  {
    code: "VARB",
    bin: "970405",
    name: "VietinBank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/VARB.png",
  },
  {
    code: "NVB",
    bin: "970419",
    name: "NovaBank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/NVB.png",
  },
  {
    code: "STB",
    bin: "970403",
    name: "Sacombank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/STB.png",
  },
  {
    code: "ACB",
    bin: "970416",
    name: "Asia Commercial Bank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/ACB.png",
  },
  {
    code: "MB",
    bin: "970422",
    name: "MB Bank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/MB.png",
  },
  {
    code: "TPB",
    bin: "970423",
    name: "TPBank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/TPB.png",
  },
];

function WithdrawForm({ open, onClose, refetchWallet, refetchPayouts }: Props) {
  const { t } = useTranslation("landlord");
  const [form, setForm] = useState({
    amount: 0,
    channel: "",
    toBin: "",
    toAccountNumber: "",
    orderInfo: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const selectedBank = bankList.find((bank) => bank.code === form.channel);

  const handleSelectBank = (bank: (typeof bankList)[0]) => {
    if (form.channel === bank.code) {
      // Bỏ chọn
      setForm({
        ...form,
        channel: "",
        toBin: "",
      });
    } else {
      // Chọn
      setForm({
        ...form,
        channel: bank.code,
        toBin: bank.bin,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.channel || !form.toAccountNumber || !form.amount) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    try {
      await myWalletApi.withdraw(form);
      toast.success(t("payout.toast.success"));
      onClose();
      refetchWallet?.();
      refetchPayouts?.();
      setForm({
        amount: 0,
        channel: "",
        toBin: "",
        toAccountNumber: "",
        orderInfo: "",
      });
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error(t("payout.toast.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t("payout.form.title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bank Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              {t("payout.form.selectBank")}
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {bankList.map((bank) => (
                <div
                  key={bank.code}
                  onClick={() => handleSelectBank(bank)}
                  className={`relative p-3 border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                    form.channel === bank.code
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <img
                    src={bank.logo}
                    alt={bank.code}
                    className="h-10 w-auto object-contain mb-1"
                  />
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {bank.code}
                  </span>
                  {form.channel === bank.code && (
                    <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Account Details */}
          {form.channel && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {selectedBank && (
                    <img
                      src={selectedBank.logo}
                      alt={selectedBank.code}
                      className="h-8 w-auto"
                    />
                  )}
                  <span className="font-semibold text-gray-700">
                    {selectedBank?.name}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="accountNumber">
                    {t("payout.form.accountNumber")}
                  </Label>
                  <Input
                    id="accountNumber"
                    type="number"
                    value={form.toAccountNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        toAccountNumber: String(e.target.value),
                      })
                    }
                    placeholder="0849017345"
                    className="border-gray-300"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="amount">{t("payout.form.amount")}</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: Number(e.target.value) })
                    }
                    min={0}
                    placeholder="1000000"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">{t("payout.form.message")}</Label>
                <Input
                  id="message"
                  type="text"
                  value={form.orderInfo}
                  onChange={(e) =>
                    setForm({ ...form, orderInfo: e.target.value })
                  }
                  placeholder={t("payout.form.messagePlaceholder")}
                  className="border-gray-300"
                />
              </div>

              {/* Summary */}
              {form.amount > 0 && (
                <div className="bg-white rounded border border-gray-200 p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t("payout.form.amount")}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {Number(form.amount).toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t("payout.form.bank")}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {selectedBank?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t("payout.form.accountNumber")}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {form.toAccountNumber}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("payout.form.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={
                !form.channel ||
                !form.toAccountNumber ||
                !form.amount ||
                isLoading
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t("payout.form.submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawForm;
