// import React, { useState } from 'react';
// import { Container } from 'react-bootstrap';
// import { Col, Row, Button, Input, Form, message } from 'antd';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { Link, useNavigate } from 'react-router-dom';
// import { Fade } from 'react-awesome-reveal';
// import { doc, getDoc } from 'firebase/firestore';
// import { auth, fireStore } from '../../Config/firebase'; // Import Firebase Config

// const AdminLogin = () => {
//     const navigate = useNavigate();
//     const [state, setState] = useState({ email: "", password: "" });
//     const [isProcessing, setIsProcessing] = useState(false);

//     const handleChange = (e) => setState({ ...state, [e.target.name]: e.target.value });

//     const handleAdminLogin = async (e) => {
//         e.preventDefault();
//         setIsProcessing(true);
//         const { email, password } = state;
//         if (!email || !password) {
//             message.error("Please enter email and password.");
//             setIsProcessing(false);
//             return;
//         }

//         try {
//             const userCredential = await signInWithEmailAndPassword(auth, email, password);
//             const user = userCredential.user;

//             // Check if the user is an admin
//             const userDoc = await getDoc(doc(fireStore, "users", user.uid));
//             if (userDoc.exists() && userDoc.data().role === "admin") {
//                 message.success("Admin Login Successful");
//                 navigate("/admin/dashboard");
//             } else {
//                 message.error("Access Denied! You are not an admin.");
//                 setIsProcessing(false);
//                 return;
//             }
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
//                             <h1 className='mb-4 text-center'><i>Admin Login</i></h1>
//                             <Row>
//                                 <Col span={24}>
//                                     <Form.Item label="Admin Email" required>
//                                         <Input type='email' placeholder='Enter Admin Email' name='email' onChange={handleChange} />
//                                     </Form.Item>
//                                 </Col>
//                                 <Col span={24}>
//                                     <Form.Item label="Password" required>
//                                         <Input.Password placeholder='Enter Your Password' name='password' onChange={handleChange} />
//                                     </Form.Item>
//                                 </Col>
//                                 <Col span={24}>
//                                     <Button type='primary' htmlType='submit' onClick={handleAdminLogin} loading={isProcessing} className='w-100'>
//                                         Login as Admin
//                                     </Button>
//                                 </Col>
//                             </Row>
//                         </Form>
//                     </div>
//                 </Container>
//             </Fade>
//         </main>
//     );
// };

// export default AdminLogin;


import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Col, Row, Button, Input, Form, message } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Fade } from 'react-awesome-reveal';
import { doc, getDoc } from 'firebase/firestore';
import { auth, fireStore } from '../../Config/firebase'; // Import Firebase Config

const AdminLogin = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({ email: "", password: "" });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (e) => setState({ ...state, [e.target.name]: e.target.value });

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
    
        const { email, password } = state;
        if (!email || !password) {
            message.error("Please enter email and password.");
            setIsProcessing(false);
            return;
        }
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Fetch user data from Firestore
            const userDoc = await getDoc(doc(fireStore, "users", user.uid));
    
            if (userDoc.exists()) {
                const userData = userDoc.data();
    
                if (userData.role === "admin") {
                    message.success("Admin Login Successful");
                    navigate("/admin/dashboard");  // ✅ Redirect to Admin Dashboard
                } else {
                    message.success("User Login Successful");
                    navigate("/");  // ✅ Redirect normal users to Home Page
                }
            } else {
                message.error("User data not found.");
            }
        } catch (error) {
            message.error("Invalid Email or Password");
        }
    
        setIsProcessing(false);
    };
    
    return (
        <main className='auth p-3 p-md-4 p-lg-5'>
            <Fade cascade damping={0.1}>
                <Container>
                    <div className="card p-3 p-md-4 p-lg-4">
                        <Form layout="vertical">
                            <h1 className='mb-4 text-center'><i>Admin Login</i></h1>
                            <Row>
                                <Col span={24}>
                                    <Form.Item label="Admin Email" required>
                                        <Input type='email' placeholder='Enter Admin Email' name='email' onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Password" required>
                                        <Input.Password placeholder='Enter Your Password' name='password' onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Button type='primary' htmlType='submit' onClick={handleAdminLogin} loading={isProcessing} className='w-100'>
                                        Login as Admin
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

export default AdminLogin;