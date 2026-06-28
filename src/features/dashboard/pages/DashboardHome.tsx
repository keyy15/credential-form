import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  FiActivity,
  FiArrowDownRight,
  FiArrowUpRight,
  FiCreditCard,
  FiDollarSign,
  FiMoreHorizontal,
  FiPackage,
  FiShoppingCart,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

type StatItem = {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: IconType;
  positive: boolean;
  accent: string;
};

type OrderStatus = "Paid" | "Pending" | "Shipped" | "Refunded";

type RecentOrder = {
  id: string;
  customer: string;
  status: OrderStatus;
  amount: string;
  date: string;
};

type ProductSummary = {
  name: string;
  category: string;
  sales: string;
  share: string;
  color: string;
};

type Transaction = {
  title: string;
  description: string;
  amount: string;
  icon: IconType;
  tone: string;
};

const statusStyles: Record<OrderStatus, string> = {
  Paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  Shipped: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  Refunded: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
};

const cardClass =
  "rounded-lg border border-slate-200/80 bg-white shadow-sm shadow-slate-950/[0.03] dark:border-white/10 dark:bg-[#19191c] dark:shadow-black/20";

const StatCard = ({ stat }: { stat: StatItem }) => {
  const Icon = stat.icon;
  const TrendIcon = stat.positive ? FiArrowUpRight : FiArrowDownRight;

  return (
    <div
      className={`${cardClass} group p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/[0.06] dark:hover:shadow-black/30`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.accent}`}>
          <Icon className="text-xl" />
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
            stat.positive
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
          }`}
        >
          <TrendIcon className="text-sm" />
          {stat.change}
        </span>
      </div>
      <div className="mt-5">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {stat.title}
        </p>
        <h3 className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">
          {stat.value}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {stat.description}
        </p>
      </div>
    </div>
  );
};

const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) => (
  <section className={`${cardClass} overflow-hidden`}>
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-white/10">
      <div>
        <h2 className="text-base font-extrabold text-slate-950 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {action || (
        <button
          type="button"
          aria-label={`${title} options`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <FiMoreHorizontal className="text-xl" />
        </button>
      )}
    </div>
    <div className="p-5">{children}</div>
  </section>
);

