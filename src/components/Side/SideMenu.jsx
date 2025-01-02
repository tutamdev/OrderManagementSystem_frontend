import React, { useState, useEffect } from 'react';
import { AppstoreOutlined, CoffeeOutlined, LeftOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';
const { Sider } = Layout;
import { getAllCategories } from '../../services/CategoryService';
import { useNavigate } from 'react-router-dom';
import food from '../../assets/fast-food.png';
import '../../assets/Side/Side.css';


function Side({ onCategoryClick }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const items = [
    {
      key: 'back',
      label: (
        <button onClick={() => navigate(-1  )} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>
          Quay lại
        </button>
      ),
      icon: < LeftOutlined style={{ color: 'white', fontWeight: 'bold' }} />,
      className: 'menu-item',
    },
    {
      key: 'category',
      label: 'Thể loại món',
      icon: <AppstoreOutlined />,
      children: Array.isArray(categories) ? categories.map((category) => ({
        key: category.categoryId,
        label: category.name,
        icon: <img src={food} alt="Category Item Icon" style={{ width: '16px', height: '16px' }} />,
        onClick: () => onCategoryClick(category.categoryId) // Thêm sự kiện onClick
      })) : []
    },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);
  //call Api
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      setCategories(response.data.result);
    } catch (error) {
      console.log('Error fetching areas: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sider style={{ height: '100vh', position: 'fixed', top: '100px' }}>
      <Menu
        style={{ height: '100%' }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sale']}
        mode="inline"
        items={items}
        // Thêm onClick cho toàn bộ Menu
        onClick={({ key }) => {
          const category = categories.find(cat => cat.categoryId === key);
          if (category) {
            onCategoryClick(category.categoryId);
          }
        }}
      />
    </Sider>
  );
};
export default Side;