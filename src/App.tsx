import "./App.css";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import Cart from "./features/dashboard/product/Cart";
import Wishlist from "./features/dashboard/product/Wishlist";
import Products from "./features/dashboard/product/Products";
import Checkout from "./features/dashboard/product/Checkout";
import ProductDetails from "./features/dashboard/product/ProductDetails";
import Orders from "./features/dashboard/product/Order";
import EditProducts from "./features/dashboard/product/EditProducts";
import OrderDetails from "./features/dashboard/product/OrderDetails";

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
// const HomePage = lazy(() => import("./pages/auth/HomePage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const Dashboard = lazy(() => import("./features/dashboard/Layout"));
const DashboardHome = lazy(
  () => import("./features/dashboard/pages/DashboardHome")
);
const PublicRoute = lazy(() => import("./routes/PublicRoute"));
const Product = lazy(
  () => import("./features/dashboard/product/ListProduct")
);
const CreateProduct = lazy(
  () => import("./features/dashboard/product/CreateProduct")
);
const ListProduct = lazy(
  () => import("./features/dashboard/product/ListProduct")
);

const DashboardPlaceholder = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#19191c]">
    <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-300">
      Workspace
    </p>
    <h1 className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">
      {title}
    </h1>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
      {description}
    </p>
  </div>
);

function App() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const root = document.documentElement;
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <Routes>``
        <Route
          index
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />

          <Route path="product" element={<Product />} />
          <Route path="product/create" element={<CreateProduct />} />
          <Route path="product/listproduct" element={<ListProduct />} />
          <Route path="product/editproducts/:id" element={<EditProducts />} />
          <Route path="product/editproducts" element={<EditProducts />} />
          <Route
            path="product/productdetails/:id"
            element={<ProductDetails />}
          />
          <Route path="product/productdetails" element={<ProductDetails />} />
          <Route path="product/cart" element={<Cart />} />
          <Route path="product/wishlist" element={<Wishlist />} />
          <Route path="product/products" element={<Products />} />
          <Route path="product/checkout" element={<Checkout />} />
          <Route path="product/orderdetails" element={<OrderDetails />} />
          <Route path="product/orders" element={<Orders />} />
          <Route
            path="customers"
            element={
              <DashboardPlaceholder
                title="Customers"
                description="Customer management is ready for its detailed table, segments, and profile views."
              />
            }
          />
          <Route
            path="analytics"
            element={
              <DashboardPlaceholder
                title="Analytics"
                description="Analytics can be expanded with deeper campaign, conversion, and retention reports."
              />
            }
          />
          <Route
            path="settings"
            element={
              <DashboardPlaceholder
                title="Settings"
                description="Settings can host account preferences, team access, billing, and dashboard configuration."
              />
            }
          />
        </Route>
        <Route
          path="*"
          element={
            <div className="flex justify-center items-center h-screen">
              <h1 className="text-4xl font-bold">404 Not Found</h1>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
