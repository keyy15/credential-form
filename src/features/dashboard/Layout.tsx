import { useEffect, useState } from "react";
import Header from "../../components/layout/Header/Header";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Content from "../../components/layout/Content/Content";
import Footer from "../../components/layout/Footer/Footer";
import axiosClient from "../../services/api/axiosClient";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        await axiosClient.get("/profile");
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchDashboard();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((current) => !current);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#2d2d30] dark:text-white">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`flex min-h-screen flex-col transition-all duration-300 ${isSidebarOpen ? "lg:pl-72" : "lg:pl-20"}`}>
        <Header
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <Content />
        <Footer />
      </div>
    </main>
  );
};

export default Layout;
