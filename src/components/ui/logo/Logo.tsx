import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/")}
      className="flex gap-2 items-center cursor-pointer group transition-transform hover:scale-105"
    >
      <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-lg p-2">
        <Building2 color="white" size={28} />
      </div>
      <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
        VStay
      </span>
    </div>
  );
}

export default Logo;
