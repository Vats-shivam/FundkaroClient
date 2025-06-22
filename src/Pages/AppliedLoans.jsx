// import React, { useContext, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { IoIosArrowBack } from 'react-icons/io';
// import { UserContext } from '../context/UserContext';
// import axios from 'axios';
// import logo from "../assets/fundkaro.svg";

// const AppliedLoans = () => {
//   const { user } = useContext(UserContext);
//   const [loans, setLoans] = useState([
//     {
//       "categoryId": {
//         "category": "Home Loan",
//         "logo": "https://www.w3schools.com/images/lamp.jpg"
//       },
//       "status": "Pending",
//       "_id": "loan1",
//       "isSelectionDone": false,
//       "loans": [
//         {
//           "loan": {
//             "vendor": "SBI",
//             "logo": "https://www.w3schools.com/images/lamp.jpg"
//           }
//         },
//         {
//           "loan": {
//             "vendor": "HDFC",
//             "logo": "https://www.w3schools.com/images/lamp.jpg"
//           }
//         }
//       ]
//     },
//     {
//       "categoryId": {
//         "category": "Car Loan",
//         "logo": "https://www.w3schools.com/images/lamp.jpg"
//       },
//       "status": "Verified",
//       "_id": "loan2",
//       "isSelectionDone": false,
//       "loans": [
//         {
//           "loan": {
//             "vendor": "Axis Bank",
//             "logo": "https://www.w3schools.com/images/lamp.jpg"
//           }
//         },
//         {
//           "loan": {
//             "vendor": "ICICI",
//             "logo": "https://www.w3schools.com/images/lamp.jpg"
//           }
//         }
//       ]
//     },
//     {
//       "categoryId": {
//         "category": "Education Loan",
//         "logo": "https://www.w3schools.com/images/lamp.jpg"
//       },
//       "status": "Rejected",
//       "_id": "loan3",
//       "isSelectionDone": true,
//       "loans": [
//         {
//           "loan": {
//             "vendor": "Bank of Baroda",
//             "logo": "https://www.w3schools.com/images/lamp.jpg"
//           }
//         },
//         {
//           "loan": {
//             "vendor": "PNB",
//             "logo": "https://www.w3schools.com/images/lamp.jpg"
//           }
//         }
//       ]
//     }
//   ]);
//   const [loading, setLoading] = useState(true);

//   useEffect(()=>{
//     fetchApplication();
//   },[])

//   const fetchApplication = async () => {
//     try {
//       const response = await axios.post("/api/application/find", { userId: user.user });
//       console.log(response.data);
//       if (response.data.status) {
//         setLoans(response.data.applications);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statusColor = (status) => {
//     switch (status) {
//       case 'Pending': return 'bg-blue-500';
//       case 'Rejected': return 'bg-red-500';
//       case 'Verified': return 'bg-green-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   return (
//     <div className='w-screen'>
//       <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-darkPrimary to-lightPrimary flex h-16 items-center py-2 px-4">
//         <img src={logo} className="w-32 h-9 ml-4" alt="Logo" />
//       </header>
//       <Link to="/dashboard" className='absolute top-20 left-10 font-semibold text-blue-500 flex items-center text-xl'>
//         <IoIosArrowBack color='blue' />
//         Dashboard
//       </Link>

//       <div className='lg:w-[75%] h-[80vh] mx-auto w-full mt-32'>
//         <div className='h-fit p-4 flex flex-wrap gap-4 items-start'>
//           {loading ? (
//             <div className='flex flex-col items-center justify-center py-10'>
//               <div className="loader"></div>
//               <p className="text-blue-500 text-xl">Loading</p>
//             </div>
//           ) : (
//             loans.length > 0 ? (
//               loans.map((loan) => (
//                 <div key={loan.categoryId.category} className="w-[22.5rem] h-[24rem] bg-gradient-to-r from-lightPrimary to-darkPrimary rounded-lg flex flex-col gap-2 p-4 text-lg font-medium text-white border-secondary border-4 shadow-md hover:scale-105">
//                   <div className="flex items-center mb-2 bg-white p-2 rounded-lg">
//                     <img src={loan.categoryId.logo} alt="Category Logo" className="w-8 h-8 mr-2 rounded-full" />
//                     <h2 className="font-bold text-xl bg-clip-text inline-block bg-gradient-to-r from-darkPrimary to-lightPrimary font-bold text-transparent">{loan.categoryId.category}</h2>
//                   </div>
//                   <h2 className='text-center'>Applied Loans</h2>
//                   <div className="flex gap-4 mb-2">
//                     {loan.loans.map((l, index) => (
//                       <div key={index} className="flex items-center w-[48%] bg-white p-2 rounded-lg">
//                         <img src={l.loan.logo} alt="Category Logo" className="w-8 h-8 mr-2 rounded-full" />
//                         <h2 className="font-bold text-lg bg-clip-text inline-block bg-gradient-to-r from-darkPrimary to-lightPrimary font-bold text-transparent">{l.loan.vendor}</h2>
//                       </div>
//                     ))}
//                   </div>
//                   <div className={`p-2 rounded-lg ${statusColor(loan.status)}`}>
//                     <p className="text-white font-bold text-center">
//                       Application Status: {loan.status}
//                     </p>
//                   </div>

