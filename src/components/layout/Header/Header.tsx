import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoNotificationsOutline, IoSearchOutline } from "react-icons/io5";
import { MdDarkMode, MdLightMode, MdOutlineLogout } from "react-icons/md";
import { useTheme } from "../../../hooks/useTheme";
import { FiGlobe, FiMaximize, FiSettings, FiShoppingCart } from "react-icons/fi";
import { deleteCookie, getCookie } from "../../../utils/cookie";
import { AuthService } from "../../../services/common/AuthService/AuthService";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header = ({ isSidebarOpen, toggleSidebar }: HeaderProps) => {
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
  const showCloseIcon = !isSidebarOpen;

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
    <header className="sticky top-0 z-20 flex h-[73px] items-center border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#19191c]/90 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-full items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            aria-expanded={isSidebarOpen}
            className="group inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
            onClick={toggleSidebar}
          >
            <span className="relative block h-5 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 h-0.5 rounded-full bg-current transition-all duration-300 ease-out ${
                  showCloseIcon
                    ? "top-1/2 w-5 -translate-y-1/2 rotate-45 group-hover:w-5"
                    : "top-[3px] w-5 group-hover:w-4"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full bg-current transition-all duration-200 ease-out ${
                  showCloseIcon ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 rounded-full bg-current transition-all duration-300 ease-out ${
                  showCloseIcon
                    ? "bottom-1/2 w-5 translate-y-1/2 -rotate-45 group-hover:w-5"
                    : "bottom-[3px] w-5 group-hover:w-3"
                }`}
              />
            </span>
          </button>

          <div className="hidden w-full max-w-xl items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500 transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:focus-within:border-indigo-400/50 dark:focus-within:bg-white/10 md:flex">
            <IoSearchOutline className="text-lg text-slate-400" />
            <input
              type="text"
              placeholder="Search anything here .."
              className="w-full border-0 bg-transparent p-0 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Globe/Language */}
          <button
            type="button"
            aria-label="Language"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <FiGlobe className="text-xl" />
          </button>

          {/* Theme toggle */}
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

          {/* Shopping cart with purple badge */}
          <button
            type="button"
            aria-label="Shopping Cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <FiShoppingCart className="text-xl" />
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#8f3ffc] text-[10px] font-bold text-white">
              6
            </span>
          </button>

          {/* Notifications with pink dot */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              aria-label="Open notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
              onClick={() => setShowNotifications((current) => !current)}
            >
              <IoNotificationsOutline className="text-xl" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ff5d9f] ring-2 ring-white dark:ring-[#19191c]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#19191c] dark:shadow-black/30">
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

          {/* Fullscreen icon */}
          <button
            type="button"
            aria-label="Fullscreen"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
              }
            }}
          >
            <FiMaximize className="text-xl" />
          </button>

          {/* User Avatar */}
          <button
            type="button"
            aria-label="User profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white p-[3px] text-slate-600 transition hover:border-indigo-200 dark:border-white/10 dark:bg-white/5"
            onClick={() => navigate("/dashboard/settings")}
          >
            <img src="/avatar.jpg" alt="User avatar" className="h-full w-full rounded-md object-cover" />
          </button>

          {/* Settings button */}
          <button
            type="button"
            aria-label="Settings"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
            onClick={() => navigate("/dashboard/settings")}
          >
            <FiSettings className="text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
