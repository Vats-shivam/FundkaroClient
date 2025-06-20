import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { IoIosArrowBack } from 'react-icons/io';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import logo from "../assets/fundkaro.svg";

const LoanDetails = () => {
  const { user } = useContext(UserContext);
  const { loanID } = useParams();
  const [loan, setLoans] = useState({});
  const [loading, setLoading] = useState(true);
  console.log(logo)

  function statusColor(status) {
    switch (status) {
      case 'Pending':
        return 'bg-blue-500';
      case 'Rejected':
        return 'bg-red-500';
      case 'Verified':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  }

  useEffect(() => {
    fetchApplication();
  }, [])

  const fetchApplication = async () => {
    try {
      const response = await axios.post("/api/application/findbyid", { userId: user.user, applicationId: loanID });
      console.log(response.data);
      if (response.data.status) {
        setLoans(response.data.application);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen py-10">
      <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-darkPrimary to-lightPrimary flex h-16 items-center py-2 px-4">
        <img src={logo} className="w-32 h-9 ml-4" alt="Logo" />
      </header>

      <Link to="/dashboard" className="absolute top-20 left-10 font-semibold text-blue-500 flex items-center text-xl">
        <IoIosArrowBack color="blue" />
        Dashboard
      </Link>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="loader"></div>
          <p className="text-blue-500 text-xl">Loading</p>
        </div>
      ) : (
        <div className="lg:w-[75%] grid grid-cols-1 lg:grid-cols-2 gap-4 mx-auto w-full mt-32">
          <div className="bg-gradient-to-r from-lightPrimary to-darkPrimary rounded-lg flex flex-col gap-2 p-4 text-lg font-medium text-white border-secondary border-4 shadow-md">
            <div className="flex items-center mb-2 bg-white p-2 rounded-lg">
              <img src={loan.categoryId.logo} alt="Category Logo" className="w-8 h-8 mr-2 rounded-full" />
              <h2 className="font-bold text-xl bg-clip-text inline-block bg-gradient-to-r from-darkPrimary to-lightPrimary font-bold text-transparent">{loan.categoryId.category}</h2>
            </div>
            <div className={`p-2 rounded-lg ${statusColor(loan.status)}`}>
              <p className="text-white font-bold text-center">
                Application Status: {loan.status}
              </p>
            </div>

            {loan.status === 'Verified' && !loan.isSelectionDone && (
              <Link to={`/select-loans/${loan._id}`} className="block mt-2 bg-green-500 py-2 rounded-lg text-white text-center">
                Apply Loans
              </Link>
            )}
          </div>

          <div className="rounded-lg p-4 bg-gradient-to-r from-lightPrimary to-darkPrimary text-white shadow-md mb-4">
            <h3 className="font-bold text-center text-lg mb-3">Applied Loans</h3>
            <div>
              {loan.loans.map((loanDetail, index) => (
                <div key={index} className="border-blue-500 text-white bg-white/[.4] rounded-lg p-4 shadow">
                  <div className="flex items-center mb-3">
                    <img src={loanDetail.loan.logo} alt="Loan Logo" className="w-14 h-14 mr-3 rounded-full" />
                    <div>
                      <p className="font-bold ">{loanDetail.loan.vendor}</p>
                      <p className="">Loan Amount: ₹{loanDetail.loan.maxLoanAmount}</p>
                      <p className="">Interest Rate: {loanDetail.loan.ratesMin}% - {loanDetail.loan.ratesMax}%</p>
                      <p className="">Tenure: {loanDetail.loan.tenureMin} - {loanDetail.loan.tenureMax} years</p>
                      <p className="">Selected: {loanDetail.isSelected ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg p-4 bg-gradient-to-r from-lightPrimary to-darkPrimary text-white shadow-md mb-4">
            <h3 className="font-bold text-center text-lg">Applied Profiles</h3>
            <div className="flex gap-3 overflow-x-auto">
              {loan.profilesId.map((profile, index) => (
                <div key={index} className="border-blue-500 text-white bg-white/[.4] rounded-lg p-4 py-6 shadow"> 
                  <p className="font-bold">{profile.fullName}</p>
                  <p className="">{profile.phoneNo}</p>
                </div>
              ))}
            </div>
          </div>
          {loan.message && (
            <div className="rounded-lg p-4 bg-gradient-to-r from-lightPrimary to-darkPrimary text-white shadow-md mb-4">
              <h3 className="font-bold text-center text-lg">Message from Fundkaro</h3>
              <p className="text-center text-[20px] font-medium  mt-1">{loan.message}</p>
            </div>
          )}
          <div className="rounded-lg p-4 bg-gradient-to-r from-lightPrimary to-darkPrimary text-white shadow-md mb-4">
            <h3 className="font-bold text-center text-lg">My Form</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {loan.formFields.map((field, index) => (
                <div key={index} className="py-4">
                  <label htmlFor={field.name}>{field.name}</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={field.type === 'file' ? undefined : loan.formFields.find(item => item.name === field.name)?.value || ''}
                    className="p-2 w-full border-blue-500 border rounded-lg"
                    disabled={true}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mb-10"></div>
        </div>
      )}
    </div>
  );
};

export default LoanDetails;
