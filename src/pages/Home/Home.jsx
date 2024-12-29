import { Layout } from "antd";
const { Content} = Layout;
import React from "react";
import Nav from "../../components/Nav/Nav";
import Side from "../../components/Side/Side";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <Layout>
        <Nav /> {/* Thanh điều hướng trên cùng */}
        <Layout>
            <Side/> {/* Sidebar */}
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content>
                    <div className="ml-8 mt-8">
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    </Layout>
  );
};

export default Home;
