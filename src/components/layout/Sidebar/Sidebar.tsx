import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { IconType } from "react-icons";
import { AiOutlineHome } from "react-icons/ai";
import {
  FiBarChart2,
  FiBox,
  FiChevronDown,
  FiClipboard,
  FiCreditCard,
  FiEdit3,
  FiFileText,
  FiGrid,
  FiHeart,
  FiList,
  FiPackage,
  FiPlusSquare,
  FiSettings,
  FiShoppingCart,
  FiUsers,
  FiX,
} from "react-icons/fi";

interface SidebarProps {
  isSidebarOpen: boolean;
  onClose?: () => void;
}

type NavigationItem = {
  label: string;
  path: string;
  icon?: IconType;
  end?: boolean;
  defaultOpen?: boolean;
  activePaths?: string[];
  activePrefixes?: string[];
  children?: NavigationItem[];
};

type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};

const navigationGroups: NavigationGroup[] = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: AiOutlineHome,
        end: true,
      },
    ],
  },
  {
    title: "Web Apps",
    items: [
      {
        label: "Ecommerce",
        path: "/dashboard/product/listproduct",
        icon: FiShoppingCart,
        defaultOpen: true,
        activePaths: ["/dashboard/product"],
        activePrefixes: ["/dashboard/product"],
        children: [
          {
            label: "Add Products",
            path: "/dashboard/product/create",
            icon: FiPlusSquare,
            activePrefixes: ["/dashboard/product/create"],
          },
          {
            label: "Cart",
            path: "/dashboard/product/cart",
            icon: FiShoppingCart,
            activePrefixes: ["/dashboard/product/cart"],
          },
          {
            label: "Checkout",
            path: "/dashboard/product/checkout",
            icon: FiCreditCard,
            activePrefixes: ["/dashboard/product/checkout"],
          },
          {
            label: "Edit Products",
            path: "/dashboard/product/editproducts",
            icon: FiEdit3,
            activePrefixes: ["/dashboard/product/editproducts"],
          },
          {
            label: "Order Details",
            path: "/dashboard/product/orderdetails",
            icon: FiFileText,
            activePrefixes: ["/dashboard/product/orderdetails"],
          },
          {
            label: "Orders",
            path: "/dashboard/product/orders",
            icon: FiClipboard,
            activePrefixes: ["/dashboard/product/orders"],
          },
          {
            label: "Products",
            path: "/dashboard/product/products",
            icon: FiBox,
            activePrefixes: ["/dashboard/product/products"],
          },
          {
            label: "Product Details",
            path: "/dashboard/product/productdetails",
            icon: FiPackage,
            activePrefixes: ["/dashboard/product/productdetails"],
          },
          {
            label: "Products List",
            path: "/dashboard/product/listproduct",
            icon: FiList,
            activePrefixes: ["/dashboard/product/listproduct"],
          },
          {
            label: "Wishlist",
            path: "/dashboard/product/wishlist",
            icon: FiHeart,
            activePrefixes: ["/dashboard/product/wishlist"],
          },
        ],
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        label: "Customers",
        path: "/dashboard/customers",
        icon: FiUsers,
        activePrefixes: ["/dashboard/customers"],
      },
      {
        label: "Analytics",
        path: "/dashboard/analytics",
        icon: FiBarChart2,
        activePrefixes: ["/dashboard/analytics"],
      },
      {
        label: "Settings",
        path: "/dashboard/settings",
        icon: FiSettings,
        activePrefixes: ["/dashboard/settings"],
      },
    ],
  },
];

