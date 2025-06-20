import React, { useContext } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaHome, FaUserAlt, FaCog, FaSignOutAlt, FaShareAlt } from 'react-icons/fa';
import { GrResources } from 'react-icons/gr';
import { MdOutlineDashboard } from 'react-icons/md';
import { TbTools } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { FaBuildingColumns } from 'react-icons/fa6';

const handleScroll = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const Sidebar = () => {
  const navigate = useNavigate();
  const {user} = useContext(UserContext);
  const handleProfile = ()=>{
    navigate(`/profile/${user._id}`)
  }
  const handleAppliedLoans = ()=>{
    navigate(`/applied-loans/${user._id}`);
  }
  return (
    <div className='sticky top-16 left-0 h-full bg-white shadow-primaryShadow transition-all duration-1000 linear'>
      <div className='sticky top-16 grid grid-rows-1 px-4 py-4'>
        <div onClick={() => handleScroll('accounts')} className="flex items-center p-4 text-left font-primaryFont font-semibold border-b border-[#7BADF9] hover:bg-[#E4EAFA] text-darkPrimary hover:text-lightPrimary transition duration-200 ease-out-in cursor-pointer">
          <FaHome className="mr-3" />
          Home
        </div>
        <div onClick={() => handleScroll('loanMaster')} className="flex items-center p-4 text-left font-primaryFont font-semibold border-b border-[#7BADF9] hover:bg-[#E4EAFA] text-darkPrimary hover:text-lightPrimary transition duration-200 ease-out-in cursor-pointer">
          <MdOutlineDashboard className='mr-3' />
          Loan Master
        </div>
        <div onClick={() => handleScroll('tools')} className="flex items-center p-4 text-left font-primaryFont font-semibold border-b border-[#7BADF9] hover:bg-[#E4EAFA] text-darkPrimary hover:text-lightPrimary transition duration-200 ease-out-in cursor-pointer">
          <TbTools className="mr-3" />
          Tools
        </div>
        <div onClick={() => handleScroll('resources')} className="flex items-center p-4 text-left font-primaryFont font-semibold border-b border-[#7BADF9] hover:bg-[#E4EAFA] text-darkPrimary hover:text-lightPrimary transition duration-200 ease-out-in cursor-pointer">
          <GrResources className="mr-3" />
          Resources
        </div>
        <div onClick={handleAppliedLoans} className="flex items-center p-4 text-left font-primaryFont font-semibold border-b border-[#7BADF9] hover:bg-[#E4EAFA] text-darkPrimary hover:text-lightPrimary transition duration-200 ease-out-in cursor-pointer">
          <FaBuildingColumns className='mr-3'/>
          Applied Loans
        </div>
        <div onClick={() => handleScroll('refferal')} className="flex items-center p-4 text-left font-primaryFont font-semibold border-b border-[#7BADF9] hover:bg-[#E4EAFA] text-darkPrimary hover:text-lightPrimary transition duration-200 ease-out-in cursor-pointer">
          <FaShareAlt className="mr-3" />
          Refer a Friend
        </div>
      </div>
      <div className='fixed bottom-0 grid grid-rows-1 px-4 py-4'>
        <div onClick={handleProfile} className="flex items-center p-4 text-left font-primaryFont font-semibold text-darkPrimary hover:text-lightPrimary transition duration-200 ease-out-in cursor-pointer">
          <CgProfile title='Profile' size={24} className="mr-3"/>
          Profile
        </div></div>
    </div>
  );
};

export default Sidebar;
