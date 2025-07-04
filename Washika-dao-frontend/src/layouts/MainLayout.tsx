import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/Navbar/Navbar.js";
import Footer from "../components/Footer.js";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";

export default function MainLayout() {
  const navigate = useNavigate();
  const account = useActiveAccount();

  useEffect(() => {
    // If not logged in and not on login/register/blog, redirect to login
    const publicRoutes = ["/login", "/register", "/blog", "/"];
    if (!account && !publicRoutes.includes(window.location.pathname)) {
      navigate("/login");
    }
  }, [account, navigate]);

  return (
    <>
      <Navbar className="navbar" />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer className="footer" />
    </>
  );
} 