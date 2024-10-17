import React, { useEffect } from "react";
import { Button, Form, Input, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/AuthService";
const Register = () => {
  useEffect(() => {
    document.title = "Đăng ký";
  }, []);
  const navigate = useNavigate();
  const handleSubmit = async (account) => {
    // console.log("Acount:", account);
    await register(account)
      .then((response) => {
        const result = response.data;
        if (result.code === 200) {
          notification.success({
            message: "Thành công",
            description: "Đăng ký tài khoản thành công",
            duration: 4,
          });
          // chuyển hướng trang đăng nhập sang login
            navigate("/login");
        }
      })
      .catch((error) => {
        if (error?.response?.status) {
          notification.error({
            message: "Đăng ký thất bại",
            message: error.response.data.message,
          });
        }
      });
  };

  const handleFailed = (errorInfo) => {
    console.log("Account:", errorInfo);
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="border px-5 py-5 rounded-xl shadow-lg">
          <h3 className="text-center text-[22px] font-semibold uppercase py-3">
            Đăng ký
          </h3>
          <Form
            style={{
              minWidth: 350,
              maxWidth: 800,
            }}
            onFinish={handleSubmit}
            onFinishFailed={handleFailed}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Username không được để trống!",
                },
                {
                  min: 5,
                  message: "Username tối thiểu cần có 5 ký tự!",
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
                {
                  min: 6,
                  message: "Mật khẩu cần tối thiểu 6 ký tự!",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Họ tên không được để trống!",
                },
              ]}
            >
              <Input placeholder="Full name" />
            </Form.Item>

            <Form.Item>
              <Button
                type="default"
                variant="outlined"
                htmlType="submit"
                block
                style={{ background: "#00b96b", color: "#fff" }}
              >
                Đăng ký
              </Button>
            </Form.Item>
            <div className="text-center text-[16px]">
              <span>Bạn đã có tài khoản? </span>
              <Link to="/login">
                <span className="text-blue-600">Đăng nhập</span>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Register;
