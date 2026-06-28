import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { IconType } from "react-icons";
import { AiOutlineHome } from "react-icons/ai";
import {
  FiBarChart2,
  FiChevronDown,
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
    title: "Menu",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: AiOutlineHome,
        end: true,
      },
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
            activePrefixes: ["/dashboard/product/create"],
          },
          {
            label: "Cart",
            path: "/dashboard/product/cart",
            activePrefixes: ["/dashboard/product/cart"],
          },
          {
            label: "Checkout",
            path: "/dashboard/product/checkout",
            activePrefixes: ["/dashboard/product/checkout"],
          },
          {
            label: "Edit Products",
            path: "/dashboard/product/editproducts",
            activePrefixes: ["/dashboard/product/editproducts"],
          },
          {
            label: "Order Details",
            path: "/dashboard/product/orderdetails",
            activePrefixes: ["/dashboard/product/orderdetails"],
          },
          {
            label: "Orders",
            path: "/dashboard/product/orders",
            activePrefixes: ["/dashboard/product/orders"],
          },
          {
            label: "Products",
            path: "/dashboard/product/products",
            activePrefixes: ["/dashboard/product/products"],
          },
          {
            label: "Product Details",
            path: "/dashboard/product/productdetails",
            activePrefixes: ["/dashboard/product/productdetails"],
          },
          {
            label: "Products List",
            path: "/dashboard/product/listproduct",
            activePrefixes: ["/dashboard/product/listproduct"],
          },
          {
            label: "Wishlist",
            path: "/dashboard/product/wishlist",
            activePrefixes: ["/dashboard/product/wishlist"],
          },
        ],
      },
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

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden border-r border-white/10 bg-[#101624] text-white shadow-2xl shadow-slate-950/20 transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-[73px] items-center justify-between border-b border-white/10 px-5">
        <NavLink
          to="/dashboard"
          className="flex min-w-0 items-center gap-3"
          onClick={onClose}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-black shadow-lg shadow-indigo-950/40">
            X
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold tracking-normal">
              Xintra
            </p>
            <p className="truncate text-xs font-medium text-slate-400">
              Admin Console
            </p>
          </div>
        </NavLink>

        <button
          type="button"
          aria-label="Close sidebar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
          onClick={onClose}
        >
          <FiX className="text-xl" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin">
        {navigationGroups.map((group) => (
          <div key={group.title} className="mb-7 last:mb-0">
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
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
                        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                          active
                            ? "bg-white/[0.06] text-white"
                            : "text-slate-400 hover:bg-white/10 hover:text-white"
                        }`}
                        onClick={() => toggleMenu(item)}
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            active
                              ? "bg-indigo-500/15 text-indigo-300"
                              : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                          }`}
                        >
                          {Icon && <Icon className="text-lg" />}
                        </span>
                        <span className="flex-1 text-left">{item.label}</span>
                        <FiChevronDown
                          className={`text-base transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`grid transition-all duration-300 ${
                          isExpanded
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="mt-2 space-y-1 pb-1 pl-12">
                            {item.children.map((child) => {
                              const childActive = isItemActive(child);

                              return (
                                <NavLink
                                  key={child.label}
                                  to={child.path}
                                  end={child.end}
                                  onClick={onClose}
                                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                                    childActive
                                      ? "bg-white/[0.08] text-white"
                                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                                  }`}
                                >
                                  <span
                                    className={`h-px w-2.5 shrink-0 transition ${
                                      childActive
                                        ? "bg-indigo-300"
                                        : "bg-slate-500 group-hover:bg-slate-300"
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
                    onClick={onClose}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-white text-indigo-600 shadow-lg shadow-indigo-950/20"
                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                        active
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                      }`}
                    >
                      {Icon && <Icon className="text-lg" />}
                    </span>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
