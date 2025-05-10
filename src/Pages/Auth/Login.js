// import React, { useState } from 'react'
// import { Container } from 'react-bootstrap'
// import { Col, Row, Button, Input, Form, message } from 'antd'
// import { signInWithEmailAndPassword } from 'firebase/auth'
// import { useNavigate } from 'react-router-dom'
// import { Fade } from 'react-awesome-reveal'
// import { auth } from '../../Config/firebase'

// const Login = () => {
//     const navigate = useNavigate()
//     const initialState = { email: "", password: "" }
//     const [state, setState] = useState(initialState)
//     const [isProcessing, setIsProcessing] = useState(false)
//     const handleChange = e => setState({ ...state, [e.target.name]: e.target.value })
//     // const handleSubmit = e => {
//     //     e.preventDefault();
//     //     let { email, password } = state
//     //     setIsProcessing(true)
//     //     signInWithEmailAndPassword(auth, email, password)
//     //         .then((userCredential) => {
//     //             const user = userCredential.user;

//     //             localStorage.setItem('user-login', true)
//     //             localStorage.setItem('user-uid', user.uid)
//     //             message.success("User is Successfully  Login ")
//     //             navigate('/')
//     //         })
//     //         .catch((user) => {
//     //             message.error("This Account Can't Register")
//     //         })
//     //         .finally(() => {
//     //             setTimeout(()=>{
//     //                 setIsProcessing(false)
//     //             },1000)
//     //         })
//     // }
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         let { email, password } = state;
//         setIsProcessing(true);
//         const adminEmail = "zain2@gmail.com";
//         const adminPassword = "12345678";
//         if (email === adminEmail && password === adminPassword) {
//             message.success("Admin Login Successful");
//             localStorage.setItem("user-login", true);
//             localStorage.setItem("user-role", "admin");
//             navigate("/admin/dashboard", { replace: true });
//             window.location.reload();
//             return;
//         }
//         try {
//             const userCredential = await signInWithEmailAndPassword(auth, email, password);
//             const user = userCredential.user;
//             localStorage.setItem("user-login", true);
//             localStorage.setItem("user-uid", user.uid);
//             localStorage.setItem("user-role", "user");
//             message.success("User Login Successful");
//             navigate("/", { replace: true });
//         } catch (error) {
//             message.error("Invalid Email or Password");
//         }
//         setIsProcessing(false);
//     };

//     return (
//         <main className='auth p-3 p-md-4 p-lg-5'>
//             <Fade cascade damping={0.1}>
//                 <Container>
//                     <div className="card p-3 p-md-4 p-lg-4">
//                         <Form layout="vertical">
//                             <h1 className='mb-4 text-center'>
//                                 <i>
//                                     Login
//                                 </i>
//                             </h1>
//                             <Row>
//                                 <Col span={24}>
//                                     <Form.Item label="Email" required>
//                                         <Input type='email' placeholder='Enter Your Email' name='email' onChange={handleChange} />
//                                     </Form.Item>
//                                 </Col>
//                                 <Col span={24}>
//                                     <Form.Item label="Password" required>
//                                         <Input.Password placeholder='Enter Your Password' name='password' onChange={handleChange} />
//                                     </Form.Item>
//                                 </Col>
//                                 <Col span={24}>
//                                     <Button type='primary' htmlType='submit' onClick={handleSubmit} loading={isProcessing} className='w-100'>Login</Button>
//                                 </Col>
//                                 {/* <Col span={12}>
//                                     <Link to='/auth/forgot' className=' my-2 text-center  nav-link'>Forgot Password</Link>
//                                 </Col>
//                                 <Col span={12}>
//                                     <Link to='/auth/register' className=' my-2 text-center  nav-link'>Register Account</Link>
//                                 </Col> */}
//                             </Row>
//                         </Form>
//                     </div>
//                 </Container>
//             </Fade>
//         </main>
//     )
// }

// export default Login;



import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Col, Row, Button, Input, Form, message } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Fade } from 'react-awesome-reveal';
import { auth } from '../../Config/firebase';

const Login = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({ email: '', password: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = e =>
        setState({ ...state, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = state;
        setIsProcessing(true);

        const adminEmail = 'zain2@gmail.com';
        const adminPassword = '12345678';

        // ✅ Admin Hardcoded Login
        if (email === adminEmail && password === adminPassword) {
            message.success('Admin Login Successful');
            localStorage.setItem('user-login', 'true');
            localStorage.setItem('user-role', 'admin');
            localStorage.setItem('user-uid', 'admin-uid');
            navigate('/admin/dashboard', { replace: true });
            window.location.reload();
            return;
        }

        // ✅ Firebase User Login
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            localStorage.setItem('user-login', 'true');
            localStorage.setItem('user-role', 'user');
            localStorage.setItem('user-uid', user.uid);

            message.success('User Login Successful');
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Login Error:', error);
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
                                        <Input
                                            type='email'
                                            name='email'
                                            placeholder='Enter Your Email'
                                            onChange={handleChange}
                                            value={state.email}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Password" required>
                                        <Input.Password
                                            name='password'
                                            placeholder='Enter Your Password'
                                            onChange={handleChange}
                                            value={state.password}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Button
                                        type='primary'
                                        htmlType='submit'
                                        loading={isProcessing}
                                        className='w-100'
                                    >
                                        Login
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Container>
            </Fade>
        </main>
    );
};

export default Login;
