// // /* eslint-disable no-unused-vars */
// // import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
// // import React, { useEffect, useState } from 'react'
// // import { Edit, X } from 'react-feather';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { setToggle } from '../redux/sidebar';
// // import { Link, useLocation, useNavigate } from 'react-router-dom';
// // import { sidebarConfig } from './siderbarConfig';
// // import { logo, menuItems } from '../icons/icons';
// // import { useAdminAuth } from '../../../Context/AdminAuthContext';

// // const VerticalSideBar = () => {
// //     const collapsed = useSelector(state => state.sidebar.collapse)
// //     const toggle = useSelector(state => state.sidebar.toggle)
// //     const dispatch = useDispatch()
// //     const location = useLocation();
// //     const navigate = useNavigate();
// //     const {handleLogout} = useAdminAuth();
// //     const [openSubmenus, setOpenSubmenus] = useState({});

// //     const isSubMenuItemActive = (submenu) => {
// //         return submenu.some((subitem) => location.pathname === subitem.path);
// //     };

// //     useEffect(() => {
// //         const newOpenSubmenus = {};
// //         menuItems.forEach((item) => {
// //             if (item.submenu) {
// //                 newOpenSubmenus[item.label] = isSubMenuItemActive(item.submenu);
// //             }
// //         });
// //         setOpenSubmenus(newOpenSubmenus);
// //         // eslint-disable-next-line react-hooks/exhaustive-deps
// //     }, [location]);

// //     const handleSubMenuClick = (label) => {
// //         setOpenSubmenus((prevState) => ({
// //             ...prevState,
// //             [label]: !prevState[label],
// //         }));
// //     };
// //     return (
// //         <>
// //             <Sidebar
// //                 className="vh-100 custom-sidebar position-lg-sticky top-0 relative min-[992px]:z-[99]"
// //                 collapsed={collapsed}
// //                 backgroundColor={sidebarConfig?.bgColor}

// //                 onBackdropClick={() => dispatch(setToggle(false))}
// //                 collapsedWidth={sidebarConfig?.collapsedWidth}
// //                 toggled={toggle}
// //                 breakPoint={toggle ? "all" : "lg"}>
// //                 <div className="d-lg-none flex justify-between items-center inter_medium p-2">
// //                     <div className={`max-w-[150px] w-100 `}>
// //                         <Link to='/' style={{ textDecoration: "none" }} className='text-white w-100' >
// //                             <img src={logo} alt='' className='w-100' />
// //                         </Link>
// //                     </div>
// //                     <div>
// //                         <button
// //                             className="btn btn-light rounded-circle p-0 h-[2rem] w-[2rem] d-lg-none d-flex justify-center items-center"
// //                             onClick={() => dispatch(setToggle(!toggle))}
// //                         >
// //                             <X size={20} />
// //                         </button>
// //                     </div>
// //                 </div>
// //                 <Menu className='text-[#8C8C8C]'>
// //                     {menuItems.map((item) => {
// //                         if (item.submenu) {
// //                             return (
// //                                 <SubMenu
// //                                     label={item.label}
// //                                     key={item.label}
// //                                     icon={item.icon}
// //                                     open={openSubmenus[item.label]} // Control submenu open state dynamically
// //                                     onOpenChange={() => handleSubMenuClick(item.label)} // Handle submenu click to toggle
// //                                     className=""
// //                                 >
// //                                     {item.submenu.map((subitem) => (
// //                                         <MenuItem
// //                                             key={subitem.label}
// //                                             icon={subitem.icon}
// //                                             onClick={() => navigate(subitem.path)}
// //                                             className={` ${location.pathname === subitem.path && "active"
// //                                                 }`}
// //                                         >
// //                                             {subitem.label}
// //                                         </MenuItem>
// //                                     ))}
// //                                 </SubMenu>
// //                             );
// //                         } else {
// //                             return (
// //                                 <MenuItem
// //                                     key={item.label}
// //                                     icon={item.icon}
// //                                     onClick={() => item.path === '/logout' ? handleLogout() : navigate(item.path)}
// //                                     className={`${location.pathname === item.path && "active"}`}
// //                                 >
// //                                     {item.label}
// //                                 </MenuItem>
// //                             );
// //                         }
// //                     }
// //                     )}
// //                 </Menu>
// //             </Sidebar>
// //         </>
// //     )
// // }

