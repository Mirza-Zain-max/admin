/* eslint-disable no-unused-vars */
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

    const handleOk = async () => {
        try {
            const docRef = doc(fireStore, 'secureData', 'password');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && password === docSnap.data().value) {
                localStorage.setItem('isAuthorized', 'true');
                navigate('/admin/booking');
            } else {
                message.error('Incorrect password!');
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            message.warning('Error checking password. Try again!');
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
    const handleOk2 = async () => {
        try {
            const docRef = doc(fireStore, 'secureData', 'password');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && password === docSnap.data().value) {
                localStorage.setItem('isAuthorized', 'true');
                navigate('/admin/user');
            } else {
                message.error('Incorrect password!');
            }
        } catch (error) {
            // console.error('Error verifying password:', error);
            message.warning('Error checking password. Try again!');
        }
        setIsModalOpen(false);
        setPassword('');
    };
    const handleCancel2 = () => {
        setIsModalOpen(false);
        setPassword('');
    };

    const handleKeyPress2 = (e) => {
        if (e.key === 'Enter') {
            handleOk2();
        }
    };

    return (
        <>
            <Navbar expand="lg" className="p-4" style={{backgroundColor : "#2f655a"}}>
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Link className='text-light nav-link mx-3 fw-bold ' to="/admin/add">Add Rider</Link>
                        <Link className='text-light nav-link mx-3 fw-bold ' to="/admin/boking">Boking</Link>
                        <NavDropdown title="Delivery" className='fw-bold text-light mx-3' id="basic-nav-dropdown">
                            <Link className='text-dark nav-link  text-center fw-bold  my-2 p-1 ' to="/admin/make-delivery"> Make Sheet</Link>
                            <hr />
                            <Link className='text-dark nav-link  text-center fw-bold my-2 p-1 ' to="/admin/view-sheet">View Sheet</Link>
                        </NavDropdown>
                        <NavDropdown title="Update" className='fw-bold text-light mx-3' id="basic-nav-dropdown">
                            <Link className='text-dark nav-link  text-center fw-bold my-2 p-1 ' to='/admin/admin-data'>Update Sheet</Link>
                            <hr />
                            <Link className='text-dark nav-link  text-center fw-bold my-2 p-1 ' to='/admin/showData'>User Sheet</Link>
                            <hr />
                            <Link className='text-dark nav-link  text-center fw-bold my-2 p-1 ' to='/admin/allShowData'>All Data</Link>
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
                                        <span className='text-dark nav-link  text-center  fw-bold p-1' to="/admin/user" onClick={showModal}>Login User</span>
                                    </Dropdown.Item>
                                    <hr />
                                    <Dropdown.Item as={"div"}>
                                        <Link className='text-dark nav-link  text-center  fw-bold p-1' onClick={handleLogout} >Logout</Link>
                                    </Dropdown.Item>
                                    <Modal title="Enter Password" centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                        <Input.Password
                                            value={password}
                                            autoComplete='passord'
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Enter your password"
                                        />
                                    </Modal>
                                    <Modal title="Enter Password" centered open={isModalOpen} onOk={handleOk2} onCancel={handleCancel2}>
                                        <Input.Password
                                            value={password}
                                            autoComplete='passord'
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyPress={handleKeyPress2}
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