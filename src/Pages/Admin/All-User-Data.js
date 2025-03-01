// import React, { useEffect, useRef, useState } from "react";
// import { Table, Select, DatePicker, Button, Modal, Input, message, Form, Row, Col, Card, Typography, Popconfirm } from "antd";
// import { collection, getDocs, deleteDoc, doc, updateDoc, writeBatch, getDoc, query, orderBy } from "firebase/firestore";
// import { fireStore } from "../../Config/firebase";
// import { DeleteFilled, EditFilled } from "@ant-design/icons";
// import { Container } from "react-bootstrap";

// // const { Option } = Select;

// const AllShowData = () => {
//     const { Title } = Typography;
//     const [data, setData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [riderList, setRiderList] = useState([]);
//     // const [riders, setRiders] = useState([]);
//     const [newReceiver, setNewReceiver] = useState({});
//     const [selectedRider, setSelectedRider] = useState(null);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [page, setPage] = useState(1);
//     const [searchValue, setSearchValue] = useState('');
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     // const [editRecord, setEditRecord] = useState(null);
//     const [editingRecord, setEditingRecord] = useState(null)
//     const [form] = Form.useForm();
//     // const [editedValues, setEditedValues] = useState({});
//     const inputRefs = useRef([]);

//     useEffect(() => {
//         fetchDeliveries();
//     }, []);

//     // const fetchDeliveries = async () => {
//     //     setLoading(true);
//     //     try {
//     //         // Fetch deliveries collection
//     //         const querySnapshot = await getDocs(collection(fireStore, "deliveries"));
//     //         const deliveryList = querySnapshot.docs.map(doc => ({ id: doc.id, source: "deliveries", ...doc.data() }));

//     //         // Fetch riders collection
//     //         const riderQuerySnapshot = await getDocs(collection(fireStore, "riders"));
//     //         const riders = riderQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     //         // Fetch shipper collection (✅ FIXED shipperSnapshot missing issue)
//     //         const shipperSnapshot = await getDocs(collection(fireStore, "shipper"));
//     //         const shipperList = shipperSnapshot.docs.map(doc => ({ id: doc.id, source: "shipper", ...doc.data() }));

//     //         // Create a map for fast lookup
//     //         const riderMap = new Map(riders.map(rider => [rider.id, rider.name || "Unknown"]));

//     //         // Assign rider names to deliveries
//     //         const updatedDeliveries = deliveryList.map(delivery => ({
//     //             ...delivery,
//     //             riderName: riderMap.get(delivery.riderId) || "Unknown",
//     //         }));

//     //         // Combine both data sources
//     //         const combinedData = [...updatedDeliveries, ...shipperList];

//     //         // ✅ FIXED: `setData` को एक ही बार कॉल किया गया
//     //         setData(combinedData);
//     //         setFilteredData(combinedData);
//     //         setRiderList(riders);

//     //     } catch (error) {
//     //         console.error("Error fetching deliveries:", error);
//     //     }
//     //     setLoading(false);
//     // };

//     const fetchDeliveries = async () => {
//         setLoading(true);
//         try {
//             // ✅ Correcting Firestore query with orderBy
//             const deliveryQuery = query(collection(fireStore, "deliveries"), orderBy("createdAt"));
//             const querySnapshot = await getDocs(deliveryQuery);
//             const deliveryList = querySnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 source: "deliveries",
//                 createdAt: doc.data().createdAt || "", // Avoids undefined issues
//                 ...doc.data()
//             }));

//             // ✅ Fetch riders collection
//             const riderQuerySnapshot = await getDocs(collection(fireStore, "riders"));
//             const riders = riderQuerySnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 name: doc.data().name || "Unknown" // Ensures no undefined values
//             }));

//             // ✅ Fetch shipper collection
//             const shipperSnapshot = await getDocs(collection(fireStore, "shipper"));
//             const shipperList = shipperSnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 source: "shipper",
//                 ...doc.data()
//             }));

//             // ✅ Create a map for fast lookup of riders
//             const riderMap = new Map(riders.map(rider => [rider.id, rider.name]));

//             // ✅ Assign rider names to deliveries
//             const updatedDeliveries = deliveryList.map(delivery => ({
//                 ...delivery,
//                 riderName: riderMap.get(delivery.riderId) || "Unknown"
//             }));

//             // ✅ Combine deliveries & shippers
//             const combinedData = [...updatedDeliveries, ...shipperList];

//             // ✅ Efficient state updates
//             setData(combinedData);
//             setFilteredData(combinedData);
//             setRiderList(riders);
//         } catch (error) {
//             console.error("Error fetching deliveries:", error);
//         }
//         setLoading(false);
//     };

//     // ✅ Fetch deliveries on component mount
//     useEffect(() => {
//         fetchDeliveries();
//     }, []);

//     useEffect(() => {
//         fetchDeliveries();
//     }, []);

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
//         setEditingRecord(record);
//         form.setFieldsValue({
//             name: record.receiverName,
//             date: record.date,
//             consigneeName: record.consigneeName
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

