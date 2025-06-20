import React, { useState } from "react";
import toast from "react-hot-toast";

const PersonalInfoStep = ({ formData, updateFormData, onNext, onSkip }) => {
  const [email, setEmail] = useState(formData.email || "");
  const [dob, setDob] = useState(formData.dob || "");
  const [referralCode, setReferralCode] = useState(formData.referralCode || "");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!dob) {
      toast.error("Please enter your date of birth");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to send OTP
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOtpSent(true);
      toast.success("OTP sent to your email address");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);

    // Simulate API call to verify OTP
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update form data with verified email
      updateFormData({
        email,
        dob,
        referralCode,
        emailVerified: true,
      });

      toast.success("Email verified successfully");
      onNext();
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-darkPrimary">
          Personal Information
        </h2>
      </div>

      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
          <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          <div>
          <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lightPrimary focus:border-lightPrimary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lightPrimary focus:border-lightPrimary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="referralCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Referral Code{" "}
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              id="referralCode"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Enter referral code if you have one"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lightPrimary focus:border-lightPrimary"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onSkip}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Skip for Later
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-darkPrimary to-lightPrimary text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-70"
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
              We've sent a 6-digit OTP to <strong>{email}</strong>. Please check
              your inbox and enter the code below.
            </p>
          </div>

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter OTP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
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
              Change Email
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
  );
};

export default PersonalInfoStep;
