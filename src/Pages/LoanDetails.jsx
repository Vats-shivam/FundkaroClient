import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from '../context/UserContext';
// import axios from 'axios';
import loanFlow from '../data/dynamic-chatbot-config.json';
import logo from "../assets/fundkaro.svg";

// --- ICONS ---
import { IoIosArrowBack } from 'react-icons/io';
import { IoPersonSharp, IoPeopleSharp, IoBusinessSharp, IoHomeSharp, IoCarSportSharp, IoDocumentTextSharp, IoChatbubblesSharp, IoInformationCircleSharp, IoCloudUploadOutline, IoPaperPlaneOutline, IoCheckmarkCircle, IoCloseCircle, IoTime } from 'react-icons/io5';

// --- DUMMY DATA FOR A SINGLE LOAN APPLICATION ---
// This simulates the detailed data you would fetch from your API using the loanID
const dummyLoanDetails = {
    _id: "app002",
    // This top-level info is for display logic
    applicantType: 'onBehalfOf', 
    beneficiary: { name: "Jane Doe", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    categoryId: { category: "Home Loan" },
    status: "Pending",
    
    // This object holds the actual data collected by the chatbot
    formData: {
      applicantType: 'onBehalfOf', // Data collected
      beneficiary: { _id: "profile002", fullName: "Jane Doe" }, // Data collected
      firstName: "Jane", // Data collected
      loanAmount: "500000", // Data collected
      panCard: { name: 'jane_pan.pdf', url: '#' }, // Represents a file object
    },
  
  // 2. Documents with status
  documents: [
    { name: "PAN Card", status: "Verified", fileUrl: "#" },
    { name: "Aadhaar Card", status: "Verified", fileUrl: "#" },
    { name: "Latest 3 Months Payslip", status: "Pending", fileUrl: "#" },
    { name: "Bank Statement (6 Months)", status: "Rejected", fileUrl: "#", rejectionReason: "Statement is password protected. Please upload an unlocked PDF." },
  ],

  // 3. Chat/Communication history
  communications: [
    { sender: "Admin", message: "Welcome to Fundkaro! Your application for a Home Loan has been received and is under review.", timestamp: "2023-10-26 10:00 AM" },
    { sender: "You", message: "Thank you! I've uploaded the initial documents.", timestamp: "2023-10-26 11:30 AM" },
    { sender: "Admin", message: "We've noticed your bank statement is password-protected. Kindly re-upload an unlocked version.", timestamp: "2023-10-27 02:15 PM" },
  ]
};

// --- HELPER CONFIG & COMPONENTS ---

const statusConfig = {
  Pending: { icon: <IoTime className="text-yellow-500" />, text: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-300' },
  Rejected: { icon: <IoCloseCircle className="text-red-500" />, text: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' },
  Verified: { icon: <IoCheckmarkCircle className="text-green-500" />, text: 'text-green-600', bg: 'bg-green-100', border: 'border-green-300' },
};

const categoryIcons = {
  "Personal Loan": <IoPersonSharp size={28} />,
  "Home Loan": <IoHomeSharp size={28} />,
  "Business Loan": <IoBusinessSharp size={28} />,
  "Car Loan": <IoCarSportSharp size={28} />,
};

const ApplicantInfo = ({ loan }) => {
    // This component is reused from AppliedLoans for consistency
  const renderInfo = () => {
    switch (loan.applicantType) {
      case 'onBehalfOf':
        return (
          <div className="flex items-center gap-3">
            <img src={loan.beneficiary.avatar} alt={loan.beneficiary.name} className="w-12 h-12 rounded-full" />
            <div>
               <span className="text-sm text-gray-500">For</span>
               <span className="block font-semibold text-gray-800 text-lg">{loan.beneficiary.name}</span>
            </div>
          </div>
        );
      case 'club': /* Add club logic if needed */ return <></>
      default:
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <IoPersonSharp size={24} />
            </div>
             <div>
               <span className="text-sm text-gray-500">For</span>
               <span className="block font-semibold text-gray-800 text-lg">You</span>
            </div>
          </div>
        );
    }
  };
  return <div className="p-1">{renderInfo()}</div>;
};

const ApplicationSummaryCard = ({ loan }) => {
  const status = statusConfig[loan.status] || {};
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6">
      <div className="flex items-center gap-4 text-blue-600">
        {categoryIcons[loan.categoryId?.category]}
        <h2 className="font-bold text-2xl text-gray-800">{loan.categoryId?.category}</h2>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">APPLICANT</h3>
        <ApplicantInfo loan={loan} />
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">OVERALL STATUS</h3>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${status.bg} ${status.text}`}>
          {status.icon}
          {loan.status}
        </div>
      </div>
      
      {loan.messageFromAdmin && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex items-center gap-3">
            <IoInformationCircleSharp className="text-blue-500 flex-shrink-0" size={24} />
            <div>
              <p className="font-semibold text-blue-800">Message from Fundkaro</p>
              <p className="text-sm text-blue-700">{loan.messageFromAdmin}</p>
            </div>
          </div>
        </div>
      )}
      
      {loan.status === 'Verified' && !loan.isSelectionDone && (
        <Link to={`/select-loans/${loan._id}`} className="block w-full text-center px-4 py-3 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors">
          Select & Apply
        </Link>
      )}
    </div>
  );
};

