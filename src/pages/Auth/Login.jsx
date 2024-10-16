import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";

const Login = () => {
  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

  const onFinish = (employee) => {
    console.log("Employee:", employee);
  };
  const onFinishFailed = (errorInfo) => {
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
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
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
                Đăng ký
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
