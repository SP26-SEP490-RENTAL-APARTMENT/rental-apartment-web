import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/dataTable/DataTable";
import { userColumns } from "./components/userColumns";
import UserForm from "./components/UserForm";
import UserFilter from "./components/UserFilter";
import { userManagementApi } from "@/services/privateApi/adminApi";
import type { User } from "@/types/user";
import { toast } from "sonner";
import { Plus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CreateUserFormData, UpdateUserFormData } from "@/schemas/userSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function UserManagement() {
  const { t: userTranslation } = useTranslation("user");

  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof User>("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formMode, setFormMode] = useState<"create" | "update">("create");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userManagementApi.getAllUsers({
        page,
        pageSize,
        search,
        sortBy,
        sortOrder,
      });

      setData(response.data.items);
      setTotal(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await userManagementApi.deleteUser(userId);
      fetchUsers();
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleCreateUser = async (userData: CreateUserFormData) => {
    try {
      await userManagementApi.createUser(userData);
      fetchUsers();
      toast.success(userTranslation("createUserSuccess"));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || userTranslation("createUserFailed"),
      );
      throw error;
    }
  };

  const handleUpdateUser = async (userData: UpdateUserFormData) => {
    if (!selectedUser) return;

    try {
      await userManagementApi.updateUser(selectedUser.userId, userData);
      fetchUsers();
      toast.success(userTranslation("updateUserSuccess"));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || userTranslation("updateUserFailed"),
      );
      throw error;
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormMode("update");
    setIsFormOpen(true);
  };

  const handleCreateNewUser = () => {
    setSelectedUser(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (
    data: CreateUserFormData | UpdateUserFormData,
  ) => {
    if (formMode === "create") {
      await handleCreateUser(data as CreateUserFormData);
    } else {
      await handleUpdateUser(data as UpdateUserFormData);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, search, sortBy, sortOrder]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="text-gray-600 mt-1">
                  View and manage all platform users
                </p>
              </div>
            </div>
            <Button
              onClick={handleCreateNewUser}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold gap-2"
            >
              <Plus className="h-4 w-4" />
              New User
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filter Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <UserFilter
              search={search}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSearchChange={setSearch}
              onSortByChange={setSortBy}
              onSortOrderChange={setSortOrder}
            />
          </CardContent>
        </Card>

        {/* Data Table Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>
              Users ({total})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={userColumns(handleDeleteUser, handleEditUser)}
              data={data}
              total={total}
              page={page}
              limit={pageSize}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>

      {/* User Form Modal */}
      <UserForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        mode={formMode}
      />
    </div>
  );
}

export default UserManagement;
  