const Sidebar = ({ isSidebarOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const isItemActive = (item: NavigationItem) => {
    if (item.end) {
      return location.pathname === item.path;
    }

    return (
      item.activePaths?.includes(location.pathname) ||
      (item.activePrefixes || [item.path]).some((prefix) =>
        location.pathname.startsWith(prefix)
      )
    );
  };

  const toggleMenu = (item: NavigationItem) => {
    setOpenMenus((current) => ({
      ...current,
      [item.label]: !(current[item.label] ?? item.defaultOpen ?? false),
    }));
  };

  const handleItemClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose?.();
    }
  };

  const getCollapsedItems = (items: NavigationItem[]) =>
    items.flatMap((item) => {
      if (item.children) {
        return [{ ...item, icon: item.icon ?? FiGrid }, ...item.children];
      }

      return [item];
    });

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r border-white/[0.06] bg-[#111c2d] text-slate-300 shadow-2xl transition-[transform,width] duration-300 ${isSidebarOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full lg:w-20 lg:translate-x-0"
        }`}
    >
      <div
        className={`flex h-[68px] items-center border-b border-white/[0.06] transition-all duration-300 ${
          isSidebarOpen ? "justify-between px-6" : "justify-center px-0"
        }`}
      >
        <NavLink
          to="/dashboard"
          className={`flex min-w-0 items-center ${
            isSidebarOpen
              ? ""
              : "h-10 w-10 justify-center overflow-hidden rounded-xl"
          }`}
          onClick={handleItemClick}
        >
          <img
            src="/desktop-dark.png"
            alt="Xintra"
            className={
              isSidebarOpen
                ? "h-[28px] w-auto"
                : "h-8 w-28 max-w-none object-cover object-left"
            }
          />
        </NavLink>

        <button
          type="button"
          aria-label="Close sidebar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          onClick={onClose}
        >
          <FiX className="text-xl" />
        </button>
      </div>

      <nav
        className={`flex-1 overflow-y-auto no-scrollbar ${
          isSidebarOpen ? "px-4 py-5" : "px-0 py-4"
        }`}
      >
        {isSidebarOpen ? (
          navigationGroups.map((group) => (
            <div key={group.title} className="mb-7 last:mb-0">
              <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#61748f] opacity-85">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item);
                  const isExpanded =
                    active || (openMenus[item.label] ?? item.defaultOpen ?? false);

                  if (item.children) {
                    return (
                      <div key={item.label}>
                        <button
                          type="button"
                          className={`group flex w-full items-center gap-3.5 px-3 py-2.5 text-[14px] font-medium transition-colors duration-200 ${active
                            ? "text-white bg-transparent"
                            : "text-slate-400 hover:text-white bg-transparent"
                            }`}
                          onClick={() => toggleMenu(item)}
                        >
                          {Icon && (
                            <Icon
                              className={`text-lg transition-colors duration-200 ${active ? "text-white" : "text-slate-400 group-hover:text-white"
                                }`}
                            />
                          )}
                          <span className="flex-1 text-left">{item.label}</span>
                          <FiChevronDown
                            className={`text-sm text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                              }`}
                          />
                        </button>

                        <div
                          className={`grid transition-all duration-300 ${isExpanded
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                          <div className="overflow-hidden">
                            <div className="mt-1 space-y-1 pb-1 pl-10">
                              {item.children.map((child) => {
                                const childActive = isItemActive(child);

                                return (
                                  <NavLink
                                    key={child.label}
                                    to={child.path}
                                    end={child.end}
                                    onClick={handleItemClick}
                                    className={`group flex items-center gap-3 px-3 py-2 text-[13.5px] font-medium transition-colors duration-200 ${childActive
                                      ? "text-white bg-transparent"
                                      : "text-slate-400 hover:text-white bg-transparent"
                                      }`}
                                  >
                                    <span
                                      className={`h-px w-2 shrink-0 transition-colors ${childActive
                                        ? "bg-indigo-400"
                                        : "bg-slate-600 group-hover:bg-slate-400"
                                        }`}
                                    />
                                    <span>{child.label}</span>
                                  </NavLink>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      end={item.end}
                      onClick={handleItemClick}
                      className={`group flex items-center gap-3.5 px-3 py-2.5 text-[14px] font-medium transition-colors duration-200 ${active
                        ? "text-white bg-transparent"
                        : "text-slate-400 hover:text-white bg-transparent"
                        }`}
                    >
                      {Icon && (
                        <Icon
                          className={`text-lg transition-colors duration-200 ${active ? "text-white" : "text-slate-400 group-hover:text-white"
                            }`}
                        />
                      )}
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center">
            {navigationGroups.map((group) => (
              <div key={group.title} className="flex w-full flex-col items-center">
                <div className="my-4 flex justify-center" aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full border border-slate-500" />
                </div>
                <div className="flex flex-col items-center gap-3">
                  {getCollapsedItems(group.items).map((item) => {
                    const Icon = item.icon;
                    const active = isItemActive(item);

                    if (!Icon) {
                      return null;
                    }

                    return (
                      <NavLink
                        key={`${group.title}-${item.label}`}
                        to={item.path}
                        end={item.end}
                        aria-label={item.label}
                        title={item.label}
                        onClick={handleItemClick}
                        className={`group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 ${
                          active
                            ? "bg-white/10 text-white"
                            : "text-slate-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon className="text-lg" />
                        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
                          {item.label}
                        </span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
