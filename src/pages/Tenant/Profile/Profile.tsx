import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { profileApi } from "@/services/privateApi/tenantApi";
import { useEffect, useState } from "react";
import { Info } from "./components/Info";
import { Button } from "@/components/ui/button";
import type { UserProfileFormData } from "@/schemas/userProfileSchema";
import { toast } from "sonner";
import ProfileDialog from "./components/ProfileDialog";
import type { UserProfile } from "@/types/user";

function Profile() {
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
      fetchProfile()
      toast.success("Cập nhật thông tin thành công");
      setIsDialogOpen(false);
    } catch (error: any) {
      console.log(error);

      toast.error("Cập nhật thông tin thất bại");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback>{profile?.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">{profile?.fullName}</h2>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>

          <Badge
            variant={profile?.role === "landlord" ? "default" : "secondary"}
          >
            {profile?.role}
          </Badge>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info label="Số điện thoại" value={profile?.phone} />
          <Info label="Giới tính" value={profile?.sex || "Chưa cập nhật"} />
          <Info
            label="Ngày sinh"
            value={profile?.birthday || "Chưa cập nhật"}
          />
          <Info
            label="Quốc tịch"
            value={profile?.nationality || "Chưa cập nhật"}
          />
        </CardContent>
      </Card>

      {/* Identity */}
      <Card>
        <CardHeader>
          <CardTitle>Xác minh danh tính</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Info
            label="CMND/CCCD"
            value={profile?.nationalIdCardNumber || "Chưa cung cấp"}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Trạng thái:</span>
            <Badge
              variant={profile?.identityVerified ? "default" : "destructive"}
            >
              {profile?.identityVerified ? "Đã xác minh" : "Chưa xác minh"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Info label="ID" value={profile?.userId} />
          <Info
            label="Ngày tạo"
            value={
              profile?.createdAt
                ? new Date(profile.createdAt).toLocaleString()
                : "Chưa cập nhật"
            }
          />
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>
          Chỉnh sửa thông tin
        </Button>
      </div>

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