const DashboardHome = () => {
  const stats: StatItem[] = [
    {
      title: "Total Sales",
      value: "$128,420",
      change: "+12.4%",
      description: "Sales volume increased this month",
      icon: FiDollarSign,
      positive: true,
      accent: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
    },
    {
      title: "Total Orders",
      value: "8,642",
      change: "+8.2%",
      description: "1,284 orders awaiting fulfillment",
      icon: FiShoppingCart,
      positive: true,
      accent: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
    },
    {
      title: "Total Customers",
      value: "24,892",
      change: "+6.8%",
      description: "824 new customers joined",
      icon: FiUsers,
      positive: true,
      accent: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300",
    },
    {
      title: "Revenue",
      value: "$86,390",
      change: "-2.1%",
      description: "Net revenue after discounts",
      icon: FiTrendingUp,
      positive: false,
      accent: "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
    },
  ];

  const chartData = [
    { label: "Mon", sales: 52, orders: 38 },
    { label: "Tue", sales: 64, orders: 45 },
    { label: "Wed", sales: 48, orders: 34 },
    { label: "Thu", sales: 78, orders: 58 },
    { label: "Fri", sales: 70, orders: 52 },
    { label: "Sat", sales: 88, orders: 63 },
    { label: "Sun", sales: 74, orders: 55 },
  ];

  const recentOrders: RecentOrder[] = [
    {
      id: "#ORD-2489",
      customer: "Sophia Carter",
      status: "Paid",
      amount: "$1,240.00",
      date: "Jun 07, 2026",
    },
    {
      id: "#ORD-2488",
      customer: "Daniel Lee",
      status: "Pending",
      amount: "$860.50",
      date: "Jun 06, 2026",
    },
    {
      id: "#ORD-2487",
      customer: "Maya Johnson",
      status: "Shipped",
      amount: "$2,430.00",
      date: "Jun 06, 2026",
    },
    {
      id: "#ORD-2486",
      customer: "Noah Williams",
      status: "Refunded",
      amount: "$320.00",
      date: "Jun 05, 2026",
    },
    {
      id: "#ORD-2485",
      customer: "Emma Brown",
      status: "Paid",
      amount: "$1,096.80",
      date: "Jun 05, 2026",
    },
  ];

  const topProducts: ProductSummary[] = [
    {
      name: "Galaxy S24 Ultra",
      category: "Smartphones",
      sales: "$32.4k",
      share: "86%",
      color: "bg-blue-500",
    },
    {
      name: "AirPods Pro",
      category: "Audio",
      sales: "$24.8k",
      share: "72%",
      color: "bg-violet-500",
    },
    {
      name: "Ultra Smart Watch",
      category: "Wearables",
      sales: "$18.2k",
      share: "58%",
      color: "bg-cyan-500",
    },
    {
      name: "Wireless Charger",
      category: "Accessories",
      sales: "$12.9k",
      share: "44%",
      color: "bg-amber-500",
    },
  ];

  const transactions: Transaction[] = [
    {
      title: "Payment received",
      description: "Stripe payout for order #ORD-2489",
      amount: "+$1,240",
      icon: FiCreditCard,
      tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    },
    {
      title: "Inventory updated",
      description: "Galaxy S24 Ultra stock replenished",
      amount: "120 units",
      icon: FiPackage,
      tone: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
    },
    {
      title: "Campaign performance",
      description: "Summer sale conversion improved",
      amount: "+18.7%",
      icon: FiActivity,
      tone: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200/80 bg-white px-5 py-5 shadow-sm shadow-slate-950/[0.03] dark:border-white/10 dark:bg-[#19191c] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-300">
            Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white sm:text-3xl">
            Welcome back, Admin
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Track store performance, recent orders, and customer activity from
            a single overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Export
          </button>
          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
          >
            Add Report
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.8fr)]">
        <DashboardCard
          title="Sales Overview"
          subtitle="Weekly performance by sales and orders"
          action={
            <div className="hidden items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 sm:flex">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                Sales
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
                Orders
              </span>
            </div>
          }
        >
          <div className="relative h-72 rounded-lg bg-gradient-to-b from-slate-50 to-white dark:from-white/[0.04] dark:to-transparent">
            <div className="absolute inset-x-4 bottom-12 top-7 grid grid-rows-4">
              {[0, 1, 2, 3].map((line) => (
                <div
                  key={line}
                  className="border-t border-dashed border-slate-200 dark:border-white/10"
                />
              ))}
            </div>
            <div className="relative z-10 flex h-full items-end justify-between gap-2 px-4 pb-4 pt-8 sm:gap-4">
              {chartData.map((point) => (
                <div
                  key={point.label}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div className="flex min-h-0 w-full flex-1 items-end justify-center gap-1.5">
                    <div
                      className="w-full max-w-8 rounded-t-lg bg-gradient-to-t from-indigo-600 to-blue-400 shadow-lg shadow-indigo-500/10 transition duration-200 hover:opacity-80"
                      style={{ height: `${point.sales}%` }}
                    />
                    <div
                      className="w-full max-w-3 rounded-t-lg bg-violet-300/90 dark:bg-violet-400/70"
                      style={{ height: `${point.orders}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Top Products"
          subtitle="Best sellers this period"
        >
          <div className="space-y-5">
            {topProducts.map((product) => (
              <div key={product.name}>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {product.category}
                    </p>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {product.sales}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${product.color}`}
                    style={{ width: product.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <DashboardCard
          title="Recent Orders"
          subtitle="Latest customer purchases"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.08em] text-slate-400 dark:border-white/10">
                  <th className="pb-3 font-extrabold">Order ID</th>
                  <th className="pb-3 font-extrabold">Customer</th>
                  <th className="pb-3 font-extrabold">Status</th>
                  <th className="pb-3 font-extrabold">Amount</th>
                  <th className="pb-3 font-extrabold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="text-sm transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="py-4 font-extrabold text-indigo-600 dark:text-indigo-300">
                      {order.id}
                    </td>
                    <td className="py-4 font-semibold text-slate-900 dark:text-white">
                      {order.customer}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-slate-700 dark:text-slate-200">
                      {order.amount}
                    </td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Activity & Transactions"
          subtitle="Operational updates"
        >
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const Icon = transaction.icon;

              return (
                <div
                  key={transaction.title}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="flex min-w-0 gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${transaction.tone}`}
                    >
                      <Icon className="text-lg" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {transaction.title}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                        {transaction.description}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-extrabold text-slate-900 dark:text-white">
                    {transaction.amount}
                  </span>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default DashboardHome;
