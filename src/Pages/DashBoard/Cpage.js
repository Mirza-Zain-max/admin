// import { Table, Card } from "antd";
// import React, { useState, useEffect } from "react";
// import {  Container } from "react-bootstrap";
// // import { useNavigate } from "react-router-dom";

// const CPage = () => {
//   const [data, setData] = useState([]);
//   // const naigate = useNavigate()
//   useEffect(() => {
//     const safeParse = (key) => {
//       try {
//         return JSON.parse(localStorage.getItem(key) || "[]");
//       } catch (error) {
//         console.error(`Error parsing ${key}:`, error);
//         return [];
//       }
//     };


//     const courierData = safeParse("courierData");
//     const riderData = safeParse("riderData");

//     const combinedData = courierData.map((courier, index) => {
//       const rider = riderData.find((r) => r.riderName === courier.riderName);
//       return {
//         ...courier,
//         receiverName: rider ? rider.receiverName : courier.name,
//         key: index + 0,
//       };
//     });

//     setData(combinedData);
//   }, []);

//   const columns = [
//     {
//       title: "Index",
//       dataIndex: "key",
//       key: "key",
//       render: (text, record, index) => ((2 * index) + 1),
//     },
//     {
//       title: "Rider Name & CN Number",
//       key: "riderAndCn",
//       render: (text, record) => (
//         <div>
//           {record.cnNumber}<br />
//           {record.riderName}
//         </div>
//       ),
//     },
//     {
//       title: "Receiver Name / Stamp",
//       dataIndex: "",
//       key: "receiverName",
//     },
//     {
//       title: "Index",
//       dataIndex: "key",
//       key: "key",
//       render: (text, record, index) => 2 * (index + 1),
//     }, {
//       title: "Rider Name & CN Number",
//       key: "riderAndCn",
//       render: (text, record) => (
//         <div>
//           {record.cnNumber} <br />
//           {record.riderName}
//         </div>
//       ),
//     },
//     {
//       title: "Receiver Name / Stamp",
//       dataIndex: "",
//       key: "receiverName",
//     },
//   ];
//   // const handlePrint = () => {
//   //   window.print()
//   // }
//   return (
//     <main className="d-flex justify-content-center align-items-center mt-5" style={{ height: "100vh" }}>
//       {/* <Button onClick={()=>{handlePrint()}}> Print </Button> */}
//       <Container >
//         <Card className="w-100">
//           <h1>Delivery Sheet</h1>
//           <Table columns={columns} dataSource={data} bordered />
//         </Card>
//       </Container>
//     </main>
//   );
// };

// export default CPage;


// import { Table, Card } from "antd";
// import React, { useState, useEffect } from "react";
// import { Container } from "react-bootstrap";

// const CPage = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const safeParse = (key) => {
//       try {
//         return JSON.parse(localStorage.getItem(key) || "[]");
//       } catch (error) {
//         console.error(`Error parsing ${key}:`, error);
//         return [];
//       }
//     };

//     const courierData = safeParse("courierData");
//     const riderData = safeParse("riderData");

//     // Combine courier and rider data
//     const combinedData = courierData.map((courier, index) => {
//       const rider = riderData.find((r) => r.riderName === courier.riderName);
//       return {
//         index: index + 1,
//         riderNameAndCn: `${courier.riderName} / ${courier.cnNumber}`,
//         receiverName: rider ? rider.receiverName : "N/A",
//       };
//     });

//     // Group data into pairs of two rows per table row
//     const groupedData = [];
//     for (let i = 0; i < combinedData.length; i += 2) {
//       groupedData.push({
//         key: i / 2 + 1,
//         index1: combinedData[i]?.index || "",
//         riderNameAndCn1: combinedData[i]?.riderNameAndCn || "",
//         receiverName1: combinedData[i]?.receiverName || "",
//         index2: combinedData[i + 1]?.index || "",
//         riderNameAndCn2: combinedData[i + 1]?.riderNameAndCn || "",
//         receiverName2: combinedData[i + 1]?.receiverName || "",
//       });
//     }

