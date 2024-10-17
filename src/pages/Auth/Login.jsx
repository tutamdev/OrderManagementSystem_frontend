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

  const handleLogin = async (acount) => {
    await login(acount)
      .then((response) => {
        // Khi đăng nhập thành công, lưu token trong LocalStorage và chuyển hướng
        const token = response.data.result.token;
        LocalStorageService.setItem("token", token);
        fetchEmployeeInfo();
        notification.success({
          message: "Đăng nhập thành công",
          description: "Chào mừng đến với bình nguyên vô tận!",
          duration: 4,
        });
        navigate("/");
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
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="border px-5 py-5 rounded-xl shadow-lg">
          <h3 className="text-center text-[22px] font-semibold uppercase py-3">
            Đăng nhập
          </h3>
          <Form
            style={{
              minWidth: 350,
              maxWidth: 800,
            }}
            onFinish={handleLogin}
            onFinishFailed={handleLoginFailed}
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
              <Input placeholder="Username" />
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
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="default"
                variant="outlined"
                htmlType="submit"
                block
                style={{ background: "#00b96b", color: "#fff" }}
              >
                Đăng nhập
              </Button>
            </Form.Item>
            <div className="text-center text-[16px]">
              <span>Bạn chưa có tài khoản? </span>
              <Link to="/register">
                <span className="text-blue-600">Đăng ký</span>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
