import React, { useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { Col, Row, Input, Form, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../Config/firebase'


const Frogot = () => {

    const navigate = useNavigate()
    const [state, steState] = useState({ email: "" })
    const [isProcessing, setIsProcessing] = useState(false)
    const handleChange = e => steState({ ...state, [e.target.name]: e.target.value })
    const handleSubmit = e => {
        e.preventDefault();
        let { email } = state
        setIsProcessing(true)
        sendPasswordResetEmail(auth, email, { url: 'http://localhost:3000/auth/login' })
            .then(() => {
                message.success("Email send  Successfully")
                navigate('/')
            })
            .catch(() => {
                message.info("This Account Can't Register")
            })
            .finally(() => {
                setIsProcessing(false)
            })
    }

    return (
        <main className='auth p-3 p-md-4 p-lg-5'>
            <Container>
                <div className="card p-3 p-md-4 p-lg-4">
                    <Form layout="vertical">
                        <h1 className='mb-4 text-center'>
                            <i>
                                Frogot
                            </i>
                        </h1>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="Email" required>
                                    <Input type='email' placeholder='Enter Your Email' name='email' onChange={handleChange} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Button htmlType='submit' onClick={handleSubmit} className='w-100 border-0 bg-danger text-light'>Submit</Button>
                            </Col>
                            <Col span={24} className='d-flex justify-content-center align-items-center'>
                                <Button htmlType='submit' onClick={() => navigate(-1)} className='text-center mt-3'>Back To Page</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Container>
        </main>
    )
}

export default Frogot