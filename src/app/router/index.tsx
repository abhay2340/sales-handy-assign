import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { ShopLayout } from "@/app/layouts/ShopLayout/ShopLayout";
import { AuthLayout } from "@/app/layouts/AuthLayout/AuthLayout";
import { DashboardLayout } from "@/app/layouts/DashboardLayout/DashboardLayout";

import {
  ShopHome,
  LoginForm,
  Dashboard,
  AllProducts,
  ProductDetails,
} from "@/pages/pages";

import { appPaths, appNestedPaths } from "./paths";
import { PageLoader } from "@/shared/components/PageLoader";

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Shop Routes */}
        <Route path={appPaths.home} element={<ShopLayout />}>
          <Route index element={<ShopHome />} />
          <Route path={appNestedPaths.products} element={<ShopHome />} />
          <Route path={appPaths.allProducts} element={<AllProducts />} />
          <Route path={appPaths.productDetails} element={<ProductDetails />} />
        </Route>

        {/* Auth Routes */}
        <Route path={appPaths.auth} element={<AuthLayout />}>
          <Route index element={<LoginForm />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path={appPaths.dashboard} element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          {/* Fallback sub-routes redirect to main dashboard overview */}
          <Route
            path="*"
            element={<Navigate to={appPaths.dashboard} replace />}
          />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to={appPaths.home} replace />} />
      </Routes>
    </Suspense>
  );
}