//     setData(groupedData);
//   }, []);

//   const columns = [
//     {
//       title: "Index ",
//       dataIndex: "index1",
//       key: "index1",
//     },
//     {
//       title: "Rider Name / CN Number ",
//       dataIndex: "riderNameAndCn1",
//       key: "riderNameAndCn1",
//     },
//     {
//       title: "Receiver Name ",
//       dataIndex: "",
//       key: "receiverName1",
//     },
//     {
//       title: "Index ",
//       dataIndex: "index2",
//       key: "index2",
//     },
//     {
//       title: "Rider Name / CN Number ",
//       dataIndex: "riderNameAndCn2",
//       key: "riderNameAndCn2",
//     },
//     {
//       title: "Receiver Name ",
//       dataIndex: "",
//       key: "receiverName2",
//     },
//   ];

//   return (
//     <main className="d-flex justify-content-center align-items-center mt-5" style={{ height: "100vh" }}>
//       <Container>
//         <Card className="w-100">
//           <h1>Delivery Sheet</h1>
//           <Table columns={columns} dataSource={data} bordered rowKey={(record) => record.key} />
//         </Card>
//       </Container>
//     </main>
//   );
// };

// export default CPage;


import { Table, Card } from "antd";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

const CPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const safeParse = (key) => {
      try {
        return JSON.parse(localStorage.getItem(key) || "[]");
      } catch (error) {
        console.error(`Error parsing ${key}:`, error);
        return [];
      }
    };

    const courierData = safeParse("courierData");
    const riderData = safeParse("riderData");

    // Combine courier and rider data
    const combinedData = courierData.map((courier, index) => {
      const rider = riderData.find((r) => r.riderName === courier.riderName);
      return {
        index: index + 1,
        riderName: courier.riderName,
        cnNumber: courier.cnNumber,
        receiverName: rider ? rider.receiverName : "N/A",
      };
    });

    // Group data into pairs of two rows per table row
    const groupedData = [];
    for (let i = 0; i < combinedData.length; i += 2) {
      groupedData.push({
        key: i / 2 + 1,
        index1: combinedData[i]?.index || "",
        riderName1: combinedData[i]?.riderName || "",
        cnNumber1: combinedData[i]?.cnNumber || "",
        receiverName1: combinedData[i]?.receiverName || "",
        index2: combinedData[i + 1]?.index || "",
        riderName2: combinedData[i + 1]?.riderName || "",
        cnNumber2: combinedData[i + 1]?.cnNumber || "",
        receiverName2: combinedData[i + 1]?.receiverName || "",
      });
    }

    setData(groupedData);
  }, []);

  const columns = [
    {
      title: "Index ",
      dataIndex: "index1",
      key: "index1",
    },
    {
      title: "Rider Name / CN Number ",
      key: "riderNameAndCn1",
      render: (text, record) => (
        <div>
          <strong>{record.riderName1}</strong>
          <br />
          {record.cnNumber1}
        </div>
      ),
    },
    {
      title: "Receiver Name ",
      dataIndex: "receiverName1",
      key: "receiverName1",
    },
    {
      title: "Index ",
      dataIndex: "index2",
      key: "index2",
    },
    {
      title: "Rider Name / CN Number ",
      key: "riderNameAndCn2",
      render: (text, record) => (
        <div>
          <strong>{record.riderName2}</strong>
          <br />
          {record.cnNumber2}
        </div>
      ),
    },
    {
      title: "Receiver Name ",
      dataIndex: "receiverName2",
      key: "receiverName2",
    },
  ]
  return (
    <main className="d-flex justify-content-center align-items-center " style={{ height: "100vh" }}>
      <Container>
        <h1>Delivery Sheet</h1>
        <Card className="w-100">
          <Table columns={columns} dataSource={data} bordered rowKey={(record) => record.key} />
        </Card>
      </Container>
    </main>
  );
};

export default CPage;
