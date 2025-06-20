import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Loader from '../assets/loader.svg'
import Logout from '../components/Logout';

const CustomToast = () => (
  <div className='bg-white text-darkPrimary p-4 rounded-md shadow-lg text-sm sm:text-base'>
    Verify details first to continue...
  </div>
)

const VerifyUser = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [verified, setVerified] = useState({ phoneNo: false, email: false });
  const [phoneNo, setPhoneNo] = useState(user._doc.phoneNo);
  const [email, setEmail] = useState(user._doc.email);
  const [emailOTP, setEmailOTP] = useState('');
  const [smsOTP, setSmsOTP] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);

  const token = localStorage.getItem('token')

  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  function isValidPhoneNumber(phoneNumber) {
    phoneNumber = phoneNumber.trim();
    const indianPhoneNumberPattern = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
    return indianPhoneNumberPattern.test(phoneNumber);
  }

  const handleMailOTP = async () => {
    if (!isValidEmail(email)) {
      return toast.error("Email is invalid");
    }
    try {
      setIsSendingEmail(true)
      const { data } = await axios.post('/api/otp/email/send-otp', { email }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setIsSendingEmail(false)
      if (!data.success) {
        toast.error("Internal server error");
      }
      else {
        setShowEmailOTP(true);
        toast.success("OTP is Sent Successfully");
      }
    } catch (err) {
      console.log(err);
      setIsSendingEmail(false);
    }
  }

  const handlePhoneOTP = async () => {
    if (!isValidPhoneNumber(String(phoneNo))) {
      return toast.error("Phone number is invalid")
    }
    try {
      setIsSendingSms(true);
      const { data } = await axios.post('/api/otp/phone/send-otp', {
        phone: "+91" + phoneNo
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setIsSendingSms(false);
      if (!data.success) {
        toast.error("Internal server error");
      }
      else {
        setShowPhoneOTP(true);
        toast.success("OTP is Sent Successfully");
      }
    } catch (err) {
      console.log(err);
      setIsSendingSms(false);
    }
  }

  const verifyEmailOTP = async () => {
    try {
      const { data } = await axios.post("/api/otp/email/verify-otp", { email, otp: emailOTP }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (data.error) {
        toast.error(data.error);
      }
      else {
        toast.success(data.status);
        setVerified((prev) => ({ ...prev, email: true }))
        setShowEmailOTP(false);
        setEmailOTP('');
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to verify email OTP");
    }
  }

  const verifyPhoneOTP = async () => {
    try {
      const { data } = await axios.post("/api/otp/phone/verify-otp", { phone: "+91" + phoneNo, otp: smsOTP }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (data.error) {
        toast.error(data.error);
      }
      else {
        toast.success(data.status);
        setVerified((prev) => ({ ...prev, phoneNo: true }))
        setShowPhoneOTP(false);
        setSmsOTP('');
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to verify phone OTP");
    }
  }

  const handleNext = async () => {
    if (!verified.email) {
      toast.error("Verify your Email first");
    }
    else if (!verified.phoneNo) {
      toast.error("Verify your Phone number");
    }
    else {
      try {
        const { data } = await axios.get('/api/user/verified', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (data.success) {
          navigate("/kyc-verify")
        }
        else {
          toast.error("Internal server Error");
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to proceed");
      }
    }
  }

  useEffect(() => {
    if (user._doc.isVerified) {
      navigate('/dashboard');
    }
    toast.custom(<CustomToast />)
  }, [])

  return (
    <div className='min-h-screen w-full flex justify-center items-center bg-gradient-to-t from-darkPrimary to-lightPrimary p-4'>
      <Toaster />
      <Logout className="absolute top-4 sm:top-8 left-4 border-white hover:bg-darkPrimary hover:text-white" />
      
      <div className='bg-gray-50 w-full max-w-md mx-auto rounded-lg shadow-lg p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8'>
        <h1 className='text-center text-lg sm:text-xl font-primaryFont font-semibold text-darkPrimary'>
          Verify Your Details
        </h1>

        {/* Email Section */}
        <div className='space-y-2 sm:space-y-3'>
          <label className='flex items-center font-primaryFont font-medium text-darkPrimary text-sm sm:text-base'>
            Email: {isSendingEmail && <img src={Loader} className="w-4 sm:w-6 ml-2" />}
          </label>
          
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
              <div className='flex-1 flex items-center border border-blue-500 rounded-lg px-3 py-2'>
                {user._doc.email ? (
                  <div className='text-blue-500 text-sm sm:text-base'>{email}</div>
                ) : (
                  <input
                    type='email'
                    placeholder="Email..."
                    value={email}
                    className='w-full placeholder-blue-500 focus:outline-none text-sm sm:text-base'
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}
              </div>
              
              {verified.email ? (
                <div className='bg-gradient-to-t from-green-400 to-green-100 px-4 py-2 rounded-md text-sm sm:text-base whitespace-nowrap'>
                  Verified
                </div>
              ) : (
                <button
                  className='text-white bg-gradient-to-t from-darkPrimary to-lightPrimary px-4 py-2 rounded-md text-sm sm:text-base whitespace-nowrap'
                  onClick={handleMailOTP}
                >
                  Send OTP
                </button>
              )}
            </div>

            {showEmailOTP && !verified.email && (
              <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                <input
                  type="number"
                  placeholder="Enter Email OTP"
                  value={emailOTP}
                  onChange={(e) => setEmailOTP(e.target.value)}
                  className='flex-1 border border-blue-500 rounded-lg px-3 py-2 placeholder-blue-500 focus:outline-none text-sm sm:text-base'
                />
                <button
                  className='text-white bg-gradient-to-t from-darkPrimary to-lightPrimary px-4 py-2 rounded-md text-sm sm:text-base whitespace-nowrap'
                  onClick={verifyEmailOTP}
                >
                  Verify Email
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Phone Section */}
        <div className='space-y-2 sm:space-y-3'>
          <label className='flex items-center font-primaryFont font-medium text-darkPrimary text-sm sm:text-base'>
            Phone No: {isSendingSms && <img src={Loader} className="w-4 sm:w-6 ml-2" />}
          </label>
          
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
              <div className='flex-1 flex items-center border border-blue-500 rounded-lg px-3 py-2'>
                {user._doc.phoneNo ? (
                  <div className='text-blue-500 text-sm sm:text-base'>{phoneNo}</div>
                ) : (
                  <>
                    <div className='text-blue-500 border-r-2 pr-2 text-sm sm:text-base'>+91</div>
                    <input
                      type="number"
                      placeholder="Phone No..."
                      value={phoneNo}
                      className='flex-1 ml-2 placeholder-blue-500 focus:outline-none text-sm sm:text-base'
                      onChange={(e) => setPhoneNo(e.target.value)}
                    />
                  </>
                )}
              </div>
              
              {verified.phoneNo ? (
                <div className='bg-gradient-to-t from-green-400 to-green-100 px-4 py-2 rounded-md text-sm sm:text-base whitespace-nowrap'>
                  Verified
                </div>
              ) : (
                <button
                  className='text-white bg-gradient-to-t from-darkPrimary to-lightPrimary px-4 py-2 rounded-md text-sm sm:text-base whitespace-nowrap'
                  onClick={handlePhoneOTP}
                >
                  Send OTP
                </button>
              )}
            </div>

            {showPhoneOTP && !verified.phoneNo && (
              <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                <input
                  type="number"
                  placeholder="Enter Phone OTP"
                  value={smsOTP}
                  onChange={(e) => setSmsOTP(e.target.value)}
                  className='flex-1 border border-blue-500 rounded-lg px-3 py-2 placeholder-blue-500 focus:outline-none text-sm sm:text-base'
                />
                <button
                  className='text-white bg-gradient-to-t from-darkPrimary to-lightPrimary px-4 py-2 rounded-md text-sm sm:text-base whitespace-nowrap'
                  onClick={verifyPhoneOTP}
                >
                  Verify Phone
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className='w-full bg-gradient-to-r from-lightPrimary to-darkPrimary text-white px-4 py-3 rounded-md text-sm sm:text-base transition-all hover:opacity-90'
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default VerifyUser