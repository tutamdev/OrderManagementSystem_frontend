import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
const ErrorPage = () => {
  const navigate = useNavigate();
  const backToHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Button onClick={backToHome} type="primary">
              Back Home
            </Button>
          }
        />
      </div>
    </>
  );
};

export default ErrorPage;
