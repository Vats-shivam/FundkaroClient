import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import toast, { Toaster } from "react-hot-toast";
import Logout from "../components/Logout";
import axios from "axios";

const KycVerify = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [aadhar, setAadhar] = useState("");
  const [panNo, setPanNo] = useState("");
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateAadhar = (aadhar) => {
    return aadhar.length === 12 && /^\d+$/.test(aadhar);
  };

  const handleVerification = async () => {
    // Validate Aadhar
    if (!validateAadhar(aadhar)) {
      toast.error("Please enter a valid 12-digit Aadhar number");
      return;
    }

    // Validate PAN
    if (!panNo) {
      toast.error("Please enter PAN number");
      return;
    }
    if (!validatePAN(panNo)) {
      toast.error("Please enter a valid PAN number (e.g., ABCDE1234F)");
      return;
    }

    if (showOTP) {
      // Handle OTP verification
      if (!otp || otp.length !== 6) {
        toast.error("Please enter a valid 6-digit OTP");
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.post(
          'api/user/kyc-aadhar-verify-otp',
          { 
            otp,
            aadharNo: aadhar,
            panNo: panNo 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.status) {
          const status = await handlePanVerification();
          if(status){
            setVerified(true);
            toast.success("KYC verification successful!");
            handleNext();
          }else{
            toast.error("Pan doesnt matches aadhar. Contact our team");
          }
          

          
        } else {
          toast.error(response.data.message || "Invalid OTP");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "OTP verification failed");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle initial verification
      try {
        setIsLoading(true);
        const response = await axios.post(
          "api/user/kyc-aadhar-send-otp",
          { 
            aadharNo: aadhar,
            panNo: panNo 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.status) {
          setShowOTP(true);
          toast.success("OTP sent successfully! Please check your registered mobile number.");
        } else {
          toast.error(response.data.message || "Failed to send OTP");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Verification request failed");
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handlePanVerification = async () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panNo || !panRegex.test(panNo)) {
      toast.error("Please enter a valid PAN number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "api/user/kyc-pan-verify",
        { panNo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        setVerified(prev => ({ ...prev, pan: true }));
        toast.success("PAN verified successfully!");
      } else {
        throw new Error("PAN verification failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to verify PAN");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      const { data } = await axios.get("/api/user/kyc-verify", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.status) {
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Verification status check failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to proceed to dashboard");
    }
  };

  useEffect(() => {
    if (user._doc.isKYCVerified) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-t from-darkPrimary to-lightPrimary p-4">
      <Toaster position="top-center" reverseOrder={false} />
      
      <Logout className="absolute top-4 right-4 md:top-8 md:left-4 border-white hover:bg-darkPrimary hover:text-white" />
      
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-center text-darkPrimary mb-8">
          Verify Your KYC Details
        </h1>

        {/* Aadhar Section */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-600">Aadhar Number</label>
            <input
              type="number"
              placeholder="Enter 12-digit Aadhar number"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightPrimary"
              maxLength="12"
              disabled={verified}
            />
          </div>
        </div>

        {/* PAN Section */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-600">PAN Number</label>
            <input
              type="text"
              placeholder="Enter PAN number"
              value={panNo}
              onChange={(e) => setPanNo(e.target.value.toUpperCase())}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightPrimary"
              maxLength="10"
              disabled={verified}
            />
          </div>
        </div>

        {/* OTP Section */}
        {showOTP && !verified && (
          <div className="space-y-4 mb-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-600">OTP Verification</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightPrimary"
                maxLength="6"
              />
            </div>
          </div>
        )}

        {/* Verify Button */}
        {!verified && (
          <button
            className="w-full py-3 bg-gradient-to-r from-darkPrimary to-lightPrimary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            onClick={handleVerification}
            disabled={isLoading}
          >
            {isLoading 
              ? "Processing..." 
              : showOTP 
                ? "Verify OTP" 
                : "Verify KYC"
            }
          </button>
        )}

        {/* Success Message */}
        {verified && (
          <div className="text-center text-green-600 font-semibold">
            KYC verification successful! Redirecting to dashboard...
          </div>
        )}
      </div>
    </div>
  );
};

export default KycVerify;