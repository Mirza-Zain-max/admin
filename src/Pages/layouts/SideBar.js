import React, { useState } from 'react';
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingFilled, UserAddOutlined, UserSwitchOutlined, } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../Context/AdminAuthContext';
import { useAuthContext } from '../../Context/Auth';
const { Header, Sider, Content } = Layout;
const SideBar = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const { handleLogout } = useAuthContext();
    return (
        <Layout >
            <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: "#0F2027" }}>
                <div className="demo-logo-vertical" />
                <Menu className='mt-5'
                    style={{ background: "#0F2027" }}
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserSwitchOutlined />,
                            label: <Link to="/admin/dashboard">Profile</Link>,
                        },
                        {
                            key: '2',
                            icon: <UserAddOutlined />,
                            label:<Link to="/admin/users">Users</Link>,
                        },
                        {
                            key: '3',
                            icon: <SettingFilled />,
                            label: <Link to="/admin/settings">Settings</Link>,
                        },
                        {
                            key: '4',
                            icon: <LogoutOutlined />,
                            label: <Button type="text" onClick={handleLogout} className='text-light '>LogOut</Button>,
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
export default SideBar;