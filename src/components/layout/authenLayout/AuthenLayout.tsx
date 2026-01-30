import { Building2 } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

function AuthenLayout() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center bg-[rgb(235,242,255)] min-h-screen">
      <div
        onClick={() => navigate("/")}
        className="flex gap-2 items-center cursor-pointer mb-5"
      >
        <span>
          <Building2 color="blue" size={35} />
        </span>
        <span className="text-blue-700 font-bold text-3xl">Booking</span>
      </div>
      <main className="w-full flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthenLayout;
