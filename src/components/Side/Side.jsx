import React, { useState, useEffect } from 'react';
import { AppstoreOutlined, BuildOutlined, ShopOutlined} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { getAllArea} from '../../services/AreaService';
import { Link} from 'react-router-dom';
const { Sider} = Layout;




function Side(){
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);

    const items = [
      {
        key: 'sale',
        label: <span style={{fontWeight:'bold'}}>Bán hàng</span>,
      },
      {
        key: 'areas',
        label:'Khu vực',
        icon: <AppstoreOutlined />,
        children: Array.isArray(areas) ? areas.map((area) => ({
          key: area.areaId,
          label: <Link to={`/areas/${area.areaId}`}>{area.areaName}</Link>,
          icon: <BuildOutlined />,
        })) : []
      },
      {
        key: 'menu',
        label: <Link to={`/menu`}>{"Menu"}</Link> ,
        icon: <ShopOutlined />,
      },
      {
        key: 'shift',
        label: <Link to={`/shift-monitor`} style={{fontWeight:'bold'}}>{"Ca làm việc"}</Link> ,
      },
    ];

    useEffect(() => {
        fetchAreas();
    }, []);
    //call Api
    const fetchAreas = async () => {
      try{
        setLoading(true);
        const response = await getAllArea();
        setAreas(response.data.result);
      }catch(error){
        console.log('Error fetching areas: ', error);
      }finally{
        setLoading(false);
      }
    };

    return(
        <Sider style={{height: '100vh', position:'sticky', top:'0'}}>
            <Menu
            style={{ height: '100%'   // Đặt chiều cao của Sider bằng toàn bộ chiều cao của màn hình
                }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sale']}
            mode="inline"
            items={items}
            />
        </Sider>
    );
};
export default Side;