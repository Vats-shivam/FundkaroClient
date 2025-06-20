"use client"

import { useState } from "react"

const EMIBreakdown = ({ viewType, breakdownData }) => {
  const [expanded, setExpanded] = useState(false)

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)

  // Convert monthly data to yearly breakdown
  const getYearlyBreakdown = () => {
    const yearlyData = []
    let currentYear = 1
    let yearlyPrincipal = 0
    let yearlyInterest = 0
    let yearlyTotal = 0

    breakdownData.forEach((data, index) => {
      yearlyPrincipal += data.principal
      yearlyInterest += data.interest
      yearlyTotal += data.totalAmount

      if ((index + 1) % 12 === 0 || index === breakdownData.length - 1) {
        yearlyData.push({
          year: currentYear,
          principal: yearlyPrincipal,
          interest: yearlyInterest,
          totalAmount: yearlyTotal,
          balance: data.balance
        })
        currentYear++
        yearlyPrincipal = 0
        yearlyInterest = 0
        yearlyTotal = 0
      }
    })
    return yearlyData
  }
  console.log(viewType)
  const displayedData = viewType === "years" ? getYearlyBreakdown() : breakdownData

  return (
    <div className="mt-8 bg-white rounded-lg p-4 shadow-primaryShadow">
      <h2 className="text-center font-semibold text-xl mb-4">EMI Breakdown</h2>
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="bg-lightPrimary hover:bg-darkPrimary text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          {expanded ? "Hide Details" : "See Detailed View"}
        </button>

        {/* {expanded && (
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          >
            <option value="months">Monthly Breakdown</option>
            <option value="years">Yearly Breakdown</option>
          </select>
        )} */}
      </div>

      {expanded && (
        <div className="overflow-x-auto flex flex-col items-start gap-4">

          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-center py-3 px-4 font-semibold">{viewType === "years" ? "Year" : "Month"}</th>
                <th className="text-center py-3 px-4 font-semibold">Principal (₹)</th>
                <th className="text-center py-3 px-4 font-semibold">Interest (₹)</th>
                <th className="text-center py-3 px-4 font-semibold">Total Amount (₹)</th>
                <th className="text-center py-3 px-4 font-semibold">Balance (₹)</th>
              </tr>
            </thead>

              <tbody className="relative">
                
                {displayedData.slice(0, 5).map((data, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="text-center py-2 px-4 border-b">{viewType === "years" ? data.year : data.month}</td>
                    <td className="text-center py-2 px-4 border-b">{formatCurrency(data.principal)}</td>
                    <td className="text-center py-2 px-4 border-b">{formatCurrency(data.interest)}</td>
                    <td className="text-center py-2 px-4 border-b">{formatCurrency(data.totalAmount)}</td>
                    <td className="text-center py-2 px-4 border-b">{formatCurrency(data.balance)}</td>
                  </tr>
                ))}
                {displayedData.length > 5 && (
                  <>
                    {/* <div className="pointer-events-none absolute flex items-center justify-center w-full h-24 bg-white/70">
                      <div className="z-50 text-red-300 px-4 py-2 align-middle rounded shadow-md text-sm font-medium">
                        Check the complete breakdown, download the schedule
                      </div>
                    </div> */}

    {displayedData.length > 5 &&
    displayedData.slice(5, 10).map((data, index) => (
      <tr key={index + 5} className={`${(index + 5) % 2 === 0 ? "bg-gray-50" : "bg-white"}  relative`}>
        <td className="text-center py-2 px-4 border-b relative z-10 blur-[2px]">
          {viewType === "yearly" ? data.year : data.month}
        </td>
        <td className="text-center py-2 px-4 border-b relative z-10 blur-[2px]">{formatCurrency(data.principal)}</td>
        <td className="text-center py-2 px-4 border-b relative z-10 blur-[2px]">{formatCurrency(data.interest)}</td>
        <td className="text-center py-2 px-4 border-b relative z-10 blur-[2px]">{formatCurrency(data.totalAmount)}</td>
        <td className="text-center py-2 px-4 border-b relative z-10 blur-[2px]">{formatCurrency(data.balance)}</td>
                      {/* Only render overlay once on the first row of blurred content */}
        {index === 0 && (
          <td colSpan={5} className="absolute inset-0 flex justify-center items-center z-50 w-full h-24 pointer-events-none">
            <div className=" text-red-500 bg-gray-300 px-4 py-2 align-middle rounded shadow-md text-sm font-bold">
              Check the complete breakdown, download the schedule
            </div>
          </td>
        )}
                    </tr>
                  ))}
                  </>
)}
              </tbody>

          </table>
        </div>
      )}
    </div>
  )
}

export default EMIBreakdown
