/* eslint-disable no-unused-vars */
// QuotationPDF.js
import React, { useState } from 'react';
import { Page, Text, View, Document, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer';
import { Button, Modal, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
// import { FileTextFilled } from '@ant-design/icons';
Font.register({
  family: 'Arial',
  fonts: [
    { src: `${window.location.origin}/arial-font/G_ari_bd.TTF`, fontWeight: 'bold' },
    { src: `${window.location.origin}/arial-font/arial.ttf`, fontWeight: 'normal' },
  ]
});
// const styles = StyleSheet.create({
//   page: { paddingHorizontal: "10px", paddingTop: 8, marginTop: "8px", fontFamily: 'Helvetica' },
//   container: { border: 1, borderColor: '#000000', marginTop: 8 },
//   header: { flexDirection: 'row', borderBottom: 1, borderColor: '#000000', padding: 4 },
//   title: { textAlign: 'center', fontSize: 9, fontFamily: 'Arial', fontWeight: "bold" },
//   infoRow: { flexDirection: 'row', borderBottom: 1, borderColor: '#000000' },
//   infoCol: { flex: 1, padding: 4, borderRight: 1, borderColor: '#000000' },
//   infoCol3: { textAlign: "center" },
//   infoColLast: { flex: 1, padding: 4 },
//   infoBox: { width: "100px" },
//   label: { fontSize: 9, fontFamily: 'Arial', fontWeight: "bold" },
//   value: { fontSize: 9, flexDirection: "column" },
//   addressSection: { flexDirection: 'row', borderBottom: 1, borderColor: '#000000' },
//   addressCol: { flex: 1, padding: 6, borderRight: 1, borderColor: '#000000' },
//   addressCALL: { alignItems: "flex-end", fontWeight: "bold" },
//   addressColLast: { flex: 1, padding: 4 },
//   addressBox: { border: 1, borderColor: '#000000', padding: 2, marginTop: 4 },
//   detailsRow: { flexDirection: 'row', borderBottom: 1, borderColor: '#000000' },
//   detailCol: { flex: 1, padding: 3, borderRight: 1, borderColor: '#000000' },
//   detailColLast: { flex: 1, padding: 5 },
//   remarks: { padding: 4 },
//   veiwTitle: { fontSize: 11, border: "1px solid black", textAlign: "center", family: 'Arial', fontWeight: "bold", },
//   veiwTitl: { fontSize: 9, border: "1px solid black", textAlign: "center", family: 'Arial', fontWeight: "bold" },
//   veiwText: { fontSize: 7, lineHeight: "12px", padding: 3, textAlign: "justify", border: "1px solid black" },
//   veiwItlic: { fontSize: "12px", },
//   terms: { fontSize: 9, textAlign: 'justify', borderColor: '#000000', padding: 4 }
// });

const styles = StyleSheet.create({
  page: { paddingHorizontal: "10px", paddingTop: 8, marginTop: "8px", fontFamily: 'Helvetica' },
  container: { borderWidth: 1, borderColor: '#000000', borderStyle: 'solid', marginTop: 8 },
  header: { flexDirection: 'row', borderBottom: "1px solid", borderColor: '#000000', padding: 4 },
  title: { textAlign: 'center', fontSize: 9, fontFamily: 'Arial', fontWeight: "bold" },
  infoRow: { flexDirection: 'row', borderBottom: "1px solid", borderColor: '#000000' },
  infoCol: { flex: 1, padding: 4, borderRight: "1px solid", borderColor: '#000000' },
  infoCol3: { textAlign: "center" },
  infoColLast: { flex: 1, padding: 4 },
  infoBox: { width: "100px" },
  label: { fontSize: 9, fontFamily: 'Arial', fontWeight: "bold" },
  value: { fontSize: 9, flexDirection: "column" },
  addressSection: { flexDirection: 'row', borderBottom: "1px solid", borderColor: '#000000' },
  addressCol: { flex: 1, padding: 6, borderRight: "1px solid", borderColor: '#000000' },
  addressCALL: { alignItems: "flex-end", fontWeight: "bold" },
  addressColLast: { flex: 1, padding: 4 },
  addressBox: { borderWidth: 1, borderColor: '#000000', borderStyle: 'solid', padding: 2, marginTop: 4 },
  detailsRow: { flexDirection: 'row', borderBottom: "1px solid", borderColor: '#000000' },
  detailCol: { flex: 1, padding: 3, borderRight: "1px solid", borderColor: '#000000' },
  detailColLast: { flex: 1, padding: 5 },
  remarks: { padding: 4 },
  veiwTitle: { fontSize: 11, border: "1px solid black", textAlign: "center", family: 'Arial', fontWeight: "bold" },
  veiwTitl: { fontSize: 9, border: "1px solid black", textAlign: "center", family: 'Arial', fontWeight: "bold" },
  veiwText: { fontSize: 7, lineHeight: "12px", padding: 3, textAlign: "justify", border: "1px solid black" },
  veiwItlic: { fontSize: "12px" },
  terms: { fontSize: 9, textAlign: 'justify', borderColor: '#000000', padding: 4 }
});
const QuotationPDF = ({ form }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Image src="Assets/naveed2.png" style={{ height: 55, width: 186 }} />
          </View>
          <View style={styles.infoCol}>
            <View  >
              <Text>Consignment Note:</Text>
              <Text style={styles.infoCol3}>{form.cnNumber}</Text>
            </View>
          </View>
          <View style={styles.infoColLast}>
            <Text style={styles.label}>Booking Date:</Text>
            <Text style={styles.value}>{form.date}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.label}>Origin:</Text>
            <Text style={styles.value}>{form.origin}</Text>
          </View>
          <View style={styles.infoColLast}>
            <Text style={styles.label}>Destination:</Text>
            <Text style={styles.value}>{form.destination}</Text>
          </View>
        </View>
        <View style={styles.addressSection}>
          <View style={styles.addressCol}>
            <Text style={styles.label}>Shipper:</Text>
            <View>
              <Text style={styles.value}>{form.shipperName}</Text>
              <Text style={styles.value}>{form.trackingId}</Text>
            </View>
            <View style={styles.addressCALL}>
              <Text style={styles.value}>{form.contact}</Text>
            </View>
          </View>
          <View style={styles.addressCol}>
            <Text style={styles.label}>Consignee:</Text>
            <View>
              <Text style={styles.value}>{form.consignee}</Text>
              <Text style={styles.value}>{form.consigneeAddress}</Text>
            </View>
            <View style={styles.addressCALL}>
              <Text style={styles.value}>{form.consigneeContact}</Text>
            </View>
          </View>
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.detailCol}>
            <Text style={styles.label}>Piece:</Text>
            <Text style={styles.value}>{form.pieces}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.label}>Weight:</Text>
            <Text style={styles.value}>{form.weight}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{form.description}</Text>
          </View>
          <View style={styles.detailColLast}>
            <Text style={styles.label}>Cash Collect:</Text>
            <Text style={styles.value}>Rs.{form.amount}</Text>
          </View>
        </View>
        <View style={styles.detailsRow}>
          {/* <View style={styles.detailCol}> */}
          {/* <View style={styles.detailColLast}>
            <Text style={styles.label}>Remarks:</Text>
          </View> */}
          <View style={styles.detailColLast}>
            <View>
              <Text style={styles.label}>
                HelpLine Number:  <Text>03247170308
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Image src="Assets/naveed2.png" style={{ height: 55, width: 186 }} />
          </View>
          <View style={styles.infoCol}>
            <View  >
              <Text>Consignment Note:</Text>
              <Text style={styles.infoCol3}>{form.cnNumber}</Text>
            </View>
          </View>
          <View style={styles.infoColLast}>
            <Text style={styles.label}>Booking Date:</Text>
            <Text style={styles.value}>{form.date}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.label}>Origin:</Text>
            <Text style={styles.value}>{form.origin}</Text>
          </View>
          <View style={styles.infoColLast}>
            <Text style={styles.label}>Destination:</Text>
            <Text style={styles.value}>{form.destination}</Text>
          </View>
        </View>
        <View style={styles.addressSection}>
          <View style={styles.addressCol}>
            <Text style={styles.label}>Shipper:</Text>
            <View>
              <Text style={styles.value}>{form.shipperName}</Text>
              <Text style={styles.value}>{form.trackingId}</Text>
            </View>
            <View style={styles.addressCALL}>
              <Text style={styles.value}>{form.contact}</Text>
            </View>
          </View>
          <View style={styles.addressCol}>
            <Text style={styles.label}>Consignee:</Text>
            <View>
              <Text style={styles.value}>{form.consignee}</Text>
              <Text style={styles.value}>{form.consigneeAddress}</Text>
            </View>
            <View style={styles.addressCALL}>
              <Text style={styles.value}>{form.consigneeContact}</Text>
            </View>
          </View>
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.detailCol}>
            <Text style={styles.label}>Piece:</Text>
            <Text style={styles.value}>{form.pieces}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.label}>Weight:</Text>
            <Text style={styles.value}>{form.weight}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{form.description}</Text>
          </View>
          <View style={styles.detailColLast}>
            <Text style={styles.label}>Cash Collect:</Text>
            <Text style={styles.value}>Rs.{form.amount}</Text>
          </View>
        </View>
        <View style={styles.detailsRow}>
          {/* <View style={styles.detailCol}> */}
          {/* <View style={styles.detailColLast}>
            <Text style={styles.label}>Remarks:</Text>
          </View> */}
          <View style={styles.detailColLast}>
            <View>
              <Text style={styles.label}>
                HelpLine Number:  <Text>03247170308
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Image src="Assets/naveed2.png" style={{ height: 55, width: 186 }} />
          </View>
          <View style={styles.infoCol}>
            <View  >
              <Text>Consignment Note:</Text>
              <Text style={styles.infoCol3}>{form.cnNumber}</Text>
            </View>
          </View>
          <View style={styles.infoColLast}>
            <Text style={styles.label}>Booking Date:</Text>
            <Text style={styles.value}>{form.date}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.label}>Origin:</Text>
            <Text style={styles.value}>{form.origin}</Text>
          </View>
          <View style={styles.infoColLast}>
            <Text style={styles.label}>Destination:</Text>
            <Text style={styles.value}>{form.destination}</Text>
          </View>
        </View>
        <View style={styles.addressSection}>
          <View style={styles.addressCol}>
            <Text style={styles.label}>Shipper:</Text>
            <View>
              <Text style={styles.value}>{form.shipperName}</Text>
              <Text style={styles.value}>{form.trackingId}</Text>
            </View>
            <View style={styles.addressCALL}>
              <Text style={styles.value}>{form.contact}</Text>
            </View>
          </View>
          <View style={styles.addressCol}>
            <Text style={styles.label}>Consignee:</Text>
            <View>
              <Text style={styles.value}>{form.consignee}</Text>
              <Text style={styles.value}>{form.consigneeAddress}</Text>
            </View>
            <View style={styles.addressCALL}>
              <Text style={styles.value}>{form.consigneeContact}</Text>
            </View>
          </View>
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.detailCol}>
            <Text style={styles.label}>Piece:</Text>
            <Text style={styles.value}>{form.pieces}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.label}>Weight:</Text>
            <Text style={styles.value}>{form.weight}</Text>
          </View>
          <View style={styles.detailCol}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{form.description}</Text>
          </View>
          <View style={styles.detailColLast}>
            <Text style={styles.label}>Cash Collect:</Text>
            <Text style={styles.value}>Rs.{form.amount}</Text>
          </View>
        </View>
        <View style={styles.detailsRow}>
          {/* <View style={styles.detailCol}> */}
          {/* <View style={styles.detailColLast}>
            <Text style={styles.label}>Remarks:</Text>
          </View> */}
          <View style={styles.detailColLast}>
            <View>
              <Text style={styles.label}>
                HelpLine Number:  <Text>03247170308
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.terms}>
        <Text style={styles.veiwTitle}>TERMS AND CONDITION</Text>
        <View style={styles.veiwText}>
          <Text>
            1. When ordering Naveed Courier (A UNS Ltd. Company) services you, as 'Shipper', are agreeing, on your behalf and on behalf of anyone else with an interest in the Shipment that the Terms and Conditions shall apply from
            the time that Naveed Courier accepts the Shipment unless otherwise agreed in writing by an authorized officer of Naveed Courier. A 'waybill' shall include any label produced by Naveed Courier's automated systems, air waybill, or consignment
            note and shall incorporate these Every Shipment is transported on a limited liability basis as provided herein 'Naveed Courier' means any member of the UNS Network. {"\n"}
            2. Unacceptable Shipments: Shipper agrees that its Shipment is acceptable for transportation and is deemed unacceptable if:{"\n"}
            • It is classified as hazardous material, dangerous goods, prohibited or restricted articles by IATA (International Air Transport Association), ICAO (International Civil Aviation Organization), any applicable government
            department or other relevant organization;{"\n"}
            • No customs declaration is made when required by applicable customs regulations; or {"\n"}
            3. Deliveries & Un-deliverables: Shipments cannot be delivered to PO boxes or postal codes. Shipments are delivered to the Receiver's address given by Shipper (which in the case of mail services shall be deemed to
            be the first receiving postal service) but not necessarily to the named Receiver personally. {"\n"}
            4. Inspection & Liability: Naveed Courier has the right to open and inspect a Shipment without prior notice to Shipper. Naveed Courier liability for loss, pilferage, damage or delay of shipments is limited to Rs.100/= (Rupees One
            Hundred only) per domestic consignment and Rs. 1,500/= (Rupees Fifteen Hundred only) per international consignment. No claim will be entertained by Naveed Courier exceeding these amounts.
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);


