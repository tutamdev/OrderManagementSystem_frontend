import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EmployeeRouteGuard = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        const userLogged = JSON.parse(localStorage.getItem("userLogged"));

        // Kiểm tra role của người dùng
        if (userLogged.role !== "EMPLOYEE") {
            alert("Bạn không có quyền truy cập trang này!"); // Thông báo
            navigate("/admin"); // Chuyển hướng về trang đăng nhập
        }
    }, [location, navigate]);

    return children; // Render children nếu người dùng có quyền
};

export default EmployeeRouteGuard;