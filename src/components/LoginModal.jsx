import { useState, useRef, useEffect } from "react";
import { X, ArrowRight, CheckCircle } from "lucide-react";

const sendOTP = async (phoneNumber) => {
  console.log(`Sending OTP to ${phoneNumber}`);
  return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
};

const verifyOTP = async (phoneNumber, otp) => {
  console.log(`Verifying OTP ${otp} for ${phoneNumber}`);
  return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
};

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const otpRefs = Array(5).fill(null).map(() => useRef(null));

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => interval && clearInterval(interval);
  }, [isTimerActive, timer]);

  useEffect(() => {
    if (isOpen) {
      setStep("phone");
      setPhoneNumber("");
      setOtpValues(["", "", "", "", ""]);
      setTimer(60);
      setIsTimerActive(false);
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    setIsLoading(true);
    try {
      const success = await sendOTP(phoneNumber);
      if (success) {
        setStep("otp");
        setIsTimerActive(true);
        setTimeout(() => otpRefs[0].current?.focus(), 100);
      }
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^[0-9]$/.test(value)) return;
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    if (value && index < 4) otpRefs[index + 1].current?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (isTimerActive) return;
    setError("");
    setIsLoading(true);
    try {
      const success = await sendOTP(phoneNumber);
      if (success) {
        setTimer(60);
        setIsTimerActive(true);
        setOtpValues(["", "", "", "", ""]);
        otpRefs[0].current?.focus();
      }
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpValues.join("");
    if (otp.length !== 5) {
      setError("Please enter the complete OTP");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const success = await verifyOTP(phoneNumber, otp);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess();
          onClose();
        }, 1500);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
          <X size={20} />
        </button>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">{step === "phone" ? "Welcome" : "Verify OTP"}</h2>
          <p className="mt-2 text-gray-600">{step === "phone" ? "Enter your phone number" : `OTP sent to ${phoneNumber}`}</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-center"><CheckCircle size={20} className="mr-2" />Login successful!</div>}
        {step === "phone" && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))} placeholder="Phone Number" className="w-full p-3 border rounded-lg" maxLength={10} required />
            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg">Send OTP</button>
          </form>
        )}
        {step === "otp" && (
          <div className="space-y-4">
            <div className="flex justify-between">
              {otpValues.map((value, index) => (
                <input key={index} ref={otpRefs[index]} type="text" value={value} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} maxLength={1} className="w-12 h-12 text-center border rounded-lg" />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResendOtp}
                className={`text-sm ${
                  isTimerActive ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"
                }`}
                disabled={isTimerActive || isLoading || success}
              >
                Resend OTP {isTimerActive ? `(${timer}s)` : ""}
              </button>

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center"
                disabled={otpValues.join("").length !== 5 || isLoading || success}
              >
                {isLoading ? (
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : null}
                {isLoading ? "Verifying..." : "Verify"}
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-sm text-blue-600 hover:text-blue-800"
                disabled={isLoading || success}
              >
                Change phone number
              </button>
            </div>
            {/* <button onClick={handleVerifyOtp} className="w-full py-3 bg-blue-600 text-white rounded-lg">Verify</button> */}
          </div>
        )}
      </div>

    </div>
  );
}
