import { Layout } from "antd";
const { Content} = Layout;
import React from "react";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import Side from "../../components/Side/Side";
import { Outlet } from "react-router-dom";
import { getAllArea } from "../../services/AreaService";

const Home = () => {
    const [fixAreaId, setFixAredId] = useState();
    const navigate = useNavigate();
    const getFirstAreaId = async() => {
        const response = await getAllArea();
        setFixAredId(response.data.result[0].areaId);
    }

    useEffect(() => {
        getFirstAreaId();
        // Điều hướng đến AreaDetail khi vào Home
        navigate(`/areas/${fixAreaId}`);
    }, [fixAreaId]);

  return (
    <Layout >
        <Nav /> {/* Thanh điều hướng trên cùng */}
        <Layout>
            <Side/> {/* Sidebar */}
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content>
                    <div className="ml-8 mt-8">
                        <Outlet style={{}} />
                    </div>
                </Content>
            </Layout>
        </Layout>
    </Layout>
  );
};

export default Home;