//             // Check if document exists in "shipper"
//             const shipperRef = doc(fireStore, "shipper", id);
//             const shipperSnap = await getDoc(shipperRef);
//             if (shipperSnap.exists()) {
//                 await deleteDoc(shipperRef);
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
//             const shipperRefs = filteredData.map(item => doc(fireStore, "shipper", item.id));

//             const deliverySnaps = await Promise.all(deliveryRefs.map(ref => getDoc(ref)));
//             const shipperSnaps = await Promise.all(shipperRefs.map(ref => getDoc(ref)));

//             for (let i = 0; i < filteredData.length; i++) {
//                 const item = filteredData[i];
//                 if (newReceiver[item.cnNumber]) {
//                     const deliverySnap = deliverySnaps[i];
//                     const shipperSnap = shipperSnaps[i];

//                     if (!deliverySnap.exists() && !shipperSnap.exists()) {
//                         console.warn(`Document with ID ${item.id} does not exist in either collection!`);
//                         continue;
//                     }

//                     if (deliverySnap.exists()) {
//                         batch.update(deliveryRefs[i], {
//                             receiverName: newReceiver[item.cnNumber],
//                             status: "Delivered"
//                         });
//                     }

//                     if (shipperSnap.exists()) {
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
//             const shipperRef = doc(fireStore, "shipper", editingRecord.id);

//             // Check if documents exist
//             const deliveryDocSnap = await getDoc(deliveryRef);
//             const shipperDocSnap = await getDoc(shipperRef);

//             if (!deliveryDocSnap.exists() && !shipperDocSnap.exists()) {
//                 message.error("Record does not exist!");
//                 return;
//             }

//             // Update both documents if they exist
//             const updatePromises = [];
//             if (deliveryDocSnap.exists()) updatePromises.push(updateDoc(deliveryRef, updateData));
//             if (shipperDocSnap.exists()) updatePromises.push(updateDoc(shipperRef, updateData));

//             await Promise.all(updatePromises);

//             await fetchDeliveries(); // Refresh data
//             setIsModalVisible(false);
//             message.success("Record updated successfully!");
//         } catch (error) {
//             console.error("Error updating record: ", error);
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
//             dataIndex: ["shipperName" || "shipper"],
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
//                         <Button className="bg-danger  text-light" danger>
//                             <DeleteFilled />
//                         </Button>
//                     </Popconfirm>
//                 </>
//             ),
//         },
//     ];

//     return (
//         <main>
//             <Container  >
//                 <Row>
//                     <Col span={24} >
//                         <Title level={1} >All User Data</Title>
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
//                                                 { value: null, label: "All Riders" },
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
//                                         <Button className=" bg-success text-light ms-2" onClick={handleSaveReceiver}>
//                                             Save  Names
//                                         </Button>
//                                     </Col>
//                                 </Row>
//                             </Card>
//                             <Table bordered className="border-black border-1  "
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

//                             <Modal title="Edit Record" visible={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel}>
//                                 <Form form={form} layout="vertical">
//                                     <Form.Item name="name" label="Receiver Name" rules={[{ required: true, message: 'Please input the receiver name!' }]}>
//                                         <Input />
//                                     </Form.Item>
//                                     {/* <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please input the date!' }]}>
//                                         <Input />
//                                     </Form.Item> */}
//                                     <Form.Item name="shipper" label="shipper" rules={[{ required: true, message: 'Please input the SipperName!' }]}>
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

// export default AllShowData;




import React, { useEffect, useRef, useState } from "react";
import { Table, Select, DatePicker, Button, Modal, Input, message, Form, Row, Col, Card, Typography, Popconfirm } from "antd";
import { collection, getDocs, deleteDoc, doc, updateDoc, writeBatch, getDoc, query, orderBy } from "firebase/firestore";
import { fireStore } from "../../Config/firebase";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Container } from "react-bootstrap";

