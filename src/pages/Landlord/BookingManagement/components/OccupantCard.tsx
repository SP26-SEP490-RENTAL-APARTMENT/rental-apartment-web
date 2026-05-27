import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Occupant } from "@/types/occupant";
import {
  User,
  Calendar,
  Globe,
  Phone,
  Mail,
  IdCard,
  Expand,
  Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  occupant: Occupant;
}
function OccupantCard({ occupant }: Props) {
  const { t } = useTranslation("landlord");
  const infoItems = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: t("occupant.form.DOB"),
      value: new Date(occupant.dateOfBirth).toLocaleDateString("vi-VN"),
    },
    {
      icon: <User className="w-5 h-5" />,
      label: t("occupant.form.gender"),
      value: occupant.sex === "male" ? "Male" : "Female",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: t("occupant.form.nationality"),
      value: occupant.nationality,
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: t("occupant.form.phone"),
      value: occupant.phone,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: t("occupant.form.email"),
      value: occupant.email,
      full: true,
    },
    {
      icon: <IdCard className="w-5 h-5" />,
      label: t("occupant.form.passport"),
      value: occupant.passportId || "N/A",
    },
    {
      icon: <IdCard className="w-5 h-5" />,
      label: t("occupant.form.nationalID"),
      value: occupant.nationalIdCardNumber || "N/A",
    },
  ];

  return (
    <Card className="rounded-2xl border py-0 border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white">
      <CardContent className="p-0">
        {/* Header with name and badge */}
        <div className="bg-linear-to-r from-slate-50 to-blue-50 border-b border-slate-200 px-8 py-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-4 items-start flex-1">
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-md">
                {occupant.fullName.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 pt-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {occupant.fullName}
                  </h3>
                  {occupant.isPrimary && (
                    <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Primary Occupant
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1.5">
                  {t("occupant.occupant").charAt(0).toUpperCase() +
                    t("occupant.occupant").slice(1)}{" "}
                  #{occupant.order}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-0">
          {/* LEFT - Information Grid */}
          <div className="p-8 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
                {t("occupant.form.title1")}
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {infoItems.slice(0, 5).map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-xl bg-white border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition duration-200 ${
                      item.full ? "sm:col-span-2" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-slate-600 text-xs font-semibold mb-2.5 uppercase tracking-wider">
                      <span className="text-blue-600">{item.icon}</span>
                      {item.label}
                    </div>
                    <p className="text-slate-900 font-semibold text-base break-all">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
                {t("occupant.form.title2")}
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {infoItems.slice(5).map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-white border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition duration-200"
                  >
                    <div className="flex items-center gap-2.5 text-slate-600 text-xs font-semibold mb-2.5 uppercase tracking-wider">
                      <span className="text-blue-600">{item.icon}</span>
                      {item.label}
                    </div>
                    <p className="text-slate-900 font-semibold text-base break-all">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT - Document Image */}
          <div className="bg-linear-to-b from-slate-50 to-slate-100 border-l border-slate-200 p-8 flex flex-col">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
              {t("occupant.form.title4")}
            </h4>

            <div
              onClick={() => window.open(occupant.proofPhotoUrl, "_blank")}
              className="relative flex-1 rounded-xl overflow-hidden cursor-pointer group border-2 border-slate-200 hover:border-blue-400 transition duration-300"
            >
              <img
                src={occupant.proofPhotoUrl}
                alt="document"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition duration-300 bg-white rounded-full p-3 shadow-xl">
                  <Expand className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default OccupantCard;
