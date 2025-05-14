import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Col, Row, Button, Input, Form, message, Modal } from 'antd';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Fade } from 'react-awesome-reveal';
import { auth, fireStore } from '../../Config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({ email: '', password: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('');

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const docRef = doc(fireStore, 'secureData', 'password');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && password === docSnap.data().value) {
                localStorage.setItem('isAuthorized', 'true');
                navigate('/auth/register');
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
    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = state;
        setIsProcessing(true);
        const adminEmail = 'zain2@gmail.com';
        const adminPassword = '12345678';
        if (email === adminEmail && password === adminPassword) {
            message.success('Admin Login Successful');
            localStorage.setItem('user-login', 'true');
            localStorage.setItem('user-role', 'admin');
            localStorage.setItem('user-uid', 'admin-uid');
            navigate('/admin/add', { replace: true });
            window.location.reload();
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userRef = doc(fireStore, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                if (userData.isDisabled) {
                    await signOut(auth);
                    message.error('Your account has been disabled. Please contact support.');
                    setIsProcessing(false);
                    return;
                }
                localStorage.setItem('user-login', 'true');
                localStorage.setItem('user-role', userData.role || 'user');
                localStorage.setItem('user-uid', user.uid);
                localStorage.setItem('user-name', userData.fullName || '');
                message.success('User Login Successful');
                navigate('/', { replace: true });
            } else {
                await signOut(auth);
                message.error('User record not found in Firestore.');
            }
        } catch (error) {
            message.error('Invalid Email or Password');
        }

        setIsProcessing(false);
    };

    return (
        <main className='auth p-3 p-md-4 p-lg-5'>
            <Fade cascade damping={0.1}>
                <Container>
                    <div className="card p-3 p-md-4 p-lg-4">
                        <Form layout="vertical" onSubmitCapture={handleSubmit}>
                            <h1 className='mb-4 text-center'><i>Login</i></h1>
                            <Row gutter={[0, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Email" required>
                                        <Input type='email' name='email' placeholder='Enter Your Email' autoComplete='email' onChange={handleChange} value={state.email} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Password" required>
                                        <Input.Password name='password' placeholder='Enter Your Password' autoComplete="current-password" onChange={handleChange} value={state.password} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Button type='primary' htmlType='submit' loading={isProcessing} className='w-100'>
                                        Login
                                    </Button>
                                </Col>
                                <Col span={24}>
                                    <div className='d-flex justify-content-center flex-wrap'>
                                        <span>
                                            Don't have an account? Click here to
                                        </span>
                                        <Link className='nav-link'>
                                            <span className='text-primary  text-center  fw-medium p-1' to="/auth/register" onClick={showModal}>Register</span>
                                        </Link>
                                    </div>
                                </Col>
                                <Modal title="Enter Password" centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                    <Input.Password
                                        value={password}
                                        autoComplete='password'
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter your password"
                                    />
                                </Modal>
                            </Row>
                        </Form>
                    </div>
                </Container>
            </Fade>
        </main>
    );
};

export default Login;
