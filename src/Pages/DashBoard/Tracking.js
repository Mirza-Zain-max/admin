/* eslint-disable no-unused-vars */
import { Button, Card, Col, Input, message, Row, Typography } from "antd";
import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { fireStore } from "../../Config/firebase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import "./Style.css";
import { set } from "lodash";

const TrackShipment = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [riders, setRiders] = useState([])
    const [shipper, setShipper] = useState([]);
    const [booking, setBooking] = useState([])
    const { Title } = Typography;
    const [trackCN, setTrackCN] = useState('');
    const [trackResult, setTrackResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const fetchData = () => {
            setIsLoading(true);
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
                const userSnapData = onSnapshot(collection(fireStore, "User Booking"), (snapshot) => {
                    const bookingList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setBooking(bookingList);
                });
                return () => {
                    deliveriesUnsub();
                    ridersUnsub();
                    shipperUnsub();
                    userSnapData()
                };

            } catch (error) {
                message.error("Failed to fetch data.");
            }
            finally{
                setIsLoading(false);
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
        const bookingResult = booking.find(booking => booking.cnNumber === trackCN.trim())

        if (deliveryResult || shipperResult || bookingResult) {
            const statusList = [];
            if (shipperResult?.status) statusList.push(shipperResult.status);
            if (deliveryResult?.status) statusList.push(deliveryResult.status);
            if (bookingResult?.status) statusList.push(bookingResult.status);
            const combinedResult = {
                ...(shipperResult || {}),
                ...(deliveryResult || {}),
                ...(bookingResult || {}),
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
                    <Col span={24} className="text-center">
                        <span className="text-white " style={{ fontSize: 60, fontWeight: 600, fontFamily: "inherit" }}>Track Shipment</span>
                    </Col>
                    <Col span={24}>
                        <Card className="mt-5 card2" style={{ backgroundColor: "#fff" }}>
                            <label className="fw-bolder mb-4">Enter CN Number:</label>
                            <Input className="mb-4" type="text" value={trackCN} onChange={handleTrackCNChange} onKeyDown={handleKeyPress} placeholder="Enter CN Number" />
                            <div className="d-flex justify-content-center mb-4 align-items-center">
                                <Button loading={isLoading} className="me-2 w-50 border-0 p-4 rounded-5 mt-2 fs-4 fw-medium" style={{ backgroundColor: "#007991", color: "#fff" }} onClick={trackShipment}>
                                    Track Shipment
                                </Button>
                            </div>
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
                                                    <td className="text-center">{shipment.consignee || shipment.consignee}</td>
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