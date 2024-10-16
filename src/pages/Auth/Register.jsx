import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
const Register = () => {
  useEffect(() => {
    document.title = "Đăng ký";
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
            Đăng ký
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
