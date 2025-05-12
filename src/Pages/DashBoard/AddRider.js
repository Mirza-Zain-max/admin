/* eslint-disable no-unused-vars */
import { Button, Card, Col, Input, message, Row, Typography } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { Container } from "react-bootstrap";
import { collection, addDoc, deleteDoc, doc, getDocs, query, orderBy } from "firebase/firestore";
import { fireStore } from "../../Config/firebase";
import { useAuthContext } from "../../Context/Auth";

const AddRider = () => {
    const { user } = useAuthContext();
    const { Title } = Typography;
    const [newRider, setNewRider] = useState({ name: "", contact: "", address: "" });
    const [riders, setRiders] = useState([]);
    const inputRefs = useRef([]);
    const riderNameRef = useRef(null);
    const [isLoading, setIsLoading] = useState()
    const [isLoading2, setIsLoading2] = useState()

    useEffect(() => {
        const fetchRiders = async () => {
            const q = query(collection(fireStore, "riders"), orderBy('createdAt'));
            const querySnapshot = await getDocs(q);
            const ridersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRiders(ridersList);
        };
        fetchRiders();
    }, []);
    const handleRiderChange = (e) => {
        const { name, value } = e.target;
        setNewRider((prev) => ({ ...prev, [name]: value }));
    };
    const handleKeyPress = (e, index) => {
        if (e.key === "Enter") {
            if (index === "submit") {
                saveRider();
            } else if (inputRefs.current[index + 1]) {
                inputRefs.current[index + 1].focus();
            }
        }
    };
    const saveRider = async () => {
        if (!newRider.name || !newRider.contact || !newRider.address) {
            message.error("Please fill all fields!");
            return;
        }

        if (!user || !user.uid) {
            message.error("User not authenticated. Please log in.");
            return;
        }

        const duplicate = riders.find((rider) => rider.name.toLowerCase() === newRider.name.toLowerCase());
        if (duplicate) {
            message.error("Rider with this name already exists!");
            return;
        }
        setIsLoading(true)

        try {
            const newRiderData = { ...newRider, Created_By: user.uid };
            const docRef = await addDoc(collection(fireStore, "riders"), newRiderData);
            setRiders((prevRiders) => [...prevRiders, { id: docRef.id, ...newRiderData }]);
            setNewRider({ name: "", contact: "", address: "" });
            message.success("Rider added successfully!");
            riderNameRef.current.focus();
        } catch (e) {
            console.error("Error adding document:", e);
            message.error("Error adding rider!");
        } finally {
            setIsLoading(false)
        }
    };
    const deleteRider = async () => {
        if (!newRider.name) {
            message.error("Please enter rider name to delete.");
            return;
        }

        const riderToDelete = riders.find((rider) => rider.name.toLowerCase() === newRider.name.toLowerCase());
        if (!riderToDelete) {
            message.error("Rider not found!");
            return;
        }
        setIsLoading2(true)
        try {
            await deleteDoc(doc(fireStore, "riders", riderToDelete.id));
            setRiders(riders.filter((rider) => rider.id !== riderToDelete.id));
            setNewRider({ name: "" });
            message.success("Rider deleted successfully!");
            riderNameRef.current.focus();
        } catch (e) {
            console.error("Error deleting document:", e);
            message.error("Error deleting rider!");
        } finally {
            setIsLoading2(false)
        }
    };
    return (
        <main className="auth d-flex justify-content-center align-items-center">
            <Container >
                <Row className="d-flex justify-content-center align-items-center">
                    <Col span={24} className="text-center">
                        <span className="text-white " style={{ fontSize: 60, fontWeight: 600, fontFamily: "inherit" }}>Add Rider</span>
                    </Col>
                    <Col className="d-flex justify-content-center align-items-center">
                        <Card style={{ backgroundColor: "#fff" }} className="p-4 my-4 card2 border-0">
                            <label className="fw-bold fs-6">Rider Name:</label>
                            <Input type="text" className="my-2 rounded-4" name="name" value={newRider.name} onChange={handleRiderChange} placeholder="Enter rider name" ref={(ref) => { inputRefs.current[0] = ref; riderNameRef.current = ref }} onKeyDown={(e) => handleKeyPress(e, 0)} />
                            <label className="fw-bold fs-6">Contact Number:</label>
                            <Input type="number" className="my-2 rounded-4" name="contact" value={newRider.contact} onChange={handleRiderChange} placeholder="Enter contact number" ref={(ref) => inputRefs.current[1] = ref} onKeyDown={(e) => handleKeyPress(e, 1)} />
                            <label className="fw-bold fs-6">Address:</label>
                            <Input type="text" className="my-2 rounded-4" name="address" value={newRider.address} onChange={handleRiderChange} placeholder="Enter address" ref={(ref) => inputRefs.current[2] = ref} onKeyDown={(e) => handleKeyPress(e, "submit")} />
                            <div className="d-flex justify-content-center align-items-center">
                                <Button loading={isLoading} className="me-2 w-50 border-0 p-4 rounded-5 mt-2 fs-4 fw-medium" style={{ backgroundColor: "#007991", color: "#fff" }} onClick={saveRider}>
                                    Save Rider
                                </Button>
                            </div>
                            {/* <Button loading={isLoading2} className="me-2 mt-2 border-0 bg-danger" style={{ color: "#fff" }} onClick={deleteRider}>
                                Delete Rider
                            </Button> */}
                        </Card>
                    </Col>
                </Row>
            </Container>
        </main>
    );
};

export default AddRider;