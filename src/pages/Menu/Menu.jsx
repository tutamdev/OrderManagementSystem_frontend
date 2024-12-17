import Nav from "../../components/Nav/Nav";
import { Layout } from "antd";
const { Content} = Layout;
import React from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../../components/Side/SideMenu";
import MenuDetail from "../../components/Content/Menu/MenuDetail";

function Menu(){
    return(
        <>
        <Layout>
            <Nav /> {/* Thanh điều hướng trên cùng */}
            <Layout>
                <SideMenu/>
                <Layout>
                    <Content>
                        <MenuDetail />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
        </>
    );
}

export default Menu;