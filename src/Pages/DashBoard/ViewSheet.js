import { Card, Col, Input, Row, Select, Table, Typography, Button, message } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { fireStore } from "../../Config/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const { Option } = Select;
const { Title } = Typography;

const ViewSheet = () => {
  const [riders, setRiders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [deliverySheetData, setDeliverySheetData] = useState([]);
  const [delivery, setDelivery] = useState({ riderId: "", date: "" });
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Riders
        const ridersQuery = query(collection(fireStore, "riders"));
        const ridersSnapshot = await getDocs(ridersQuery);
        const ridersList = ridersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRiders(ridersList);

        // Fetch Deliveries
        const deliveriesQuery = query(collection(fireStore, "deliveries"), orderBy('createdAt'));
        const deliveriesSnapshot = await getDocs(deliveriesQuery);
        const deliveriesList = deliveriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch Shipper Data
        const shipperQuery = query(collection(fireStore, "shipper"), orderBy('createdAt'));
        const shipperSnapshot = await getDocs(shipperQuery);
        const shipperList = shipperSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDeliveries([...deliveriesList, ...shipperList]);
      } catch (error) {
        message.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const handleDeliveryChange = (name, value) => { setDelivery(prev => ({ ...prev, [name]: value })) };

  const viewDeliverySheet = () => {
    if (!delivery.riderId || !delivery.date) {
      message.error("Please select both rider and date!");
      return;
    }

    const filteredDeliveries = deliveries
      .filter(d => d.riderId === delivery.riderId && d.date === delivery.date);

    setDeliverySheetData(filteredDeliveries);
  };
  const downloadPDFSheet = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = "Delivery Sheet";
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 20);
    if (deliverySheetData.length > 0) {
      const riderNameText = `Rider Name: ${deliverySheetData[0].riderName}`;
      const riderNameWidth = doc.getTextWidth(riderNameText);
      doc.text(riderNameText, (pageWidth - riderNameWidth) / 2, 30);
      const riderDateText = `Date: ${deliverySheetData[0].date}`;
      const riderDateWidth = doc.getTextWidth(riderDateText);
      doc.text(riderDateText, (pageWidth - riderDateWidth) / 2, 40);
    }
    const bodyData = [];
    for (let i = 0; i < deliverySheetData.length; i += 2) {
      const firstItem = deliverySheetData[i];
      const secondItem = deliverySheetData[i + 1] || {};
      bodyData.push([
        i + 1,
        `${firstItem.cnNumber}\n${firstItem.consignee}`,
        '',
        '',
        i + 2,
        `${secondItem.cnNumber || ''}\n${secondItem.consignee || ''}`,
        '',
        firstItem.date,
      ]);
    }
    while (bodyData.length < 10) {
      bodyData.push([bodyData.length * 2 + 1, '', '', '', bodyData.length * 2 + 2, '', '', ''])
    }
    doc.autoTable({
      head: [["Index", "CN Number / Consignee Name ", "Receiver Name / Signature /Stamp", "", "Index", "CN Number / Consignee Name", "Receiver Name / Signature /Stamp"]],
      body: bodyData,
      startY: 50,
      styles: { lineColor: [0, 0, 0], lineWidth: 0.3, minCellHeight: 20, fontSize: 12, },
      pageBreak: 'auto', tableWidth: 'auto',
      margin: { top: 30, bottom: 30 },
    });
    const fileName = `${deliverySheetData[0]?.date}_${deliverySheetData[0]?.riderName}.pdf`;
    doc.save(fileName);
  };
  const columns = [
    { title: "Index", dataIndex: "index", key: "index" },
    { title: "CN Number", dataIndex: "cnNumber", key: "cnNumber" },
    { title: "Consignee Name", dataIndex: "consignee", key: "consignee" },
    { title: "Receiver Name", dataIndex: "receiverName", key: "receiverName" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  const indexedDeliverySheetData = deliverySheetData.map((item, index) => ({
    ...item,
    index: index + 1,
  }));

  return (
    <main className="auth d-flex justify-content-center align-items-center">
      <Container>
        <Row className="d-flex justify-content-center align-items-center">
          <Col span={24} className="text-center">
            <span className="text-white " style={{ fontSize: 60, fontWeight: 600, fontFamily: "inherit" }}>View Delivery Sheet</span>
          </Col>
          <Col span={20}>
            <Card style={{ backgroundColor: "#fff" }} className="mt-5 card2">
              <label className="mt-4 fs-6 fw-medium">Select Rider:</label>
              <Select
                name="riderId"
                value={delivery.riderId}
                onChange={(value) => handleDeliveryChange("riderId", value)}
                style={{ width: "100%", marginBottom: "1rem" }}
                placeholder="Select a rider"
                showSearch
                filterOption={(input, option) => option?.children?.toLowerCase().includes(input.toLowerCase())}
              >
                {riders.map((rider) => (
                  <Option key={rider.id} value={rider.id}>
                    {rider.name}
                  </Option>
                ))}
              </Select>

              <label className="fs-6 fw-medium">Select Date:</label>
              <Input type="date" name="date" className="rounded-4" value={delivery.date} onChange={(e) => handleDeliveryChange("date", e.target.value)} style={{ width: "100%", marginBottom: "1rem" }} />
              <div className="d-flex justify-content-center align-items-center">
                <Button  onClick={viewDeliverySheet} className="rounded-5 w-50 p-4 fs-5 fw-medium text-light" style={{ marginBottom: "1rem" , backgroundColor : "#007991" }}>
                  View Delivery Sheet
                </Button>
              </div>
              {deliverySheetData.length > 0 ? (
                <div style={{ textAlign: 'center' }}>
                  <hr />
                  <h2 className="text-center">{deliverySheetData[0]?.riderName}</h2>
                  <Table bordered columns={columns} dataSource={indexedDeliverySheetData} rowKey="id" pagination={false} className="text-center border-2 h-auto" />
                  <Button className="bg-success text-light" onClick={downloadPDFSheet} style={{ marginTop: "1rem" }}>
                    Download as PDF
                  </Button>
                </div>
              ) : (
                <p>No deliveries found for the selected rider and date.</p>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ViewSheet; 