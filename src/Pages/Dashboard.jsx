import React, { useContext, useEffect, useState } from 'react';
import SideNavbar from '../components/Sidebar.jsx';
import Layout from './Layout/Layout.jsx';
import LoanMaster from '../components/LoanMaster.jsx';
import EMICalculator from '../components/EMICaculater.jsx';
import BlogsMaster from '../components/BlogsMaster.jsx';
import RefferalSection from '../components/RefferalSection.jsx';
import toast, { Toaster } from 'react-hot-toast';
import { UserContext, UserProvider, useUser } from '../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ProfileContext, ProfileProvider } from '../context/ProfileContext.jsx';
import { MdAdd, MdAssignmentAdd } from 'react-icons/md';
import Accounts from '../components/Accounts.jsx';
import AddAccounts from '../components/AddAccounts.jsx';

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useUser();
  // const { profiles, setProfiles } = useContext(ProfileContext);
  const [formData, setFormData] = useState({
    city: '',
    state: '',
    pincode: ''
  })
  
  // if (!user._doc.isProfileCompleted) {
  //   document.body.style.overflow = 'hidden';
  // }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("hello");
    try {
      if (!formData.city ||
        !formData.state ||
        !formData.pincode
      ) {
        return toast.error("Missing fields")
      }
        console.log(formData)
      const response = await axios.post("/api/user/update", {
        userId: user._id,
        newData: {
          address: {
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
          },
        }
      })
      console.log(response)
      if (response.status == 200) {
        toast.success("Profile completed")
        navigate("./")
      }
    } catch (err) {
      console.log(err);
    }
  }
  const [viewKYCModal,setViewKYCModal] = useState({status:false,profile:null});
  const [viewAddAccounts,setViewAddAccounts] = useState(false);
  const handleKYC = (profile)=>{
    setViewKYCModal({status:true,profile});
  }
  const handleAddAccounts = ()=>{
    setViewAddAccounts(true);
  }
  const handleClose = ()=>{
    navigate("./");
    setViewAddAccounts(false);
    setViewKYCModal({status:false,profile:null})
  }
  if(viewAddAccounts){
    return <div className='w-screen h-screen bg-black bg-opacity-40 fixed flex items-center justify-center'>
       <AddAccounts handleClose={handleClose}/> </div> 
  }
  if(viewKYCModal.status){
    return <div className='w-screen h-screen bg-black bg-opacity-40 fixed flex items-center justify-center'>
      <AddAccounts handleClose={handleClose} defaultStep={2} defaultProfile={viewKYCModal.profile}/>
    </div>
  }
  return (
    <div className='flex'>
      <Toaster />
      <Layout>
        <div className='flex flex-col '>
          <div id="accounts" className="section h-fit p-8">
            
           <Accounts/>

          </div>
          <div id="loanMaster" className="h-fit p-8">
            <LoanMaster />
          </div>

          <div id="tools" className="h-fit p-8">
            <EMICalculator />
          </div>

          <div id="resources" className="section h-fit p-8">
            <BlogsMaster />
          </div>
          <div id="refferal" className="section h-fit p-8">
            <RefferalSection refCode={user.refCode} />
          </div>
        </div>
      </Layout>
      {/* {!user._doc.isProfileCompleted && <div className='bg-[#333333] bg-opacity-60 w-full h-full fixed inset-0 z-[80] flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-lightPrimary p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Fill in your address
        </h2>
        <div className='grid gap-4'>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-white mb-1">
              CITY
            </label>
            <input 
              type="text" 
              id="city"
              name='city' 
              value={formData.city} 
              onChange={handleChange} 
              placeholder='Enter your city' 
              className='w-full py-2 px-3 bg-white bg-opacity-10 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md transition duration-200'
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-white mb-1">
              STATE
            </label>
            <input 
              type="text" 
              id="state"
              name='state' 
              value={formData.state} 
              onChange={handleChange} 
              placeholder='Enter your state' 
              className='w-full py-2 px-3 bg-white bg-opacity-10 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md transition duration-200'
            />
          </div>
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-white mb-1">
              PINCODE
            </label>
            <input 
              type="number" 
              id="pincode"
              name='pincode' 
              value={formData.pincode} 
              onChange={handleChange} 
              placeholder='Enter your pincode' 
              className='w-full py-2 px-3 bg-white bg-opacity-10 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md transition duration-200'
            />
          </div>
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>
    </div>} */}
    </div >
  );
};

export default Dashboard;
