import React, { useEffect } from "react";
import { Button, Form, Input, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/AuthService";
import LocalStorageService from "../../services/LocalStorageService";
import { getEmployeeInfo } from "../../services/EmployeeService";

const Login = () => {
  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

  const navigate = useNavigate();

  const handleLogin = async (account) => {
    await login(account)
      .then((response) => {
        const token = response.data.result.token;
        LocalStorageService.setItem("token", token);
        fetchEmployeeInfo();
        notification.success({
          message: "Đăng nhập thành công",
          description: "Chào mừng đến với hệ thống!",
          duration: 4,
        });
        navigate("/shifts");
      })
      .catch(() => {
        notification.error({
          message: "Đăng nhập không thành công!",
          description: "Tài khoản hoặc mật khẩu không chính xác!",
        });
      });
  };

  const fetchEmployeeInfo = async () => {
    await getEmployeeInfo()
      .then((response) => {
        const EmployeeInfo = response.data.result;
        LocalStorageService.setItem("userLogged", EmployeeInfo);
        console.log(LocalStorageService.getItem("userLogged"));
        return response.data.result;
      })
      .catch((error) => {
        console.log(error?.response);
      });
  };

  const handleLoginFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      {/* Background Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute transform scale-50 opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 60 + 40}px`,
              color: `rgba(255, 255, 255, 0.2)`,
            }}
          >
            {i % 2 === 0 ? "🍔" : "☕"}
          </div>
        ))}
      </div>

      {/* Login Card */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px] relative z-10">
        <h2 className="text-center text-2xl font-bold text-gray-700 mb-6 uppercase">
          Đăng nhập
        </h2>
        <Form
          name="loginForm"
          onFinish={handleLogin}
          onFinishFailed={handleLoginFailed}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Username không được để trống!",
              },
            ]}
          >
            <Input
              placeholder="Tên đăng nhập"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Mật khẩu không được để trống!",
              },
            ]}
          >
            <Input.Password
              placeholder="Mật khẩu"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="rounded-md"
              style={{
                background: "linear-gradient(to right, #00b96b, #0071e3)",
                border: "none",
                color: "#fff",
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <span className="text-gray-600">Bạn chưa có tài khoản? </span>
            <Link to="/register" className="text-blue-600 font-medium">
              Đăng ký
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
