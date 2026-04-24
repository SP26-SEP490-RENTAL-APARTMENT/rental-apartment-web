import Logo from "@/components/ui/logo/Logo";
import { Outlet } from "react-router-dom";

function AuthenLayout() {
  return (
    <div className="flex flex-col justify-center items-center bg-[rgb(235,242,255)] min-h-screen">
      <div className="mb-5">
        <Logo />
      </div>
      <main className="w-full flex justify-center">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthenLayout;