// --- TABS ---
const ApplicationDetailsTab = ({ formData }) => {
  // A helper function to format keys like 'firstName' into 'First Name'
  const formatLabel = (key) => {
    if (!key) return '';
    // Add a space before each capital letter, then capitalize the first letter
    const result = key.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  // A helper to render different value types gracefully
  const renderValue = (value) => {
    // Case 1: Value is a file-like object (from new upload or existing doc)
    if (typeof value === 'object' && value !== null && (value.name || value.url || value.fileUrl)) {
      return (
        <a href={value.url || value.fileUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {value.name || 'View File'}
        </a>
      );
    }
    // Case 2: Value is a profile-like object (from beneficiary select)
    if (typeof value === 'object' && value !== null && (value.fullName || value.firstName)) {
      return value.fullName || `${value.firstName} ${value.lastName || ''}`;
    }
    // Case 3: Value is an array of profile objects (from club select)
    if (Array.isArray(value)) {
      return value.map(item => item.fullName || item.firstName).join(', ');
    }
    // Case 4: Default for strings, numbers, etc.
    return String(value) || 'Not Provided';
  };

  // These are metadata keys that are usually displayed elsewhere (e.g., in the summary card)
  // and should not be repeated in the details list.
  const EXCLUDED_KEYS = ['applicantType', 'beneficiary', 'clubMembers'];

  // Filter the formData to get only the fields we want to display
  const displayFields = Object.entries(formData || {})
    .filter(([key]) => !EXCLUDED_KEYS.includes(key) && formData[key] !== null && formData[key] !== undefined)
    .map(([key, value]) => ({
      label: formatLabel(key),
      value: value,
    }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      {displayFields.length > 0 ? (
        displayFields.map(({ label, value }) => (
          <div key={label}>
            <label className="text-sm font-medium text-gray-500">{label}</label>
            <div className="text-base text-gray-800 font-semibold mt-1 bg-gray-100 p-3 rounded-md min-h-[48px] flex items-center break-words">
              {renderValue(value)}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-10 md:col-span-2">
          <p>No application details have been submitted yet.</p>
        </div>
      )}
    </div>
  );
};

const DocumentsTab = ({ documents }) => {
    const handleReupload = (docName) => {
        // This would trigger a file input click in a real app
        alert(`Initiating re-upload for ${docName}...`);
    }

    return (
        <div className="space-y-4">
            {documents.map(doc => {
                const docStatus = statusConfig[doc.status] || {};
                return (
                    <div key={doc.name} className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${docStatus.bg} ${docStatus.border}`}>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">{docStatus.icon}</span>
                            <div>
                                <p className={`font-semibold ${docStatus.text}`}>{doc.name}</p>
                                {doc.status === 'Rejected' && <p className="text-sm text-red-700 mt-1">{doc.rejectionReason}</p>}
                            </div>
                        </div>
                        <div className="flex gap-3 mt-2 sm:mt-0">
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">View</a>
                            {doc.status === 'Rejected' && (
                                <button onClick={() => handleReupload(doc.name)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700">
                                    <IoCloudUploadOutline/> Re-upload
                                </button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

const CommunicationTab = ({ messages }) => {
    const [newMessage, setNewMessage] = useState("");

    const handleSend = () => {
        if (!newMessage.trim()) return;
        // In a real app, this would send the message to your backend
        alert(`Message sent: ${newMessage}`);
        setNewMessage("");
    }

    return (
        <div>
            <div className="space-y-4 h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg border">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-3 rounded-xl ${msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 shadow-sm border'}`}>
                            {msg.sender === 'Admin' && <p className="font-bold text-sm text-purple-600 mb-1">Admin</p>}
                            <p>{msg.message}</p>
                            <p className={`text-xs mt-2 ${msg.sender === 'You' ? 'text-blue-200' : 'text-gray-400'}`}>{msg.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex gap-3">
                <textarea 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply here..." 
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <button onClick={handleSend} className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400" disabled={!newMessage.trim()}>
                    <IoPaperPlaneOutline size={20}/>
                </button>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

const LoanDetails = () => {
  const { user } = useContext(UserContext); // Ready for API call
  const { loanID } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      try {
        // --- API call would go here ---
        // const response = await axios.post("/api/application/findbyid", { userId: user.user, applicationId: loanID });
        // if (response.data.status) {
        //   setLoan(response.data.application);
        // }

        // Simulate API call with dummy data
        setTimeout(() => {
          setLoan(dummyLoanDetails);
          setLoading(false);
        }, 1200);

      } catch (error) {
        console.error("Failed to fetch loan details:", error);
        setLoading(false);
      }
    };

    fetchApplication();
  }, [loanID, user]);

  const TABS = {
    details: { label: 'Application Details', icon: <IoInformationCircleSharp/> },
    documents: { label: 'Documents', icon: <IoDocumentTextSharp/> },
    chat: { label: 'Communication', icon: <IoChatbubblesSharp/> },
  };

  if (loading) {
    return (
        <div className="w-full min-h-screen bg-gray-50">
            <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-darkPrimary to-lightPrimary flex h-16 items-center py-2 px-4 shadow-md">
                <img src={logo} className="w-32 h-9 ml-4" alt="Logo" />
            </header>
            <main className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 animate-pulse'>
                 <div className="h-6 w-48 bg-gray-300 rounded-md mb-8"></div>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6 p-6 bg-gray-200 rounded-xl">
                        <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
                        <div className="h-16 w-full bg-gray-300 rounded"></div>
                        <div className="h-10 w-1/2 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="lg:col-span-2 p-6 bg-gray-200 rounded-xl">
                        <div className="h-10 w-full bg-gray-300 rounded"></div>
                        <div className="mt-6 h-64 w-full bg-gray-300 rounded"></div>
                    </div>
                 </div>
            </main>
        </div>
    );
  }

  if (!loan) {
    return (
        <div className="text-center py-40">
            <h2 className="text-2xl font-bold">Loan Application Not Found</h2>
            <Link to="/applied-loans" className="text-blue-600 hover:underline mt-4 inline-block">Go back to my applications</Link>
        </div>
    )
  }

  return (
    <div className='w-full min-h-screen bg-gray-50'>
      <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-darkPrimary to-lightPrimary flex h-16 items-center py-2 px-4 shadow-md">
        <img src={logo} className="w-32 h-9 ml-4" alt="Logo" />
      </header>
      
      <main className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12'>
        <div className='mb-8'>
            <Link to="/applied-loans" className='inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition-colors'>
                <IoIosArrowBack size={20} />
                Back to All Applications
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* --- Left Column: Summary (Sticky on large screens) --- */}
            <div className="lg:col-span-1 lg:sticky top-24">
                <ApplicationSummaryCard loan={loan} />
            </div>

            {/* --- Right Column: Tabbed Details --- */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="flex" aria-label="Tabs">
                        {Object.keys(TABS).map(tabKey => (
                            <button 
                                key={tabKey} 
                                onClick={() => setActiveTab(tabKey)}
                                className={`flex items-center gap-2 whitespace-nowrap py-4 px-5 text-sm font-medium transition-colors
                                    ${activeTab === tabKey 
                                        ? 'border-b-2 border-blue-600 text-blue-600' 
                                        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                {TABS[tabKey].icon} {TABS[tabKey].label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-6">
                    {activeTab === 'details' && <ApplicationDetailsTab formData={dummyLoanDetails.formData} flowConfig={loanFlow} />}
                    {activeTab === 'documents' && <DocumentsTab documents={loan.documents} />}
                    {activeTab === 'chat' && <CommunicationTab messages={loan.communications} />}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default LoanDetails;