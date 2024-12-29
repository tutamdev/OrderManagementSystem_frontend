import React from 'react'
import { NavLink } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons';
import { FaUserCog, FaUserEdit } from "react-icons/fa";
import { TbMapCog } from "react-icons/tb";
import { MdFastfood } from "react-icons/md";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { BiSolidDiscount } from "react-icons/bi";
import { Button } from 'antd';
export const Sidebar = () => {
  const menuItems = [
    { link: "/admin", icon: <HomeOutlined />, label: "Dashboard" },
    { link: "/admin/employee", icon: <FaUserCog />, label: "Nhân viên" },
    { link: "/admin/area", icon: <TbMapCog />, label: "Khu vực" },
    { link: "/admin/category", icon: <MdFastfood />, label: "Sản phẩm" },
    { link: "/admin/order", icon: <RiMoneyDollarCircleFill />, label: "Hoá đơn" },
    { link: "/admin/discount", icon: <BiSolidDiscount />, label: "Ưu đãi" }
  ];
  return (
    <div className="min-w-52 bg-gray-50 border-r flex flex-col justify-between h-full fixed z-10">
      <div className="py-2 px-6">
        <a href="/admin">
          <img
            className="w-auto h-14 mx-auto object-contain"
            src="https://inkythuatso.com/uploads/thumbnails/800/2021/12/logo-dai-hoc-cong-nghiep-ha-noi-inkythuatso-01-21-16-44-16.jpg"
            alt="Logo HAUI"
          />
        </a>
      </div>
      <div>
        <h3 className="mx-6 mb-2 text-xs text-gray-400 uppercase tracking-widest">
          Dashboard
        </h3>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.link}
            end={item.link === "/admin"}
            className={({ isActive }) =>
              `flex  items-center space-x-3 ml-2 px-6 py-2.5 text-gray-500 ${isActive ? 'text-orange-500' : 'hover:text-orange-500'} group`
            }
          >
            {item.icon}
            <p>{item.label}</p>
          </NavLink>
        ))}
      </div>
      <div className="mt-auto mb-4">
        <h3 className="mx-6 mb-2 text-xs text-gray-400 uppercase tracking-widest">
          PROFILE
        </h3>
        <NavLink
          to={"/admin/profile"}
          className={({ isActive }) =>
            `flex items-center space-x-3 ml-2 px-6 py-2.5 text-gray-500 ${isActive ? 'text-orange-500' : 'hover:text-orange-500'} group`
          }
        >
          <FaUserEdit />
          <p>Cá nhân</p>
        </NavLink>
      </div>
    </div>
  )
}