// // export default VerticalSideBar



// import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
// import React, { useEffect, useState } from 'react';
// import { X } from 'react-feather';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { sidebarConfig } from './siderbarConfig';
// import { useAdminAuth } from '../../../Context/AdminAuthContext';
// import { HomeOutlined, LogoutOutlined, SettingOutlined, UsbOutlined, UserOutlined } from '@ant-design/icons';

// const VerticalSideBar = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { handleLogout } = useAdminAuth();
//     const [collapsed, setCollapsed] = useState(false);
//     const [toggle, setToggle] = useState(false);
//     const [openSubmenus, setOpenSubmenus] = useState({});

//     const isSubMenuItemActive = (submenu) => {
//         return submenu.some((subitem) => location.pathname === subitem.path);
//     };
//     const menuItems = [
//         { label: "Dashboard", path: "/dashboard", icon: <HomeOutlined /> },
//         { label: "Users", path: "/users", icon: <UserOutlined /> },
//         { label: "Settings", path: "/settings", icon: <SettingOutlined /> },
//         { label: "Logout", path: "/logout", icon: <LogoutOutlined /> }
//     ];
//     useEffect(() => {
//         const newOpenSubmenus = {};
//         menuItems.forEach((item) => {
//             if (item.submenu) {
//                 newOpenSubmenus[item.label] = isSubMenuItemActive(item.submenu);
//             }
//         });
//         setOpenSubmenus(newOpenSubmenus);
//     }, [location]);

//     const handleSubMenuClick = (label) => {
//         setOpenSubmenus((prevState) => ({
//             ...prevState,
//             [label]: !prevState[label],
//         }));
//     };

//     return (
//         <>
//             <Sidebar
//                 className="vh-100 custom-sidebar position-lg-sticky top-0 relative min-[992px]:z-[99]"
//                 collapsed={collapsed}
//                 style={{ backgroundColor: '#001529' }} // Custom background color for Sidebar
//                 collapsedWidth={sidebarConfig?.collapsedWidth}
//                 toggled={toggle}
//                 breakPoint={toggle ? "all" : "lg"}
//             >
//                 <div className="d-lg-none flex justify-between items-center inter_medium p-2">
//                     <div className={`max-w-[150px] w-100`}>
//                         <Link to='/' style={{ textDecoration: "none" }} className='text-white w-100'>
//                             {/* <img src={logo} alt='' className='w-100' /> */}
//                         </Link>
//                     </div>
//                     <div>
//                         <button
//                             className="btn btn-light rounded-circle p-0 h-[2rem] w-[2rem] d-lg-none d-flex justify-center items-center"
//                             onClick={() => setToggle(!toggle)}
//                         >
//                             <X size={20} />
//                         </button>
//                     </div>
//                 </div>
//                 <Menu className='text-[#8C8C8C]'>
//                     {menuItems.map((item) => {
//                         if (item.submenu) {
//                             return (
//                                 <SubMenu
//                                     label={item.label}
//                                     key={item.label}
//                                     icon={item.icon}
//                                     open={openSubmenus[item.label]}
//                                     onOpenChange={() => handleSubMenuClick(item.label)}
//                                 >
//                                     {item.submenu.map((subitem) => (
//                                         <MenuItem
//                                             key={subitem.label}
//                                             icon={subitem.icon}
//                                             onClick={() => navigate(subitem.path)}
//                                             className={location.pathname === subitem.path ? "active" : ""}
//                                         >
//                                             {subitem.label}
//                                         </MenuItem>
//                                     ))}
//                                 </SubMenu>
//                             );
//                         } else {
//                             return (
//                                 <MenuItem
//                                     key={item.label}
//                                     icon={<UsbOutlined />} // Corrected syntax
//                                     onClick={() => item.path === '/logout' ? handleLogout() : navigate(item.path)}
//                                     className={location.pathname === item.path ? "active" : ""}
//                                 >
//                                     {item.label}
//                                 </MenuItem>
//                             );
//                         }
//                     })}
//                 </Menu>
//             </Sidebar>
//         </>
//     );
// };

// export default VerticalSideBar;