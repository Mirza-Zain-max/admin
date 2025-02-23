// import React, { useEffect, useRef, useState } from "react";
// import { Table, Select, DatePicker, Button, Input, Form, Row, Col, Card, Typography, message, } from "antd";
// import { collection, getDocs, deleteDoc, doc, query, orderBy, getDoc, } from "firebase/firestore";
// import { fireStore } from "../../Config/firebase";
// import { Container } from "react-bootstrap";

// // const { Option } = Select;

// const AddShipment = () => {
//     const { Title } = Typography;
//     const [data, setData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isloading, setISLoading] = useState(false);
//     const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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

//     // const applyFilters = () => {
//     //     let filtered = [...data];
//     //     if (selectedRider) {
//     //         filtered = filtered.filter(delivery => delivery.riderId === selectedRider);
//     //     }
//     //     if (selectedDate) {
//     //         const selectedDateString = selectedDate.format("YYYY-MM-DD");
//     //         filtered = filtered.filter(delivery => delivery.date === selectedDateString);
//     //     }
//     //     setFilteredData(filtered);
//     // };
//     const applyFilters = () => {
//         let filtered = [...data];

//         if (selectedRider) {
//             filtered = filtered.filter(delivery => delivery.riderId === selectedRider);
//         }

//         if (selectedDate) {
//             const selectedDateString = selectedDate.format("YYYY-MM-DD");
//             const selectedMonthString = selectedDate.format("YYYY-MM");

//             filtered = filtered.filter(delivery => 
//                 delivery.date === selectedDateString || delivery.date.startsWith(selectedMonthString)
//             );
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
//     // const handleDelete = async (id) => {
//     //     try {
//     //         let deleted = false;

//     //         // Check if document exists in "deliveries"
//     //         const deliveryRef = doc(fireStore, "deliveries", id);
//     //         const deliverySnap = await getDoc(deliveryRef);
//     //         if (deliverySnap.exists()) {
//     //             await deleteDoc(deliveryRef);
//     //             deleted = true;
//     //         }

//     //         // Check if document exists in "shipper"
//     //         const shipperRef = doc(fireStore, "shipper", id);
//     //         const shipperSnap = await getDoc(shipperRef);
//     //         if (shipperSnap.exists()) {
//     //             await deleteDoc(shipperRef);
//     //             deleted = true;
//     //         }

//     //         if (deleted) {
//     //             setData(prevData => prevData.filter(item => item.id !== id));
//     //             message.success("Delivery deleted successfully!");
//     //         } else {
//     //             message.warning("No matching delivery found to delete.");
//     //         }
//     //     } catch (error) {
//     //         console.error("Error deleting delivery:", error);
//     //         message.error("Failed to delete delivery!");
//     //     }
//     // };

//     const handleKeyPress = (e, index) => {
//         if (e.key === "Enter") {
//             e.preventDefault(); // Prevents default submit behavior
//             const nextInput = inputRefs.current[index + 1];
//             if (nextInput) {
//                 nextInput.focus(); // Moves focus to the next input field
//             }
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
//         // {
//         //     title: "Receiver Name",
//         //     key: "receiverName",
//         //     render: (record, _, index) => (
//         //         <Input
//         //             className="border-0"
//         //             defaultValue={record.receiverName}
//         //             ref={(ref) => (inputRefs.current[index] = ref)}
//         //             onChange={(e) => handleReciverChange(e, record.cnNumber)}
//         //             onKeyDown={(e) => handleKeyPress(e, index)}
//         //         />

//         //     ),
//         // },
//         {
//             title: "Date",
//             dataIndex: "date",
//             key: "date",
//         },
//     ];
//     const handleDelete = async () => {
//         setISLoading(true)
//         try {
//             if (selectedRowKeys.length === 0) {
//                 message.warning("Please select at least one record to delete.");
//                 return;
//             }

//             const deletePromises = selectedRowKeys.map(async (id) => {
//                 const deliveryRef = doc(fireStore, "deliveries", id);
//                 const shipperRef = doc(fireStore, "shipper", id);

//                 const deliverySnap = await getDoc(deliveryRef);
//                 const shipperSnap = await getDoc(shipperRef);

//                 if (deliverySnap.exists()) {
//                     await deleteDoc(deliveryRef);
//                 }
//                 if (shipperSnap.exists()) {
//                     await deleteDoc(shipperRef);
//                 }
//             });

//             await Promise.all(deletePromises);

//             message.success("Selected records deleted successfully!");

