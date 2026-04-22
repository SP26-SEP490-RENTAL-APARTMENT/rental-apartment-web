import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout;
