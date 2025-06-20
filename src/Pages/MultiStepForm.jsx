import React, { useEffect } from "react";
import MultiStepForm from "../components/MultiStepForm.jsx";
import heroImg from "../assets/heroImg.png";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MultiStepFormPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate, token]);

  return (
    <div className="w-full min-h-screen relative">
      {/* Gradient Header */}
      <div className="w-full flex flex-col bg-gradient-to-r from-darkPrimary to-lightPrimary h-[40vh] relative px-6 sm:px-10 md:px-16 pt-6">
        <div className="w-full text-white text-2xl md:text-3xl lg:text-4xl font-primaryFont font-bold">
          fundka₹o
        </div>
        <div className="w-full text-white text-lg md:text-xl lg:text-2xl font-primaryFont font-normal mt-1">
          Multiple loan choice Instant benefits
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full absolute inset-x-0 top-28 md:top-32 lg:top-36 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
          {/* Image Column - Hidden on mobile, adjustable size on larger screens */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 items-start justify-center">
            <img
              src={heroImg || "/placeholder.svg"}
              alt="Hero"
              className="w-full max-w-md xl:max-w-lg object-contain"
            />
          </div>

          {/* Form Column - Takes full width on mobile, more space on larger screens */}
          <div className="col-span-1 lg:col-span-7 xl:col-span-7">
            {/* <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 lg:p-8"> */}
              <Toaster position="top-center" />
              <MultiStepForm />
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepFormPage;
