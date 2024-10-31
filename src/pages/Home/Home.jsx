import { Layout } from "antd";
const { Content} = Layout;
import React from "react";
import Nav from "../../components/Home/Nav";
import Side from "../../components/Home/Side";


const Home = () => {
  return (
    <Layout>
        <Nav /> {/* Thanh điều hướng trên cùng */}
        <Layout>
            <Side /> {/* Sidebar */}
            <Layout style={{ padding: '0 24px 24px' }}> {/* Padding cho Content chính */}
                <Content>
                    <p>Hekl</p>
                </Content>
            </Layout>
        </Layout>
    </Layout>
  );
};

export default Home;
