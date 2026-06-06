import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

function Logo() {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/")}
      className="flex gap-2 items-center cursor-pointer group transition-transform hover:scale-105"
    >
      <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
      <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
        VStay
      </span>
    </div>
  );
}

export default Logo;
