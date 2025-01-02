import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminRouteGuard = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra nếu URL có chứa '/admin'
        if (location.pathname.includes("/admin")) {
            // Lấy thông tin người dùng từ localStorage
            const userLogged = JSON.parse(localStorage.getItem("userLogged"));

            // Kiểm tra role của người dùng
            if (!userLogged || userLogged.role !== "ADMIN") {
                alert("Bạn không có quyền truy cập trang này!"); // Thông báo
                navigate("/"); // Chuyển hướng về trang chủ
            }
        }
    }, [location, navigate]);

    return children; // Render children nếu người dùng có quyền
};

export default AdminRouteGuard;