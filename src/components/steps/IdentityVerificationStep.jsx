"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"

const IdentityVerificationStep = ({ formData, updateFormData, onNext, onBack, onSkip }) => {
  const [aadharNumber, setAadharNumber] = useState(formData.aadharNumber || "")
  const [panNumber, setPanNumber] = useState(formData.panNumber || "")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [panDescription, setPanDescription] = useState("")
  const [panCategory, setPanCategory] = useState("")
  const [panValid, setPanValid] = useState(true)
  
  // Clear toast notification on component mount
  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  const formatAadhar = (value) => {
    // Format: XXXX XXXX XXXX
    const v = value.replace(/\D/g, "").slice(0, 12)
    if (v.length <= 4) return v
    if (v.length <= 8) return `${v.slice(0, 4)} ${v.slice(4)}`
    return `${v.slice(0, 4)} ${v.slice(4, 8)} ${v.slice(8, 12)}`
  }

  const validatePANPattern = (pan) => {
    // PAN Format: 5 letters, 4 numbers, 1 letter
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return panRegex.test(pan)
  }

  // Process PAN input and update all states in one place
  const processPAN = (value) => {
    // Format: ABCDE1234F (5 letters, 4 numbers, 1 letter)
    const formattedValue = value.toUpperCase().slice(0, 10)
    
    // Reset states to prevent stale messages
    let category = "Unknown"
    let isValidFormat = true
    let description = ""
    
    // Only analyze if there's input
    if (formattedValue.length > 0) {
      // Get the first character to determine PAN category
      const firstChar = formattedValue.charAt(3)
      
      // Set category based on first letter
      switch(firstChar) {
        case 'P':
          category = "Individual";
          break;
        case 'C':
          category = "Company";
          break;
        case 'A':
          category = "Association";
          break;
        case 'T':
          category = "Trust";
          break;
        case 'H':
          category = "HUF";
          break;
        case 'F':
          category = "Firm";
          break;
        default:
          category = "Unknown";
      }
      
      // Check format if complete PAN
      if (formattedValue.length === 10) {
        isValidFormat = validatePANPattern(formattedValue)
        
        // Set description based on validation results
        if (!isValidFormat || category == "Unknown") {
          description = "Invalid PAN format. Please enter in the format ABCDE1234F";
          toast.error("Invalid PAN", { id: "pan-format-error" });
        } else if (category !== "Individual" && category !== "Unknown") {
          description = `Non-individual PAN (${category})`;
          toast.error("Currently we only serve Individual category PAN numbers", { id: "pan-category-error" });
        } else if (category === "Individual") {
          description = "Individual PAN";
          toast.success("Valid Individual PAN", { id: "pan-valid" });
        }
      } else {
        // Clear toasts for incomplete PAN
        toast.dismiss();
      }
    } else {
      // Clear toasts for empty input
      toast.dismiss();
    }
    
    // Update all states synchronously
    setPanCategory(category);
    setPanValid(isValidFormat);
    setPanDescription(description);
    
    return formattedValue;
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()

    if (!aadharNumber || aadharNumber.replace(/\D/g, "").length !== 12) {
      toast.error("Please enter a valid 12-digit Aadhar number")
      return
    }

    if (!panNumber || panNumber.length !== 10 || !validatePANPattern(panNumber)) {
      toast.error("Please enter a valid 10-character PAN number in correct format")
      return
    }

    // Validate PAN category
    if (panCategory !== "Individual") {
      toast.error("We currently only support Individual PAN numbers (starting with 'P')")
      return
    }

    setIsSubmitting(true)

    // Simulate API call to send OTP
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setOtpSent(true)
      toast.success("OTP sent to your registered mobile number")
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setIsVerifying(true)

    // Simulate API call to verify OTP
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update form data with verified IDs
      updateFormData({
        aadharNumber: aadharNumber.replace(/\D/g, ""),
        panNumber,
        idsVerified: true,
      })

      toast.success("Identity verified successfully")
      onNext()
    } catch (error) {
      toast.error("Invalid OTP. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-darkPrimary">Identity Verification</h2>
        <p className="text-gray-600 mt-2">Please provide your identity documents</p>
      </div>

      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700 mb-1">
              Aadhar Card Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="aadhar"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(formatAadhar(e.target.value))}
              placeholder="XXXX XXXX XXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lightPrimary focus:border-lightPrimary"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Your 12-digit Aadhar number</p>
          </div>

          <div>
            <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1">
              PAN Card Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="pan"
                value={panNumber}
                onChange={(e) => {
                  const newPan = processPAN(e.target.value);
                  setPanNumber(newPan);
                }}
                placeholder="ABCDE1234F"
                className={`w-full px-4 py-2 border ${!panValid && panNumber.length === 10 ? 'border-red-300' : panValid && panNumber.length === 10 && panCategory === "Individual" ? 'border-green-300' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-lightPrimary focus:border-lightPrimary`}
                maxLength={10}
                required
              />
              {panNumber.length === 10 && (
                <div className="absolute right-3 top-2.5">
                  {!panValid ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : panCategory !== "Individual" && panCategory !== "Unknown" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : panCategory === "Individual" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : null}
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">Your 10-character PAN number</p>
            
            {panNumber.length === 10 && (!panValid || panCategory=="Unknown") && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Invalid PAN.</span>
              </div>
            )}
            
            {panValid && panCategory === "Individual" && panNumber.length === 10 && (
              <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-md flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Valid Individual PAN</span>
              </div>
            )}
            
            {panValid && panCategory && panCategory !== "Individual" && panCategory !== "Unknown" && panNumber.length === 10 && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>We currently only support Individual PAN numbers (starting with 'P'). This appears to be a {panCategory} PAN.</span>
              </div>
            )}
          </div>

          {/* <div className="bg-blue-50 p-4 rounded-md mt-4">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {/* <p className="text-blue-800 text-sm">
                <strong>PAN Card Anatomy:</strong> First character represents the category (P - Individual, C - Company, A - Association, T - Trust), followed by surname initials, first name initial, and a sequential number.
                <br /><br />
                <strong>Note:</strong> Currently we only serve Individual category PAN numbers (starting with 'P').
              </p> 
            </div>
          </div> */}

          <div className="flex flex-wrap pt-4">
            <div className="space-x-3">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Back
              </button>

              <button
                type="button"
                onClick={onSkip}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Skip for Later
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || (panNumber.length === 10 && (!panValid || panCategory !== "Individual"))}
              className="px-6 py-2 w-full bg-gradient-to-r from-darkPrimary to-lightPrimary text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <p className="text-blue-800 text-sm">
              We've sent a 6-digit OTP to your registered mobile number. Please check your phone and enter the code
              below.
            </p>
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lightPrimary focus:border-lightPrimary"
              maxLength={6}
              required
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Change Details
            </button>

            <button
              type="submit"
              disabled={isVerifying}
              className="px-6 py-2 bg-gradient-to-r from-darkPrimary to-lightPrimary text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              {isVerifying ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify & Continue"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default IdentityVerificationStep