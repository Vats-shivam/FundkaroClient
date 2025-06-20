"use client"

import { useState } from "react"
import toast from "react-hot-toast"

const LoanSurveyStep = ({ formData, updateFormData, onSubmit, onBack, onSkip }) => {
  const [loanType, setLoanType] = useState(formData.loanType || "unsecuredBusiness")
  const [hasPreviousLoan, setHasPreviousLoan] = useState(formData.hasPreviousLoan || false)
  const [creditReportAuthorized, setCreditReportAuthorized] = useState(formData.creditReportAuthorized || false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePullCreditReport = async () => {
    setIsLoading(true)

    // Simulate API call to pull credit report
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setCreditReportAuthorized(true)
      updateFormData({ creditReportAuthorized: true })
      toast.success("Credit report pulled successfully")
    } catch (error) {
      toast.error("Failed to pull credit report. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitSurvey = (e) => {
    e.preventDefault()

    // Update form data
    updateFormData({
      loanType,
      hasPreviousLoan,
      creditReportAuthorized,
    })

    // Submit the form
    onSubmit()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-darkPrimary">Loan Preferences</h2>
        <p className="text-gray-600 mt-2">Help us understand your loan requirements</p>
      </div>

      <form onSubmit={handleSubmitSurvey} className="space-y-6">
        <div>
          <label htmlFor="loanType" className="block text-sm font-medium text-gray-700 mb-1">
            What kind of loan are you looking for? <span className="text-red-500">*</span>
          </label>
          <select
            id="loanType"
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lightPrimary focus:border-lightPrimary"
            required
          >
            <option value="unsecuredBusiness">Unsecured Business Loan</option>
            <option value="personal">Personal Loan</option>
            <option value="home">Home Loan</option>
            <option value="property">Loan Against Property</option>
            <option value="auto">Auto Loan</option>
            <option value="education">Education Loan</option>
            <option value="exploring">Just exploring for now</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Have you taken a loan, purchased on EMI, or used a credit card before?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="previousLoan"
                checked={hasPreviousLoan === true}
                onChange={() => setHasPreviousLoan(true)}
                className="h-4 w-4 text-lightPrimary focus:ring-lightPrimary"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="previousLoan"
                checked={hasPreviousLoan === false}
                onChange={() => setHasPreviousLoan(false)}
                className="h-4 w-4 text-lightPrimary focus:ring-lightPrimary"
              />
              <span className="ml-2 text-gray-700">No</span>
            </label>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Please authorize us to pull your credit report for further evaluation.{" "}
            <span className="text-red-500">*</span>
          </label>

          {!creditReportAuthorized ? (
            <button
              type="button"
              onClick={handlePullCreditReport}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-darkPrimary to-lightPrimary text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              {isLoading ? (
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
                  Pulling Credit Report...
                </span>
              ) : (
                "Pull Credit Report"
              )}
            </button>
          ) : (
            <div className="flex items-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Credit report authorized successfully
            </div>
          )}
        </div>

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
            disabled={!creditReportAuthorized}
            className="px-6 py-2 w-full bg-gradient-to-r from-darkPrimary to-lightPrimary text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            Complete Application
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoanSurveyStep

