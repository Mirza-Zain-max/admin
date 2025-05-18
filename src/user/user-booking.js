/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Card, Col, Input, InputNumber, message, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Container } from "react-bootstrap";
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { useAuthContext } from "../Context/Auth";
import QuotationGenerator from "../Pages/DashBoard/pdf-generatoer";
import { fireStore } from "../Config/firebase";
const UserBoking = () => {
  const { user } = useAuthContext()
  const [cnError, setCnError] = useState("");
  const descriptionRef = useRef(null);
  const [userFullName, setUserFullName] = useState("");
  const amountRef = useRef(null);
  const [couriers, setCouriers] = useState([]);
  const [form, setForm] = useState({
    cnNumber: "", date: "", shipperName: "", trackingId: "", contact: "", amount: "", consignee: "",
    consigneeAddress: "", consigneeContact: "", origin: "", destination: "",
    pieces: "", weight: "", description: ""
  });

  const fetchCouriers = async (userId) => {
    if (!userId) {
      console.warn("⛔ fetchCouriers called with undefined userId");
      return;
    }
    try {
      const q = query(collection(fireStore, "User Booking"), where("Created_By", "==", userId));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCouriers(userList);
    } catch (error) {
      message.error("Failed to fetch riders!");
    }
  };

  useEffect(() => {
    if (user && user.uid) {
      fetchCouriers(user.uid);
    } else {
      console.warn("⏳ Waiting for user to load...");
    }
  }, [user]);

  useEffect(() => {
    if (user && user.uid) {
      fetchCouriers(user.uid);
      fetchUserFullName(user.uid);
    }
  }, [user]);

  const fetchUserFullName = async (uid) => {
    try {
      const userRef = doc(fireStore, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserFullName(userSnap.data().fullName || "User");
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleAddCourier = async () => {
    const timestamp = new Date().toISOString();

    try {
      // Check if CN Number already exists
      const querySnapshot = await getDocs(collection(fireStore, "User Booking"));
      const existingCN = querySnapshot.docs.find(doc => doc.data().cnNumber === form.cnNumber);
      if (existingCN) {
        setCnError("CN Number already exists! Please use a different CN Number.");
        return;
      } else {
        setCnError("");
      }
      if (!user || !user.uid) {
        message.error("User not authenticated. Please login again.");
        return;
      }
      const newCourier = {
        ...form,
        createdAt: Date.now(),
        status: "Booked",
        Created_By: user.uid,
      };
      await addDoc(collection(fireStore, "User Booking"), newCourier);
      message.success("Save successfully!");
      setForm({
        date: "", cnNumber: "", shipperName: "", trackingId: "", contact: "", consignee: "",
        consigneeAddress: "", consigneeContact: "", origin: "", destination: "",
        pieces: "", weight: "", description: "", amount: ""
      });
      setCnError("");
      fetchCouriers();
      document.querySelector(`[name="date"]`).focus();
    } catch (error) {
      console.error("Firestore Error:", error);
      message.error("Error adding : " + error.message);
    }
  };

  const handleKeyPress = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef === "submit") {
        handleAddCourier();
      } else if (typeof nextRef === "string") {
        const nextInput = document.querySelector(`[name="${nextRef}"]`);
        if (nextInput) {
          nextInput.focus();
        }
      } else if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };
  return (
    <main className="auth d-flex justify-content-center align-items-center">
      <Container>
        <h1 className="text-center text-white mb-4">{userFullName}</h1>
        <Row className="my-3 ">
          <Col md={24} lg={12} className="">
            <Card className="border-0 card2  rounded-5" >
              <Row>
                <Col xs={24} md={24} lg={12} className="px-2 py-1">
                  <label className="fw-bolder w-100 mb-1">Date:</label>
                  <Input type="date" className="" name="date" value={form.date} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "cnNumber")} />
                </Col>
                <Col xs={24} md={24} lg={12} className="px-2 py-1">
                  <label className="mb-1 fw-bolder">CN Number:</label>
                  <Input type="number" name="cnNumber" value={form.cnNumber} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "shipperName")} />
                  {cnError && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{cnError}</p>}
                </Col>
              </Row>
              <Col span={24} className="px-2 py-1">
                <label className="mb-1 fw-bolder">Shipper:</label>
                <Input type="text" name="shipperName" placeholder="Add Shipment Name" value={form.shipperName} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "trackingId")} />
              </Col>
              <Col span={24} className="px-2 py-1">
                <label className="mb-1 fw-bolder">Address:</label>
                <TextArea name="trackingId" rows={4} placeholder="Enter Address" value={form.trackingId} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "contact")} />
              </Col>
              <Col span={24} className="px-2 py-1">
                <label className="fw-bolder">Contact Number:</label>
                <Input type="number" name="contact" placeholder="Enter Contact Number" value={form.contact} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "consignee")} />
              </Col>
            </Card>
          </Col>
          <Col lg={12}>
            <Card className="border-0 card2  overflow-auto flex-wrap ms-2 rounded-5">
              <Row>
                <Col span={24} className="px-2 py-1">
                  <label className="mb-1 fw-bolder">Consignee Name:</label>
                  <Input type="text" name="consignee" value={form.consignee} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "consigneeAddress")} />
                </Col>
              </Row>
              <Col span={24} className="px-2 py-1">
                <label className="mb-1 fw-bolder">Consignee Address:</label>
                <TextArea name="consigneeAddress" value={form.consigneeAddress} placeholder="Enter Address" onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "consigneeContact")} />
              </Col>
              <Col span={24} className="px-2 py-1">
                <label className="fw-bolder">Consignee Contact:</label>
                <Input type="number" name="consigneeContact" value={form.consigneeContact} placeholder="Enter Contact Number" onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "origin")} />
              </Col>
              <Row className="p-2 wrapper" gutter={6}>
                <Col xs={24} md={6} lg={3}>
                  <label className="mb-1 fw-bolder">Origin:</label>
                  <Input type="text" name="origin" value={form.origin} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "destination")} />
                </Col>
                <Col xs={24} md={6} lg={3}>
                  <label className="mb-1 fw-bolder">Dest:</label>
                  <Input type="text" name="destination" value={form.destination} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "pieces")} />
                </Col>
                <Col xs={24} md={6} lg={4}>
                  <label className="mb-1 fw-bolder">Pcs:</label>
                  <Input type="number" name="pieces" value={form.pieces} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "weight")} />
                </Col>
                <Col xs={24} md={6} lg={4}>
                  <label className="mb-1 fw-bolder">Weight:</label>
                  <Input type="number" name="weight" value={form.weight} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, descriptionRef)} />
                </Col>
                <Col xs={24} md={12} lg={5}>
                  <label className="mb-1 fw-bolder">Description:</label>
                  <Input type="text" name="description" ref={descriptionRef} value={form.description} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, amountRef)} />
                </Col>
                <Col xs={24} md={12} lg={5}>
                  <label className="mb-1 fw-bolder">Amount (RS):</label>
                  <div tabIndex={0} onKeyDown={(e) => handleKeyPress(e, "submit")}>
                    <InputNumber name="amount" ref={amountRef} formatter={(value) => `RS: ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "/-"} parser={(value) => value.replace(/RS:\s?|,|\/-/g, "")} value={form.amount} onKeyDown={(e) => handleKeyPress(e, "submit")} onChange={(value) => setForm({ ...form, amount: value })} className="w-100" />
                  </div>
                </Col>
                <Col xs={24} md={12} lg={5}>
                  <input type="hidden" name="created_by_name" value={userFullName} />
                </Col>
              </Row>
              <Row className="d-flex justify-content-center align-items-center">
                <Col span={10}>
                  <QuotationGenerator form={form} handleAddCourier={handleAddCourier} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </main >
  );
};

export default UserBoking;
