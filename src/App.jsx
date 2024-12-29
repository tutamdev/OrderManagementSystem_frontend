import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ErrorPage from "./pages/Error/ErrorPage";
import AreaDetail from "./components/Content/Area/AreaDetail";
import { ToastContainer } from 'react-toastify';
import Menu from "./pages/Menu/Menu";
import MenuDetail from "./components/Content/Menu/MenuDetail";
import Shift from "./pages/Shift/Shift";
import Order from "./components/Content/Order/Order";
import ShiftMonitor from "./pages/Shift/ShiftMonitor";
import ShiftMonitorDetail from "./pages/Shift/ShiftMonitorDetail";

 // hoặc import theo phiên bản antd của bạn

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
        {/* area and table */}
        <Route path="/" element={<Home />} >       
          <Route path="/areas/:areaId" element={<AreaDetail />}>
          </Route>
        </Route>

      {/* menu */}
        <Route path="/menu" element={<Menu />} >
          <Route path="categories/:categoryId" element={<MenuDetail />} />
        </Route>

        {/* orders */}
        <Route path="/table/:tableId/orders/:orderId" element={<Order />} />

        {/* shift */}
        <Route path="/shifts" element={<Shift/>}/>
        <Route path="/shift-monitor" element={<ShiftMonitor/>}/>
        <Route path="/shift-monitor-detail" element={<ShiftMonitorDetail/>}/>




        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />
          
        <Route path="/areas/:areaId" element={<AreaDetail />} />

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

      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