const AllShowData = () => {
    const { Title } = Typography;
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [riderList, setRiderList] = useState([]);
    const [newReceiver, setNewReceiver] = useState({});
    const [selectedRider, setSelectedRider] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [page, setPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const inputRefs = useRef([]);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            const deliveryQuery = query(collection(fireStore, "deliveries"), orderBy("createdAt"));
            const querySnapshot = await getDocs(deliveryQuery);
            const deliveryList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                source: "deliveries",
                createdAt: doc.data().createdAt || "",
                ...doc.data()
            }));

            const riderQuerySnapshot = await getDocs(collection(fireStore, "riders"));
            const riders = riderQuerySnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name || "Unknown"
            }));

            const shipperSnapshot = await getDocs(collection(fireStore, "shipper"));
            const shipperList = shipperSnapshot.docs.map(doc => ({
                id: doc.id,
                source: "shipper",
                ...doc.data()
            }));

            const riderMap = new Map(riders.map(rider => [rider.id, rider.name]));

            const updatedDeliveries = deliveryList.map(delivery => ({
                ...delivery,
                riderName: riderMap.get(delivery.riderId) || "Unknown"
            }));

            const combinedData = [...updatedDeliveries, ...shipperList];

            setData(combinedData);
            setFilteredData(combinedData);
            setRiderList(riders);
        } catch (error) {
            console.error("Error fetching deliveries:", error);
        }
        setLoading(false);
    };

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

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            name: record.receiverName,
            date: record.date,
            consigneeName: record.consigneeName
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

    const handleReciverChange = (e, cnNumber) => {
        const { value } = e.target;
        setNewReceiver((prev) => ({ ...prev, [cnNumber]: value }));
    };

    const handleSaveReceiver = async () => {
        try {
            const batch = writeBatch(fireStore);
            let hasUpdates = false;

            const deliveryRefs = filteredData.map(item => doc(fireStore, "deliveries", item.id));
            const shipperRefs = filteredData.map(item => doc(fireStore, "shipper", item.id));

            const deliverySnaps = await Promise.all(deliveryRefs.map(ref => getDoc(ref)));
            const shipperSnaps = await Promise.all(shipperRefs.map(ref => getDoc(ref)));

            for (let i = 0; i < filteredData.length; i++) {
                const item = filteredData[i];
                if (newReceiver[item.cnNumber]) {
                    const deliverySnap = deliverySnaps[i];
                    const shipperSnap = shipperSnaps[i];

                    if (!deliverySnap.exists() && !shipperSnap.exists()) {
                        console.warn(`Document with ID ${item.id} does not exist in either collection!`);
                        continue;
                    }

                    if (deliverySnap.exists()) {
                        batch.update(deliveryRefs[i], {
                            receiverName: newReceiver[item.cnNumber],
                            status: "Delivered"
                        });
                    }

                    if (shipperSnap.exists()) {
                        batch.update(shipperRefs[i], {
                            receiverName: newReceiver[item.cnNumber],
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

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            console.log("Form Values:", values);

            if (!editingRecord || !editingRecord.id) {
                message.error("No record selected for updating!");
                return;
            }

            const updateData = {
                receiverName: values.name || "N/A",
                shipperName: values.shipper || "",
                consigneeName: values.consignee || "N/A",
            };

            console.log("Updating Firestore with:", updateData);

            const deliveryRef = doc(fireStore, "deliveries", editingRecord.id);
            const shipperRef = doc(fireStore, "shipper", editingRecord.id);

            const deliveryDocSnap = await getDoc(deliveryRef);
            const shipperDocSnap = await getDoc(shipperRef);

            if (!deliveryDocSnap.exists() && !shipperDocSnap.exists()) {
                message.error("Record does not exist!");
                return;
            }

            const updatePromises = [];
            if (deliveryDocSnap.exists()) updatePromises.push(updateDoc(deliveryRef, updateData));
            if (shipperDocSnap.exists()) updatePromises.push(updateDoc(shipperRef, updateData));

            await Promise.all(updatePromises);

            await fetchDeliveries();
            setIsModalVisible(false);
            message.success("Record updated successfully!");
        } catch (error) {
            console.error("Error updating record: ", error);
            message.error("Failed to update record!");
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
        } else {
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

    const handleModalCancel = () => {
        setIsModalVisible(false);
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
                return rider ? rider.name : "Unknown";
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
                    <Button className="bg-success text-light" onClick={() => handleEdit(record)}>
                        <EditFilled />
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this rider?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className="bg-danger text-light" danger>
                            <DeleteFilled />
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <main>
            <Container>
                <Row>
                    <Col span={24}>
                        <Title level={1}>All User Data</Title>
                        <Card className="border-1 mt-5 border-black">
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
                                                { value: "", label: "All Riders" },
                                                ...riderList.map(rider => ({ value: rider.id, label: rider.name }))
                                            ]}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <DatePicker className="border-1 w-75 border-black" placeholder="Select Date" onChange={setSelectedDate} />
                                        <Button className="ms-2 bg-black text-light" onClick={applyFilters}>Apply Filters</Button>
                                    </Col>
                                    <Col span={12} className="mt-3">
                                        <Input className="border-1 w-75 border-black" placeholder="Enter CN Number" value={searchValue} onChange={handleSearchChange} allowClear />
                                        <Button type="primary" className="ms-2" onClick={handleSearchClick}>
                                            Search
                                        </Button>
                                    </Col>
                                    <Col span={12} className="mt-3">
                                        <Button className="bg-success text-light ms-2" onClick={handleSaveReceiver}>
                                            Save Names
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                            <Table bordered className="border-black border-1"
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
                            <Modal title="Edit Record" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel}>
                                <Form form={form} layout="vertical">
                                    <Form.Item name="name" label="Receiver Name" rules={[{ required: true, message: 'Please input the receiver name!' }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="shipper" label="Shipper" rules={[{ required: true, message: 'Please input the Shipper Name!' }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="consignee" label="Consignee Name" rules={[{ required: true, message: 'Please input the consignee name!' }]}>
                                        <Input />
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

export default AllShowData;