/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Table, Select, DatePicker, Button, Modal, Input, message, Form, Row, Col, Card, Typography, Popconfirm } from "antd";
import { collection, getDocs, deleteDoc, doc, updateDoc, writeBatch, getDoc, query, orderBy } from "firebase/firestore";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Container } from "react-bootstrap";
import { fireStore } from "../Config/firebase";

// const { Option } = Select;

const UserData = () => {
    const { Title } = Typography;
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [riderList, setRiderList] = useState([]);
    // const [riders, setRiders] = useState([]);
    const [newReceiver, setNewReceiver] = useState({});
    const [selectedRider, setSelectedRider] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [page, setPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    // const [editRecord, setEditRecord] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null)
    const [form] = Form.useForm();
    // const [editedValues, setEditedValues] = useState({});
    const inputRefs = useRef([]);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            // ✅ Correcting Firestore query with orderBy
            const deliveryQuery = query(collection(fireStore, "deliveries"), orderBy("createdAt"));
            // const deliveryQuery = query(collection(fireStore, "deliveries"))
            const querySnapshot = await getDocs(deliveryQuery);
            const deliveryList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                source: "deliveries",
                createdAt: doc.data().createdAt || "", // Avoids undefined issues
                ...doc.data()
            }));

            // ✅ Fetch riders collection
            const riderQuerySnapshot = await getDocs(collection(fireStore, "riders"));
            const riders = riderQuerySnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name || "Unknown" // Ensures no undefined values
            }));

            // ✅ Fetch shipper collection
            const userSnapshot = await getDocs(collection(fireStore, "User Booking"));
            const usershipperList = userSnapshot.docs.map(doc => ({
                id: doc.id,
                source: "User Booking",
                ...doc.data()
            }));

            // ✅ Create a map for fast lookup of riders
            const riderMap = new Map(riders.map(rider => [rider.id, rider.name]));

            // ✅ Assign rider names to deliveries
            const updatedDeliveries = deliveryList.map(delivery => ({
                ...delivery,
                riderName: riderMap.get(delivery.riderId) || "Unknown"
            }));

            // ✅ Combine deliveries & shippers
            const combinedData = [...updatedDeliveries, ...usershipperList];

            // ✅ Efficient state updates
            setData(combinedData);
            setFilteredData(combinedData);
            setRiderList(riders);
        } catch (error) {
            console.error("Error fetching deliveries:", error);
        }
        setLoading(false);
    };

    // ✅ Fetch deliveries on component mount
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
    // const handleEdit = (record) => {
    //     setEditingRecord(record);
    //     form.setFieldsValue({
    //         name: record.receiverName,
    //         date: record.date,
    //         consigneeName: record.consigneeName || record.consignee
    //     });
    //     setIsModalVisible(true);
    // };
    // ✅ یہ نیا فنکشن رکھ لو اوپر کہیں
    const updateOnlyConsigneeName = async (id, newConsigneeValue) => {
        try {
            //   console.log("Updating Consignee...");
            //   console.log("Record ID:", id);
            //   console.log("New Consignee:", newConsigneeValue);

            const deliveryRef = doc(fireStore, "deliveries", id);
            const userRef = doc(fireStore, "User Booking", id);

            const deliverySnap = await getDoc(deliveryRef);
            const userSnap = await getDoc(userRef);

            //   console.log("Delivery exists:", deliverySnap.exists());
            //   console.log("Shipper exists:", userSnap.exists());

            const updateData = { consignee: newConsigneeValue || "N/A" }; // ✅ Notice here!

            //   console.log("Update Data:", updateData);

            if (deliverySnap.exists()) {
                // console.log("Updating in Deliveries...");
                await updateDoc(deliveryRef, updateData);
            }

            if (userSnap.exists()) {
                // console.log("Updating in Shipper...");
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

        // console.log("Editing this record:", record);

        setEditingRecord(record);

        form.setFieldsValue({
            consignee: record.consignee || "",
        });

        setIsModalVisible(true);
    };


    const handleDelete = async (id) => {
        try {
            let deleted = false;

            // Check if document exists in "deliveries"
            const deliveryRef = doc(fireStore, "deliveries", id);
            const deliverySnap = await getDoc(deliveryRef);
            if (deliverySnap.exists()) {
                await deleteDoc(deliveryRef);
                deleted = true;
            }

            // Check if document exists in "User Booking"
            const userRef = doc(fireStore, "User Booking", id);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                await deleteDoc(userRef);
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
            e.preventDefault(); // Prevents default submit behavior
            const nextInput = inputRefs.current[index + 1];
            if (nextInput) {
                nextInput.focus(); // Moves focus to the next input field
            }
        }
    };

    const handleReciverChange = (e, cnNumber) => { const { value } = e.target; setNewReceiver((prev) => ({ ...prev, [cnNumber]: value })) };

    // const handleSaveReceiver = async () => {
    //     try {
    //         const batch = writeBatch(fireStore);
    //         let hasUpdates = false;

    //         const deliveryRefs = filteredData.map(item => doc(fireStore, "deliveries", item.id));
    //         const shipperRefs = filteredData.map(item => doc(fireStore, "User Booking", item.id));

    //         const deliverySnaps = await Promise.all(deliveryRefs.map(ref => getDoc(ref)));
    //         const usershipperSnaps = await Promise.all(shipperRefs.map(ref => getDoc(ref)));

    //         for (let i = 0; i < filteredData.length; i++) {
    //             const item = filteredData[i];
    //             if (newReceiver[item.cnNumber]) {
    //                 const deliverySnap = deliverySnaps[i];
    //                 const userSnap = usershipperSnaps[i];

    //                 if (!deliverySnap.exists() && !userSnap.exists()) {
    //                     console.warn(`Document with ID ${item.id} does not exist in either collection!`);
    //                     continue;
    //                 }

    //                 if (deliverySnap.exists()) {
    //                     batch.update(deliveryRefs[i], {
    //                         receiverName: newReceiver[item.cnNumber],
    //                         status: "Delivered"
    //                     });
    //                 }

    //                 if (userSnap.exists()) {
    //                     batch.update(shipperRefs[i], {
    //                         receiverName: newReceiver[item.cnNumber],
    //                         status: "Delivered"
    //                     });
    //                 }

    //                 hasUpdates = true;
    //             }
    //         }

    //         if (hasUpdates) {
    //             await batch.commit();
    //             message.success("updated saved successfully");
    //         } else {
    //             message.warning("No valid records found to update!");
    //         }
    //     } catch (error) {
    //         console.error("Error saving receiver names: ", error);
    //         message.error("Failed to save receiver names!");
    //     }
    // };
    const handleSaveReceiver = async () => {
        try {
            const batch = writeBatch(fireStore);
            let hasUpdates = false;

            const deliveryRefs = filteredData.map(item => doc(fireStore, "deliveries", item.id));
            const userRefs = filteredData.map(item => doc(fireStore, "User Booking", item.id));

            const deliverySnaps = await Promise.all(deliveryRefs.map(ref => getDoc(ref)));
            const usershipperSnaps = await Promise.all(userRefs.map(ref => getDoc(ref)));

            for (let i = 0; i < filteredData.length; i++) {
                const item = filteredData[i];
                if (newReceiver[item.cnNumber]) {
                    const deliverySnap = deliverySnaps[i];
                    const userSnap = usershipperSnaps[i];

                    if (!deliverySnap.exists() && !userSnap.exists()) {
                        console.warn(`Document with ID ${item.id} does not exist in either collection!`);
                        continue;
                    }

                    if (deliverySnap.exists()) {
                        batch.update(deliveryRefs[i], {
                            receiverName: newReceiver[item.cnNumber],
                            consigneeName: newReceiver[item.cnNumber],  // ✅ Add this line
                            status: "Delivered"
                        });
                    }

                    if (userSnap.exists()) {
                        batch.update(userRefs[i], {
                            receiverName: newReceiver[item.cnNumber],
                            consigneeName: newReceiver[item.cnNumber],  // ✅ Add this line
                            status: "Delivered"
                        });
                    }

                    hasUpdates = true;
                }
            }

            if (hasUpdates) {
                await batch.commit();
                message.success("Updated saved successfully");
            } else {
                message.warning("No valid records found to update!");
            }
        } catch (error) {
            console.error("Error saving receiver names: ", error);
            message.error("Failed to save receiver names!");
        }
    };

    // const handleModalOk = async () => {
    //     try {
    //         const values = await form.validateFields();
    //         console.log("Form Values:", values); // Debugging

    //         if (!editingRecord || !editingRecord.id) {
    //             message.error("No record selected for updating!");
    //             return;
    //         }

    //         const updateData = {
    //             receiverName: values.name || "N/A",
    //             shipperName: values.shipper || "",
    //             consigneeName: values.consignee || "N/A", // Ensure it's present
    //         };

    //         console.log("Updating Firestore with:", updateData); // Debugging

    //         const deliveryRef = doc(fireStore, "deliveries", editingRecord.id);
    //         const userRef = doc(fireStore, "User Booking", editingRecord.id);

    //         // Check if documents exist
    //         const deliveryDocSnap = await getDoc(deliveryRef);
    //         const shipperDocSnap = await getDoc(userRef);

    //         if (!deliveryDocSnap.exists() && !shipperDocSnap.exists()) {
    //             message.error("Record does not exist!");
    //             return;
    //         }

    //         // Update both documents if they exist
    //         const updatePromises = [];
    //         if (deliveryDocSnap.exists()) updatePromises.push(updateDoc(deliveryRef, updateData));
    //         if (shipperDocSnap.exists()) updatePromises.push(updateDoc(userRef, updateData));

    //         await Promise.all(updatePromises);

    //         await fetchDeliveries(); // Refresh data
    //         setIsModalVisible(false);
    //         message.success("Record updated successfully!");
    //     } catch (error) {
    //         console.error("Error updating record: ", error);
    //         message.error("Failed to update record!");
    //     }
    // };
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();

            // console.log("Form Values received on Save:", values);

            if (!editingRecord || !editingRecord.id) {
                message.error("No record selected for updating!");
                return;
            }

            // console.log("Editing Record:", editingRecord);

            await updateOnlyConsigneeName(editingRecord.id, values.consignee);

            await fetchDeliveries();
            form.resetFields();
            setIsModalVisible(false);
        } catch (error) {
            // console.error("❌ Error in handleModalOk:", error);
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
            setFilteredData(filtered);
        }
        else {
            setFilteredData(data);
        }
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
            title: "Rider Name",
            key: "riderName",
            render: (record) => {
                const rider = riderList.find((r) => r.id === record.riderId);
                return rider ? rider.name : "Unknown";
            },
        },
        {
            title: "Shipper Name",
            dataIndex: ["shipperName" || "User Booking"],
            key: "shipperName"
        },

        {
            title: "CN Number",
            dataIndex: "cnNumber",
            key: "cnNumber",
        },
        {
            title: "Consignee Name",
            dataIndex: "consignee", // ✅ Correct way to handle multiple fields
            key: "consignee",

        },
        {
            title: "Receiver Name",
            key: "receiverName",
            render: (record, _, index) => (
                <Input disabled
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
                                        <Input className="border-1 w-75 border-bottom " placeholder="Enter CN Number" value={searchValue} onChange={handleSearchChange} allowClear />
                                        <Button style={{ backgroundColor: "grayText" }} className="ms-2 text-light rounded-pill border-0" onClick={handleSearchClick}>
                                            Search
                                        </Button>
                                    </Col>
                                    <Col span={12} className="mt-3">
                                        <Button className=" bg-success text-light ms-2 rounded-pill border-0" onClick={handleSaveReceiver}>
                                            Save  Names
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                            <Table bordered className="  "
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

                            {/* <Modal title="Edit Record" visible={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel}>
                                <Form form={form} layout="vertical">
                                    <Form.Item name="name" label="Receiver Name" rules={[{ required: true, message: 'Please input the receiver name!' }]}>
                                        <Input />
                                    </Form.Item>
                                    {/* <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please input the date!' }]}>
                                        <Input />
                                    </Form.Item> 
                                    <Form.Item name="User Booking" label="User Booking" rules={[{ required: true, message: 'Please input the SipperName!' }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="consignee" label="Consignee Name" rules={[{ required: true, message: 'Please input the consignee name!' }]}>
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Modal> */}
                            <Modal
                                title="Edit Consignee Name"
                                open={isModalVisible}
                                onOk={handleModalOk}
                                onCancel={handleModalCancel}
                            >
                                <Form form={form} layout="vertical">
                                    <Form.Item
                                        name="consignee"
                                        label="Consignee Name"
                                        rules={[{ required: true, message: 'Please input the consignee name!' }]}
                                    >
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

export default UserData;



// import React, { useEffect, useRef, useState } from "react";
// import { Table, Select, DatePicker, Button, Modal, Input, message, Form, Row, Col, Card, Typography, Popconfirm } from "antd";
// import { collection, getDocs, deleteDoc, doc, updateDoc, writeBatch, getDoc, query, orderBy, where } from "firebase/firestore";
// import { fireStore } from "../../Config/firebase";
// import { DeleteFilled, EditFilled } from "@ant-design/icons";
// import { Container } from "react-bootstrap";
// import { useAuthContext } from "../../Context/Auth";

// const ShowData = () => {
//     const { Title } = Typography;
//     const { user } = useAuthContext();
//     const [data, setData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [riderList, setRiderList] = useState([]);
//     const [newReceiver, setNewReceiver] = useState({});
//     const [selectedRider, setSelectedRider] = useState(null);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [page, setPage] = useState(1);
//     const [searchValue, setSearchValue] = useState('');
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [editingRecord, setEditingRecord] = useState(null);
//     const [form] = Form.useForm();
//     const inputRefs = useRef([]);

//     useEffect(() => {
//         fetchDeliveries();
//         fetchRiders();
//     }, [user?.uid]);

//     const fetchDeliveries = async () => {
//         setLoading(true);
//         try {
//             const selectedDateString = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;

//             let deliveryQuery = collection(fireStore, "deliveries");

//             let conditions = [];
//             if (selectedRider) conditions.push(where("riderId", "==", selectedRider));
//             if (selectedDateString) conditions.push(where("date", "==", selectedDateString));

//             if (conditions.length > 0) {
//                 deliveryQuery = query(deliveryQuery, ...conditions, orderBy("createdAt"));
//             } else {
//                 deliveryQuery = query(deliveryQuery, orderBy("createdAt"));
//             }

//             const querySnapshot = await getDocs(deliveryQuery);
//             const deliveryList = querySnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));

//             console.log("Fetched Deliveries:", deliveryList); // Debugging

//             setData(deliveryList);
//             setFilteredData(deliveryList);
//         } catch (error) {
//             console.error("Error fetching deliveries:", error);
//             if (error.code === 'failed-precondition') {
//                 message.error("Please create the required Firestore index.");
//             }
//         }
//         setLoading(false);
//     };

//     const fetchRiders = async () => {
//         try {
//             const riderQuery = query(collection(fireStore, "user"), orderBy("createdAt"));
//             const querySnapshot = await getDocs(riderQuery);
//             const riders = querySnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 name: doc.data().name || "Unknown"
//             }));

//             console.log("Fetched Riders:", riders); // Debugging

//             setRiderList(riders);
//         } catch (error) {
//             console.error("Error fetching riders:", error);
//         }
//     };

//     const applyFilters = () => {
//         let filtered = [...data];
//         if (selectedRider) {
//             filtered = filtered.filter(delivery => delivery.riderId === selectedRider);
//         }
//         if (selectedDate) {
//             const selectedDateString = selectedDate.format("YYYY-MM-DD");
//             filtered = filtered.filter(delivery => delivery.date === selectedDateString);
//         }
//         setFilteredData(filtered);
//     };

//     const handleEdit = (record) => {
//         if (!record) return; // Prevent errors if record is undefined
//         setEditingRecord(record);

//         form.setFieldsValue({
//             name: record.receiverName || "",
//             date: record.date || "",
//             consigneeName: record.consigneeName || record.consignee,
//         });

//         setIsModalVisible(true);
//     };

//     const handleDelete = async (id) => {
//         try {
//             let deleted = false;

//             // Check if document exists in "deliveries"
//             const deliveryRef = doc(fireStore, "deliveries", id);
//             const deliverySnap = await getDoc(deliveryRef);
//             if (deliverySnap.exists()) {
//                 await deleteDoc(deliveryRef);
//                 deleted = true;
//             }

//             // Check if document exists in "User Booking"
//             const userRef = doc(fireStore, "User Booking", id);
//             const userSnap = await getDoc(userRef);
//             if (userSnap.exists()) {
//                 await deleteDoc(userRef);
//                 deleted = true;
//             }

//             if (deleted) {
//                 setData(prevData => prevData.filter(item => item.id !== id));
//                 message.success("Delivery deleted successfully!");
//             } else {
//                 message.warning("No matching delivery found to delete.");
//             }
//         } catch (error) {
//             console.error("Error deleting delivery:", error);
//             message.error("Failed to delete delivery!");
//         }
//     };

//     const handleKeyPress = (e, index) => {
//         if (e.key === "Enter") {
//             e.preventDefault(); // Prevents default submit behavior
//             const nextInput = inputRefs.current[index + 1];
//             if (nextInput) {
//                 nextInput.focus(); // Moves focus to the next input field
//             }
//         }
//     };

//     const handleReciverChange = (e, cnNumber) => { const { value } = e.target; setNewReceiver((prev) => ({ ...prev, [cnNumber]: value })) };

//     const handleSaveReceiver = async () => {
//         try {
//             const batch = writeBatch(fireStore);
//             let hasUpdates = false;

//             const deliveryRefs = filteredData.map(item => doc(fireStore, "deliveries", item.id));
//             const shipperRefs = filteredData.map(item => doc(fireStore, "User Booking", item.id));

//             const deliverySnaps = await Promise.all(deliveryRefs.map(ref => getDoc(ref)));
//             const usershipperSnaps = await Promise.all(shipperRefs.map(ref => getDoc(ref)));

//             for (let i = 0; i < filteredData.length; i++) {
//                 const item = filteredData[i];
//                 if (newReceiver[item.cnNumber]) {
//                     const deliverySnap = deliverySnaps[i];
//                     const userSnap = usershipperSnaps[i];

//                     if (!deliverySnap.exists() && !userSnap.exists()) {
//                         console.warn(`Document with ID ${item.id} does not exist in either collection!`);
//                         continue;
//                     }

//                     if (deliverySnap.exists()) {
//                         batch.update(deliveryRefs[i], {
//                             receiverName: newReceiver[item.cnNumber],
//                             status: "Delivered"
//                         });
//                     }

//                     if (userSnap.exists()) {
//                         batch.update(shipperRefs[i], {
//                             receiverName: newReceiver[item.cnNumber],
//                             status: "Delivered"
//                         });
//                     }

//                     hasUpdates = true;
//                 }
//             }

//             if (hasUpdates) {
//                 await batch.commit();
//                 message.success("updated saved successfully");
//             } else {
//                 message.warning("No valid records found to update!");
//             }
//         } catch (error) {
//             console.error("Error saving receiver names: ", error);
//             message.error("Failed to save receiver names!");
//         }
//     };

//     const handleModalOk = async () => {
//         try {
//             const values = await form.validateFields();
//             console.log("Form Values:", values); // Debugging

//             if (!editingRecord || !editingRecord.id) {
//                 message.error("No record selected for updating!");
//                 return;
//             }

//             const updateData = {
//                 receiverName: values.name || "N/A",
//                 shipperName: values.shipper || "",
//                 consigneeName: values.consignee || "N/A", // Ensure it's present
//             };

//             console.log("Updating Firestore with:", updateData); // Debugging

//             const deliveryRef = doc(fireStore, "deliveries", editingRecord.id);
//             const userRef = doc(fireStore, "User Booking", editingRecord.id);

//             // Check if documents exist
//             const deliveryDocSnap = await getDoc(deliveryRef);
//             const shipperDocSnap = await getDoc(userRef);

//             if (!deliveryDocSnap.exists() && !shipperDocSnap.exists()) {
//                 message.error("Record does not exist!");
//                 return;
//             }

//             // Update both documents if they exist
//             const updatePromises = [];
//             if (deliveryDocSnap.exists()) updatePromises.push(updateDoc(deliveryRef, updateData));
//             if (shipperDocSnap.exists()) updatePromises.push(updateDoc(userRef, updateData));

//             await Promise.all(updatePromises);

//             await fetchDeliveries(); // Refresh data
//             setIsModalVisible(false);
//             message.success("Record updated successfully!");
//         } catch (error) {
//             console.error("Error updating record:", error);
//             message.error("Failed to update record!");
//         }
//     };

//     const onSearch = (value) => {
//         let filtered = [...data];
//         if (value) {
//             filtered = filtered.filter((delivery) =>
//                 delivery.cnNumber?.toString().toLowerCase().includes(value.toLowerCase())
//             );
//         }
//         setFilteredData(filtered);
//     };

//     const handleSearchClick = () => {
//         let filtered = [...data];
//         if (searchValue) {
//             filtered = filtered.filter((delivery) =>
//                 delivery.cnNumber?.toString().toLowerCase().includes(searchValue.toLowerCase())
//             );
//             setFilteredData(filtered);
//         }
//         else {
//             setFilteredData(data);
//         }
//     };

//     const handleSearchChange = (e) => {
//         const value = e.target.value;
//         setSearchValue(value);
//         if (!value) {
//             setFilteredData(data);
//         }
//     };

//     const handleModalCancel = () => { setIsModalVisible(false) };

//     const columns = [
//         {
//             title: "#",
//             key: "index",
//             render: (_, __, index) => index + 1,
//         },
//         {
//             title: "Rider Name",
//             key: "riderName",
//             render: (record) => {
//                 const rider = riderList.find((r) => r.id === record.riderId);
//                 return rider ? rider.name : "Unknown";
//             },
//         },
//         {
//             title: "Shipper Name",
//             dataIndex: "shipperName",
//             key: "shipperName"
//         },
//         {
//             title: "CN Number",
//             dataIndex: "cnNumber",
//             key: "cnNumber",
//         },
//         {
//             title: "Consignee Name",
//             dataIndex: "consignee",
//             key: "consignee",
//         },
//         {
//             title: "Receiver Name",
//             key: "receiverName",
//             render: (record, _, index) => (
//                 <Input
//                     className="border-0"
//                     defaultValue={record.receiverName}
//                     ref={(ref) => (inputRefs.current[index] = ref)}
//                     onChange={(e) => handleReciverChange(e, record.cnNumber)}
//                     onKeyDown={(e) => handleKeyPress(e, index)}
//                 />
//             ),
//         },
//         {
//             title: "Date",
//             dataIndex: "date",
//             key: "date",
//         },
//         {
//             title: "Actions",
//             key: "actions",
//             render: (_, record) => (
//                 <>
//                     <Button className="bg-success text-light" onClick={() => handleEdit(record)}>
//                         <EditFilled />
//                     </Button>
//                     <Popconfirm
//                         title="Are you sure you want to delete this rider?"
//                         onConfirm={() => handleDelete(record.id)}
//                         okText="Yes"
//                         cancelText="No"
//                     >
//                         <Button className="bg-danger text-light" danger>
//                             <DeleteFilled />
//                         </Button>
//                     </Popconfirm>
//                 </>
//             ),
//         },
//     ];

//     return (
//         <main className="auth">
//             <Container className="my-3">
//                 <Row>
//                     <Col span={24} className="mt-5">
//                         <Title level={1} className="text-light">Show Data</Title>
//                         <Card className="border-1 mt-5 border-black">
//                             <Card className="border-0">
//                                 <Row>
//                                     <Col span={12}>
//                                         <Select
//                                             placeholder="Select Rider"
//                                             onChange={(value) => setSelectedRider(value)}
//                                             showSearch
//                                             optionFilterProp="label"
//                                             filterOption={(input, option) =>
//                                                 option?.label?.toLowerCase().includes(input.toLowerCase())
//                                             }
//                                             allowClear
//                                             className="w-75"
//                                             options={[
//                                                 { value: "", label: "All Riders" },
//                                                 ...riderList.map(rider => ({ value: rider.id, label: rider.name }))
//                                             ]}
//                                         />
//                                     </Col>
//                                     <Col span={12}>
//                                         <DatePicker className="border-1 w-75 border-black" placeholder="Select Date" onChange={setSelectedDate} />
//                                         <Button className="ms-2 bg-black text-light" onClick={applyFilters}>Apply Filters</Button>
//                                     </Col>
//                                     <Col span={12} className="mt-3">
//                                         <Input className="border-1 w-75 border-black" placeholder="Enter CN Number" value={searchValue} onChange={handleSearchChange} allowClear />
//                                         <Button type="primary" className="ms-2" onClick={handleSearchClick}>
//                                             Search
//                                         </Button>
//                                     </Col>
//                                     <Col span={12} className="mt-3">
//                                         <Button className="bg-success text-light ms-2" onClick={handleSaveReceiver}>
//                                             Save Names
//                                         </Button>
//                                     </Col>
//                                 </Row>
//                             </Card>
//                             <Table
//                                 bordered
//                                 className="border-black border-1"
//                                 dataSource={filteredData.map((item, index) => ({ ...item, key: item.id || index }))}
//                                 columns={columns}
//                                 loading={loading}
//                                 pagination={{
//                                     current: page,
//                                     pageSize: 20,
//                                     showSizeChanger: false,
//                                     onChange: (newPage) => setPage(newPage),
//                                 }}
//                                 scroll={{ x: 1000 }}
//                             />
//                             <Modal title="Edit Record" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel}>
//                                 <Form form={form} layout="vertical">
//                                     <Form.Item name="name" label="Receiver Name" rules={[{ required: true, message: 'Please input the receiver name!' }]}>
//                                         <Input />
//                                     </Form.Item>
//                                     <Form.Item name="User Booking" label="User Booking" rules={[{ required: true, message: 'Please input the shipper name!' }]}>
//                                         <Input />
//                                     </Form.Item>
//                                     <Form.Item name="consignee" label="Consignee Name" rules={[{ required: true, message: 'Please input the consignee name!' }]}>
//                                         <Input />
//                                     </Form.Item>
//                                 </Form>
//                             </Modal>
//                         </Card>
//                     </Col>
//                 </Row>
//             </Container>
//         </main>
//     );
// };

// export default ShowData;