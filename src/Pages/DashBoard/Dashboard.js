import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd'
import React from 'react'
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { Title } = Typography;
    const navigate =useNavigate()
    return (
        <>
          <main className='d-flex justify-content-center align-items-center auth' >
          <Container>
                <Row className='d-flex justify-content-center align-items-center'>
                    <Col span={24}>
                        <h1 className='display-2 fw-bolder text-light'>
                            Welcome To Naveed Courier & Cargo Services
                        </h1>
                     <Col span={24} className=' d-flex justify-content-center align-items-center'>
                     <Button className='fw-bolder mt-2 d-flex justify-content-center align-items-center border-0' onClick={()=>{navigate("/add")}} style={{backgroundColor:"cyan" , color:"black"}}>
                       Get Started
                        <ArrowRightOutlined />
                       </Button>
                     </Col>
                    </Col>
                </Row>
            </Container>
          </main>
        </>
    )
}

export default Dashboard