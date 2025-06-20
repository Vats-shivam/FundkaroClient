import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loanType: '',
    hasLoanOrCredit: '',
  });
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreditReportQuestion, setShowCreditReportQuestion] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'hasLoanOrCredit') {
      setShowCreditReportQuestion(value === 'yes');
    }
  };

  const handlePullCreditReport = async () => {
    const token = localStorage.getItem('token');
    try {
      setIsLoading(true);
      const response = await axios.post(
        '/api/user/credit-report',
        {
          surveyquestions: [
            { Question: "What kind of loan are you looking for?", Answer: formData.loanType },
            { Question: "Have you taken a loan, purchased on EMI, or used a credit card before?", Answer: formData.hasLoanOrCredit }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }
      );
      if (!response.data.status) {
        throw new Error('Failed to pull credit report');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user._doc.isSurveyCompleted) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-darkPrimary to-lightPrimary p-4">
      <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-md mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
          Loan Interest Inquiry
        </h2>

        <form className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="loanType" className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">
              What kind of loan are you looking for?
            </label>
            <select
              id="loanType"
              name="loanType"
              value={formData.loanType}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 text-sm sm:text-base"
            >
              <option value="">Select</option>
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
            <label htmlFor="hasLoanOrCredit" className="block text-gray-700 font-bold mb-2 text-sm sm:text-base">
              Have you taken a loan, purchased on EMI, or used a credit card before?
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="yes" 
                  name="hasLoanOrCredit" 
                  value="yes" 
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label htmlFor="yes" className="ml-2 text-sm sm:text-base">Yes</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="no" 
                  name="hasLoanOrCredit" 
                  value="no" 
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label htmlFor="no" className="ml-2 text-sm sm:text-base">No</label>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center pt-4 sm:pt-6">
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
            ) : (
              <>
                <p className="text-gray-700 text-center mb-2 text-sm sm:text-base px-4">
                  Please authorize us to pull your credit report for further evaluation.
                </p>
                <button
                  type="button"
                  onClick={handlePullCreditReport}
                  className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-md shadow-md focus:outline-none focus:ring focus:ring-indigo-500 text-sm sm:text-base transition-colors duration-200"
                >
                  Pull Credit Report
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;