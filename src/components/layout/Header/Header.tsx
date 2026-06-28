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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
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
  const headerIconButtonClass =
    "relative inline-flex h-8 w-12 items-center justify-center bg-transparent text-[#61748f] transition hover:text-[#8f3ffc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3ffc]/20 dark:text-slate-300 dark:hover:text-white";
  const responsiveHeaderIconButtonClass =
    "relative hidden h-8 w-12 items-center justify-center bg-transparent text-[#61748f] transition hover:text-[#8f3ffc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3ffc]/20 dark:text-slate-300 dark:hover:text-white sm:inline-flex";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
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
    <header className="sticky top-0 z-20 flex h-[68px] items-center border-b border-[#e2e6f1] bg-white shadow-[0_0_16px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-[#19191c]">
      <div className="flex w-full max-w-full items-center justify-between gap-4 px-4 sm:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <button
            type="button"
            aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            aria-expanded={isSidebarOpen}
            className="group inline-flex h-[25px] w-8 shrink-0 items-center justify-center bg-transparent text-[#61748f] transition hover:text-[#8f3ffc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3ffc]/20 dark:text-slate-300 dark:hover:text-white"
            onClick={toggleSidebar}
          >
            <span className="relative block h-5 w-[18px]" aria-hidden="true">
              <span
                className={`absolute left-0 h-px rounded-full bg-current transition-all duration-300 ease-out ${
                  showCloseIcon
                    ? "top-1/2 w-[18px] -translate-y-1/2 rotate-45"
                    : "top-[4px] w-[18px]"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-px w-[18px] -translate-y-1/2 rounded-full bg-current transition-all duration-200 ease-out ${
                  showCloseIcon ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                }`}
              />
              <span
                className={`absolute left-0 h-px rounded-full bg-current transition-all duration-300 ease-out ${
                  showCloseIcon
                    ? "bottom-1/2 w-[18px] translate-y-1/2 -rotate-45"
                    : "bottom-[4px] w-[18px]"
                }`}
              />
            </span>
          </button>

          <div className="relative hidden h-[35px] w-full max-w-[320px] items-center md:flex">
            <IoSearchOutline className="pointer-events-none absolute left-3 text-[15px] text-[#61748f]" />
            <input
              type="text"
              placeholder="Search anything here ..."
              className="h-full w-full rounded-[5px] border border-[#eff2ff] bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#8f3ffc]/40 focus:ring-2 focus:ring-[#8f3ffc]/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center">
          {/* Globe/Language */}
          <button
            type="button"
            aria-label="Language"
            className={headerIconButtonClass}
          >
            <FiGlobe className="text-[21px]" />
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            aria-label="Toggle theme"
            className={headerIconButtonClass}
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <MdLightMode className="text-[21px]" />
            ) : (
              <MdDarkMode className="text-[21px]" />
            )}
          </button>

          {/* Shopping cart with purple badge */}
          <button
            type="button"
            aria-label="Shopping Cart"
            className={headerIconButtonClass}
          >
            <FiShoppingCart className="text-[21px]" />
            <span className="absolute right-2 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8f3ffc] px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white dark:ring-[#19191c]">
              5
            </span>
          </button>

          {/* Notifications with pink dot */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              aria-label="Open notifications"
              className={headerIconButtonClass}
              onClick={() => setShowNotifications((current) => !current)}
            >
              <IoNotificationsOutline className="text-[22px]" />
              <span className="absolute right-3 top-1 h-2 w-2 rounded-full bg-[#ff5d9f] ring-2 ring-white dark:ring-[#19191c]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-4 w-72 overflow-hidden rounded-[5px] border border-[#ecf3fb] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-[#19191c] dark:shadow-black/30">
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
            className={responsiveHeaderIconButtonClass}
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
              }
            }}
          >
            <FiMaximize className="text-[21px]" />
          </button>

          {/* User Avatar */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              aria-label="User profile"
              aria-expanded={showUserMenu}
              className="relative inline-flex h-8 w-11 items-center justify-center bg-transparent text-[#61748f] transition hover:text-[#8f3ffc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f3ffc]/20 dark:text-slate-300 dark:hover:text-white"
              onClick={() => setShowUserMenu((current) => !current)}
            >
              <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#8f3ffc]/10 text-xs font-semibold text-[#8f3ffc]">
                <span className="absolute">{initials || "A"}</span>
                <img
                  src="/avatar.jpg"
                  alt=""
                  className="relative z-10 h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-4 w-56 overflow-hidden rounded-[5px] border border-[#ecf3fb] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-[#19191c]">
                <div className="border-b border-slate-100 px-4 py-3 dark:border-white/10">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {userName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    UI/UX Designer
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/dashboard/settings");
                  }}
                >
                  Profile
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                  onClick={handleLogout}
                >
                  <MdOutlineLogout className="text-base" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Settings button */}
          <button
            type="button"
            aria-label="Settings"
            className={headerIconButtonClass}
            onClick={() => navigate("/dashboard/settings")}
          >
            <FiSettings className="text-[21px]" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