//             // Remove deleted items from state
//             setData(prevData => prevData.filter(item => !selectedRowKeys.includes(item.id)));
//             setFilteredData(prevData => prevData.filter(item => !selectedRowKeys.includes(item.id)));

//             setSelectedRowKeys([]); // Clear selection after delete
//         } catch (error) {
//             console.error("Error deleting documents:", error);
//             message.error("Failed to delete records.");
//         }
//         setISLoading(false)
//     };

//     const rowSelection = {
//         selectedRowKeys, // This ensures the selected checkboxes are tracked
//         onChange: (selectedKeys) => {
//             setSelectedRowKeys(selectedKeys);
//         },
//     };
//     return (
//         <main className="auth">
//             <Container className="my-3" >
//                 <Row>
//                     <Col span={24} className="mt-5">
//                         <Title level={1} className="text-light"> Show Data</Title>
//                         <Card className="border-1 mt-5 border-black">
//                             <Card className="border-0">
//                                 <Row>
//                                     {/* <Col>
//                                     <Button onClick={handleDelete}>
//                                         Delete Selected
//                                     </Button>
//                                     </Col> */}
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
//                                     {/* <Col span={12} className="mt-3">
//                                         <Button className=" bg-success text-light ms-2" onClick={handleSaveReceiver}>
//                                             Save  Names
//                                         </Button>
//                                     </Col> */}
//                                 </Row>
//                             </Card>
//                             <Button onClick={handleDelete} loading={isloading} disabled={selectedRowKeys.length === 0} type="primary" danger className="mb-3">
//                                 Delete Selected
//                             </Button>
//                             {/* <Table
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
//                                 rowSelection={{
//                                     type: "checkbox", // Use "radio" for single selection
//                                     onChange: (selectedRowKeys, selectedRows) => {
//                                         console.log("Selected Rows:", selectedRows);
//                                     },
//                                 }}
//                             /> */}
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
//                                 rowSelection={rowSelection} // ✅ Fixed row selection
//                             />

//                         </Card>
//                     </Col>
//                 </Row>
//             </Container>

//         </main>
//     );
// };

// export default AddShipment;

import React, { useEffect, useRef, useState } from "react";
import { Table, Select, DatePicker, Button, Input, Form, Row, Col, Card, Typography, message, Popconfirm } from "antd";
import { collection, getDocs, deleteDoc, doc, query, orderBy, getDoc } from "firebase/firestore";
import { fireStore } from "../../Config/firebase";
import { Container } from "react-bootstrap";

