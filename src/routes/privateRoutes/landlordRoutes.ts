import ApartmentManagement from "@/pages/Landlord/ApartmentManagement/ApartmentManagement";
import LandlordDashboard from "@/pages/Landlord/LandlordDasboard/LandlordDashboard";

const landlordRoutes = [
    {path: '/landlord/dashboard', component: LandlordDashboard},
    {path: '/landlord/apartment', component: ApartmentManagement}
]

export default landlordRoutes