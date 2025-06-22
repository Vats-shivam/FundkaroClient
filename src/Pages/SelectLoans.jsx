import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// --- ICONS & ASSETS ---
import { IoIosArrowBack } from "react-icons/io";
import { IoCheckmarkCircle, IoShieldCheckmark, IoPricetag } from "react-icons/io5";
import logo from "../assets/fundkaro.svg";
import forwardcoin from "../assets/forwardcoin.png";
import backwardcoin from "../assets/backwardcoin.png";

// --- DUMMY DATA ---
// This simulates the data for a specific application that has been VERIFIED.
// These are not general loan listings, but specific, approved offers for the user.
const dummyVerifiedApplication = {
  _id: "app001",
  categoryId: {
    category: "Personal Loan",
  },
  // The list of loans that have been approved by vendors for this specific application
  verifiedLoans: [
    {
      _id: "verified_loan_1",
      vendor: "HDFC Bank",
      logo: "https://i.imgur.com/MA2D96y.png",
      approvedAmount: 4500000,
      finalRate: 8.75, // The final, non-negotiable rate offered
      maxTenure: 5, // in years
      processingFee: 5000,
      offerMessage: "Digital processing, no paperwork required.",
    },
    {
      _id: "verified_loan_2",
      vendor: "Axis Bank",
      logo: "https://i.imgur.com/rOenA9T.png",
      approvedAmount: 4800000,
      finalRate: 9.10,
      maxTenure: 7,
      processingFee: 0, // Special offer
      offerMessage: "Zero processing fee exclusive offer!",
    },
    {
      _id: "verified_loan_3",
      vendor: "ICICI Bank",
      logo: "https://i.imgur.com/qgSgSj2.png",
      approvedAmount: 5000000,
      finalRate: 8.95,
      maxTenure: 5,
      processingFee: 7500,
      offerMessage: "Quick disbursal within 24 hours of selection.",
    },
  ],
};


// --- SUB-COMPONENTS ---

const SkeletonCard = () => (
    <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 animate-pulse">
        <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div className="flex-1 grid grid-cols-4 gap-4">
            <div className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
            </div>
             <div className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
            </div>
             <div className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
            </div>
             <div className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
            </div>
        </div>
    </div>
);