//                   <Link to={`/loan-details/${loan._id}`} className="block mt-2 bg-blue-600 py-2 rounded-lg text-white text-center">
//                     View Details
//                   </Link>

//                   {loan.status === 'Verified' && !loan.isSelectionDone && (
//                     <Link to={`/select-loans/${loan._id}`} className="block mt-2 bg-green-500 py-2 rounded-lg text-white text-center">
//                       Apply Loans
//                     </Link>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">No loans found.</p>
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AppliedLoans;

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoPersonSharp, IoPeopleSharp, IoBusinessSharp, IoCarSportSharp, IoHomeSharp } from 'react-icons/io5';
import { IoIosArrowBack } from 'react-icons/io';
import { UserContext } from '../context/UserContext';
// import axios from 'axios'; // Backend integration is currently disabled
import logo from "../assets/fundkaro.svg";

// --- DUMMY DATA ---
// This data simulates fetching applications for the current user,
// on behalf of others, and as part of a club.
const dummyLoans = [
  {
    _id: "app001",
    applicantType: 'self',
    categoryId: { category: "Personal Loan" },
    status: "Verified",
    isSelectionDone: false,
    appliedTo: [
      { vendor: "HDFC Bank", logo: "https://i.imgur.com/MA2D96y.png" },
      { vendor: "Axis Bank", logo: "https://i.imgur.com/rOenA9T.png" }
    ]
  },
  {
    _id: "app002",
    applicantType: 'onBehalfOf',
    beneficiary: { name: "Jane Doe", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    categoryId: { category: "Home Loan" },
    status: "Pending",
    isSelectionDone: false,
    appliedTo: [
      { vendor: "SBI", logo: "https://i.imgur.com/jV7c1S2.png" },
      { vendor: "ICICI Bank", logo: "https://i.imgur.com/qgSgSj2.png" },
      { vendor: "Bank of Baroda", logo: "https://i.imgur.com/8MrzTqF.png" }
    ]
  },
  {
    _id: "app003",
    applicantType: 'club',
    clubMembers: [
      { name: "Alice", avatar: "https://randomuser.me/api/portraits/women/7.jpg" },
      { name: "Bob", avatar: "https://randomuser.me/api/portraits/men/9.jpg" },
      // The current user is implicitly the third member
    ],
    categoryId: { category: "Business Loan" },
    status: "Rejected",
    isSelectionDone: true,
    appliedTo: [{ vendor: "PNB", logo: "https://i.imgur.com/v1hTiyU.png" }]
  },
    {
    _id: "app004",
    applicantType: 'self',
    categoryId: { category: "Car Loan" },
    status: "Verified",
    isSelectionDone: true, // A loan has already been selected by the user
    appliedTo: [{ vendor: "Kotak Bank", logo: "https://i.imgur.com/eNjaS10.png" }],
    selectedLoan: { vendor: "Kotak Bank" } // Info about the chosen loan
  }
];


// --- HELPER CONFIGURATION ---

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Rejected: 'bg-red-100 text-red-800 border-red-300',
  Verified: 'bg-green-100 text-green-800 border-green-300',
  default: 'bg-gray-100 text-gray-800 border-gray-300',
};

const categoryIcons = {
  "Personal Loan": <IoPersonSharp className="text-blue-500" size={24} />,
  "Home Loan": <IoHomeSharp className="text-green-500" size={24} />,
  "Business Loan": <IoBusinessSharp className="text-purple-500" size={24} />,
  "Car Loan": <IoCarSportSharp className="text-red-500" size={24} />,
};

// --- SUB-COMPONENTS for better organization ---

const SkeletonCard = () => (
  <div className="w-full bg-white rounded-xl shadow-md border border-gray-200 animate-pulse">
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
    <div className="p-5 space-y-5">
      <div className="space-y-2">
        <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
        <div className="w-3/4 h-8 bg-gray-300 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
        <div className="flex -space-x-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white"></div>
          <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white"></div>
        </div>
      </div>
    </div>
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <div className="w-full h-11 bg-gray-300 rounded-lg"></div>
    </div>
  </div>
);

