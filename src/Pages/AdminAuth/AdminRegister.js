import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Col, Row, Button, Input, Form, message } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, fireStore } from '../../Config/firebase';

const AdminRegister = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (e) => setState({ ...state, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        let { fullName, email, password, confirmPassword } = state;

        // Validation
        fullName = fullName.trim();
        if (fullName.length < 3) return message.error("Please enter your name correctly");
        if (password.length < 8) return message.error("Password must be at least 8 characters.");
        if (confirmPassword !== password) return message.error("Passwords do not match.");

        setIsProcessing(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user details in Firestore with admin role
            await setDoc(doc(fireStore, "users", user.uid), {
                displayName: fullName,
                uid: user.uid,
                email: user.email,
                role: "admin",
                createdAt: new Date(),
                password: password

            });

            message.success("Admin registered successfully!");
            navigate("/admin/dashboard"); // Redirect to admin dashboard
        } catch (error) {
            message.error("Registration failed. Try again.");
        }

        setIsProcessing(false);
    };

    return (
        <main className='auth p-3 p-md-4 p-lg-5'>
            <Container>
                <div className="card p-3 p-md-4 p-lg-4">
                    <Form layout="vertical">
                        <h1 className='mb-4 text-center'><i>Admin Register</i></h1>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="Full Name" required>
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
                                    <Input.Password placeholder='Confirm Your Password' name='confirmPassword' onChange={handleChange} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Button type='primary' htmlType='submit' onClick={handleSubmit} className='w-100' loading={isProcessing}>
                                    Register as Admin
                                </Button>
                            </Col>
                            <Col span={12} className='mt-2'>
                                <p>Already have an admin account?</p>
                            </Col>
                            <Col span={12}>
                                <Link to='/admin/login' className='mt-2 btn text-center nav-link'>Login</Link>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Container>
        </main>
    );
};

export default AdminRegister;
