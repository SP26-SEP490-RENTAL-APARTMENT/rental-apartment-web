import type { User } from "@/types/user";
import { useTranslation } from "react-i18next";

function UserDetailDialog({ user }: { user: User }) {
  const { t: translate } = useTranslation("user");
  return (
    <div className="space-y-6">
      {/* User basic */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
          {user?.fullName?.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.fullName}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
        <div className="text-gray-500">{translate("userId")}</div>
        <div className="font-medium text-gray-900 break-all">
          {user?.userId}
        </div>

        <div className="text-gray-500">{translate("phone")}</div>
        <div className="font-medium text-gray-900">{user?.phone || "-"}</div>

        <div className="text-gray-500">{translate("role")}</div>
        <div className="font-medium text-gray-900 capitalize">{user?.role}</div>

        <div className="text-gray-500">{translate("verified")}</div>
        <div>
          {user?.identityVerified ? (
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
              Yes
            </span>
          ) : (
            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-500">
              No
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetailDialog;
