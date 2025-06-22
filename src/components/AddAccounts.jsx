"use client"

import { useState } from "react"
import { CgClose } from "react-icons/cg"
import { MdPerson, MdPhone, MdSecurity } from "react-icons/md"
import toast, { Toaster } from "react-hot-toast"

const AddAccountModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNo: "",
    otp: "",
  })

  // Dummy data for demonstration
  const handleStep1Submit = async (e) => {
    e.preventDefault()

    if (!formData.fullName || formData.phoneNo.length !== 10) {
      toast.error("Please enter valid details")
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Check if phone number already exists (dummy logic)
      const existingNumbers = ["9876543210", "8765432109", "7654321098"]

      if (existingNumbers.includes(formData.phoneNo)) {
        toast.success("User found! Adding to your profiles...")
        // Simulate adding existing user
        setTimeout(() => {
          const existingProfile = {
            _id: Date.now().toString(),
            fullName: formData.fullName,
            phoneNo: formData.phoneNo,
            email: `${formData.fullName.toLowerCase().replace(" ", ".")}@example.com`,
            isKYCVerified: true,
            isProfileCompleted: true,
            firstName: formData.fullName.split(" ")[0],
            lastName: formData.fullName.split(" ")[1] || "",
          }
          onSuccess(existingProfile)
          toast.success("Profile added successfully!")
        }, 1000)
      } else {
        // New user - send OTP
        setOtpSent(true)
        toast.success("OTP sent to your phone number")
      }
      setLoading(false)
    }, 2000)
  }

  const handleOTPVerification = async (e) => {
    e.preventDefault()

    if (!formData.otp || formData.otp.length !== 6) {
      toast.error("Please enter valid OTP")
      return
    }

    setLoading(true)

    // Simulate OTP verification
    setTimeout(() => {
      if (formData.otp === "123456") {
        const newProfile = {
          _id: Date.now().toString(),
          fullName: formData.fullName,
          phoneNo: formData.phoneNo,
          email: null,
          isKYCVerified: false,
          isProfileCompleted: false,
          firstName: formData.fullName.split(" ")[0],
          lastName: formData.fullName.split(" ")[1] || "",
        }
        onSuccess(newProfile)
        toast.success("Profile created successfully!")
      } else {
        toast.error("Invalid OTP. Please try again.")
      }
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Toaster position="top-center" />

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Add New Profile</h2>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
              <CgClose className="text-xl" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-white text-blue-600" : "bg-white bg-opacity-30 text-white"
                }`}
              >
                <MdPerson />
              </div>
              <span className="ml-2 text-sm">Details</span>
            </div>
            <div className={`flex-1 h-1 rounded ${step >= 2 ? "bg-white" : "bg-white bg-opacity-30"}`}></div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-white text-blue-600" : "bg-white bg-opacity-30 text-white"
                }`}
              >
                <MdSecurity />
              </div>
              <span className="ml-2 text-sm">Verify</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {!otpSent ? (
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                  value={formData.phoneNo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phoneNo: e.target.value }))}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">We'll check if this user already exists in our system</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Checking...
                  </div>
                ) : (
                  "Continue"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPVerification} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdPhone className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Verify Phone Number</h3>
                <p className="text-gray-600">
                  We've sent a 6-digit OTP to
                  <br />
                  <span className="font-semibold">+91 {formData.phoneNo}</span>
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Enter OTP</label>
                <input
                  type="text"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  value={formData.otp}
                  onChange={(e) => setFormData((prev) => ({ ...prev, otp: e.target.value }))}
                  required
                />
                <p className="text-sm text-gray-500 mt-1 text-center">
                  Use <span className="font-semibold">123456</span> for demo
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify & Add Profile"
                )}
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-blue-600 py-2 font-medium hover:text-blue-700 transition-colors"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddAccountModal
