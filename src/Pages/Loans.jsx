import axios from "axios";
import React, { useState, useEffect } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import offers from "../assets/offers.svg";
import logo from "../assets/fundkaro.svg";
import { Link, useParams } from "react-router-dom";
import forwardcoin from "../assets/forwardcoin.png";
import backwardcoin from "../assets/backwardcoin.png";
import { IoIosArrowBack } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import LoanForm from "../components/LoanForm";
import { useUser } from "../context/UserContext";

const dummyLoans = [
  {
    _id: "1",
    vendor: "HDFC Bank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/HDFC_Bank_Logo.svg",
    maxLoanAmount: "₹50 Lakhs",
    minScoreRequired: 750,
    ratesMax: 12.5,
    ratesMin: 8.5,
    tenureMin: 1,
    tenureMax: 20,
    offer: {
      isValid: true,
      offerMsg: "Special rate for salaried professionals",
    },
  },
  {
    _id: "2",
    vendor: "ICICI Bank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/ICICI_Bank_Logo.svg",
    maxLoanAmount: "₹75 Lakhs",
    minScoreRequired: 700,
    ratesMax: 13.0,
    ratesMin: 9.0,
    tenureMin: 1,
    tenureMax: 25,
    offer: {
      isValid: true,
      offerMsg: "Zero processing fee for first-time borrowers",
    },
  },
  {
    _id: "3",
    vendor: "State Bank of India",
    logo: "https://upload.wikimedia.org/wikipedia/en/5/58/State_Bank_of_India_logo.svg",
    maxLoanAmount: "₹1 Crore",
    minScoreRequired: 650,
    ratesMax: 11.5,
    ratesMin: 7.5,
    tenureMin: 1,
    tenureMax: 30,
    offer: {
      isValid: true,
      offerMsg: "Government employee special rates",
    },
  },
  {
    _id: "4",
    vendor: "Axis Bank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Axis_Bank_Logo.svg",
    maxLoanAmount: "₹2 Crores",
    minScoreRequired: 720,
    ratesMax: 14.0,
    ratesMin: 9.5,
    tenureMin: 1,
    tenureMax: 20,
    offer: {
      isValid: true,
      offerMsg: "Quick approval in 24 hours",
    },
  },
  {
    _id: "5",
    vendor: "Kotak Mahindra Bank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Kotak_Mahindra_Bank_logo.svg",
    maxLoanAmount: "₹3 Crores",
    minScoreRequired: 680,
    ratesMax: 13.5,
    ratesMin: 8.0,
    tenureMin: 1,
    tenureMax: 25,
    offer: {
      isValid: true,
      offerMsg: "Flexible EMI options available",
    },
  },
  {
    _id: "6",
    vendor: "Punjab National Bank",
    logo: "https://upload.wikimedia.org/wikipedia/en/3/36/Punjab_National_Bank_logo.svg",
    maxLoanAmount: "₹40 Lakhs",
    minScoreRequired: 600,
    ratesMax: 12.0,
    ratesMin: 8.5,
    tenureMin: 1,
    tenureMax: 15,
    offer: {
      isValid: true,
      offerMsg: "Senior citizen special discount",
    },
  },
];



const Tooltip = ({ children, content }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute z-20 w-40 p-2 mt-2 text-sm text-white bg-darkPrimary rounded-lg shadow-lg -left-16 top-full animate-fadeIn cursor-pointer">
          {content.isValid && content.offerMsg}
        </div>
      )}
    </div>
  );
};

