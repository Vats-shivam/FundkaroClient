"use client"

import { useState, useEffect } from "react"
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image, pdf, Font } from "@react-pdf/renderer"
import * as XLSX from "xlsx"
import EMIBreakdown from "./EMIBreakdown"
import EMIGraph from "./EMIGraph"
import EMISummary from "./EMISummary"
import companyLogo from "../assets/fundkaro.svg"
import rupeeFont from "../assets/rupee.ttf"

const EMICalculator = () => {
  // Default values from the PDF data
  const [loanType, setLoanType] = useState("Personal Loan")
  const [loanAmount, setLoanAmount] = useState(3000000)
  const [interestRate, setInterestRate] = useState(22.25)
  const [tenure, setTenure] = useState(24)
  const [tenureUnit, setTenureUnit] = useState("months")
  const [emiType, setEmiType] = useState("Reducing")
  const [breakdownData, setBreakdownData] = useState([])
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [totalPrincipal, setTotalPrincipal] = useState(0)
  const [graphData, setGraphData] = useState([])
  const [emi, setEMI] = useState(0)

  useEffect(() => {
    calculateEMI()
  }, [loanAmount, interestRate, tenure, tenureUnit, emiType])

  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100
    const tenureInMonths = tenureUnit === "years" ? tenure * 12 : tenure
    let emiValue, totalInterestValue, breakdown, graph

    if (emiType === "Flat") {
      ;[emiValue, totalInterestValue, breakdown, graph] = calculateFlatEMI(monthlyRate, tenureInMonths)
    } else {
      ;[emiValue, totalInterestValue, breakdown, graph] = calculateReducingEMI(monthlyRate, tenureInMonths)
    }

    setEMI(emiValue)
    setTotalInterest(Math.ceil(totalInterestValue))
    setTotalPayment(Math.ceil(Number(loanAmount) + Number(totalInterestValue)))
    setTotalPrincipal(loanAmount)
    setBreakdownData(breakdown)
    setGraphData(graph)
  }

  const calculateFlatEMI = (monthlyRate, tenureInMonths) => {
    // For flat rate, interest is calculated on the full principal for the entire period
    const totalInterest = (loanAmount * (interestRate / 100) * (tenureInMonths / 12))
    const totalAmount = Number(loanAmount) + totalInterest
    const emi = totalAmount / tenureInMonths

    const breakdown = []
    const graph = []
    let remainingBalance = loanAmount
    let totalPaid = 0

    for (let i = 0; i < tenureInMonths; i++) {
      const monthlyInterest = totalInterest / tenureInMonths
      const monthlyPrincipal = loanAmount / tenureInMonths
      remainingBalance -= monthlyPrincipal
      totalPaid += emi

      breakdown.push({
        month: i + 1,
        principal: monthlyPrincipal,
        interest: monthlyInterest,
        balance: Math.max(0, remainingBalance),
        totalAmount: emi
      })

      graph.push({
        month: i + 1,
        totalPaid,
        emi,
        interest: monthlyInterest
      })
    }

    return [emi, totalInterest, breakdown, graph]
  }

  const calculateReducingEMI = (monthlyRate, tenureInMonths) => {
    // For reducing balance, EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = loanAmount * monthlyRate *
      (Math.pow(1 + monthlyRate, tenureInMonths)) /
      (Math.pow(1 + monthlyRate, tenureInMonths) - 1)

    const breakdown = []
    const graph = []
    let remainingBalance = loanAmount
    let totalPaid = 0
    let totalInterest = 0

    for (let i = 0; i < tenureInMonths; i++) {
      const monthlyInterest = remainingBalance * monthlyRate
      const monthlyPrincipal = emi - monthlyInterest
      remainingBalance = Math.max(0, remainingBalance - monthlyPrincipal)
      totalPaid += emi
      totalInterest += monthlyInterest

      breakdown.push({
        month: i + 1,
        year: Math.ceil((i + 1) / 12),
        principal: monthlyPrincipal,
        interest: monthlyInterest,
        balance: remainingBalance,
        totalAmount: emi
      })

      graph.push({
        month: i + 1,
        totalPaid,
        emi,
        interest: monthlyInterest
      })
    }

    return [emi, totalInterest, breakdown, graph]
  }

  const exportToPDF = async () => {
    Font.register({
      family: "Rupee",
      src: rupeeFont
    })
    let logoBase64 = companyLogo;
    const convertImageToBase64 = (imageFile) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
    };

    // If companyLogo is a file/blob, convert it to base64
    if (companyLogo instanceof File || companyLogo instanceof Blob) {
      logoBase64 = await convertImageToBase64(companyLogo);
    }
    const styles = StyleSheet.create({
      page: {
        padding: 0,
        fontSize: 11,
        backgroundColor: "#FFFFFF",
        fontFamily: 'Helvetica'
      },

      // Header Section
      headerContainer: {
        backgroundColor: "#1e40af",
        padding: 25,
        marginBottom: 20
      },
      headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      },
      logoSection: {
        flexDirection: "row",
        alignItems: "center"
      },
      logo: {
        width: 60,
        height: 60,
        marginRight: 15,
        borderRadius: 8
      },
      companyInfo: {
        color: "#FFFFFF"
      },
      companyName: {
        fontSize: 20,
        fontFamily: "Rupee",
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 2
      },
      documentTitle: {
        fontSize: 14,
        color: "#e2e8f0",
        fontWeight: "normal"
      },
      dateSection: {
        alignItems: "flex-end"
      },
      dateLabel: {
        fontSize: 10,
        color: "#cbd5e1",
        marginBottom: 2
      },
      dateValue: {
        fontSize: 12,
        color: "#FFFFFF",
        fontWeight: "bold"
      },

      // Content Container
      contentContainer: {
        paddingHorizontal: 25,
        paddingBottom: 25
      },

      // Loan Summary Card
      summaryCard: {
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: 20,
        marginBottom: 25
      },
      summaryTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1e293b",
        marginBottom: 15,
        textAlign: "center"
      },
      summaryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
      },
      summaryItem: {
        width: "48%",
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      },
      summaryLabel: {
        fontSize: 11,
        color: "#64748b",
        fontWeight: "500"
      },
      summaryValue: {
        fontSize: 12,
        color: "#1e293b",
        fontWeight: "bold"
      },
      summaryHighlight: {
        backgroundColor: "#dbeafe",
        padding: 8,
        borderRadius: 4,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      },
      highlightLabel: {
        fontSize: 12,
        color: "#1e40af",
        fontWeight: "bold"
      },
      highlightValue: {
        fontSize: 14,
        color: "#1e40af",
        fontWeight: "bold"
      },

      // Table Section
      tableSection: {
        marginTop: 10
      },
      tableTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1e293b",
        marginBottom: 15,
        textAlign: "center"
      },
      tableContainer: {
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        overflow: "hidden"
      },
      tableHeader: {
        flexDirection: "row",
        backgroundColor: "#1e40af",
        padding: 12
      },
      tableCellHeader: {
        flex: 1,
        fontSize: 11,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center"
      },
      tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid #e2e8f0",
        padding: 10,
        backgroundColor: "#FFFFFF"
      },
      tableRowAlternate: {
        flexDirection: "row",
        borderBottom: "1px solid #e2e8f0",
        padding: 10,
        backgroundColor: "#f8fafc"
      },
      tableCell: {
        flex: 1,
        fontSize: 10,
        color: "#374151",
        textAlign: "center"
      },
      tableCellBold: {
        flex: 1,
        fontSize: 10,
        color: "#1e293b",
        textAlign: "center",
        fontWeight: "bold"
      },

      // Footer
      footer: {
        position: "absolute",
        bottom: 20,
        left: 25,
        right: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 15,
        borderTop: "1px solid #e2e8f0"
      },
      footerText: {
        fontSize: 9,
        color: "#64748b"
      },
      footerBold: {
        fontSize: 9,
        color: "#1e293b",
        fontWeight: "bold"
      },

      // Page break styling for large tables
      pageBreakAvoid: {
        breakInside: "avoid"
      }
    });

    const formatCurrency = (amount) => {
      return `R${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
    };

    const getCurrentDate = () => {
      return new Date().toLocaleDateString("en-IN", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const MyDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Professional Header */}
          <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
              <View style={styles.logoSection}>
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>fundkaRo</Text>
                  <Text style={styles.documentTitle}>Loan EMI Schedule Report</Text>
                </View>
              </View>
              <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>Generated on</Text>
                <Text style={styles.dateValue}>{getCurrentDate()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.contentContainer}>
            {/* Loan Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Loan Summary</Text>

              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Loan Amount:</Text>
                  <Text style={[styles.summaryValue, { fontFamily: 'Rupee' }]}>{formatCurrency(loanAmount)}</Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Interest Rate:</Text>
                  <Text style={styles.summaryValue}>{interestRate}% p.a.</Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Loan Tenure:</Text>
                  <Text style={styles.summaryValue}>{tenure} {tenureUnit}</Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>EMI Type:</Text>
                  <Text style={styles.summaryValue}>{emiType}</Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Interest:</Text>
<Text style={[styles.summaryValue, { fontFamily: 'Rupee' }]}>{formatCurrency(totalInterest)}</Text>
</View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Payment:</Text>
                  <Text style={[styles.summaryValue, { fontFamily: 'Rupee' }]}>{formatCurrency(totalPayment)}</Text>
                </View>
              </View>

              <View style={styles.summaryHighlight}>
                <Text style={styles.highlightLabel}>Monthly EMI Amount:</Text>
                <Text style={[styles.highlightValue, { fontFamily: 'Rupee' }]}>{formatCurrency(emi)}</Text>
              </View>
            </View>

            {/* EMI Breakdown Table */}
            <View style={styles.tableSection}>
              <Text style={styles.tableTitle}>Monthly EMI Breakdown</Text>

              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableCellHeader}>Month</Text>
                  <Text style={styles.tableCellHeader}>EMI Amount</Text>
                  <Text style={styles.tableCellHeader}>Interest</Text>
                  <Text style={styles.tableCellHeader}>Principal</Text>
                  <Text style={styles.tableCellHeader}>Outstanding</Text>
                </View>

                {breakdownData.map((row, index) => (
                  <View
                    key={index}
                    style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}
                  >
                    <Text style={styles.tableCellBold}>{row.month}</Text>
                    <Text style={[styles.tableCell, { fontFamily: 'Rupee' }]}>{formatCurrency(row.totalAmount)}</Text>
                    <Text style={[styles.tableCell, { fontFamily: 'Rupee' }]}>{formatCurrency(row.interest)}</Text>
                    <Text style={[styles.tableCell, { fontFamily: 'Rupee' }]}>{formatCurrency(row.principal)}</Text>
                    <Text style={[styles.tableCell, { fontFamily: 'Rupee' }]}>{formatCurrency(row.balance)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Professional Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              This document is computer-generated and does not require a signature.
            </Text>
            <Text style={styles.footerBold}>
              Page 1 of 1
            </Text>
          </View>
        </Page>
      </Document>
    );
    try {
      const blob = await pdf(MyDocument()).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `EMI_Schedule_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      // Optional: Return success status
      return { success: true, message: "PDF downloaded successfully" };
    } catch (error) {
      console.error('Error generating PDF:', error);
      return { success: false, message: "Failed to generate PDF", error };
    }

    // return (
    //   <PDFDownloadLink document={<MyDocument />} fileName="emi_schedule.pdf">
    //     {({ loading }) => (
    //       <button disabled={loading} className="bg-lightPrimary hover:bg-darkPrimary text-white font-bold py-2 px-4 rounded">
    //         {loading ? "Preparing PDF..." : "Download EMI Schedule"}
    //       </button>
    //     )}
    //   </PDFDownloadLink>
    // );
  };

  //   return (
  //     <div>{exportToPDF()}</div>
  //   );
  // };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(breakdownData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "EMI Breakdown")
    XLSX.writeFile(wb, "emi_breakdown.xlsx")
  }


  return (
    <div id="d-tools" className="container mx-auto px-4 py-8 font-primaryFont">
      <div className="bg-white shadow-primaryShadow rounded-lg">
        <div className="bg-gray-50 rounded-t-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-darkPrimary">EMI Calculator</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Loan Type:</span>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1"
              >
                <option value="Home Loan">Home Loan</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Business Loan">Business Loan</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Loan Amount (₹)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tenure</label>
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tenure Unit</label>
              <select
                value={tenureUnit}
                onChange={(e) => setTenureUnit(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">EMI Type</label>
              <select
                value={emiType}
                onChange={(e) => setEmiType(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="Reducing">Reducing</option>
                <option value="Flat">Flat</option>
              </select>
            </div>
          </div>

          <EMISummary
            emi={emi}
            totalInterest={totalInterest}
            totalPayment={totalPayment}
            totalPrincipal={totalPrincipal}
          />

          <EMIGraph graphData={graphData} totalPrincipal={totalPrincipal} totalInterest={totalInterest} />

          <EMIBreakdown viewType={tenureUnit} breakdownData={breakdownData} />

          <div className="flex flex-wrap justify-center gap-4 mt-8">

            <button onClick={exportToPDF} className="bg-lightPrimary hover:bg-darkPrimary text-white font-bold py-2 px-4 rounded">
              Download EMI Schedule
            </button>
            <button
              onClick={exportToExcel}
              className="bg-lightPrimary hover:bg-darkPrimary text-white font-bold py-2 px-4 rounded transition-colors duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              Export to Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
})

export default EMICalculator

