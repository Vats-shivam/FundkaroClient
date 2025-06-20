import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timer if component unmounts
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-16 h-16 text-green-500 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2l4-4M5 13l4 4l6-6"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Success!</h1>
        <p className="text-gray-600 mb-4">
          Your application has been successfully submitted.
        </p>
        <p className="text-gray-600">
          You will be redirected to the dashboard shortly...
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
