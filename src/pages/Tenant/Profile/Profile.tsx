import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { profileApi } from "@/services/privateApi/tenantApi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { UserProfileFormData } from "@/schemas/userProfileSchema";
import { toast } from "sonner";
import ProfileDialog from "./components/ProfileDialog";
import type { UserProfile } from "@/types/user";
import { useTranslation } from "react-i18next";
import {
  User,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Clock,
  Edit2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function Profile() {
  const { t } = useTranslation("user");
  const { t: commontT } = useTranslation("common");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await profileApi.getProfile();
      setProfile(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (data: UserProfileFormData) => {
    try {
      await profileApi.updateProfile(data);
      fetchProfile();
      toast.success(commontT("toast.profileUpdated"));
      setIsDialogOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error(commontT("toast.profileUpdateFailed"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Profile Card */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-blue-800">
                  {profile?.fullName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{profile?.fullName}</h1>
                <p className="text-blue-100 text-sm mt-1">{profile?.email}</p>
              </div>
            </div>
            <Badge
              variant={profile?.role === "landlord" ? "default" : "secondary"}
              className="px-4 py-2 text-base"
            >
              {profile?.role === "landlord"
                ? t("role.landlord")
                : t("role.tenant")}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle>{t("profile.personalInfo")}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  {t("profile.phone")}
                </p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {profile?.phone || (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  {t("profile.gender")}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {profile?.sex === "male" ? (
                    t("profile.male")
                  ) : profile?.sex === "female" ? (
                    t("profile.female")
                  ) : (
                    <span className="text-gray-400">Not updated</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  {t("profile.birthday")}
                </p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {profile?.birthday || (
                    <span className="text-gray-400">Not updated</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  {t("profile.nationality")}
                </p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {profile?.nationality || (
                    <span className="text-gray-400">Not updated</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Identity Verification */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <CardTitle>{t("profile.identityVerified")}</CardTitle>
                </div>
                {profile?.identityVerified ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {t("profile.verified")}
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700 border-0">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {t("profile.notVerified")}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  {t("profile.nationalID")}
                </p>
                <p className="text-sm font-medium text-gray-900 font-mono">
                  {profile?.nationalIdCardNumber || (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <CardTitle>{t("profile.accountInfo")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  {t("profile.userId")}
                </p>
                <p className="text-sm font-medium text-gray-900 font-mono">
                  {profile?.userId}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  {t("profile.createdAt")}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold gap-2 px-6"
            >
              <Edit2 className="h-4 w-4" />
              {commontT("button.edit")}
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Dialog */}
      {profile && (
        <ProfileDialog
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleUpdateProfile}
          open={isDialogOpen}
          profileData={profile}
        />
      )}
    </div>
  );
}

export default Profile;