const AddShipment = () => {
    const { Title } = Typography;
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isloading, setISLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [riderList, setRiderList] = useState([]);
    const [selectedRider, setSelectedRider] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [page, setPage] = useState(1);
    // const [searchValue, setSearchValue] = useState('');
    const [form] = Form.useForm();
    // const inputRefs = useRef([]);

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

    // ✅ Updated applyFilters function
    const applyFilters = () => {
        let filtered = [...data];

        if (selectedRider) {
            filtered = filtered.filter(delivery => delivery.riderId === selectedRider);
        }

        if (selectedDate) {
            const selectedDateString = selectedDate.format("YYYY-MM-DD");
            const selectedMonthString = selectedDate.format("YYYY-MM");

            filtered = filtered.filter(delivery => {
                if (typeof delivery.date === "string") {
                    // If user selects full date, match exact date
                    if (selectedDateString.length === 10) {
                        return delivery.date === selectedDateString;
                    }
                    // If user selects only year and month, match month
                    else if (selectedDateString.length === 7) {
                        return delivery.date.startsWith(selectedMonthString);
                    }
                }
                return false;
            });
        }

        setFilteredData(filtered);
    };
    const deleteByMonth = async () => {
        if (!selectedMonth) {
            message.warning("Please select a month to delete.");
            return;
        }

        const selectedMonthString = selectedMonth.format("YYYY-MM"); // Get YYYY-MM format
        const itemsToDelete = data.filter(delivery => delivery.date.startsWith(selectedMonthString));

        if (itemsToDelete.length === 0) {
            message.info(`No records found for ${selectedMonthString}.`);
            return;
        }

        setISLoading(true);

        try {
            const deletePromises = itemsToDelete.map(async (item) => {
                const deliveryRef = doc(fireStore, "deliveries", item.id);
                const shipperRef = doc(fireStore, "shipper", item.id);

                const deliverySnap = await getDoc(deliveryRef);
                const shipperSnap = await getDoc(shipperRef);

                if (deliverySnap.exists()) {
                    await deleteDoc(deliveryRef);
                }
                if (shipperSnap.exists()) {
                    await deleteDoc(shipperRef);
                }
            });

            await Promise.all(deletePromises);
            message.success(`Deleted all records from ${selectedMonthString}!`);

            // Update UI
            setData(prevData => prevData.filter(item => !item.date.startsWith(selectedMonthString)));
            setFilteredData(prevData => prevData.filter(item => !item.date.startsWith(selectedMonthString)));

        } catch (error) {
            console.error("Error deleting records:", error);
            message.error("Failed to delete records.");
        }

        setISLoading(false);
    };




    const handleDelete = async () => {
        setISLoading(true);
        try {
            if (selectedRowKeys.length === 0) {
                message.warning("Please select at least one record to delete.");
                return;
            }

            const deletePromises = selectedRowKeys.map(async (id) => {
                const deliveryRef = doc(fireStore, "deliveries", id);
                const shipperRef = doc(fireStore, "shipper", id);

                const deliverySnap = await getDoc(deliveryRef);
                const shipperSnap = await getDoc(shipperRef);

                if (deliverySnap.exists()) {
                    await deleteDoc(deliveryRef);
                }
                if (shipperSnap.exists()) {
                    await deleteDoc(shipperRef);
                }
            });

            await Promise.all(deletePromises);
            message.success("Selected records deleted successfully!");

            setData(prevData => prevData.filter(item => !selectedRowKeys.includes(item.id)));
            setFilteredData(prevData => prevData.filter(item => !selectedRowKeys.includes(item.id)));
            setSelectedRowKeys([]);
        } catch (error) {
            console.error("Error deleting documents:", error);
            message.error("Failed to delete records.");
        }
        setISLoading(false);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
            setSelectedRowKeys(selectedKeys);
        },
    };
    return (
        <main className="auth">
            <Container className="my-3">
                <Row>
                    <Col span={24} className="mt-5">
                        <Title level={1} className="text-light">Show Data</Title>
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
                                                { value: null, label: "All Riders" },
                                                ...riderList.map(rider => ({ value: rider.id, label: rider.name }))
                                            ]}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <DatePicker
                                            className="border-1 w-75 border-black"
                                            placeholder="Select Date"
                                            onChange={setSelectedDate}
                                            format="YYYY-MM-DD"
                                        />
                                        <Button className="ms-2 bg-black text-light" onClick={applyFilters}>
                                            Apply Filters
                                        </Button>
                                    </Col>
                                    <Col span={12} className="mt-3">
                                        <DatePicker
                                            className="border-1 w-75 border-black"
                                            picker="month"
                                            placeholder="Select Month to Delete"
                                            onChange={setSelectedMonth}
                                        />
                                    </Col>
                                    <Col span={12} className="mt-3">
                                        <Popconfirm
                                            title="Are you sure you want to delete all records for this month?"
                                            onConfirm={deleteByMonth} // Call deleteByMonth function on confirmation
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button
                                                className="ms-2 bg-danger text-light"
                                                disabled={!selectedMonth}
                                            >
                                                Delete by Month
                                            </Button>
                                        </Popconfirm>

                                    </Col>
                                </Row>
                            </Card>

                            <Popconfirm
                                title="Are you sure you want to delete?"
                                onConfirm={handleDelete} // Call the correct function here
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="primary" danger className="mb-3" disabled={selectedRowKeys.length === 0}>
                                    Delete Selected
                                </Button>
                            </Popconfirm>
                            <Table
                                bordered
                                className="border-black border-1"
                                dataSource={filteredData.map((item, index) => ({ ...item, key: item.id || index }))}
                                columns={[
                                    { title: "#", key: "index", render: (_, __, index) => index + 1 },
                                    {
                                        title: "Rider Name",
                                        key: "riderName",
                                        render: (record) => {
                                            const rider = riderList.find((r) => r.id === record.riderId);
                                            return rider ? rider.name : "Unknown";
                                        },
                                    },
                                    { title: "Shipper Name", dataIndex: "shipperName", key: "shipperName" },
                                    { title: "CN Number", dataIndex: "cnNumber", key: "cnNumber" },
                                    { title: "Consignee Name", dataIndex: "consigneeName" || "consignee", key: "consignee" },
                                    { title: "Date", dataIndex: "date", key: "date" }
                                ]}
                                loading={loading}
                                pagination={{ current: page, pageSize: 20, showSizeChanger: false, onChange: (newPage) => setPage(newPage) }}
                                scroll={{ x: 1000 }}
                                rowSelection={rowSelection}
                            />
                        </Card>
                    </Col>
                </Row>
            </Container>
        </main >
    );
};

export default AddShipment;
