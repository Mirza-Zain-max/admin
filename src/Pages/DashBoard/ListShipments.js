// import { DeleteFilled, FileAddFilled } from '@ant-design/icons';
// import { Col, Input, message, Modal, Row } from 'antd';
// import React, { useState, useEffect } from 'react';
// import { Container, Table, Button } from 'react-bootstrap';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable'; // Import the plugin for tables in PDF

// const ListShipments = () => {
//   const [courirs, setCourirs] = useState([]);
//   const [editForm, setEditForm] = useState({ name: "", trackingId: "", status: "", amount: "" });
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const savedCouriers = localStorage.getItem('courirs');
//     if (savedCouriers) {
//       setCourirs(JSON.parse(savedCouriers));
//     }
//   }, []);

//   const handleDeleteCourier = (trackingId) => {
//     const updatedCouriers = courirs.filter((courier) => courier.trackingId !== trackingId);
//     setCourirs(updatedCouriers);
//     localStorage.setItem("courirs", JSON.stringify(updatedCouriers));
//     message.success("Shipment deleted successfully");
//   };

//   const handleEditCourier = (courier) => {
//     setEditForm(courier);
//     showModal();
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm({ ...editForm, [name]: value });
//   };

//   const handleSaveEdit = () => {
//     const updatedCouriers = courirs.map((courier) =>
//       courier.trackingId === editForm.trackingId ? editForm : courier
//     );
//     setCourirs(updatedCouriers);
//     localStorage.setItem("courirs", JSON.stringify(updatedCouriers));
//     setEditForm({ trackingId: "", name: "", status: "", amount: "" });
//     message.success("Updated successfully");
//     setIsModalOpen(false);
//   };

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleSave = () => {
//     handleSaveEdit();
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   const saveToPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Courier List", 10, 10);

//     // Table headers and data
//     const headers = [["#", "Name", "Tracking ID", "Status", "Amount"]];
//     const data = courirs.map((courier, index) => [
//       index + 1,
//       courier.name,
//       courier.trackingId,
//       courier.status,
//       `$${courier.amount}`,
//     ]);

//     doc.autoTable({
//       head: headers,
//       body: data,
//       startY: 20,
//     });

//     doc.save("couriers.pdf");
//     message.success("PDF downloaded successfully");
//   };

//   return (
//     <Container style={{ height: "100vh" }}>
//       <Row className="flex-sm-wrap">
//         <Col xs={12} md={18} lg={24}>
//           <h1 className="text-center my-5">Courier List</h1>
//           <Button className="mb-3" onClick={saveToPDF}>Download PDF</Button>
//           {courirs.length > 0 ? (
//             <Col>
//               <Table striped bordered hover>
//                 <thead className="text-center">
//                   <tr>
//                     <th>#</th>
//                     <th>Name</th>
//                     <th>Tracking ID</th>
//                     <th>Status</th>
//                     <th>Amount</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-center">
//                   {courirs.map((courier, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>{courier.name}</td>
//                       <td>{courier.trackingId}</td>
//                       <td>{courier.status}</td>
//                       <td>${courier.amount}</td>
//                       <td>
//                         <Col>
//                           <Button
//                             className="btn btn-danger w-25 mx-1"
//                             onClick={() => handleDeleteCourier(courier.trackingId)}
//                           >
//                             <DeleteFilled />
//                           </Button>
//                           <Button
//                             className="btn btn-success w-25"
//                             onClick={() => handleEditCourier(courier)}
//                           >
//                             <FileAddFilled />
//                           </Button>
//                         </Col>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Col>
//           ) : (
//             <p>No couriers added yet.</p>
//           )}

//           <Modal
//             open={isModalOpen}
//             onOk={handleSave}
//             onCancel={handleCancel}
//             okText="Save"
//           >
//             <div className="edit-form">
//               <h3>Edit Courier</h3>
//               <Input
//                 className="my-2"
//                 type="text"
//                 name="name"
//                 placeholder="Customer Name"
//                 value={editForm.name}
//                 onChange={handleChange}
//               />
//               <Input
//                 className="my-2"
//                 type="text"
//                 name="trackingId"
//                 placeholder="Tracking ID"
//                 value={editForm.trackingId}
//                 onChange={handleChange}
//               />
//               <Input
//                 className="my-2"
//                 type="text"
//                 name="status"
//                 placeholder="Courier Status"
//                 value={editForm.status}
//                 onChange={handleChange}
//               />
//               <Input
//                 className="my-2"
//                 type="number"
//                 name="amount"
//                 placeholder="Amount"
//                 value={editForm.amount}
//                 onChange={handleChange}
//               />
//             </div>
//           </Modal>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default ListShipments;


import { DeleteFilled, FileAddFilled } from '@ant-design/icons';
import { Col, Input, message, Modal, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the plugin for tables in PDF

const ListShipments = () => {
  const [couriers, setCouriers] = useState([]);
  const [riders, setRiders] = useState([]);
  const [editForm, setEditForm] = useState({ name: "", trackingId: "", status: "", amount: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load couriers
    const savedCouriers = localStorage.getItem('courirs');
    if (savedCouriers) {
      setCouriers(JSON.parse(savedCouriers));
    }

    // Load riders
    const savedRiders = localStorage.getItem('couriers'); // Rider data is stored under this key
    if (savedRiders) {
      setRiders(JSON.parse(savedRiders));
    }
  }, []);

  const handleDeleteCourier = (trackingId) => {
    const updatedCouriers = couriers.filter((courier) => courier.trackingId !== trackingId);
    setCouriers(updatedCouriers);
    localStorage.setItem("courirs", JSON.stringify(updatedCouriers));
    message.success("Shipment deleted successfully");
  };

  const saveToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Courier List", 10, 10);

    const headers = [["#", "Name", "Tracking ID", "Status", "Amount", "Rider Name", "Rider Contact"]];
    const data = couriers.map((courier, index) => {
      const rider = riders.find((r) => r.name === courier.name) || {};
      return [
        index + 1,
        courier.name,
        courier.trackingId,
        courier.status,
        `$${courier.amount}`,
        rider.name || "N/A",
        rider.contact || "N/A",
      ];
    });

    doc.autoTable({
      head: headers,
      body: data,
      startY: 20,
    });

    doc.save("couriers.pdf");
    message.success("PDF downloaded successfully");
  };

  return (
    <Container style={{ height: "100vh" }}>
      <Row className="flex-sm-wrap">
        <Col xs={12} md={18} lg={24}>
          <h1 className="text-center my-5">Courier List</h1>
          <Button className="mb-3" onClick={saveToPDF}>Download PDF</Button>
          {couriers.length > 0 ? (
            <Col>
              <Table striped bordered hover>
                <thead className="text-center">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Tracking ID</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Rider Name</th>
                    <th>Rider Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {couriers.map((courier, index) => {
                    const rider = riders.find((r) => r.name === courier.name) || {};
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{courier.name}</td>
                        <td>{courier.trackingId}</td>
                        <td>{courier.status}</td>
                        <td>${courier.amount}</td>
                        <td>{rider.name || "N/A"}</td>
                        <td>{rider.contact || "N/A"}</td>
                        <td>
                          <Button className="btn btn-danger mx-1" onClick={() => handleDeleteCourier(courier.trackingId)}>
                            <DeleteFilled />
                          </Button>
                          <Button className="btn btn-success" onClick={() => setEditForm(courier)}>
                            <FileAddFilled />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          ) : (
            <p>No couriers added yet.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ListShipments;

