import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';
const { Sider} = Layout;
const items = [
    {
        key: 'sub1',
        label: 'Bán hàng',
    },
    {
      key: 'sub2',
      label: 'Khu vực',
      icon: <AppstoreOutlined />,
      children: [
        {
          key: '1',
          label: 'Tầng 1',
        },
        {
          key: '2',
          label: 'Tầng  2',
        },
        {
            key: '3',
            label: 'Tầng 3',
          },
          {
            key: '4',
            label: 'Ngoài trời',
          },
      ],
    },
    {
      type: 'divider',
    },
    
  ];


function Side(){

    const onClick = (e) => {
        console.log('click ', e);
      };
    return(
        <Sider>
            <Menu
            onClick={onClick}
            style={{ width: '256px', height: 'calc(100vh - 80px)',     // Đặt chiều cao của Sider bằng toàn bộ chiều cao của màn hình
                }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
            />
        </Sider>
    );
};
export default Side;