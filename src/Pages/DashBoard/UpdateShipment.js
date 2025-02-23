// import { message } from "antd";
// import React, { useState } from "react";

// function UpdateShipment() {
//   const [trackingId, setTrackingId] = useState("");
//   const [newStatus, setNewStatus] = useState("");

//   const handleUpdate = () => {
//     // Update logic here (mocked)
//     console.log(`Updated shipment ${trackingId} to status: ${newStatus}`);
//     message.error(`Shipment ${trackingId} status updated to ${newStatus}`);
//   };

//   return (
//     <div>
//       <h1>Update Shipment</h1>
//       <input
//         type="text"
//         placeholder="Enter Tracking ID"
//         value={trackingId}
//         onChange={(e) => setTrackingId(e.target.value)}
//       />
//       <select
//         value={newStatus}
//         onChange={(e) => setNewStatus(e.target.value)}
//       >
//         <option value="">Select Status</option>
//         <option value="Pending">Pending</option>
//         <option value="In Transit">In Transit</option>
//         <option value="Delivered">Delivered</option>
//       </select>
//       <button onClick={handleUpdate}>Update Status</button>
//     </div>
//   );
// }

// export default UpdateShipment;

// import { DeleteFilled, FileAddFilled } from "@ant-design/icons";
// import { Col, message, Modal, Row, Input, Select, DatePicker } from "antd";
// import React, { useEffect, useState } from "react";
// import { Container, Table, Button } from "react-bootstrap";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// const { Option } = Select;

// const UpdateShipment = () => {
//   const [couriers, setCouriers] = useState([]);
//   const [filteredCouriers, setFilteredCouriers] = useState([]);
//   const [editForm, setEditForm] = useState({
//     consignee: "",
//     cnnumber: "",
//     rider: "",
//     reserved: "",
//   });
//   const [riders, setRiders] = useState([]);
//   const [selectedRider, setSelectedRider] = useState("");
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Fetch couriers and riders from localStorage on mount
//   useEffect(() => {
//     const savedCouriers = localStorage.getItem("courierData");
//     const savedRiders = localStorage.getItem("couriers");
//     if (savedCouriers) {
//       const parsedCouriers = JSON.parse(savedCouriers);
//       setCouriers(parsedCouriers);
//       setFilteredCouriers(parsedCouriers);
//     }
//     if (savedRiders) {
//       setRiders(JSON.parse(savedRiders));
//     }
//   }, []);

//   // Filter couriers by rider and date
//   const filterCouriers = () => {
//     let filtered = couriers;

//     if (selectedRider) {
//       filtered = filtered.filter((courier) => courier.rider === selectedRider);
//     }

//     if (selectedDate) {
//       filtered = filtered.filter(
//         (courier) =>
//           new Date(courier.createdAt).toDateString() ===
//           selectedDate.toDateString()
//       );
//     }

//     setFilteredCouriers(filtered);
//   };

//   useEffect(() => {
//     filterCouriers();
//   }, [selectedRider, selectedDate]);

//   const handleDeleteCourier = (cnnumber) => {
//     const updatedCouriers = couriers.filter(
//       (courier) => courier.cnnumber !== cnnumber
//     );
//     setCouriers(updatedCouriers);
//     setFilteredCouriers(updatedCouriers);
//     localStorage.setItem("courierData", JSON.stringify(updatedCouriers));
//     message.success("Courier deleted successfully!");
//   };

//   const handleEditCourier = (courier) => {
//     setEditForm(courier);
//     setIsModalOpen(true);
//   };

//   const handleSaveEdit = () => {
//     const updatedCouriers = couriers.map((courier) =>
//       courier.cnnumber === editForm.cnnumber ? editForm : courier
//     );
//     setCouriers(updatedCouriers);
//     setFilteredCouriers(updatedCouriers);
//     localStorage.setItem("courierData", JSON.stringify(updatedCouriers));
//     setEditForm({ consignee: "", cnnumber: "", rider: "", reserved: "" });
//     message.success("Courier updated successfully!");
//     setIsModalOpen(false);
//   };

//   const handleReservedChange = (cnnumber, value) => {
//     const updatedCouriers = couriers.map((courier) =>
//       courier.cnnumber === cnnumber ? { ...courier, reserved: value } : courier
//     );
//     setCouriers(updatedCouriers);
//     setFilteredCouriers(updatedCouriers);
//     localStorage.setItem("courierData", JSON.stringify(updatedCouriers));
//   };

//   const saveToPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Courier List", 10, 10);

//     const headers = [
//       ["#", "Rider", "Consignee", "CN Number", "Reserved", "Timestamp"],
//     ];
//     const data = filteredCouriers.map((courier, index) => [
//       index + 1,
//       courier.rider,
//       courier.consignee,
//       courier.cnnumber,
//       courier.reserved || "",
//       courier.createdAt,
//     ]);

//     doc.autoTable({ head: headers, body: data, startY: 20 });
//     doc.save("couriers.pdf");
//     message.success("PDF downloaded successfully!");
//   };

//   return (
//     <main>
//       <Container>
//         <Row>
//           <Col span={24}>
//             <h1 className="text-center my-5">Make Delivery Sheet</h1>

//             {/* Dropdown and Date Filter */}
//             <div className="mb-3 d-flex gap-3">
//               <Select
//                 className="w-25"
//                 placeholder="Select Rider to Filter"
//                 value={selectedRider}
//                 onChange={(value) => setSelectedRider(value)}
//                 allowClear
//               >
//                 {riders.map((rider, index) => (
//                   <Option key={index} value={rider.name}>
//                     {rider.name}
//                   </Option>
//                 ))}
//               </Select>
//               <DatePicker
//                 placeholder="Select Date"
//                 onChange={(date) => setSelectedDate(date ? date.toDate() : null)}
//                 allowClear
//               />
//             </div>

//             {filteredCouriers.length > 0 ? (
//               <Table striped bordered hover>
//                 <thead className="text-center">
//                   <tr>
//                     <th>#</th>
//                     <th>Rider</th>
//                     <th>Consignee</th>
//                     <th>CN Number</th>
//                     <th>Reserved</th>
//                     <th>Timestamp</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCouriers.map((courier, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>{courier.rider}</td>
//                       <td>{courier.consignee}</td>
//                       <td>{courier.cnnumber}</td>
//                       <td>
//                         <Input
//                           value={courier.reserved || ""}
//                           onChange={(e) =>
//                             handleReservedChange(
//                               courier.cnnumber,
//                               e.target.value
//                             )
//                           }
//                           placeholder="Enter reserved info"
//                         />
//                       </td>
//                       <td>{new Date(courier.createdAt).toLocaleString()}</td>
//                       <td>
//                         <Button
//                           className="btn btn-danger mx-1"
//                           onClick={() =>
//                             handleDeleteCourier(courier.cnnumber)
//                           }
//                         >
//                           <DeleteFilled />
//                         </Button>
//                         <Button
//                           className="btn btn-success"
//                           onClick={() => handleEditCourier(courier)}
//                         >
//                           <FileAddFilled />
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             ) : (
//               <p>No couriers match the selected filters.</p>
//             )}
//           </Col>
//         </Row>

//         {/* Modal for editing a courier */}
//         <Modal
//           open={isModalOpen}
//           onOk={handleSaveEdit}
//           onCancel={() => setIsModalOpen(false)}
//           okText="Save"
//           cancelText="Cancel"
//         >
//           <h3>Edit Courier</h3>
//           <Input
//             className="my-2"
//             type="text"
//             name="rider"
//             placeholder="Rider Name"
//             value={editForm.rider}
//             onChange={(e) =>
//               setEditForm({ ...editForm, rider: e.target.value })
//             }
//           />
//           <Input
//             className="my-2"
//             type="text"
//             name="consignee"
//             placeholder="Consignee"
//             value={editForm.consignee}
//             onChange={(e) =>
//               setEditForm({ ...editForm, consignee: e.target.value })
//             }
//           />
//           <Input
//             className="my-2"
//             type="text"
//             name="cnnumber"
//             placeholder="CN Number"
//             value={editForm.cnnumber}
//             disabled
//           />
//           <Input
//             className="my-2"
//             type="text"
//             name="reserved"
//             placeholder="Reserved Info"
//             value={editForm.reserved}
//             onChange={(e) =>
//               setEditForm({ ...editForm, reserved: e.target.value })
//             }
//           />
//         </Modal>
//       </Container>
//     </main>
//   );
// };

// export default UpdateShipment; 

import { Table, Card } from "antd";
import React, { useState, useEffect } from "react";

const UpdateShipment = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const riderData = JSON.parse(localStorage.getItem("riderData") || "[]");
    const courierData = JSON.parse(localStorage.getItem("courierData") || "[]");

    // Combine riderData and courierData
    const combinedData = courierData.map((courier) => {
      const rider = riderData.find((r) => r.riderName === courier.riderName);
      return {
        ...courier,
        receiverName: rider ? rider.receiverName : "N/A",
      };
    });

    setData(combinedData);
  }, []);

  const columns = [
    { title: "Rider Name", dataIndex: "riderName", key: "riderName" },
    { title: "Receiver Name", dataIndex: "receiverName", key: "receiverName" },
    { title: "CN Number", dataIndex: "cnNumber", key: "cnNumber" },
    { title: "Consignee Number", dataIndex: "consigneeNumber", key: "consigneeNumber" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  return (
    <main className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card className="w-75">
        <h1>Update Shipment</h1>
        <Table columns={columns} dataSource={data} rowKey="cnNumber" />
      </Card>
    </main>
  );
};

export default UpdateShipment;
