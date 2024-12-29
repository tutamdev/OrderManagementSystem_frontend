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


        {/* <Route path="/areas/:areaId" element={<AreaDetail />} /> */}
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
