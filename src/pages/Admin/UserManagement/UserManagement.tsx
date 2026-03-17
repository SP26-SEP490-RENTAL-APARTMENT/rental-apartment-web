import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/dataTable/DataTable";
import { userColumns } from "./components/userColumns";
import UserForm from "./components/UserForm";
import UserFilter from "./components/UserFilter";
import { userManagementApi } from "@/services/privateApi/adminApi";
import type { User } from "@/types/user";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type {
  CreateUserFormData,
  UpdateUserFormData,
} from "@/schemas/userSchema";

function UserManagement() {
  const { t: userTranslation } = useTranslation("user");

  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5); // fixed limit for now
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
      throw error; // Re-throw to let form handle loading state
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {userTranslation("userManagement")}
        </h1>
        <Button onClick={handleCreateNewUser}>
          <Plus className="mr-2 h-4 w-4" />
          {userTranslation("createUser")}
        </Button>
      </div>

      <UserFilter
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={setSearch}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
      />

      <DataTable
        columns={userColumns(handleDeleteUser, handleEditUser)}
        data={data}
        total={total}
        page={page}
        limit={pageSize}
        onPageChange={handlePageChange}
        loading={loading}
      />

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
