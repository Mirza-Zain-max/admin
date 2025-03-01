// import { Button, Card, Col, Input, InputNumber, message, Row } from "antd";
// import TextArea from "antd/es/input/TextArea";
// import React, { useEffect, useRef, useState } from "react";
// import { Container } from "react-bootstrap";
// import { fireStore } from "../../Config/firebase"; // Import Firestore
// import { collection, addDoc, getDocs, where } from "firebase/firestore";
// import { useAuthContext } from "../../Context/Auth";
// import QuotationGenerator from "./pdf-generatoer";
// import QuotationGenerator2 from "./track-pdf";
// const Boking = () => {
//   const { user } = useAuthContext()
//   const [cnError, setCnError] = useState("");
//   const descriptionRef = useRef(null);
//   const amountRef = useRef(null);
//   const [couriers, setCouriers] = useState([]);
//   const [form, setForm] = useState({
//     cnNumber: "", date: "", shipperName: "", trackingId: "", contact: "", amount: "", consigneeName: "",
//     consigneeAddress: "", consigneeContact: "", origin: "", destination: "",
//     pieces: "", weight: "", description: ""
//   });
//   const [trackingResult, setTrackingResult] = useState(null);
//   useEffect(() => {
//     fetchCouriers();
//   }, []);
//   const fetchCouriers = async () => {
//     const querySnapshot = await getDocs(collection(fireStore, "shipper"),
//      where("userId", "==", user.uid)
//      );
//     const couriersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     setCouriers(couriersList);
//   };
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prevForm) => ({
//       ...prevForm,
//       [name]: value,
//     }));
//   };


//   const handleTrackCourier = async () => {
//     try {
//       if (!form.cnNumber) {
//         message.error("Please enter a CN Number to track.");
//         return;
//       }

//       const querySnapshot = await getDocs(collection(fireStore, "shipper"));
//       const trackingData = querySnapshot.docs.find(
//         (doc) => doc.data().cnNumber === form.cnNumber
//       );

//       if (trackingData) {
//         const courierInfo = trackingData.data();
//         message.success("Courier found!");
//         setTrackingResult(courierInfo);
//       } else {
//         message.error("No record found for this CN Number.");
//         setTrackingResult(null);
//       }
//     } catch (error) {
//       console.error("Error tracking courier:", error);
//       message.error("Error tracking courier: " + error.message);
//     }
//   };

//   const handleAddCourier = async () => {
//     const timestamp = new Date().toISOString();

//     try {
//       // Check if CN Number already exists
//       const querySnapshot = await getDocs(collection(fireStore, "shipper"));
//       const existingCN = querySnapshot.docs.find(doc => doc.data().cnNumber === form.cnNumber);

//       if (existingCN) {
//         setCnError("CN Number already exists! Please use a different CN Number.");
//         return;
//       } else {
//         setCnError(""); // Clear error if valid
//       }

//       const newCourier = {
//         ...form,
//         createdAt: Date.now(),
//         status: "Booked",
//         userId: user.uid,
//       };

//       console.log("Saving courier:", newCourier);

//       await addDoc(collection(fireStore, "shipper"), newCourier);
//       message.success("Save successfully!");

//       // Reset form & error
//       setForm({
//         date: "", cnNumber: "", shipperName: "", trackingId: "", contact: "", consigneeName: "",
//         consigneeAddress: "", consigneeContact: "", origin: "", destination: "",
//         pieces: "", weight: "", description: "", amount: ""
//       });
//       setCnError("");

//       fetchCouriers(); // Refresh the list
//       document.querySelector(`[name="date"]`).focus();
//     } catch (error) {
//       console.error("Firestore Error:", error);
//       message.error("Error adding : " + error.message);
//     }
//   };



//   const handleKeyPress = (e, nextRef) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       if (nextRef === "submit") {
//         handleAddCourier();
//       } else if (typeof nextRef === "string") {
//         const nextInput = document.querySelector(`[name="${nextRef}"]`);
//         if (nextInput) {
//           nextInput.focus();
//         }
//       } else if (nextRef && nextRef.current) {
//         nextRef.current.focus();
//       }
//     }
//   };
//   return (
//     <main className="auth d-flex justify-content-center align-items-center">
//       <Container>
//         <Row className="my-3">
//           <Col md={24} lg={12}>
//             <Card className="border-1 border-black rounded-5" >
//               <Row>
//                 <Col xs={24} md={24} lg={12} className="px-2 py-1">
//                   <label className="fw-bolder w-100 mb-1">Date:</label>
//                   <Input type="date" className="" name="date" value={form.date} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "cnNumber")} />
//                 </Col>
//                 <Col xs={24} md={24} lg={12} className="px-2 py-1">
//                 <label className="fw-bolder w-100 mb-1">CN Number:</label>
//                   <Input
//                     type="number"
//                     name="cnNumber"
//                     value={form.cnNumber}
//                     onChange={handleChange}
//                     onKeyDown={(e) => handleKeyPress(e, "shipperName")}
//                     placeholder="Enter CN Number"
//                   />
//                   <Col>
//                   <Button variant="primary" className="bg-info text-light mt-2" onClick={handleTrackCourier}>Track CN</Button>
//                   </Col>
                 
//                   {trackingResult && (
//                     <>
//                       <QuotationGenerator2 form={trackingResult} />
//                     </>
//                   )}
//                 </Col>
//                   <Col>
//                   </Col>
//               </Row>
//               <Col span={24} className="px-2 py-1">
//                 <label className="mb-1 fw-bolder">Shipper:</label>
//                 <Input type="text" name="shipperName" placeholder="Add Shipment Name" value={form.shipperName} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "trackingId")} />
//               </Col>
//               <Col span={24} className="px-2 py-1">
//                 <label className="mb-1 fw-bolder">Address:</label>
//                 <TextArea name="trackingId" rows={4} placeholder="Enter Address" value={form.trackingId} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "contact")} />
//               </Col>
//               <Col span={24} className="px-2 py-1">
//                 <label className="fw-bolder">Contact Number:</label>
//                 <Input type="number" name="contact" placeholder="Enter Contact Number" value={form.contact} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "consigneeName")} />
//               </Col>
//             </Card>
//           </Col>
//           <Col lg={12}>
//             <Card className="border-1 overflow-auto flex-wrap border-black rounded-5">
//               <Row>
//                 <Col span={24} className="px-2 py-1">
//                   <label className="mb-1 fw-bolder">Consignee Name:</label>
//                   <Input type="text" name="consigneeName" value={form.consigneeName} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "consigneeAddress")} />
//                 </Col>
//               </Row>
//               <Col span={24} className="px-2 py-1">
//                 <label className="mb-1 fw-bolder">Consignee Address:</label>
//                 <TextArea name="consigneeAddress" value={form.consigneeAddress} placeholder="Enter Address" onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "consigneeContact")} />
//               </Col>
//               <Col span={24} className="px-2 py-1">
//                 <label className="fw-bolder">Consignee Contact:</label>
//                 <Input type="number" name="consigneeContact" value={form.consigneeContact} placeholder="Enter Contact Number" onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "origin")} />
//               </Col>
//               <Row className="p-2 wrapper" gutter={6}>
//                 <Col xs={24} md={6} lg={3}>
//                   <label className="mb-1 fw-bolder">Origin:</label>
//                   <Input type="text" name="origin" value={form.origin} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "destination")} />
//                 </Col>
//                 <Col xs={24} md={6} lg={3}>
//                   <label className="mb-1 fw-bolder">Dest:</label>
//                   <Input type="text" name="destination" value={form.destination} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "pieces")} />
//                 </Col>
//                 <Col xs={24} md={6} lg={4}>
//                   <label className="mb-1 fw-bolder">Pcs:</label>
//                   <Input type="number" name="pieces" value={form.pieces} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "weight")} />
//                 </Col>
//                 <Col xs={24} md={6} lg={4}>
//                   <label className="mb-1 fw-bolder">Weight:</label>
//                   <Input type="number" name="weight" value={form.weight} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, descriptionRef)} />
//                 </Col>
//                 <Col xs={24} md={12} lg={5}>
//                   <label className="mb-1 fw-bolder">Description:</label>
//                   <Input type="text" name="description" ref={descriptionRef} value={form.description} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, amountRef)} />
//                 </Col>
//                 <Col xs={24} md={12} lg={5}>
//                   <label className="mb-1 fw-bolder">Amount (RS):</label>
//                   <div tabIndex={0} onKeyDown={(e) => handleKeyPress(e, "submit")}>
//                     <InputNumber name="amount" ref={amountRef} formatter={(value) => `RS: ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "/-"} parser={(value) => value.replace(/RS:\s?|,|\/-/g, "")} value={form.amount} onKeyDown={(e) => handleKeyPress(e, "submit")} onChange={(value) => setForm({ ...form, amount: value })} className="w-100" />
//                   </div>
//                 </Col>
//               </Row>
//               <Row className="d-flex justify-content-center align-items-center">
//                 {/* <Col span={10}>
//                   <Button variant="primary" className="w-75 mt-2 p-1 fs-6" onClick={handleAddCourier}>Save Data</Button>
//                 </Col> */}
//                 <Col span={10}>
//                   <QuotationGenerator form={form} handleAddCourier={handleAddCourier} />
//                 </Col>
//               </Row>
//             </Card>
//           </Col>
//           {/* <Card className="border-1 border-black rounded-5 p-3">
//             <h5 className="fw-bold">Track Your Shipment</h5>
//             <Row>
//               <Col xs={18}>
//                 <Input
//                   type="text"
//                   placeholder="Enter CN Number"
//                   value={trackingNumber}
//                   onChange={(e) => setTrackingNumber(e.target.value)}
//                 />
//               </Col>
//               <Col xs={6}>
//                 <Button variant="primary" onClick={handleTrackCourier}>Track</Button>
//               </Col>
//             </Row> */}

//           {/* Show Error Message */}
//           {/* {trackingError && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{trackingError}</p>} */}

//           {/* Show Tracking Data if Found */}
//           {/* {trackingData && (
//               <Card className="mt-3 p-2">
//                 <h6><b>Status:</b> {trackingData.status}</h6>
//                 <p><b>Shipper:</b> {trackingData.shipperName}</p>
//                 <p><b>Consignee:</b> {trackingData.consigneeName}</p>
//                 <p><b>Destination:</b> {trackingData.destination}</p>
//                 <p><b>Amount:</b> RS {trackingData.amount}/-</p>
//               </Card>
//             )}
//           </Card> */}
//         </Row>
//       </Container>
//     </main >
//   );
// };

// export default Boking;



import { Button, Card, Col, Input, InputNumber, message, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { fireStore } from "../../Config/firebase"; // Import Firestore
import { collection, addDoc, getDocs, where, query } from "firebase/firestore";
import { useAuthContext } from "../../Context/Auth";
import QuotationGenerator from "./pdf-generatoer";
import QuotationGenerator2 from "./track-pdf";

const Boking = () => {
  const { user } = useAuthContext();
  const [cnError, setCnError] = useState("");
  const descriptionRef = useRef(null);
  const amountRef = useRef(null);
  const [couriers, setCouriers] = useState([]);
  const [form, setForm] = useState({
    cnNumber: "", date: "", shipperName: "", trackingId: "", contact: "", amount: "", consigneeName: "",
    consigneeAddress: "", consigneeContact: "", origin: "", destination: "",
    pieces: "", weight: "", description: ""
  });
  const [trackingResult, setTrackingResult] = useState(null);

  useEffect(() => {
    fetchCouriers();
  }, [user?.uid]);

  const fetchCouriers = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(fireStore, "shipper"), where("user", "==", user.uid)));
      const couriersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCouriers(couriersList);
    } catch (error) {
      console.error("Error fetching couriers:", error);
      message.error("Error fetching couriers: " + error.message);
    }
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

      const querySnapshot = await getDocs(query(collection(fireStore, "shipper"), where("user", "==", user.uid), where("cnNumber", "==", form.cnNumber)));
      const trackingData = querySnapshot.docs[0];

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
      // Check if CN Number already exists
      const querySnapshot = await getDocs(query(collection(fireStore, "shipper"), where("user", "==", user.uid), where("cnNumber", "==", form.cnNumber)));
      const existingCN = querySnapshot.docs[0];

      if (existingCN) {
        setCnError("CN Number already exists! Please use a different CN Number.");
        return;
      } else {
        setCnError(""); // Clear error if valid
      }

      const newCourier = {
        ...form,
        createdAt: Date.now(),
        status: "Booked",
        userId: user.uid,
      };

      console.log("Saving courier:", newCourier);

      await addDoc(collection(fireStore, "shipper"), newCourier);
      message.success("Saved successfully!");

      // Reset form & error
      setForm({
        date: "", cnNumber: "", shipperName: "", trackingId: "", contact: "", consigneeName: "",
        consigneeAddress: "", consigneeContact: "", origin: "", destination: "",
        pieces: "", weight: "", description: "", amount: ""
      });
      setCnError("");

      fetchCouriers(); // Refresh the list
      document.querySelector(`[name="date"]`).focus();
    } catch (error) {
      console.error("Firestore Error:", error);
      message.error("Error adding: " + error.message);
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
        <Row className="my-3">
          <Col md={24} lg={12}>
            <Card className="border-1 border-black rounded-5">
              <Row>
                <Col xs={24} md={24} lg={12} className="px-2 py-1">
                  <label className="fw-bolder w-100 mb-1">Date:</label>
                  <Input type="date" className="" name="date" value={form.date} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "cnNumber")} />
                </Col>
                <Col xs={24} md={24} lg={12} className="px-2 py-1">
                  <label className="fw-bolder w-100 mb-1">CN Number:</label>
                  <Input
                    type="number"
                    name="cnNumber"
                    value={form.cnNumber}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyPress(e, "shipperName")}
                    placeholder="Enter CN Number"
                  />
                  <Col>
                    <Button variant="primary" className="bg-info text-light mt-2" onClick={handleTrackCourier}>Track CN</Button>
                  </Col>
                  {trackingResult && (
                    <>
                      <QuotationGenerator2 form={trackingResult} />
                    </>
                  )}
                </Col>
                <Col>
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
                <Input type="number" name="contact" placeholder="Enter Contact Number" value={form.contact} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "consigneeName")} />
              </Col>
            </Card>
          </Col>
          <Col lg={12}>
            <Card className="border-1 overflow-auto flex-wrap border-black rounded-5">
              <Row>
                <Col span={24} className="px-2 py-1">
                  <label className="mb-1 fw-bolder">Consignee Name:</label>
                  <Input type="text" name="consigneeName" value={form.consigneeName} onChange={handleChange} onKeyDown={(e) => handleKeyPress(e, "consigneeAddress")} />
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
    </main>
  );
};

export default Boking;