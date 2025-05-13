/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Table, Select, DatePicker, Button, Modal, Input, message, Form, Row, Col, Card, Typography, Popconfirm } from "antd";
import { collection, getDocs, deleteDoc, doc, updateDoc, writeBatch, getDoc, query, orderBy } from "firebase/firestore";
import { fireStore } from "../../Config/firebase";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Container } from "react-bootstrap";


const ShowData = () => {
    const { Title } = Typography;
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
    const [editingRecord, setEditingRecord] = useState(null)
    const [form] = Form.useForm();
    const inputRefs = useRef([]);
    const [companySearch, setCompanySearch] = useState('');

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            const deliveryQuery = query(collection(fireStore, "deliveries"), orderBy("createdAt"));
            const deliverySnapshot = await getDocs(deliveryQuery);
            const deliveryList = deliverySnapshot.docs.map(doc => ({
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
            const userBookingSnapshot = await getDocs(collection(fireStore, "User Booking"));
            const usershipperList = userBookingSnapshot.docs.map(doc => ({
                id: doc.id,
                source: "User Booking",
                ...doc.data()
            }));
            const riderMap = new Map(riders.map(rider => [rider.id, rider.name]));
            const createdByIds = new Set();
            deliveryList.forEach(item => item.Created_By && createdByIds.add(item.Created_By));
            usershipperList.forEach(item => item.Created_By && createdByIds.add(item.Created_By));
            const userNameMap = new Map();
            for (const uid of createdByIds) {
                const userRef = doc(fireStore, "users", uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    userNameMap.set(uid, userSnap.data().fullName || "Unknown User");
                }
            }
            const updatedDeliveries = deliveryList.map(delivery => ({
                ...delivery,
                riderName: riderMap.get(delivery.riderId) || "",
                createdByName: userNameMap.get(delivery.Created_By) || ""
            }));
            const updatedUserBookings = usershipperList.map(booking => ({
                ...booking,
                riderName: "",
                createdByName: userNameMap.get(booking.Created_By) || ""
            }));
            const combinedData = [...updatedDeliveries, ...updatedUserBookings];
            setData(combinedData);
            setFilteredData(combinedData);
            setRiderList(riders);
        } catch (error) {
            console.error("Error fetching deliveries:", error);
            message.error("Failed to fetch data");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDeliveries();
    }, []);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const applyFilters = () => {
        let filtered = [...data];
        if (selectedRider) {
            filtered = filtered.filter(delivery => delivery.riderId === selectedRider);
        }
        if (selectedDate) {
            const selectedDateString = selectedDate.format("YYYY-MM-DD");
            filtered = filtered.filter(delivery => delivery.date === selectedDateString);
        }
        setFilteredData(filtered);
    };

    const updateOnlyconsignee = async (id, newConsigneeValue) => {
        try {
            const deliveryRef = doc(fireStore, "deliveries", id);
            const shipperRef = doc(fireStore, "shipper", id);
            const userRef = doc(fireStore, "User Booking", id);
            const deliverySnap = await getDoc(deliveryRef);
            const shipperSnap = await getDoc(shipperRef);
            const userSnap = await getDoc(userRef);
            const updateData = { consignee: newConsigneeValue || "N/A" };
            if (deliverySnap.exists()) {
                await updateDoc(deliveryRef, updateData);
            }
            if (shipperSnap.exists()) {
                await updateDoc(shipperRef, updateData);
            }
            if (userSnap.exists()) {
                await updateDoc(userRef, updateData);
            }
            message.success("Consignee updated successfully!");
        } catch (error) {
            console.error("❌ Error during Consignee Update:", error);
            message.error("Failed to update consignee!");
        }
    };

    const handleEdit = (record) => {
        if (!record) return;
        setEditingRecord(record);
        form.setFieldsValue({
            consignee: record.consignee || "",
        });
        setIsModalVisible(true);
    };
    const handleDelete = async (id) => {
        try {
            let deleted = false;
            const deliveryRef = doc(fireStore, "deliveries", id);
            const deliverySnap = await getDoc(deliveryRef);
            if (deliverySnap.exists()) {
                await deleteDoc(deliveryRef);
                deleted = true;
            }
            const shipperRef = doc(fireStore, "shipper", id);
            const shipperSnap = await getDoc(shipperRef);
            if (shipperSnap.exists()) {
                await deleteDoc(shipperRef);
                deleted = true;
            }
            if (deleted) {
                setData(prevData => prevData.filter(item => item.id !== id));
                message.success("Delivery deleted successfully!");
            } else {
                message.warning("No matching delivery found to delete.");
            }
        } catch (error) {
            console.error("Error deleting delivery:", error);
            message.error("Failed to delete delivery!");
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const nextInput = inputRefs.current[index + 1];
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handleReciverChange = (e, cnNumber) => { const { value } = e.target; setNewReceiver((prev) => ({ ...prev, [cnNumber]: value })) };
    const handleSaveReceiver = async () => {
        try {
            const batch = writeBatch(fireStore);
            let hasUpdates = false;

            const deliveryRefs = filteredData.map(item => doc(fireStore, "deliveries", item.id));
            const shipperRefs = filteredData.map(item => doc(fireStore, "shipper", item.id));
            const userRefs = filteredData.map(item => doc(fireStore, "User Booking", item.id));
            const deliverySnaps = await Promise.all(deliveryRefs.map(ref => getDoc(ref)));
            const shipperSnaps = await Promise.all(shipperRefs.map(ref => getDoc(ref)));
            const usershipperSnaps = await Promise.all(userRefs.map(ref => getDoc(ref)));
            for (let i = 0; i < filteredData.length; i++) {
                const item = filteredData[i];
                const cn = String(item.cnNumber);
                if (!cn) {
                    console.warn("⛔ Missing cnNumber in item:", item);
                    continue;
                }
                if (newReceiver[cn]) {
                    const deliverySnap = deliverySnaps[i];
                    const shipperSnap = shipperSnaps[i];
                    const userSnap = usershipperSnaps[i];
                    if (!deliverySnap.exists() && !shipperSnap.exists() && !userSnap.exists()) {
                        console.warn(`⚠️ Document with ID ${item.id} does not exist in any collection!`);
                        continue;
                    }
                    if (deliverySnap.exists()) {
                        batch.update(deliveryRefs[i], {
                            receiverName: newReceiver[cn],
                            consignee: newReceiver[cn],
                            status: "Delivered"
                        });
                    }
                    if (shipperSnap.exists()) {
                        batch.update(shipperRefs[i], {
                            receiverName: newReceiver[cn],
                            consignee: newReceiver[cn],
                            status: "Delivered"
                        });
                    }
                    if (userSnap.exists()) {
                        batch.update(userRefs[i], {
                            receiverName: newReceiver[cn],
                            consignee: newReceiver[cn],
                            status: "Delivered"
                        });
                    }
                    hasUpdates = true;
                } else {
                    console.warn("❌ No receiver data found for CN:", cn);
                }
            }

            if (hasUpdates) {
                await batch.commit();
                message.success("✅ Updates saved successfully");
            } else {
                message.warning("⚠️ No valid records found to update!");
            }
        } catch (error) {
            console.error("🔥 Error saving receiver names:", error);
            message.error("❌ Failed to save receiver names!");
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (!editingRecord || !editingRecord.id) {
                message.error("No record selected for updating!");
                return;
            }
            await updateOnlyconsignee(editingRecord.id, values.consignee);
            await fetchDeliveries();
            form.resetFields();
            setIsModalVisible(false);
        } catch (error) {
            message.error("Failed to update consignee name!");
        }
    };
    const onSearch = (value) => {
        let filtered = [...data];
        if (value) {
            filtered = filtered.filter((delivery) =>
                delivery.cnNumber?.toString().toLowerCase().includes(value.toLowerCase())
            );
        }
        setFilteredData(filtered);
    };

    const handleSearchClick = () => {
        let filtered = [...data];

        if (searchValue) {
            filtered = filtered.filter((delivery) =>
                delivery.cnNumber?.toString().toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        if (companySearch) {
            filtered = filtered.filter((delivery) =>
                delivery.createdByName?.toLowerCase().includes(companySearch.toLowerCase())
            );
        }

        setFilteredData(filtered);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (!value) {
            setFilteredData(data);
        }
    };

    const handleModalCancel = () => { setIsModalVisible(false) };
    const columns = [
        {
            title: "#",
            key: "index",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Company Name",
            key: "createdByName",
            dataIndex: "createdByName"
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
            key: "shipperName"
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
                        title="Are you sure you want to delete this rider?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className="bg-danger  text-light rounded-pill border-0" danger>
                            <DeleteFilled />
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <main className="auth">
            <Container className="my-3" >
                <span level={1} className="text  d-flex justify-content-center align-items-center display-3 fw-medium text-light mt-3 ">Show Data</span>
                <Row>
                    <Col span={24} className="mt-5">
                        <Card className="border-0 card2  ">
                            <Card className="border-0">
                                <Row>
                                    <Col span={12}>
                                        <Select
                                            placeholder="Select Rider"
                                            onChange={(value) => setSelectedRider(value)}
                                            showSearch
                                            optionFilterProp="label"
                                            filterOption={(input, option) =>
                                                option?.label?.toLowerCase().includes(input.toLowerCase())
                                            }
                                            allowClear
                                            className="w-75"
                                            options={[
                                                { value: null, label: "All Riders" },
                                                ...riderList.map(rider => ({ value: rider.id, label: rider.name }))
                                            ]}
                                        />

                                    </Col>
                                    <Col span={12}>
                                        <DatePicker className="border-1 w-75 border-bottom " placeholder="Select Date" onChange={setSelectedDate} />
                                        <Button className="ms-2  text-light rounded-pill border-0" style={{ backgroundColor: "#3E5151" }} onClick={applyFilters}>Apply Filters</Button>
                                    </Col>
                                    <Col span={12} className="mt-3">
                                        <Input className="border-1 w-75 border-bottom" placeholder="Enter Company Name" value={companySearch} onChange={(e) => setCompanySearch(e.target.value)} allowClear />
                                    </Col>
                                    <Col span={12} className="mt-3">
                                        <Input className="border-1 w-75 border-bottom " placeholder="Enter CN Number" value={searchValue} onChange={handleSearchChange} allowClear />
                                        <Button style={{ backgroundColor: "grayText" }} className="ms-2 text-light rounded-pill border-0" onClick={handleSearchClick}>
                                            Search
                                        </Button>
                                    </Col>
                                    <Col span={12} className="mt-3">
                                        <Button className=" bg-success text-light ms-2 rounded-pill border-0" onClick={handleSaveReceiver}>
                                            Save  Names
                                        </Button>
                                        <Button onClick={() => { setFilteredData(data); setSearchValue(""); setSelectedDate(null); }} className="ms-5">
                                            Reset
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                            <Table bordered
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
                            <Modal title="Edit Consignee Name" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel}>
                                <Form form={form} layout="vertical">
                                    <Form.Item name="consignee" label="Consignee Name" rules={[{ required: true, message: 'Please input the consignee name!' }]}>
                                        <Input placeholder="Enter Consignee Name" />
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </main>
    );
};

export default ShowData;