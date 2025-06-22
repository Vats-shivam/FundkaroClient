import axios from "axios";
import React, { useState, useEffect } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import offers from "../assets/offers.svg";
import logo from "../assets/fundkaro.svg";
import { Link, useAsyncError, useParams } from "react-router-dom";
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
    logo: "/placeholder.svg?height=64&width=64",
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
    logo: "/placeholder.svg?height=64&width=64",
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
    vendor: "SBI",
    logo: "/placeholder.svg?height=64&width=64",
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
    logo: "/placeholder.svg?height=64&width=64",
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
    vendor: "Kotak Mahindra",
    logo: "/placeholder.svg?height=64&width=64",
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
    logo: "/placeholder.svg?height=64&width=64",
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
]
const Tooltip = ({ children, content }) => {
  const [visible, setVisible] = useState(false);
  console.log(content);
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute z-10 w-40 p-2 mt-2 text-sm text-white bg-darkPrimary rounded-lg shadow-lg -left-16 top-full cursor-pointer">
          {content.isValid && content.offerMsg}
        </div>
      )}
    </div>
  );
};

const Loans = () => {
  const { categoryID } = useParams();
  const {user} = useUser();
  const [loans, setLoans] = useState(dummyLoans)
  const [filteredLoans, setFilteredLoans] = useState(dummyLoans)

  // Filter state (you'll need to fill in the default filter values)
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
      const bankMatch = !filters.bankName || loan.vendor.toLowerCase().includes(filters.bankName.toLowerCase())
      const rateMatch = loan.ratesMax <= filters.rateMax && loan.ratesMin >= filters.rateMin
      const tenureMatch = loan.tenureMin <= filters.tenureMax && loan.tenureMax >= filters.tenureMin
      const cibilMatch = loan.minScoreRequired >= filters.cibilMin && loan.minScoreRequired <= filters.cibilMax
      return bankMatch && rateMatch && tenureMatch && cibilMatch
    })

    setFilteredLoans(filtered)
  }, [filters, loans])
  const token = localStorage.getItem("token");
  const fetchLoans = async () => {
    try {
      const { data } = await axios.post(
        "/api/loan/find",
        {
          categoryId: categoryID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data, "Parent");
      setLoans(data.loans);
    } catch (err) {
      console.log(err);
    }
  };
  // useEffect(() => {
  //   fetchLoans();
  // }, []);
  const [checkedLoans, setCheckedLoans] = useState([]);

  // Function to handle checkbox changes
  const handleCheckboxChange = (loanId) => {
    console.log("hiiiii");
    if (checkedLoans.includes(loanId)) {
      setCheckedLoans(checkedLoans.filter((id) => id !== loanId));
    } else {
      setCheckedLoans([...checkedLoans, loanId]);
    }
  };
  const [formFields, setFormFields] = useState([]);
  const handleSubmit = async () => {
    if (!checkedLoans.length) {
      return toast.error("NO LOANS SELECTED");
    }
    try {
      // const { data } = await axios.post("/api/category/find", {
      //   id: categoryID,
      // });
      // console.log(data);
      // setFormFields(data.formFields);
      setModalVisible(true);
    } catch (err) {
      console.log(err);
      setModalVisible(false);
    }
    console.log(checkedLoans);
  };
  const [modal, setModalVisible] = useState(false);
  useEffect(() => {
    console.log(modal);
  }, [modal]);

  return (
    <div className="relative">
      {/* Header */}
      <Toaster
        position="top-center"
        toastOptions={{
          className: "",
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
        }}
      />
      <div className="w-full fixed bg-gradient-to-r from-darkPrimary to-lightPrimary z-10 py-1 sm:py-4 flex justify-between px-1 sm:px-4">
        <img src={logo} className="h-9 ml-4" alt="Logo" />
        <div className="text-white text-xl font-primaryFont font-extrabold lg:block hidden">
          Empower Your Journey, Fund Your Tomorrow - Choose FundKa₹o
        </div>
        <div>
          <img
            src={forwardcoin}
            alt="nav-logo"
            className="fixed right-4 sm:w-[6rem] sm:right-14 lg:right-24 w-20 lg:w-auto"
          />
          <img
            src={backwardcoin}
            alt="nav-logo"
            className="fixed right-0 w-16 sm:right-8 lg:right-12 -z-10 sm:w-[6rem] lg:w-auto"
          />
        </div>
      </div>
      <Link
        to={"/dashboard"}
        className="absolute top-20 left-10 font-semibold text-blue-500 font-primaryFont flex items-center text-xl"
      >
        <IoIosArrowBack className="" color="blue" />
        Dashboard
      </Link>
      {/* Main content */}
      <div className="w-full relative top-32 flex flex-col justify-center sm:grid sm:grid-cols-4 md:grid-cols-12">
        <div className="mx-auto bg-white shadow-md rounded-lg px-4 pb-8 col-span-2 md:col-span-3 h-fit w-full">
          <h3 className="text-lg font-semibold mb-2">Filter Loans</h3>
          <div className="grid grid-cols-1 gap-4">
            {/* Bank Name filter */}
            <div>
              <label
                htmlFor="bankName"
                className="block text-gray-700 text-sm font-bold mb-2"
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Interest Rate filter */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
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
              />
              <div className="flex justify-between mt-2">
                <span>{filters.rateMin}%</span>
                <span>{filters.rateMax}%</span>
              </div>
            </div>

            {/* Tenure filter */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
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
              />
              <div className="flex justify-between mt-2">
                <span>{filters.tenureMin} years</span>
                <span>{filters.tenureMax} years</span>
              </div>
            </div>

            {/* CIBIL Score filter */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
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
              />
              <div className="flex justify-between mt-2">
                <span>{filters.cibilMin}</span>
                <span>{filters.cibilMax}</span>
              </div>
            </div>
          </div>
        </div>
        {/* <div className='col-span-1'></div> */}
        {/* Loan Cards Section */}
        <div className="px-4 col-span-4 md:col-span-9 w-full lg:px-16 overflow-scroll h-[78vh] no-scrollbar pt-12">
          {filteredLoans.map((loan) => (
            <div
              key={loan._id}
              className="p-4 lg:py-8 w-full rounded-lg h-auto border-lightPrimary border items-center text-center grid grid-cols-12 hover:border-darkPrimary my-4"
            >
              {/* Checkbox */}
              <div className="flex justify-center col-span-1">
                <input
                  type="checkbox"
                  checked={checkedLoans.includes(loan._id)}
                  onChange={() => handleCheckboxChange(loan._id)}
                  className="size-6 rounded-full border-blue-500 text-blue-500 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500 checked:text-white"
                />
              </div>
              <div className="items-center col-span-11 grid grid-cols-6 sm:grid-cols-6 md:grid-cols-12 gap-4">
                {/* Bank Logo and Name */}
                <div className="col-span-6 sm:col-span-5 md:col-span-2 flex gap-4 items-center">
                  <img
                    src={loan.logo}
                    alt={loan.vendor}
                    className="rounded-full w-12 h-auto md:w-16"
                  />
                  <h4 className="text-base md:text-lg font-semibold">
                    {loan.vendor}
                  </h4>
                </div>

                {/* Loan Amount */}
                <div className="col-span-3 md:col-span-2">
                  <h2 className="text-sm font-medium">Loan Amount</h2>
                  <p className="text-base md:text-lg font-semibold">
                    {loan.maxLoanAmount}
                  </p>
                </div>

                {/* Score Required */}
                <div className="col-span-3 md:col-span-2">
                  <h2 className="text-sm font-medium">Score Required</h2>
                  <p className="text-base md:text-lg font-semibold">
                    {">"} {loan.minScoreRequired}
                  </p>
                </div>

                {/* Max Rate */}
                <div className="col-span-3 md:col-span-1">
                  <h2 className="text-sm font-medium">Max Rate</h2>
                  <p className="text-base md:text-lg font-semibold">
                    {loan.ratesMax}
                  </p>
                </div>

                {/* Min Rate */}
                <div className="col-span-3 md:col-span-1">
                  <h2 className="text-sm font-medium">Min Rate</h2>
                  <p className="text-base md:text-lg font-semibold">
                    {loan.ratesMin}
                  </p>
                </div>

                {/* Tenure */}
                <div className="col-span-6 md:col-span-2">
                  <h2 className="text-sm font-medium">Tenure</h2>
                  <p className="text-base md:text-lg font-semibold">
                    {loan.tenureMin}-{loan.tenureMax} years
                  </p>
                </div>

                {/* Offers */}
                <div className="col-span-6 md:col-span-2">
                  <Tooltip content={loan.offer}>
                    <div className="w-fit border px-2 flex gap-1 rounded-lg text-blue-500 border-blue-500 text-sm p-2">
                      <img
                        src={offers}
                        alt="offers"
                        className="w-4 h-4 md:w-6 md:h-6"
                      />
                      <div>Offers</div>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="sm:col-span-3 md:col-span-10"></div>
        <button
          className="mx-auto sm:col-span-1 p-4 rounded-lg text-white font-bold font-primaryFont bg-blue-500"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <div className="absolute top-32 w-full justify-center flex bg-white text-white">
         <LoanForm
          isVisible={modal}
          onClose={()=>setModalVisible(false)}
          existingDocuments={user?.documents || []} 
        />
      </div>
    </div>
  );
};

export default Loans;
