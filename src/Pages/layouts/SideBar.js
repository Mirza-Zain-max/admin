/* eslint-disable no-unused-vars */
// import React, { useState } from 'react';
// import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingFilled, UserAddOutlined, UserSwitchOutlined, } from '@ant-design/icons';
// import { Button, Layout, Menu, theme } from 'antd';
// import { Link } from 'react-router-dom';
// import { useAdminAuth } from '../../Context/AdminAuthContext';
// import { useAuthContext } from '../../Context/Auth';
// const { Header, Sider, Content } = Layout;
// const SideBar = ({ children }) => {
//     const [collapsed, setCollapsed] = useState(false);
//     const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
//     const { handleLogout } = useAuthContext();
//     return (
//         <Layout >
//             <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: "#0F2027" }}>
//                 <div className="demo-logo-vertical" />
//                 <Menu className='mt-5'
//                     style={{ background: "#0F2027" }}
//                     theme="dark"
//                     mode="inline"
//                     defaultSelectedKeys={['1']}
//                     items={[
//                         {
//                             key: '1',
//                             icon: <UserSwitchOutlined />,
//                             label: <Link to="/admin/dashboard">Profile</Link>,
//                         },
//                         {
//                             key: '2',
//                             icon: <UserAddOutlined />,
//                             label:<Link to="/admin/users">Users</Link>,
//                         },
//                         {
//                             key: '3',
//                             icon: <SettingFilled />,
//                             label: <Link to="/admin/settings">Settings</Link>,
//                         },
//                         {
//                             key: '4',
//                             icon: <SettingFilled />,
//                             label: <Link to="/admin/allShowData">UserData</Link>,
//                         },
//                         {
//                             key: '5',
//                             icon: <Button type="text" onClick={handleLogout} className='text-light '><LogoutOutlined /> LogOut</Button>,
//                             // label: ,
//                         },
//                     ]}
//                 />
//             </Sider>
//             <Layout>
//                 <Header
//                     style={{
//                         padding: 0,
//                         background: colorBgContainer,
//                     }}
//                 >
//                     <Button
//                         type="text"
//                         icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//                         onClick={() => setCollapsed(!collapsed)}
//                         style={{
//                             fontSize: '16px',
//                             width: 64,
//                             height: 64,
//                         }}
//                     />
//                 </Header>
//                 <Content
//                     style={{
//                         margin: '24px 16px',
//                         padding: 24,
//                         minHeight: 280,
//                         background: colorBgContainer,
//                         borderRadius: borderRadiusLG,
//                     }}>
//                     {children}
//                 </Content>
//             </Layout>
//         </Layout>
//     );
// };
// export default SideBar;


import { Container, Dropdown, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../Context/Auth';
import { useState } from 'react';
import { Input, message, Modal } from 'antd';
import { doc, getDoc } from 'firebase/firestore';
import { fireStore } from '../../Config/firebase';

function SideBar({ children }) {
    const { isAuth, handleLogout } = useAuthContext()
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('');


    const isAuthorized = localStorage.getItem('isAuthorized') === 'true';

    const showModal = () => {
        setIsModalOpen(true);
    };

    // const handleOk = () => {
    //   if (password === 'naveed9562') {
    //     setIsAuthorized(true);
    //     navigate('/booking');
    //   } else {
    //     alert('Incorrect password!');
    //   }
    //   setIsModalOpen(false);
    //   setPassword('');
    // };
    // const handleCancel = () => {
    //   setIsModalOpen(false);
    //   setPassword('');
    // };
    const handleOk = async () => {
        try {
            const docRef = doc(fireStore, 'secureData', 'password'); // Ensure this document exists
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && password === docSnap.data().value) {
                localStorage.setItem('isAuthorized', 'true');
                navigate('/booking');
            } else {
                alert('Incorrect password!');
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            alert('Error checking password. Try again!');
        }

        setIsModalOpen(false);
        setPassword('');
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setPassword('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleOk();
        }
    };

    return (
        <>
            <Navbar expand="lg" className="bg-dark navbar-dark p-4">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Link className='text-light nav-link mx-3 fw-bold ' to="/admin/add">Add Rider</Link>
                        <Link className='text-light nav-link mx-3 fw-bold ' to="/admin/boking">Boking</Link>
                        <NavDropdown title="Delivery" className='fw-bold text-light mx-3' id="basic-nav-dropdown">
                            <Link className='text-dark nav-link  text-center fw-bold  my-2 p-1 ' to="/admin/make-delivery"> Make Sheet</Link>
                            <hr />
                            <Link className='text-dark nav-link  text-center fw-bold my-2 p-1 ' to="/admin/view-sheet">View Sheet</Link>
                            <hr />
                            <Link className='text-dark nav-link  text-center fw-bold my-2 p-1 ' to='/admin/showData'>Update Sheet</Link>
                        </NavDropdown>
                        <Link className='text-light nav-link mx-3 fw-bold ' to="/admin/track-shipment">Track Shipment</Link>
                        <NavDropdown title="Account" className='fw-bold text-light  ms-3 flex-wrap ' id="basic-nav-dropdown">
                            {!isAuth
                                ? <>
                                    <Dropdown.Item as={"div"}>
                                        <Link className='ms-4 nav-link text-dark fw-bold' to="/auth/login">Login</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item as={"div"}>
                                        <Link className='ms-4 nav-link  text-dark fw-bold' to="/auth/register">Register</Link>
                                    </Dropdown.Item>
                                </>
                                : <>
                                    <Dropdown.Item as={"div"}>
                                        <span className='text-dark nav-link  text-center  fw-bold p-1' to="/admin/booking" onClick={showModal}>Data Deleted</span>
                                    </Dropdown.Item>
                                    <hr />
                                    <Dropdown.Item as={"div"}>
                                        <Link className='text-dark nav-link  text-center  fw-bold p-1' onClick={handleLogout} >Logout</Link>
                                    </Dropdown.Item>
                                    <Modal title="Enter Password" centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                        <Input.Password
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Enter your password"
                                        />
                                    </Modal>
                                </>
                            }
                        </NavDropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
           <main>
            {children}
           </main>
            
        </>
    );
}

export default SideBar;