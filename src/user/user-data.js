/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Table, Select, DatePicker, Button, Modal, Input, message, Form, Row, Col, Card, Typography, Popconfirm } from "antd";
import { collection, getDocs, deleteDoc, doc, updateDoc, getDoc, query, where, orderBy, writeBatch } from "firebase/firestore";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Container } from "react-bootstrap";
import { fireStore } from "../Config/firebase";
import { useAuthContext } from "../Context/Auth";

const UserData = () => {
    const { Title } = Typography;
    const { user } = useAuthContext();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [riderList, setRiderList] = useState([]);
    const [newReceiver, setNewReceiver] = useState({});
    const [selectedRider, setSelectedRider] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [page, setPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const inputRefs = useRef([]);

    useEffect(() => {
        if (user?.uid) {
            fetchDeliveries(user.uid);
        } else {
            console.warn("⏳ Waiting for user to load...");
        }
    }, [user]);

    const fetchDeliveries = async (uid) => {
        setLoading(true);
        try {
            const deliveryQuery = query(
                collection(fireStore, "deliveries"),
                where("Created_By", "==", uid)
            );
            const deliverySnapshot = await getDocs(deliveryQuery);
            const deliveries = deliverySnapshot.docs.map(doc => ({
                id: doc.id,
                source: "deliveries",
                createdAt: doc.data().createdAt || "",
                ...doc.data()
            }));
            const riderSnapshot = await getDocs(collection(fireStore, "riders"));
            const riders = riderSnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name || ""
            }));
            const userBookingQuery = query(
                collection(fireStore, "User Booking"),
                where("Created_By", "==", uid)
            );
            const bookingSnapshot = await getDocs(userBookingQuery);
            const bookings = bookingSnapshot.docs.map(doc => ({
                id: doc.id,
                source: "User Booking",
                ...doc.data()
            }));
            const riderMap = new Map(riders.map(r => [r.id, r.name]));
            const updatedDeliveries = deliveries.map(d => ({
                ...d,
                riderName: riderMap.get(d.riderId) || ""
            }));
            const combinedData = [...updatedDeliveries, ...bookings];
            setData(combinedData);
            setFilteredData(combinedData);
            setRiderList(riders);
        } catch (err) {
            message.error("Error fetching your data.");
        }
        setLoading(false);
    };

    const columns = [
        {
            title: "#",
            key: "index",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Rider Name",
            key: "riderName",
            render: (record) => {
                const rider = riderList.find((r) => r.id === record.riderId);
                return rider ? rider.name : "";
            },
        },
        {
            title: "Shipper Name",
            dataIndex: ["shipperName" || "shipper"],
            key: "shipperName",
        },
        {
            title: "CN Number",
            dataIndex: "cnNumber",
            key: "cnNumber",
        },
        {
            title: "Consignee Name",
            dataIndex: "consignee",
            key: "consignee",
        },
        {
            title: "Receiver Name",
            key: "receiverName",
            render: (record, _, index) => (
                <Input
                    disabled
                    className="border-0"
                    defaultValue={record.receiverName}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    onChange={(e) => handleReciverChange(e, record.cnNumber)}
                    onKeyDown={(e) => handleKeyPress(e, index)}
                />
            ),
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button className="bg-success text-light rounded-pill border-0" onClick={() => handleEdit(record)}>
                        <EditFilled />
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this delivery?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className="bg-danger text-light rounded-pill border-0" danger>
                            <DeleteFilled />
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];
    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({ consignee: record.consignee || "" });
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (!editingRecord || !editingRecord.id) return;
            await updateOnlyconsignee(editingRecord.id, values.consignee);
            fetchDeliveries(user.uid);
            form.resetFields();
            setIsModalVisible(false);
        } catch (err) {
            message.error("Failed to update consignee name!");
        }
    };

    const updateOnlyconsignee = async (id, newName) => {
        const deliveryRef = doc(fireStore, "deliveries", id);
        const bookingRef = doc(fireStore, "User Booking", id);
        const deliverySnap = await getDoc(deliveryRef);
        const bookingSnap = await getDoc(bookingRef);
        if (deliverySnap.exists()) await updateDoc(deliveryRef, { consignee: newName });
        if (bookingSnap.exists()) await updateDoc(bookingRef, { consignee: newName });
        message.success("Consignee updated successfully!");
    };

    const handleDelete = async (id) => {
        try {
            const deliveryRef = doc(fireStore, "deliveries", id);
            const bookingRef = doc(fireStore, "User Booking", id);
            const deliverySnap = await getDoc(deliveryRef);
            const bookingSnap = await getDoc(bookingRef);
            if (deliverySnap.exists()) await deleteDoc(deliveryRef);
            if (bookingSnap.exists()) await deleteDoc(bookingRef);
            setData(prev => prev.filter(item => item.id !== id));
            message.success("Delivery deleted.");
        } catch (err) {
            console.error("Delete error:", err);
            message.error("Failed to delete delivery.");
        }
    };

    const handleReciverChange = (e, cnNumber) => {
        setNewReceiver((prev) => ({ ...prev, [cnNumber]: e.target.value }));
    };

    const handleKeyPress = (e, index) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const next = inputRefs.current[index + 1];
            if (next) next.focus();
        }
    };

    return (
        <main className="auth">
            <Container className="my-3">
                <Typography.Title className="text-center text-light">Show Data</Typography.Title>
                <Card>
                    <Card className="border-0 bg-transparent card2 mb-3">
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} md={12}>
                                <DatePicker className="w-100" placeholder="Select Date" onChange={setSelectedDate} />
                            </Col>
                            <Col xs={24} md={12}>
                                <Input placeholder="Search CN Number" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} allowClear />
                            </Col>
                            <Col xs={24} md={12}>
                                <Button
                                    type="primary"
                                    className="me-2"
                                    onClick={() => {
                                        let filtered = [...data];
                                        if (selectedRider) {
                                            filtered = filtered.filter((d) => d.riderId === selectedRider);
                                        }
                                        if (selectedDate) {
                                            const selected = selectedDate.format("YYYY-MM-DD");
                                            filtered = filtered.filter((d) => d.date === selected);
                                        }
                                        if (searchValue) {
                                            filtered = filtered.filter((d) =>
                                                d.cnNumber?.toString().toLowerCase().includes(searchValue.toLowerCase())
                                            );
                                        }
                                        setFilteredData(filtered);
                                    }}
                                >
                                    Apply Filters
                                </Button>

                                <Button
                                    onClick={() => {
                                        setFilteredData(data);
                                        setSearchValue("");
                                        setSelectedDate(null);
                                    }}
                                >
                                    Reset
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                    <Table
                        bordered
                        dataSource={filteredData.map((item, index) => ({ ...item, key: item.id || index }))}
                        columns={columns}
                        loading={loading}
                        pagination={{
                            current: page,
                            pageSize: 20,
                            showSizeChanger: false,
                            onChange: (newPage) => setPage(newPage),
                        }}
                        scroll={{ x: 1000 }}
                    />
                    <Modal title="Edit Consignee Name" open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)}>
                        <Form form={form} layout="vertical">
                            <Form.Item name="consignee" label="Consignee Name" rules={[{ required: true, message: 'Please input the consignee name!' }]}>
                                <Input placeholder="Enter Consignee Name" />
                            </Form.Item>
                        </Form>
                    </Modal>
                </Card>
            </Container>
        </main>
    );
};

export default UserData;