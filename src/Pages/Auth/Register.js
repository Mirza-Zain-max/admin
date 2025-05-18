/* eslint-disable no-unused-vars */
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
            await setDoc(doc(fireStore, "users", user.uid), {
                uid: user.uid,
                fullName,
                email,
                role: "User",
                password,
                createdAt: new Date(),
            });
            message.success("User registered successfully!");
            navigate("/");
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
                    <div className='card2 rounded-5 '>
                      <div className="card rounded-5 bg-white p-3 p-md-4 p-lg-4">
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
                                            <Input.Password autoComplete='password' placeholder='Enter Your Password' name='password' onChange={handleChange} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Confirm Password" required>
                                            <Input.Password autoComplete='password' placeholder='Enter Your Confirm Password' name='confirmPassword' onChange={handleChange} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Button htmlType='submit' onClick={handleSubmit} className="border-0 rounded-5 ms-2 w-100 py-4" style={{ backgroundColor: "#007991", color: "#fff", fontSize: 25, fontWeight: 600 }} loading={isProcessing}>Register</Button>
                                    </Col>
                                    <Col span={12} className='mt-2'>
                                        <p>
                                            Already have an account?
                                        </p>
                                    </Col>
                                    <Col span={12}>
                                        <Link to='/auth/login' className='mt-2 btn text-center nav-link text-primary fw-bold'>Login</Link>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </Container>
            </Fade>
        </main>
    );
};

export default Register;