const LoanOfferCard = ({ loan, onSelect, isSelected }) => (
  <div
    className={`p-4 w-full rounded-lg border items-center transition-all duration-200 cursor-pointer 
        ${isSelected ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-white border-gray-200 hover:border-gray-400'}`}
    onClick={() => onSelect(loan._id)}
  >
    <div className="flex items-center gap-4">
      {/* Checkbox */}
      <div className="flex justify-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(loan._id)}
          className="size-6 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-y-4 md:gap-x-4 items-center">
        {/* Bank Logo and Name */}
        <div className="md:col-span-3 flex gap-4 items-center">
          <img src={loan.logo} alt={loan.vendor} className="rounded-full w-12 h-12 md:w-16 md:h-16" />
          <h4 className="text-base md:text-lg font-semibold text-gray-800">{loan.vendor}</h4>
        </div>
        
        {/* Key Metrics */}
        <div className="md:col-span-2 text-center md:text-left">
          <h2 className="text-sm text-gray-500">Approved Amount</h2>
          <p className="text-lg font-bold text-gray-900">₹{loan.approvedAmount.toLocaleString('en-IN')}</p>
        </div>
        <div className="md:col-span-2 text-center md:text-left">
          <h2 className="text-sm text-gray-500">Interest Rate</h2>
          <p className="text-lg font-bold text-gray-900">{loan.finalRate.toFixed(2)}% p.a.</p>
        </div>
        <div className="md:col-span-2 text-center md:text-left">
          <h2 className="text-sm text-gray-500">Processing Fee</h2>
          <p className="text-lg font-bold text-gray-900">₹{loan.processingFee.toLocaleString('en-IN')}</p>
        </div>

        {/* Offer Message */}
        <div className="md:col-span-3">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-md">
                <IoPricetag />
                <p className="text-sm font-medium">{loan.offerMessage}</p>
            </div>
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

const SelectLoans = () => {
  const { applicationId } = useParams(); // Get the application ID from the URL
  const [application, setApplication] = useState(null);
  const [loanOptions, setLoanOptions] = useState([]);
  const [selectedLoans, setSelectedLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch verified loan offers for this application
  useEffect(() => {
    const fetchVerifiedLoans = async () => {
      setLoading(true);
      try {
        // --- API call to fetch the specific application details ---
        // const { data } = await axios.get(`/api/application/verified-offers/${applicationId}`);
        // if (data.success) {
        //   setApplication(data.application);
        //   setLoanOptions(data.application.verifiedLoans);
        // }

        // Simulating API call
        setTimeout(() => {
          setApplication(dummyVerifiedApplication);
          setLoanOptions(dummyVerifiedApplication.verifiedLoans);
          setLoading(false);
        }, 1500);
      } catch (err) {
        console.error(err);
        toast.error("Could not fetch loan offers.");
        setLoading(false);
      }
    };

    fetchVerifiedLoans();
  }, [applicationId]);

  // Handle checkbox selection
  const handleSelectLoan = (loanId) => {
    setSelectedLoans((prevSelected) =>
      prevSelected.includes(loanId)
        ? prevSelected.filter((id) => id !== loanId)
        : [...prevSelected, loanId]
    );
  };

  // Handle final submission
  const handleConfirmSelection = async () => {
    if (selectedLoans.length === 0) {
      toast.error("Please select at least one loan offer to proceed.");
      return;
    }
    
    const loadingToast = toast.loading("Confirming your selection...");

    try {
        // --- API call to submit the user's final choice ---
        // await axios.post('/api/application/confirm-selection', {
        //     applicationId: application._id,
        //     selectedLoanIds: selectedLoans
        // });

        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success("Your selection has been submitted successfully!", { id: loadingToast });
        console.log("Confirmed Loan IDs:", selectedLoans);
        // You might want to navigate the user to a success page or back to their dashboard
        // navigate(`/application-status/${application._id}`);

    } catch (err) {
        toast.error("There was a problem submitting your selection. Please try again.", { id: loadingToast });
        console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      {/* Header */}
      <div className="w-full sticky top-0 bg-gradient-to-r from-darkPrimary to-lightPrimary z-10 py-1 sm:py-4 flex justify-between px-1 sm:px-4 items-center">
        <img src={logo} className="h-9 ml-4" alt="Logo" />
        <div className="text-white text-lg font-semibold lg:block hidden">
          Your Approved Offers - The Final Step!
        </div>
        <div>
          <img src={forwardcoin} alt="nav-logo" className="absolute right-4 top-2 sm:w-[6rem] sm:right-14 lg:right-24 w-20 lg:w-auto" />
          <img src={backwardcoin} alt="nav-logo" className="absolute right-0 top-2 w-16 sm:right-8 lg:right-12 -z-10 sm:w-[6rem] lg:w-auto" />
        </div>
      </div>
      
      <main className="w-full max-w-6xl mx-auto px-4 py-8">
        <Link to={`/loan-details/${applicationId}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition-colors mb-6">
          <IoIosArrowBack size={20} />
          Back to Application Details
        </Link>
        
        {/* Page Header */}
        <div className="text-center mb-8">
            <IoShieldCheckmark className="mx-auto text-5xl text-green-500 mb-2"/>
            <h1 className="text-3xl font-bold text-gray-900">Congratulations! You're Approved.</h1>
            <p className="text-lg text-gray-600 mt-2">
                Select the final {application?.categoryId?.category} offer(s) you wish to proceed with.
            </p>
        </div>

        {/* Loan Offers List */}
        <div className="space-y-4">
            {loading ? (
                // Skeleton Loader
                Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : loanOptions.length > 0 ? (
                // Actual Loan Cards
                loanOptions.map((loan) => (
                    <LoanOfferCard
                        key={loan._id}
                        loan={loan}
                        onSelect={handleSelectLoan}
                        isSelected={selectedLoans.includes(loan._id)}
                    />
                ))
            ) : (
                // No offers state
                <div className="text-center py-16 bg-white rounded-lg border border-dashed">
                    <h3 className="text-xl font-semibold">No Verified Offers Found</h3>
                    <p className="text-gray-500 mt-2">We couldn't find any approved loan offers for this application at the moment.</p>
                </div>
            )}
        </div>
        
        {/* Submission Button */}
        {!loading && loanOptions.length > 0 && (
            <div className="mt-10 flex justify-end">
                <button
                    onClick={handleConfirmSelection}
                    disabled={selectedLoans.length === 0}
                    className="flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <IoCheckmarkCircle size={22}/>
                    Confirm Selection ({selectedLoans.length})
                </button>
            </div>
        )}
      </main>
    </div>
  );
};

export default SelectLoans;