import type { UserProfile } from "@/types/user";
import { Badge } from "@/components/ui/badge";

function UserDetailDialog({ user }: { user: UserProfile }) {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
          {user.fullName?.charAt(0)}
        </div>

        <div>
          <p className="font-semibold text-lg">{user.fullName}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
        <div className="text-muted-foreground">
          UserId
        </div>
        <div className="font-medium break-all">
          {user.userId}
        </div>

        <div className="text-muted-foreground">
          Phone
        </div>
        <div className="font-medium">
          {user.phone || "-"}
        </div>

        <div className="text-muted-foreground">
          Role
        </div>
        <div>
          <Badge variant="secondary" className="capitalize">
            {user.role}
          </Badge>
        </div>

        <div className="text-muted-foreground">
          Gender
        </div>
        <div className="capitalize">
          {user.sex}
        </div>

        <div className="text-muted-foreground">
          Birthday
        </div>
        <div>
          {user.birthday || "-"}
        </div>

        <div className="text-muted-foreground">
          Nationality
        </div>
        <div>
          {user.nationality}
        </div>

        <div className="text-muted-foreground">
          Verified
        </div>
        <div>
          {user.identityVerified ? (
            <Badge className="bg-green-500 hover:bg-green-500">
              Verified
            </Badge>
          ) : (
            <Badge variant="destructive">
              Not verified
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetailDialog;