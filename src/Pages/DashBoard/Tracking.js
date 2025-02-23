import { Button, Card, Col, Input, message, Row, Typography } from "antd";
import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { fireStore } from "../../Config/firebase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import "./Style.css";

const TrackShipment = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [riders, setRiders] = useState([]);
    const [shipper, setShipper] = useState([]);
    const { Title } = Typography;
    const [trackCN, setTrackCN] = useState('');
    const [trackResult, setTrackResult] = useState(null);
    useEffect(() => {
        const fetchData = () => {
            try {
                const deliveriesUnsub = onSnapshot(collection(fireStore, "deliveries"), (snapshot) => {
                    const deliveriesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setDeliveries(deliveriesList);
                });
                const ridersUnsub = onSnapshot(collection(fireStore, "riders"), (snapshot) => {
                    const ridersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setRiders(ridersList);
                });
                const shipperUnsub = onSnapshot(collection(fireStore, "shipper"), (snapshot) => {
                    const shipperList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setShipper(shipperList);
                });
                return () => {
                    deliveriesUnsub();
                    ridersUnsub();
                    shipperUnsub();
                };

            } catch (error) {
                message.error("Failed to fetch data.");
            }
        };

        fetchData();
    }, []);
    const getStatusClass = (status) => {
        switch (status) {
            case "Delivered":
                return "text-success";
            case "On Route":
                return "text-danger";
            case "Booked":
                return "text-primary";
            default:
                return "text-warning";
        }
    };
    const handleTrackCNChange = (e) => setTrackCN(e.target.value);
    const saveTrackingData = async () => {
        if (!trackResult) {
            message.error("No tracking data to save.");
            return;
        }
        try {
            await addDoc(collection(fireStore, "tracking"), { results: trackResult });
            message.success("Tracking data saved successfully!");
        } catch (error) {
            message.error("Failed to save tracking data!");
        }
    };
    const trackShipment = () => {
        if (!trackCN.trim()) {
            message.warning("Please enter a CN Number.");
            return;
        }

        const deliveryResult = deliveries.find(delivery => delivery.cnNumber === trackCN.trim());
        const shipperResult = shipper.find(ship => ship.cnNumber === trackCN.trim());

        if (deliveryResult || shipperResult) {
            const statusList = [];
            if (shipperResult?.status) statusList.push(shipperResult.status);
            if (deliveryResult?.status) statusList.push(deliveryResult.status);
            const combinedResult = {
                ...(shipperResult || {}),
                ...(deliveryResult || {}),
                status: statusList.length > 0 ? statusList.join(" → ") : "Status not available"
            };

            setTrackResult([combinedResult]);
            message.success("Record found!");
        } else {
            setTrackResult(null);
            message.error("Not found with this CN Number.");
        }
    };
    const handleKeyPress = (event) => { if (event.key === "Enter") trackShipment(); };
    return (
        <main className="d-flex justify-content-center align-items-center auth">
            <Container>
                <Row className="d-flex justify-content-center align-items-center">
                    <Col span={24}>
                        <Card className="mt-5" style={{backgroundColor:"#d6d6d6"}}>
                            <Title level={1}>Track Shipment</Title>
                            <label className="fw-bolder mb-4">Enter CN Number:</label>
                            <Input className="mb-4" type="text" value={trackCN} onChange={handleTrackCNChange} onKeyDown={handleKeyPress} placeholder="Enter CN Number" />
                            <Button className="w-25 p-3" type="primary" onClick={trackShipment}>
                                Track
                            </Button>
                            <Button className="w-25 p-3 d-none" type="primary" onClick={saveTrackingData}>
                                Save
                            </Button>

                            {trackResult ? (
                                <div className="table-container">
                                    <Table responsive border="2" bordered className="desktop-table">
                                        <thead>
                                            <tr>
                                                <th className="text-center">Index</th>
                                                <th className="text-center">CN Number</th>
                                                <th className="text-center">Shipper</th>
                                                <th className="text-center">Origin</th>
                                                <th className="text-center">Destination</th>
                                                <th className="text-center">Consignee Name</th>
                                                <th className="text-center">Reciver Name</th>
                                                <th className="text-center">Rider Name</th>
                                                <th className="text-center">Status</th>
                                                <th className="text-center">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trackResult.map((shipment, index) => (
                                                <tr key={index}>
                                                    <td className="text-center">{index + 1}</td>
                                                    <td className="text-center">{shipment.cnNumber}</td>
                                                    <td className="text-center">{shipment.name || shipment.shipperName}</td>
                                                    <td className="text-center">{shipment.origin}</td>
                                                    <td className="text-center">{shipment.destination}</td>
                                                    <td className="text-center">{shipment.consignee || shipment.consigneeName}</td>
                                                    <td className="text-center">{shipment.receiverName}</td>
                                                    <td className="text-center">{shipment.riderName}</td>
                                                    <td className="text-center">
                                                        <span className={getStatusClass(shipment.status)}>
                                                            {shipment.status}
                                                        </span>

                                                    </td>
                                                    <td className="text-center">{shipment.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    <div className="mobile-table">
                                        {trackResult.map((shipment, index) => (
                                            <div key={index} className="mobile-table-row">
                                                <p><strong>CN Number:</strong> {shipment.cnNumber}</p>
                                                <p><strong>Shipper:</strong> {shipment.name || shipment.shipperName}</p>
                                                <p><strong>Origin:</strong> {shipment.origin}</p>
                                                <p><strong>Destination:</strong> {shipment.destination}</p>
                                                <p><strong>Consignee Name:</strong> {shipment.consignee}</p>
                                                <p><strong>Reciver Name:</strong> {shipment.receiverName}</p>
                                                <p><strong>Rider Name:</strong> {shipment.riderName}</p>
                                                <p><strong>Status:</strong> <span className={getStatusClass(shipment.status)}>
                                                    {shipment.status}
                                                </span></p>
                                                <p><strong>Date:</strong> {shipment.date}</p>
                                                <hr />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : trackCN && (
                                <p style={{ color: 'red', marginTop: '20px' }}>
                                    No shipment found with this CN Number.
                                </p>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Container>
        </main>
    );
};

export default TrackShipment;

// import { Button, Card, Col, Input, message, Row, Typography } from "antd";
// import React, { useState, useEffect } from "react";
// import { Container, Table } from "react-bootstrap";
// import { fireStore } from "../../Config/firebase";
// import { addDoc, collection, getDocs, query } from "firebase/firestore";
// import "./Style.css"; // Import custom styles

// const TrackShipment = () => {
//     const [deliveries, setDeliveries] = useState([]);
//     const [riders, setRiders] = useState([]);
//     const { Title } = Typography;
//     const [trackCN, setTrackCN] = useState('');
//     const [trackResult, setTrackResult] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const deliveriesQuery = query(collection(fireStore, "deliveries"));
//                 const deliveriesSnapshot = await getDocs(deliveriesQuery);
//                 const deliveriesList = deliveriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//                 setDeliveries(deliveriesList);

//                 const ridersQuery = query(collection(fireStore, "riders"));
//                 const ridersSnapshot = await getDocs(ridersQuery);
//                 const ridersList = ridersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//                 setRiders(ridersList);
//             } catch (error) {
//                 message.error("Failed to fetch data from Firestore!");
//             }
//         };
//         fetchData();
//     }, []);

//     const handleTrackCNChange = (e) => setTrackCN(e.target.value);

//     const trackShipment = () => {
//         if (!trackCN.trim()) {
//             message.warning("Please enter a CN Number.");
//             return;
//         }

//         const results = deliveries.filter(delivery => delivery.cnNumber === trackCN.trim());

//         if (results.length > 0) {
//             const trackedDeliveries = results.map(result => {
//                 const rider = riders.find(r => r.id === result.riderId);
//                 return { ...result, riderName: rider ? rider.name : "Unknown" };
//             });

//             setTrackResult(trackedDeliveries);
//             message.success(`${results.length} deliveries found with this CN Number!`);
//         } else {
//             setTrackResult(null);
//             message.error("No delivery found with this CN Number.");
//         }
//     };

//     const handleKeyPress = (event) => { if (event.key === "Enter") trackShipment(); };

//     const saveTrackingData = async () => {
//         if (!trackResult) {
//             message.error("No tracking data to save.");
//             return;
//         }
//         try {
//             await addDoc(collection(fireStore, "tracking"), trackResult);
//             message.success("Tracking data saved successfully!");
//         } catch (error) {
//             message.error("Failed to save tracking data!");
//         }
//     };

//     return (
//         <main className="d-flex justify-content-center align-items-center auth">
//             <Container>
//                 <Row className="d-flex justify-content-center align-items-center">
//                     <Col span={24}>
//                         <Card className="mt-5">
//                             <Title level={1}>Track Shipment</Title>
//                             <label className="fw-bolder mb-4">Enter CN Number:</label>
//                             <Input className="mb-4" type="text" value={trackCN} onChange={handleTrackCNChange} onKeyDown={handleKeyPress} placeholder="Enter CN Number" />
//                             <Button className="w-25 p-3" type="primary" onClick={trackShipment}>
//                                 Track
//                             </Button>
//                             <Button className="w-25 p-3 d-none" type="primary" onClick={saveTrackingData}>
//                                 Save
//                             </Button>

//                             {trackResult ? (
//                                 <div className="table-container">
//                                     {/* Desktop Table */}
//                                     <Table border="2" bordered className="desktop-table">
//                                         <thead>
//                                             <tr>
//                                                 <th className="text-center">Index</th>
//                                                 <th className="text-center">Origin</th>
//                                                 <th className="text-center">Shipper</th>
//                                                 <th className="text-center">CN Number</th>
//                                                 <th className="text-center">Consignee Name</th>
//                                                 <th className="text-center">Rider Name</th>
//                                                 <th className="text-center">Receiver Name</th>
//                                                 <th className="text-center">Status</th>
//                                                 <th className="text-center">Dest</th>
//                                                 <th className="text-center">Date</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {trackResult.map((delivery, index) => (
//                                                 <tr key={index}>
//                                                     <td className="fs-6 text-center">{index + 1}</td>
//                                                     <td className="fs-6 text-center">{""}</td>
//                                                     <td className="fs-6 text-center">{""}</td>
//                                                     <td className="text-center">{delivery.cnNumber}</td>
//                                                     <td className="text-center">{delivery.consigneeName}</td>
//                                                     <td className="text-center">{delivery.riderName}</td>
//                                                     <td className="text-center">{delivery.receiverName}</td>
//                                                     <td className="text-center">{""}</td>
//                                                     <td className="text-center">{""}</td>
//                                                     <td className="text-center">{delivery.date}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </Table>

//                                     {/* Mobile View: Convert to Cards */}
//                                     <div className="mobile-table">
//                                         {trackResult.map((delivery, index) => (
//                                             <div key={index} className="mobile-table-row">
//                                                 <p><strong>CN Number:</strong> {delivery.cnNumber}</p>
//                                                 <p><strong>Consignee Name:</strong> {delivery.consigneeName}</p>
//                                                 <p><strong>Rider Name:</strong> {delivery.riderName}</p>
//                                                 <p><strong>Receiver Name:</strong> {delivery.receiverName}</p>
//                                                 <p><strong>Date:</strong> {delivery.date}</p>
//                                                 <hr />
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ) : trackCN && (
//                                 <p style={{ color: 'red', marginTop: '20px' }}>
//                                     No delivery found with this CN Number.
//                                 </p>
//                             )}
//                         </Card>
//                     </Col>
//                 </Row>
//             </Container>
//         </main>
//     );
// };

// export default TrackShipment;
