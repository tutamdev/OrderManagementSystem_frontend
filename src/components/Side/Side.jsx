import React, { useState, useEffect } from 'react';
import { AppstoreOutlined, BuildOutlined, ShopOutlined, CalendarOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { getAllArea } from '../../services/AreaService';
import { Link } from 'react-router-dom';
const { Sider } = Layout;
import '../../assets/Side/Side.css';


function Side() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  const items = [
    {
      key: 'sale',
      label: <span className='menu-text'>Bán hàng</span>,
      className: 'menu-item',
    },
    {
      key: 'areas',
      label: 'Khu vực',
      icon: <AppstoreOutlined />,
      children: Array.isArray(areas) ? areas.map((area) => ({
        key: area.areaId,
        label: <Link to={`/areas/${area.areaId}`}>{area.areaName}</Link>,
        icon: <BuildOutlined />,
      })) : []
    },
    {
      key: 'menu',
      label: <Link to={`/menu`}>{"Menu"}</Link>,
      icon: <ShopOutlined />,
    },
    {
      key: 'shift',
      label: <Link to={`/shift-monitor`}><span style={{ color: '#F96E2A', fontWeight: 'bold' }}>Ca làm việc</span></Link>,
      icon: <CalendarOutlined style={{ color: '#F96E2A' }} />,
    },
  ];

  useEffect(() => {
    fetchAreas();
  }, []);
  //call Api
  const fetchAreas = async () => {
    try {
      setLoading(true);
      const response = await getAllArea();
      setAreas(response.data.result);
    } catch (error) {
      console.log('Error fetching areas: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy tất cả các key của SubMenu
  const getAllSubMenuKeys = (items) => {
    const keys = [];
    items.forEach((item) => {
      if (item.children) {
        keys.push(item.key);
      }
    });
    return keys;
  };
  const [openKeys, setOpenKeys] = useState(getAllSubMenuKeys(items)); // Luôn mở tất cả SubMenu
  return (
    <Sider style={{ height: '100vh', position: 'sticky', top: '0' }} collapsible>
      <Menu
        style={{
          height: '100%'   // Đặt chiều cao của Sider bằng toàn bộ chiều cao của màn hình
        }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sale']}
        mode="inline"
        items={items}
        openKeys={openKeys} // Thiết lập tất cả SubMenu luôn mở
        onOpenChange={(keys) => setOpenKeys(keys)}
      />
    </Sider>
  );
};
export default Side;