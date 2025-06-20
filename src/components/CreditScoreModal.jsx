import React, { useEffect, useState } from 'react'
import GaugeChart from 'react-gauge-chart'
import { ArrowLeft, X } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

function MetricCard({ title, value, status }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-2">
      <h3 className="text-gray-800 font-medium text-sm sm:text-base">{title}</h3>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
      <span className="text-emerald-500 font-medium">{status}</span>
    </div>
  )
}

function calculateAge(dateString) {
    console.log(dateString)
    if(!dateString){
        return "N/A"
    }
    // Parse the input date string into a Date object
    const inputDate = new Date(dateString);
    const currentDate = new Date();
  
    // Validate the input date
    if (isNaN(inputDate.getTime())) {
      throw new Error("Invalid date string provided.");
    }
  
    // Calculate the difference in years and months
    let years = currentDate.getFullYear() - inputDate.getFullYear();
    let months = currentDate.getMonth() - inputDate.getMonth();
  
    // Adjust if the current month is earlier than the input date's month
    if (months < 0) {
      years--;
      months += 12;
    }
  
    return `${years} years and ${months} months`;
  }

function CreditScoreModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const [creditData,setCreditData] = useState(null);
  const [score, setScore] = useState();
  const fetchReport=async()=>{
    try{
        const {data} = await axios.get("api/profiles/cibil",{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        console.log(data)
        setCreditData(data.data)
        toast.success("hurray")
    }catch(error){
        toast.error(error.message);
    }
  }  
  useEffect(()=>{
    fetchReport();
  },[])

  useEffect(()=>{
    setScore(parseInt(creditData?.creditScore))
  },[creditData])

  const getCreditScoreStatus = (score) => {
    if (score >= 750) return 'Excellent'
    if (score >= 700) return 'Very Good'
    if (score >= 650) return 'Good'
    if (score >= 600) return 'Fair'
    return 'Poor'
  }
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-50 w-full max-w-2xl rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">My Credit Score</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Credit Score Gauge */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-full max-w-md mx-auto">
              <GaugeChart
                id="credit-score-gauge"
                nrOfLevels={5}
                colors={['#FF4B4B', '#FF9618', '#FFCD56', '#7CD992', '#00C48C']}
                arcWidth={0.3}
                percent={score / 900}
                textColor="#000000"
                formatTextValue={() => ''}
              />
              <div className="text-center -mt-4">
                <h3 className="text-4xl font-bold text-gray-900">
                  Credit Score: {score}
                </h3>
                <p className="text-2xl font-semibold text-emerald-500 mt-2">
                  {getCreditScoreStatus(score)}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="On Time Payments"
              value="100%"
              status="Excellent"
            />
            <MetricCard
              title="Credit Age"
              value={calculateAge(creditData?.creditReport.ccrResponse.cirReportDataList[0].cirReportData.IDAndContactInfo.IdentityInfo.PANId[0].reportedDate)}
              status="Excellent"
            />
            <MetricCard
              title="Credit Mix"
              value="3"
              status="Excellent"
            />
            <MetricCard
              title="Credit Enquires"
              value="0"
              status="Excellent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t text-center text-gray-600">
          Powered by Fundkaro
        </div>
      </div>
    </div>
  )
}

export default CreditScoreModal
