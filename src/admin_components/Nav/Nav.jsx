import React from 'react'
import { LogoutOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Popconfirm, Space } from 'antd';
import LocalStorageService from '../../services/LocalStorageService';
import { logout } from '../../services/AuthService';

export const Nav = () => {
    const handleLogout = async () => {
        try {
            const token = { token: LocalStorageService.getItem("token") };
            await logout(token);
        } catch (error) {
            console.log(error);
        } finally {
            LocalStorageService.clear();
            window.location.href = "/login";
        }

    }
    const userLogged = LocalStorageService.getItem("userLogged");
    return (
        <div className='flex h-14 items-center space-x-4 p-2 justify-end border-b border-gray-200 bg-gray-50'>
            <div className='flex-grow text-center text-xl font-bold'>Trang Quản Trị</div>
            <div>
                <h4 className='font-bold'>{userLogged.fullName}</h4>
                <p className='text-xs font-light text-right'>ROLE: {userLogged.role}</p>
            </div>
            <Avatar
                src="https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474082nAQ/avatar-duong-tang-bua_044338241.jpg"
                size={50}
            />

            <Popconfirm
                onConfirm={handleLogout}
                placement="bottomRight"
                title={"Đăng xuất"}
                description={"Bạn có muốn đăng xuất không?"}
                okText="Đồng ý"
                cancelText="Không"
                icon={<QuestionCircleOutlined
                    style={{
                        color: 'green',
                    }}
                />}
            >
                <Button
                    type="dashed"
                    color='danger'
                    icon={<LogoutOutlined />}
                >
                    Đăng xuất
                </Button>
            </Popconfirm>
        </div>
    )
}
