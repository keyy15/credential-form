import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoNotificationsOutline, IoSearchOutline } from "react-icons/io5";
import { MdDarkMode, MdLightMode, MdOutlineLogout } from "react-icons/md";
import { RiMenu2Line } from "react-icons/ri";
import { useTheme } from "../../../hooks/useTheme";
import { deleteCookie, getCookie } from "../../../utils/cookie";
import { AuthService } from "../../../services/common/AuthService/AuthService";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const userName = useMemo(() => {
    const rawUser = getCookie("user");

    if (!rawUser) {
      return "Admin";
    }

    try {
      const parsedUser = JSON.parse(decodeURIComponent(rawUser)) as {
        name?: string;
      };
      return parsedUser.name || "Admin";
    } catch {
      return rawUser;
    }
  }, []);

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("user");
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#181820]/90 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-full items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            aria-label="Toggle sidebar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
            onClick={toggleSidebar}
          >
            <RiMenu2Line className="text-xl" />
          </button>

          <div className="hidden w-full max-w-xl items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500 transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:focus-within:border-indigo-400/50 dark:focus-within:bg-white/10 md:flex">
            <IoSearchOutline className="text-lg" />
            <input
              type="text"
              placeholder="Search orders, products, customers..."
              className="w-full border-0 bg-transparent p-0 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              aria-label="Open notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
              onClick={() => setShowNotifications((current) => !current)}
            >
              <IoNotificationsOutline className="text-xl" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#181820]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#202029] dark:shadow-black/30">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/10">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Notifications
                  </p>
                  <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                    3 new
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/10">
                  {["New order #ORD-2489", "Revenue target updated", "Low stock alert"].map(
                    (message) => (
                      <button
                        type="button"
                        key={message}
                        className="w-full px-4 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                      >
                        {message}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label="Toggle theme"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <MdLightMode className="text-xl" />
            ) : (
              <MdDarkMode className="text-xl" />
            )}
          </button>

          <div className="hidden items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {userName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Administrator
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Logout"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
            onClick={handleLogout}
          >
            <MdOutlineLogout className="text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