const Loans = () => {
  const { categoryID } = useParams();
  const { user } = useUser();
  const [loans, setLoans] = useState(dummyLoans);
  const [filteredLoans, setFilteredLoans] = useState(dummyLoans);

  // Filter state
  const [filters, setFilters] = useState({
    bankName: '',
    rateMin: 0,
    rateMax: 100,
    tenureMin: 0,
    tenureMax: 30,
    cibilMin: 0,
    cibilMax: 900,
  });

  useEffect(() => {
    // Filter loans
    const filtered = loans.filter((loan) => {
      const bankMatch = !filters.bankName || loan.vendor.toLowerCase().includes(filters.bankName.toLowerCase());
      const rateMatch = loan.ratesMax <= filters.rateMax && loan.ratesMin >= filters.rateMin;
      const tenureMatch = loan.tenureMin <= filters.tenureMax && loan.tenureMax >= filters.tenureMin;
      const cibilMatch = loan.minScoreRequired >= filters.cibilMin && loan.minScoreRequired <= filters.cibilMax;
      return bankMatch && rateMatch && tenureMatch && cibilMatch;
    });

    setFilteredLoans(filtered);
  }, [filters, loans]);

  // Uncomment and integrate your actual API call when ready
  // const token = localStorage.getItem("token");
  // const fetchLoans = async () => {
  //   try {
  //     const { data } = await axios.post(
  //       "/api/loan/find",
  //       {
  //         categoryId: categoryID,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setLoans(data.loans);
  //   } catch (err) {
  //     console.error("Error fetching loans:", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchLoans();
  // }, []);

  const [checkedLoans, setCheckedLoans] = useState([]);
  const handleCheckboxChange = (loanId) => {
    if (checkedLoans.includes(loanId)) {
      setCheckedLoans(checkedLoans.filter((id) => id !== loanId));
    } else {
      setCheckedLoans([...checkedLoans, loanId]);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const handleSubmit = async () => {
    if (!checkedLoans.length) {
      return toast.error("Please select at least one loan to proceed!");
    }
    setModalVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col"> {/* Use flex-col to stack header and main content */}
      {/* Header */}
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-primaryFont",
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
            backgroundColor: "#FFF7ED",
          },
        }}
      />
      <header className="w-full bg-gradient-to-r from-darkPrimary to-lightPrimary z-20 py-2 sm:py-4 flex justify-between items-center px-4 md:px-8 shadow-lg fixed top-0"> {/* Changed to <header> for semantic HTML */}
        <img src={logo} className="h-10 sm:h-12 ml-2" alt="FundKaro Logo" />
        <div className="text-white text-base sm:text-xl font-primaryFont font-extrabold hidden lg:block text-center flex-grow">
          Empower Your Journey, Fund Your Tomorrow - Choose FundKa₹o
        </div>
        <div className="relative">
          <img
            src={forwardcoin}
            alt="forward coin"
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-20 sm:w-24 lg:w-28 animate-float"
          />
          <img
            src={backwardcoin}
            alt="backward coin"
            className="absolute -right-8 top-1/2 -translate-y-1/2 w-16 sm:w-20 lg:w-24 -z-10 animate-float-reverse"
          />
        </div>
      </header>

      {/* Main content area - This will scroll */}
      <main className="flex-grow pt-[100px] sm:pt-[110px] pb-20 px-4 sm:px-8 lg:px-12 fixed"> {/* Added flex-grow, increased top padding dynamically based on header height */}
        {/* Back to Dashboard Link - Positioned relative to the main content flow */}
        <Link
          to={"/dashboard"}
          className="mb-6 inline-flex items-center font-semibold text-blue-600 font-primaryFont text-lg sm:text-xl hover:text-blue-800 transition-colors duration-200"
        >
          <IoIosArrowBack className="mr-1" color="blue" />
          Dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Filter Section */}
          <div className="md:col-span-3 lg:col-span-3 bg-white shadow-xl rounded-lg p-6 h-fit sticky top-[100px] sm:top-[110px] border border-gray-200 z-10"> {/* Adjusted sticky top to match main content padding */}
            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Filter Loans</h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Bank Name filter */}
              <div>
                <label
                  htmlFor="bankName"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Bank Name:
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={filters.bankName}
                  onChange={(e) =>
                    setFilters({ ...filters, bankName: e.target.value })
                  }
                  className="shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., HDFC, SBI"
                />
              </div>

              {/* Interest Rate filter */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-4">
                  Interest Rate (%):
                </label>
                <Slider
                  range
                  min={0}
                  max={100}
                  value={[filters.rateMin, filters.rateMax]}
                  onChange={(value) =>
                    setFilters({
                      ...filters,
                      rateMin: value[0],
                      rateMax: value[1],
                    })
                  }
                  trackStyle={[{ backgroundColor: '#3B82F6' }]}
                  handleStyle={[{ borderColor: '#3B82F6' }, { borderColor: '#3B82F6' }]}
                  railStyle={{ backgroundColor: '#E0E0E0' }}
                />
                <div className="flex justify-between mt-3 text-sm text-gray-600">
                  <span>{filters.rateMin}%</span>
                  <span>{filters.rateMax}%</span>
                </div>
              </div>

              {/* Tenure filter */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-4">
                  Tenure (years):
                </label>
                <Slider
                  range
                  min={0}
                  max={30}
                  value={[filters.tenureMin, filters.tenureMax]}
                  onChange={(value) =>
                    setFilters({
                      ...filters,
                      tenureMin: value[0],
                      tenureMax: value[1],
                    })
                  }
                  trackStyle={[{ backgroundColor: '#3B82F6' }]}
                  handleStyle={[{ borderColor: '#3B82F6' }, { borderColor: '#3B82F6' }]}
                  railStyle={{ backgroundColor: '#E0E0E0' }}
                />
                <div className="flex justify-between mt-3 text-sm text-gray-600">
                  <span>{filters.tenureMin} years</span>
                  <span>{filters.tenureMax} years</span>
                </div>
              </div>

              {/* CIBIL Score filter */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-4">
                  CIBIL Score:
                </label>
                <Slider
                  range
                  min={0}
                  max={900}
                  value={[filters.cibilMin, filters.cibilMax]}
                  onChange={(value) =>
                    setFilters({
                      ...filters,
                      cibilMin: value[0],
                      cibilMax: value[1],
                    })
                  }
                  trackStyle={[{ backgroundColor: '#3B82F6' }]}
                  handleStyle={[{ borderColor: '#3B82F6' }, { borderColor: '#3B82F6' }]}
                  railStyle={{ backgroundColor: '#E0E0E0' }}
                />
                <div className="flex justify-between mt-3 text-sm text-gray-600">
                  <span>{filters.cibilMin}</span>
                  <span>{filters.cibilMax}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Cards Section */}
          <div className="md:col-span-9 lg:col-span-9 w-full overflow-scroll h-4/5 pb-[320px]"> {/* Removed fixed height and overflow-y-auto here */}
            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => (
                <div
                  key={loan._id}
                  className="bg-white p-5 lg:p-8 w-full rounded-xl shadow-md border border-gray-200 flex items-center justify-between hover:shadow-lg hover:border-darkPrimary transition-all duration-300 my-4 cursor-pointer"
                >
                  {/* Checkbox */}
                  <div className="flex-shrink-0 mr-4">
                    <input
                      type="checkbox"
                      checked={checkedLoans.includes(loan._id)}
                      onChange={() => handleCheckboxChange(loan._id)}
                      className="size-7 rounded-md border-blue-500 text-blue-500 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 checked:text-white cursor-pointer"
                    />
                  </div>

                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-8 gap-4 items-center text-center">
                    {/* Bank Logo and Name */}
                    <div className="col-span-full sm:col-span-1 md:col-span-2 flex flex-col items-center justify-center space-y-2">
                      <img
                        src={loan.logo}
                        alt={`${loan.vendor} Logo`}
                        className="rounded-full w-16 h-16 object-contain border border-gray-200 p-1"
                      />
                      <h4 className="text-base sm:text-lg font-bold text-gray-800">
                        {loan.vendor}
                      </h4>
                    </div>

                    {/* Loan Amount */}
                    <div className="col-span-full sm:col-span-1 md:col-span-1 text-center">
                      <h2 className="text-xs sm:text-sm font-medium text-gray-500">Loan Amount</h2>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                        {loan.maxLoanAmount}
                      </p>
                    </div>

                    {/* Score Required */}
                    <div className="col-span-full sm:col-span-1 md:col-span-1 text-center">
                      <h2 className="text-xs sm:text-sm font-medium text-gray-500">Min. CIBIL</h2>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                        {">"} {loan.minScoreRequired}
                      </p>
                    </div>

                    {/* Interest Rates */}
                    <div className="col-span-full sm:col-span-2 md:col-span-2 text-center">
                      <h2 className="text-xs sm:text-sm font-medium text-gray-500">Interest Rates</h2>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                        {loan.ratesMin}% - {loan.ratesMax}%
                      </p>
                    </div>

                    {/* Tenure */}
                    <div className="col-span-full sm:col-span-1 md:col-span-1 text-center">
                      <h2 className="text-xs sm:text-sm font-medium text-gray-500">Tenure</h2>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                        {loan.tenureMin}-{loan.tenureMax} years
                      </p>
                    </div>

                    {/* Offers */}
                    <div className="col-span-full sm:col-span-1 md:col-span-1 flex justify-center mt-2 md:mt-0">
                      <Tooltip content={loan.offer}>
                        <div className="w-fit px-3 py-1 flex gap-2 items-center rounded-full text-blue-600 border border-blue-600 text-sm font-medium bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
                          <img
                            src={offers}
                            alt="offers icon"
                            className="w-5 h-5"
                          />
                          <span>Offers</span>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 text-lg py-10">
                No loans found matching your criteria. Try adjusting your filters!
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Submit Button */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-inner border-t border-gray-100 flex justify-center z-30"> {/* Changed to <footer> for semantic HTML */}
        <button
          className="px-8 py-3 rounded-lg text-white font-bold font-primaryFont bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-lg text-lg"
          onClick={handleSubmit}
        >
          Apply for Selected Loans ({checkedLoans.length})
        </button>
      </footer>

      {/* Loan Form Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${modalVisible ? 'bg-black bg-opacity-50' : 'hidden'}`}>
        <LoanForm
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          existingDocuments={user?.documents || []}
          selectedLoanIds={checkedLoans}
        />
      </div>

      {/* Floating coin animations (CSS remains the same) */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translatey(0px); }
          50% { transform: translatey(-10px); }
          100% { transform: translatey(0px); }
        }
        @keyframes float-reverse {
          0% { transform: translatey(0px); }
          50% { transform: translatey(10px); }
          100% { transform: translatey(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 3.5s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        /* Custom scrollbar for Webkit browsers */
        .no-scrollbar::-webkit-scrollbar {
          width: 8px; /* width of the scrollbar */
        }
        .no-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; /* color of the tracking area */
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar-thumb {
          background: #888; /* color of the scroll thumb */
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555; /* color of the scroll thumb on hover */
        }
      `}</style>
    </div>
  );
};

export default Loans;