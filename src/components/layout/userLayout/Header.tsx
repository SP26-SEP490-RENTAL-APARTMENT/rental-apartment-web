import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";

function Header() {
  const navigate = useNavigate();
  return (
    <div className="px-3 py-5 flex justify-between shadow-b shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
      <span
        onClick={() => navigate("/")}
        className="flex gap-2 items-center cursor-pointer"
      >
        <span>
          <Building2 color="blue" size={35} />
        </span>
        <span className="text-blue-700 font-bold text-3xl">Booking</span>
      </span>
      <span className="flex gap-3 items-center">
        <Button
          className="cursor-pointer"
          variant={"ghost"}
          onClick={() => navigate("/register")}
        >
          Sign Up
        </Button>
        <Button className="cursor-pointer" onClick={() => navigate("/login")}>
          Login
        </Button>
      </span>
    </div>
  );
}

export default Header;
