import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import logo from "../assets/fundkaro.svg";

const AppliedLoans = () => {
  const { user } = useContext(UserContext);
  const [loans, setLoans] = useState([
    {
      "categoryId": {
        "category": "Home Loan",
        "logo": "https://www.w3schools.com/images/lamp.jpg"
      },
      "status": "Pending",
      "_id": "loan1",
      "isSelectionDone": false,
      "loans": [
        {
          "loan": {
            "vendor": "SBI",
            "logo": "https://www.w3schools.com/images/lamp.jpg"
          }
        },
        {
          "loan": {
            "vendor": "HDFC",
            "logo": "https://www.w3schools.com/images/lamp.jpg"
          }
        }
      ]
    },
    {
      "categoryId": {
        "category": "Car Loan",
        "logo": "https://www.w3schools.com/images/lamp.jpg"
      },
      "status": "Verified",
      "_id": "loan2",
      "isSelectionDone": false,
      "loans": [
        {
          "loan": {
            "vendor": "Axis Bank",
            "logo": "https://www.w3schools.com/images/lamp.jpg"
          }
        },
        {
          "loan": {
            "vendor": "ICICI",
            "logo": "https://www.w3schools.com/images/lamp.jpg"
          }
        }
      ]
    },
    {
      "categoryId": {
        "category": "Education Loan",
        "logo": "https://www.w3schools.com/images/lamp.jpg"
      },
      "status": "Rejected",
      "_id": "loan3",
      "isSelectionDone": true,
      "loans": [
        {
          "loan": {
            "vendor": "Bank of Baroda",
            "logo": "https://www.w3schools.com/images/lamp.jpg"
          }
        },
        {
          "loan": {
            "vendor": "PNB",
            "logo": "https://www.w3schools.com/images/lamp.jpg"
          }
        }
      ]
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetchApplication();
  },[])

  const fetchApplication = async () => {
    try {
      const response = await axios.post("/api/application/find", { userId: user.user });
      console.log(response.data);
      if (response.data.status) {
        setLoans(response.data.applications);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-blue-500';
      case 'Rejected': return 'bg-red-500';
      case 'Verified': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className='w-screen'>
      <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-darkPrimary to-lightPrimary flex h-16 items-center py-2 px-4">
        <img src={logo} className="w-32 h-9 ml-4" alt="Logo" />
      </header>
      <Link to="/dashboard" className='absolute top-20 left-10 font-semibold text-blue-500 flex items-center text-xl'>
        <IoIosArrowBack color='blue' />
        Dashboard
      </Link>

      <div className='lg:w-[75%] h-[80vh] mx-auto w-full mt-32'>
        <div className='h-fit p-4 flex flex-wrap gap-4 items-start'>
          {loading ? (
            <div className='flex flex-col items-center justify-center py-10'>
              <div className="loader"></div>
              <p className="text-blue-500 text-xl">Loading</p>
            </div>
          ) : (
            loans.length > 0 ? (
              loans.map((loan) => (
                <div key={loan.categoryId.category} className="w-[22.5rem] h-[24rem] bg-gradient-to-r from-lightPrimary to-darkPrimary rounded-lg flex flex-col gap-2 p-4 text-lg font-medium text-white border-secondary border-4 shadow-md hover:scale-105">
                  <div className="flex items-center mb-2 bg-white p-2 rounded-lg">
                    <img src={loan.categoryId.logo} alt="Category Logo" className="w-8 h-8 mr-2 rounded-full" />
                    <h2 className="font-bold text-xl bg-clip-text inline-block bg-gradient-to-r from-darkPrimary to-lightPrimary font-bold text-transparent">{loan.categoryId.category}</h2>
                  </div>
                  <h2 className='text-center'>Applied Loans</h2>
                  <div className="flex gap-4 mb-2">
                    {loan.loans.map((l, index) => (
                      <div key={index} className="flex items-center w-[48%] bg-white p-2 rounded-lg">
                        <img src={l.loan.logo} alt="Category Logo" className="w-8 h-8 mr-2 rounded-full" />
                        <h2 className="font-bold text-lg bg-clip-text inline-block bg-gradient-to-r from-darkPrimary to-lightPrimary font-bold text-transparent">{l.loan.vendor}</h2>
                      </div>
                    ))}
                  </div>
                  <div className={`p-2 rounded-lg ${statusColor(loan.status)}`}>
                    <p className="text-white font-bold text-center">
                      Application Status: {loan.status}
                    </p>
                  </div>

                  <Link to={`/loan-details/${loan._id}`} className="block mt-2 bg-blue-600 py-2 rounded-lg text-white text-center">
                    View Details
                  </Link>

                  {loan.status === 'Verified' && !loan.isSelectionDone && (
                    <Link to={`/select-loans/${loan._id}`} className="block mt-2 bg-green-500 py-2 rounded-lg text-white text-center">
                      Apply Loans
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No loans found.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedLoans;
