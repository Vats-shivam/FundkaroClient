"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts"

const EMIGraph = ({ graphData, totalPrincipal, totalInterest }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [viewType, setViewType] = useState("distribution")

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)

  // Data for the principal vs interest pie chart
  const distributionData = [
    { name: "Principal", value: totalPrincipal, fill: "#0E2C86" },
    { name: "Interest", value: totalInterest, fill: "#4169E1" },
  ]

  // Data for monthly payment breakdown (last month)
  const lastMonth = graphData[graphData.length - 1]
  const monthlyData = lastMonth
    ? [
        {
          name: "Principal",
          value: Number.parseFloat(lastMonth.emi) - Number.parseFloat(lastMonth.interest),
          fill: "#10B981",
        },
        { name: "Interest", value: Number.parseFloat(lastMonth.interest), fill: "#F59E0B" },
      ]
    : []

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333" className="text-lg font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#333" className="text-lg font-bold">
          {formatCurrency(value)}
        </text>
        <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#333" className="text-sm">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    )
  }

  return (
    <div className="my-8">
      <div className="bg-white shadow-primaryShadow rounded-lg p-4">
        <h2 className="text-center text-xl font-semibold mb-4">
          {viewType === "distribution" ? "Total Payment Distribution" : "Monthly Payment Breakdown"}
        </h2>
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`py-2 px-4 rounded font-bold transition-colors duration-300 ${
              viewType === "distribution" ? "bg-lightPrimary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setViewType("distribution")}
          >
            Total Distribution
          </button>
          <button
            className={`py-2 px-4 rounded font-bold transition-colors duration-300 ${
              viewType === "monthly" ? "bg-lightPrimary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setViewType("monthly")}
          >
            Monthly Breakdown
          </button>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={viewType === "distribution" ? distributionData : monthlyData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {(viewType === "distribution" ? distributionData : monthlyData).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-8 mt-4">
          {(viewType === "distribution" ? distributionData : monthlyData).map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4 h-4" style={{ backgroundColor: entry.fill }}></div>
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EMIGraph

