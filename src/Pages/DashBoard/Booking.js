/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Input, InputNumber, message, Row, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Container } from "react-bootstrap";
import { fireStore } from "../../Config/firebase"; // Import Firestore
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useAuthContext } from "../../Context/Auth";
import QuotationGenerator from "./pdf-generatoer";
import TrackPDF from "./track-pdf"

const Boking = () => {
  const { user } = useAuthContext()
  const { Title } = Typography;
  const [cnError, setCnError] = useState("");
  const descriptionRef = useRef(null);
  const amountRef = useRef(null);
  const [couriers, setCouriers] = useState([]);
  const [form, setForm] = useState({ cnNumber: "", date: "", shipperName: "", trackingId: "", contact: "", amount: "", consignee: "", consigneeAddress: "", consigneeContact: "", origin: "", destination: "", pieces: "", weight: "", description: "" });
  const [trackingResult, setTrackingResult] = useState(null);
  useEffect(() => { fetchCouriers(); }, []);
  const fetchCouriers = async () => {
    const querySnapshot = await getDocs(collection(fireStore, "shipper"));
    const couriersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCouriers(couriersList);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  const handleTrackCourier = async () => {
    try {
      if (!form.cnNumber) {
        message.error("Please enter a CN Number to track.");
        return;
      }

      const querySnapshot = await getDocs(collection(fireStore, "shipper"));
      const trackingData = querySnapshot.docs.find(
        (doc) => doc.data().cnNumber === form.cnNumber
      );

      if (trackingData) {
        const courierInfo = trackingData.data();
        message.success("Courier found!");
        setTrackingResult(courierInfo);
      } else {
        message.error("No record found for this CN Number.");
        setTrackingResult(null);
      }
    } catch (error) {
      console.error("Error tracking courier:", error);
      message.error("Error tracking courier: " + error.message);
    }
  };

  const handleAddCourier = async () => {
    const timestamp = new Date().toISOString();
    try {
      const querySnapshot = await getDocs(collection(fireStore, "shipper"));
      const existingCN = querySnapshot.docs.find(doc => doc.data().cnNumber === form.cnNumber);
      if (existingCN) {
        setCnError("CN Number already exists! Please use a different CN Number.");
        return;
      } else {
        setCnError("");
      }
      const newCourier = {
        ...form,
        createdAt: Date.now(),
        status: "Booked",
        userId: user.uid,
      };
      // console.log("Saving courier:", newCourier);
      await addDoc(collection(fireStore, "shipper"), newCourier);
      message.success("Save successfully!");
      setForm({ date: "", cnNumber: "", shipperName: "", trackingId: "", contact: "", consignee: "", consigneeAddress: "", consigneeContact: "", origin: "", destination: "", pieces: "", weight: "", description: "", amount: "" });
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
        <span level={1} className="text  d-flex justify-content-center align-items-center display-3 fw-medium text-light "> Booking</span>
        <Row className="my-3">
          <Col md={24} lg={12}>
            <Card className="border-0 card2 rounded-5" >
              <Row>
                <Col xs={24} md={24} lg={12} className="px-2 py-1">
                  <label className="fw-bolder w-100 mb-1">Date:</label>
                  <Input type="date" className="" name="date" value={form.date} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "cnNumber")} />
                </Col>
                <Col xs={24} md={24} lg={12} className="px-2 py-1">
                  <label className="fw-bolder w-100 mb-1">CN Number:</label>
                  <Input type="number" name="cnNumber" value={form.cnNumber} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "shipperName")} placeholder="Enter CN Number" />
                  <Col>
                    <Button className="  rounded-pill border-0 text-light mt-2" style={{ backgroundColor: "#302b63" }} onClick={handleTrackCourier}>Track CN</Button>
                  </Col>
                  {trackingResult && (<TrackPDF form={trackingResult} />)}
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
            <Card className="border-1 overflow-auto flex-wrap border-0 card2  rounded-5">
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

export default Boking;
