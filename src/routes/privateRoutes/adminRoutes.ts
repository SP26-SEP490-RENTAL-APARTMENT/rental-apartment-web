import AdminDashboard from "@/pages/Admin/AdminDashboard/AdminDashboard"
import SubsciptionPlan from "@/pages/Admin/SubsciptionPlan/SubsciptionPlan"
import UserManagement from "@/pages/Admin/UserManagement/UserManagement"

const adminRoutes = [
    {path: '/admin/dashboard', component: AdminDashboard},
    {path: '/admin/users', component: UserManagement},
    {path: '/admin/subscription-plans', component: SubsciptionPlan}
]

export default adminRoutes