// const QuotationGenerator = ({ form, handleAddCourier }) => {
//   const generatePDF = async () => {
//     const doc = <QuotationPDF form={form} />;
//     const pdfBlob = await pdf(doc).toBlob(); // Generate the PDF as a blob
//     const url = URL.createObjectURL(pdfBlob); // Create a downloadable URL
//     const a = document.createElement("a"); // Create an anchor tag
//     a.href = url;
//     a.download = `${form.date}_${form.consignee}`; // Set the filename
//     document.body.appendChild(a);
//     a.click(); // Trigger the download
//     document.body.removeChild(a); // Remove the element after download
//     URL.revokeObjectURL(url); // Clean up the URL object
//     handleAddCourier()
//   };
//   return (
//     <div>
//       <Button 
//         className='p-3 border-0 text-light'
//         style={{backgroundColor:"#240b36"}}
//         onClick={() => {
//           const pdfBlob = pdf(<QuotationPDF form={form} />).toBlob();
//           pdfBlob.then(blob => {
//             const url = URL.createObjectURL(blob);
//             window.open(url, '_blank');
//           });
//         }}>
//         <EyeOutlined />
//       </Button>
//       <Button onClick={generatePDF} style={{backgroundColor:"#333333"}} className="w-auto text-light ms-1 mt-2 p-3 "> Save & Save as Print </Button>
//     </div>
//   );
// };

const QuotationGenerator = ({ form, handleAddCourier }) => {
  const [isloading, setIsLoading] = useState(false);

  const generatePDF = async () => {
    setIsLoading(true); // Show loading message

    const doc = <QuotationPDF form={form} />;
    const pdfBlob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(pdfBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.date}_${form.consignee}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    handleAddCourier(); // Call your function after saving
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };


  return (
    <div>
      {/* Button to Preview PDF */}
      <Button
        className="p-3 border-0 text-light"
        style={{ backgroundColor: "#240b36" }}
        onClick={() => {
          const pdfBlob = pdf(<QuotationPDF form={form} />).toBlob();
          pdfBlob.then(blob => {
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
          });
        }}
      >
        <EyeOutlined />
      </Button>

      {/* Button to Save & Print */}
      <Button
        onClick={generatePDF}
        loading={isloading}
        style={{ backgroundColor: "#333333" }}
        className="w-auto text-light ms-1 mt-2 p-3"
      >
        Save & Save as Print
      </Button>

    </div>
  );
};
export default QuotationGenerator;