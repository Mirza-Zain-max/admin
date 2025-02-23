import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Col, Row, Button, Input, Form, message } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Fade } from 'react-awesome-reveal';
import { doc, setDoc } from 'firebase/firestore';
import { auth, fireStore } from '../../Config/firebase';

const Register = () => {
    const navigate = useNavigate();
    const initialState = { fullName: "", email: "", password: "", confirmPassword: "" };
    const [state, setState] = useState(initialState);
    const [isProcessing, setIsProcessing] = useState(false);
    const handleChange = e => setState({ ...state, [e.target.name]: e.target.value });
    // const handleSubmit = e => {
    //     e.preventDefault();
    //     let { fullName, email, password, confirmPassword } = state;
    //     fullName = fullName.trim();
    //     if (fullName.length < 3) return message.error("Please Enter Your Name Correctly");
    //     if (password.length < 8) return message.error("Password must be at least 8 characters.");
    //     if (confirmPassword !== password) return message.error("Passwords do not match.");
    //     setIsProcessing(true);
    //     createUserWithEmailAndPassword(auth, email, password)
    //         .then(async (userCredential) => {
    //             const user = userCredential.user;
    //             const userData = { uid: user.uid, fullName, email, password, confirmPassword };
    //             await setDoc(doc(fireStore, "users", user.uid), {
    //                 uid: user.uid,
    //                 email: user.email,
    //                 role: "User",
    //                 createdAt: new Date()
    //             });
    //             createDocument({ ...userData, uid: user.uid });
    //             message.success("User registered successfully!");
    //             navigate("/"); // Redirect to dashboard
    //         })
    //         .catch((error) => message.error("Account is already registered"))
    //         .finally(() => setIsProcessing(false));

    // }
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let { fullName, email, password, confirmPassword } = state;
        fullName = fullName.trim();
    
        if (fullName.length < 3) {
            return message.error("Please enter your name correctly.");
        }
        if (!email.includes("@")) {
            return message.error("Please enter a valid email.");
        }
        if (password.length < 8) {
            return message.error("Password must be at least 8 characters.");
        }
        if (confirmPassword !== password) {
            return message.error("Passwords do not match.");
        }
    
        setIsProcessing(true);
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Store user data in Firestore (excluding password for security)
            await setDoc(doc(fireStore, "users", user.uid), {
                uid: user.uid,
                fullName,
                email,
                role: "User",
                createdAt: new Date(),
            });
    
            message.success("User registered successfully!");
            navigate("/"); // Redirect to dashboard
        } catch (error) {
            message.error("Account is already registered or an error occurred.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    const createDocument = async (formData) => {
        try {
            await setDoc(doc(fireStore, "users", formData.uid), formData);
            message.success("User created successfully");
        } catch (e) {
            message.error("Something went wrong while creating the user!");
            setIsProcessing(false);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className='auth p-3 p-md-4 p-lg-5'>
            <Fade cascade damping={0.1}>
                <Container>
                    <div className="card p-3 p-md-4 p-lg-4">
                        <Form layout="vertical">
                            <h1 className='mb-4 text-center'>
                                <i>
                                    Register
                                </i>
                            </h1>
                            <Row>
                                <Col span={24}>
                                    <Form.Item label="FullName" required>
                                        <Input type='text' placeholder='Enter Your Full Name' name='fullName' onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Email" required>
                                        <Input type='email' placeholder='Enter Your Email' name='email' onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Password" required>
                                        <Input.Password placeholder='Enter Your Password' name='password' onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Confirm Password" required>
                                        <Input.Password placeholder='Enter Your Confirm Password' name='confirmPassword' onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Button type='primary' htmlType='submit' onClick={handleSubmit} className='w-100' loading={isProcessing}>Register</Button>
                                </Col>
                                <Col span={12} className='mt-2'>
                                    <p>
                                        Already have an account?
                                    </p>
                                </Col>
                                <Col span={12}>
                                    <Link to='/auth/login' className='mt-2 btn text-center nav-link'>Login</Link>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Container>
            </Fade>
        </main>
    );
};

export default Register;