import { DeleteColumnOutlined, DeleteFilled, FileAddFilled, PrinterOutlined } from '@ant-design/icons';
import { Col, Input, message, Modal, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const RiderExcelSheet = () => {
    // const [courirs, setCourirs] = useState([]);
    // const [editForm, setEditForm] = useState({ name: "", trackingId: "", status: "", amount: "" });
    // const [isModalOpen, setIsModalOpen] = useState(false);

    // useEffect(() => {
    //     const SavedCouriers = localStorage.getItem('courirs');
    //     if (SavedCouriers) {
    //         setCourirs(JSON.parse(SavedCouriers));
    //     }
    // }, []);

    // const handleDeleteCourier = (trackingId) => {
    //     const updatedCouriers = courirs.filter((courier) => courier.trackingId !== trackingId);
    //     setCourirs(updatedCouriers);
    //     localStorage.setItem("courirs", JSON.stringify(updatedCouriers));
    // };

    // // const handlePrint = () => { window.print(); };

    // const handleEditCourier = (courier) => { setEditForm(courier); showModal(); };

    // const handleChange = (e) => { const { name, value } = e.target; setEditForm({ ...editForm, [name]: value }); };

    // const handleSaveEdit = () => {
    //     const updatedCouriers = courirs.map((courier) => courier.trackingId === editForm.trackingId ? editForm : courier);
    //     setCourirs(updatedCouriers);
    //     localStorage.setItem("courirs", JSON.stringify(updatedCouriers));
    //     setEditForm({ trackingId: "", name: "", status: "", amount: "" });
    //     message.success("Update Successfully");
    //     setIsModalOpen(false);
    // };

    // const showModal = () => { setIsModalOpen(true); };
    // const handleSave = () => { handleSaveEdit(false) };
    // const handleCancel = () => { setIsModalOpen(false); };

    return (
        // <main style={{ height: "100vh" }}>
        //     <Container>
        //         <Row className='flex-sm-wrap' >
        //             <Col xs={12} md={18} lg={24}>
        //                 <h1 className='text-center my-5'>Courier Excel Sheet</h1>
        //                 {courirs.length > 0 ? (
        //                     <Col>
        //                         <Table striped bordered hover>
        //                             <thead className='text-center'>
        //                                 <tr>
        //                                     <th>#</th>
        //                                     <th>CN No. & Name</th>
        //                                     <th>Receiver Name /  Stamp</th>
        //                                     <th>Print</th>
        //                                 </tr>
        //                             </thead>
        //                             <tbody className='text-center'>
        //                                 {courirs.map((courier, index) => (
        //                                     <tr key={index}>
        //                                         <td>{index + 1}</td>
        //                                         <td>{courier.name}</td>
        //                                         <td></td>
        //                                         <td>
        //                                             <Col >
        //                                                 <Button className='btn btn-warning w-50 mx-1' ><PrinterOutlined /></Button>
        //                                             </Col>
        //                                         </td>
        //                                     </tr>
        //                                 ))}
        //                             </tbody>
        //                         </Table>
        //                     </Col>
        //                 ) : (
        //                     <p>No courirs added yet.</p>
        //                 )}
        //                 <Modal open={isModalOpen} onOk={handleSave} onCancel={handleCancel} okText="Save">
        //                     <div className="edit-form">
        //                         <h3>Edit Courier</h3>
        //                         <Input className='my-2' type="text" name="name" placeholder="Customer Name" value={editForm.name} onChange={handleChange} />
        //                         <Input className='my-2' type="text" name="trackingId" placeholder="Tracking ID" value={editForm.trackingId} onChange={handleChange} disabled />
        //                         <Input className='my-2' type="text" name="status" placeholder="Courier Status" value={editForm.status} onChange={handleChange} />
        //                         <Input className='my-2' type="number" name="amount" placeholder="Amount" value={editForm.amount} onChange={handleChange} />
        //                         {/* <Button variant="info" onClick={handleSaveEdit}>Save</Button> */}
        //                     </div>
        //                 </Modal>
        //             </Col>
        //         </Row>
        //     </Container>
        // </main>
        <>
        <h1>
            Rytsa``
        </h1>
        </>
    );
};

export default RiderExcelSheet;