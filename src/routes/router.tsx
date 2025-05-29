import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import PublicLayout from "@/components/layout/PublicLayout";
// import RequireAuth from "@/components/RequireAuth";

// Pagini
import { Home } from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import StartKDom from "@/pages/StartKDom";
import KDomPage from "@/pages/KDomPage";
// import NotFound from "@/pages/NotFound";

// import KDomPage from "@/pages/KDom";
// import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/kdom/:slug", element: <KDomPage /> },
    ],
  },
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/start-kdom", element: <StartKDom /> }, // Placeholder for Start K-Dom page
      { path: "/kdoms/slug/:slug", element: <KDomPage /> },
      // { path: "*", element: <NotFound /> },
    ],
  },
]);
