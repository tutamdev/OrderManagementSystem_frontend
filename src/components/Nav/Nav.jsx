import React from "react";
import { useState, useEffect } from "react";
import {Menu, Layout} from "antd";
const { Header} = Layout;
import logo from '../../assets/logo.jfif';
import avatar from '../../assets/avatar.jpg';



function Nav(){
    //get real time
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Cập nhật mỗi giây

        // Hủy timer khi component bị gỡ bỏ
        return () => clearInterval(timer);
    }, []);

    const currentDate = currentTime.toLocaleDateString(); // Lấy ngày tháng năm
    const currentClock = currentTime.toLocaleTimeString(); // Lấy giờ phút giây

    //data use
    const userData = {
        full_name: 'Nguyễn Văn A',
        role: 'Nhân viên', 
    };

    return(
        <Header style={{backgroundColor:'white', padding:'20px 0px', height: "100px"}}>
            <div className="logo" />
            <Menu  theme="light" mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="logo" disabled style={{ cursor: 'default' }}> 
                    <img 
                        src={logo}
                        alt="Logo" 
                        style={{ height: '40px', marginRight: '16px' }} // Tùy chỉnh kích thước logo
                    />
                    <h3>GROUP 19</h3>
                </Menu.Item>

                
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <p style={{height:'20px', fontSize:'16px', fontWeight:'bolder'}}>{currentDate}</p>
                    <p style={{height:'20px'}} className="flex justify-center">{currentClock}</p>
                </div>

                <div className="flex ms-auto">
                    <div>
                        <p style={{height:'20px', fontSize:'16px', fontWeight:'bolder'}}>{userData.full_name}</p>
                        <p style={{height:'20px'}} className="flex justify-end">{userData.role}</p>
                    </div>
                    <div className="flex items-center">
                        <img 
                            src={avatar}
                            alt="Logo" 
                            style={{ height: '40px', marginRight: '16px', marginLeft:'10px', borderRadius:'50%', }} // Tùy chỉnh kích thước logo
                        />
                    </div>
                </div>

            </Menu>
        </Header>
    );
};

export default Nav;