const ApplicantInfo = ({ loan }) => {
  const renderInfo = () => {
    switch (loan.applicantType) {
      case 'onBehalfOf':
        return (
          <div className="flex items-center gap-3">
            <img src={loan.beneficiary.avatar} alt={loan.beneficiary.name} className="w-10 h-10 rounded-full" />
            <div className='flex flex-col'>
               <span className="text-sm text-gray-500">For</span>
               <span className="font-semibold text-gray-800">{loan.beneficiary.name}</span>
            </div>
          </div>
        );
      case 'club':
        return (
          <div className='flex flex-col gap-2'>
            <div className="font-semibold text-gray-800 flex items-center gap-2">
              <IoPeopleSharp /> Club Application
            </div>
            <div className="flex -space-x-3">
              {loan.clubMembers.map(member => (
                <img key={member.name} src={member.avatar} alt={member.name} title={member.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              ))}
               <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-white shadow-sm" title="You">
                 <IoPersonSharp size={18} />
               </div>
            </div>
          </div>
        );
      case 'self':
      default:
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <IoPersonSharp size={22} />
            </div>
             <div className='flex flex-col'>
               <span className="text-sm text-gray-500">For</span>
               <span className="font-semibold text-gray-800">You</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-2">APPLICANT</h3>
      {renderInfo()}
    </div>
  );
};


const LoanCard = ({ loan }) => {
  const statusClass = statusStyles[loan.status] || statusStyles.default;

  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-gray-200 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Card Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {categoryIcons[loan.categoryId.category] || <IoBusinessSharp size={24} />}
          </div>
          <h2 className="font-bold text-xl text-gray-800">{loan.categoryId.category}</h2>
          <div className={`ml-auto px-3 py-1 text-sm font-semibold rounded-full border ${statusClass}`}>
            {loan.status}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-grow space-y-5">
        <ApplicantInfo loan={loan} />

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">APPLIED TO</h3>
          <div className="flex items-center gap-2">
            {loan.appliedTo.map((l) => (
              <img key={l.vendor} src={l.logo} alt={l.vendor} title={l.vendor} className="w-10 h-10 object-contain rounded-full bg-white p-1 border border-gray-200" />
            ))}
          </div>
        </div>
        
        {loan.isSelectionDone && loan.selectedLoan && (
            <div className='bg-green-50 p-3 rounded-lg'>
                <h3 className="text-sm font-medium text-green-700 mb-1">LOAN SELECTED</h3>
                <p className="font-semibold text-green-900">{loan.selectedLoan.vendor}</p>
            </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={`/loan-details/${loan._id}`} className="w-full text-center px-4 py-2.5 rounded-lg font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors">
            View Details
          </Link>
          {loan.status === 'Verified' && !loan.isSelectionDone && (
            <Link to={`/select-loans/${loan._id}`} className="w-full text-center px-4 py-2.5 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors">
              Select & Apply
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---

const AppliedLoans = () => {
  const { user } = useContext(UserContext); // Still available if needed later
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      try {
        // --- Backend call is disabled, using dummy data ---
        // const response = await axios.post("/api/application/find", { userId: user.user });
        // if (response.data.status) {
        //   setLoans(response.data.applications);
        // }
        
        // Simulate network delay
        setTimeout(() => {
          setLoans(dummyLoans);
          setLoading(false);
        }, 1500);

      } catch (error) {
        console.error(error);
        setLoading(false); // Ensure loading stops on error
      }
    };

    fetchApplication();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className='w-full min-h-screen bg-gray-50'>
      <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-darkPrimary to-lightPrimary flex h-16 items-center py-2 px-4 shadow-md">
        <img src={logo} className="w-32 h-9 ml-4" alt="Logo" />
      </header>

      <main className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12'>
        <div className='mb-8'>
            <Link to="/dashboard" className='inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition-colors'>
                <IoIosArrowBack size={20} />
                Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">My Loan Applications</h1>
            <p className="text-gray-500 mt-1">Track the status of all your loan applications in one place.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
          {loading ? (
            // Skeleton loaders
            Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
          ) : loans.length > 0 ? (
            // Render actual loan cards
            loans.map((loan) => <LoanCard key={loan._id} loan={loan} />)
          ) : (
            // No applications found state
            <div className="md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg border border-dashed">
                <IoBusinessSharp size={50} className="text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">No Applications Found</h2>
                <p className="text-gray-500 mt-2">It looks like you haven't applied for any loans yet.</p>
                <Link to="/dashboard" className="mt-6 px-5 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    Apply for a Loan
                </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppliedLoans;
