import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { indentityApi } from "@/services/privateApi/tenantApi";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

const bankList = [
  {
    bin: "970436",
    name: "Vietcombank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/VCB.png",
  },
  {
    bin: "970415",
    name: "Vietinbank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/CTG.png",
  },
  {
    bin: "970407",
    name: "Techcombank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/TCB.png",
  },
  {
    bin: "970418",
    name: "BIDV",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/BIDV.png",
  },
  {
    bin: "970405",
    name: "VietinBank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/VARB.png",
  },
  {
    bin: "970419",
    name: "NovaBank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/NVB.png",
  },
  {
    bin: "970403",
    name: "Sacombank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/STB.png",
  },
  {
    bin: "970416",
    name: "Asia Commercial Bank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/ACB.png",
  },
  {
    bin: "970422",
    name: "MB Bank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/MB.png",
  },
  {
    bin: "970423",
    name: "TPBank",
    logo: "https://img.mservice.com.vn/momo_app_v2/img/TPB.png",
  },
];

function AddBankDialog({ open, onClose }: Props) {
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
        await indentityApi.addBankAcc(form)
        toast.success("Bank account added successfully");
        onClose();
    } catch (error) {
        toast.error("Failed to add bank account. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleAddBank}>
          <div>
            <Label className="mb-4 block">Select Bank</Label>
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
              <Label>Bank Account Number</Label>
              <Input
                type="number"
                placeholder="Enter your bank account number"
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
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            >
              Add Bank Account
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddBankDialog;
