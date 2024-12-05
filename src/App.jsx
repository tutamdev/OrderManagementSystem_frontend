import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ErrorPage from "./pages/Error/ErrorPage";

// Admin
import AdminHome from "./pages/Admin/AdminHome";
import { Dashboard } from "./admin_components/Dashboard/Dashboard";
import { ManageEmployee } from "./admin_components/Contents/Employee/ManageEmployee";
import { ManageArea } from "./admin_components/Contents/Area/ManageArea";
import { ManageCategory } from "./admin_components/Contents/Category/ManageCategory";
import { ManageShift } from "./admin_components/Contents/Shift/ManageShift";
import { ManageDiscount } from "./admin_components/Contents/Discount/ManageDiscount";
import { Profile } from "./admin_components/Contents/Employee/Profile";
import { MangeTable } from "./admin_components/Contents/Table/MangeTable";
import { ManageFood } from "./admin_components/Contents/Food/ManageFood";
import { ManageOrder } from "./admin_components/Contents/Order/ManageOrder";
import { ManageOrderDetail } from "./admin_components/Contents/Order/ManageOrderDetail";
import { ManageFoodDetail } from "./admin_components/Contents/Food/ManageFoodDetail";


export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />





        {/* Admin */}
        <Route path="/admin" element={<AdminHome />}>
          <Route index element={<Dashboard />} />

          <Route path="employee" element={<ManageEmployee />} />

          <Route path="area" element={<ManageArea />} />
          <Route path="area/:areaId" element={< MangeTable />} />

          <Route path="category" element={<ManageCategory />} />
          <Route path="category/:categoryId" element={<ManageFood />} />
          <Route path="category/:categoryId/:foodId?" element={<ManageFoodDetail />} />

          <Route path="order" element={<ManageShift />} />
          <Route path="order/:shiftId" element={<ManageOrder />} />
          <Route path="order/:shiftId/:orderId?" element={<ManageOrderDetail />} />

          <Route path="discount" element={<ManageDiscount />} />

          <Route path="profile" element={<Profile />} />

        </Route>
      </Routes>
    </>
  );
}
