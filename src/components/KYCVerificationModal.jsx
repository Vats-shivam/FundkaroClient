"use client"

import { useState } from "react"
import { CgClose } from "react-icons/cg"
import { MdVerifiedUser, MdCreditCard, MdFingerprint, MdSecurity } from "react-icons/md"
import toast, { Toaster } from "react-hot-toast"

const KYCVerificationModal = ({ profile, onClose, onSuccess }) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [formData, setFormData] = useState({
    panNo: "",
    aadharNo: "",
    aadharOTP: "",
  })

  const handlePANVerification = async (e) => {
    e.preventDefault()

    if (!formData.panNo || !formData.aadharNo) {
      toast.error("Please enter both PAN and Aadhar numbers")
      return
    }

    if (formData.panNo.length !== 10) {
      toast.error("PAN number should be 10 characters")
      return
    }

    if (formData.aadharNo.length !== 12) {
      toast.error("Aadhar number should be 12 digits")
      return
    }

    setLoading(true)

    // Simulate PAN verification
    setTimeout(() => {
      // Simulate successful PAN verification
      toast.success("PAN verified successfully!")
      setOtpSent(true)
      toast.success("OTP sent to your registered mobile number")
      setLoading(false)
    }, 2000)
  }

  const handleAadharOTPVerification = async (e) => {
    e.preventDefault()

    if (!formData.aadharOTP || formData.aadharOTP.length !== 6) {
      toast.error("Please enter valid 6-digit OTP")
      return
    }

    setLoading(true)

    // Simulate Aadhar OTP verification
    setTimeout(() => {
      if (formData.aadharOTP === "123456") {
        const updatedProfile = {
          ...profile,
          isKYCVerified: true,
          panCardNumber: formData.panNo,
          aadharCardNumber: formData.aadharNo,
        }
        onSuccess(updatedProfile)
        toast.success("KYC verification completed successfully!")
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
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">KYC Verification</h2>
              <p className="text-sm opacity-90 mt-1">
                Verifying for {profile.fullName || profile.firstName + " " + profile.lastName}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
              <CgClose className="text-xl" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-white text-green-600" : "bg-white bg-opacity-30 text-white"
                }`}
              >
                <MdCreditCard />
              </div>
              <span className="ml-2 text-sm">Documents</span>
            </div>
            <div className={`flex-1 h-1 rounded ${step >= 2 ? "bg-white" : "bg-white bg-opacity-30"}`}></div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-white text-green-600" : "bg-white bg-opacity-30 text-white"
                }`}
              >
                <MdFingerprint />
              </div>
              <span className="ml-2 text-sm">Verify</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {!otpSent ? (
            <form onSubmit={handlePANVerification} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdVerifiedUser className="text-2xl text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Document Verification</h3>
                <p className="text-gray-600">Please provide your PAN and Aadhar details for KYC verification</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">PAN Card Number</label>
                <input
                  type="text"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all uppercase"
                  placeholder="ABCDE1234F"
                  maxLength="10"
                  value={formData.panNo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, panNo: e.target.value.toUpperCase() }))}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Aadhar Card Number</label>
                <input
                  type="text"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="1234 5678 9012"
                  maxLength="12"
                  value={formData.aadharNo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, aadharNo: e.target.value.replace(/\D/g, "") }))}
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <MdSecurity className="text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Secure Verification</h4>
                    <p className="text-sm text-blue-700">
                      Your documents are verified through government databases and are completely secure.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying Documents...
                  </div>
                ) : (
                  "Verify Documents"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAadharOTPVerification} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdFingerprint className="text-2xl text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Aadhar OTP Verification</h3>
                <p className="text-gray-600">
                  We've sent a 6-digit OTP to your registered mobile number ending with
                  <span className="font-semibold"> ***{profile.phoneNo?.slice(-3)}</span>
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Enter Aadhar OTP</label>
                <input
                  type="text"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  value={formData.aadharOTP}
                  onChange={(e) => setFormData((prev) => ({ ...prev, aadharOTP: e.target.value.replace(/\D/g, "") }))}
                  required
                />
                <p className="text-sm text-gray-500 mt-1 text-center">
                  Use <span className="font-semibold">123456</span> for demo
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Completing KYC...
                  </div>
                ) : (
                  "Complete KYC Verification"
                )}
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-green-600 py-2 font-medium hover:text-green-700 transition-colors"
              >
                Change Documents
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default KYCVerificationModal
