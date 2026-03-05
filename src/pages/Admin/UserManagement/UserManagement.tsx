import DataTable from "@/components/ui/dataTable/DataTable";
import { userColumns } from "./components/userColumns";

const data = [
  {
    id: "1",
    name: "Long Le",
    email: "long@gmail.com",
    role: "landlord",
  },
  {
    id: "2",
    name: "Minh Tran",
    email: "minh@gmail.com",
    role: "tenant",
  },
];
function UserManagement() {
  return (
    <div>
      <DataTable columns={userColumns} data={data} />
    </div>
  );
}

export default UserManagement;
