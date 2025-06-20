import React, { useState } from 'react'
import view from "../assets/view.svg";
import hidden from "../assets/hidden.svg";
import { Link, useNavigate } from 'react-router-dom';
import google from "../assets/google.png";
import axios from 'axios';
import toast from 'react-hot-toast';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../config/firebase';

const RegisterForm = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [user,setUser] = useState({name:"",  email: "",phoneNo:"",  password: "", confPass: "", referrer: "" });
  const [hidePassword, setHidePassword] = useState(true);
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNo = (phoneNo) => {
    const re = /^[0-9]{10}$/;
    return re.test(String(phoneNo));
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    console.log(user)
    let valid = true;
    if (!user.name){
      valid = false;
      toast.error("All fields are required")
    }
    if (!validateEmail(user.email)) {
      valid = false;
      toast.error("Invalid email format");
    }

    if (!validatePhoneNo(user.phoneNo)) {
      valid = false;
      toast.error("Phone number must be 10 digits");
    }

    if (user.password !== user.confPass) {
      valid = false;
      toast.error("Passwords do not match");
    }

    if (valid) {
      // Send the data to the backend
      try{
        const {data} = await axios.post("/api/auth/signup", user);
        console.log(data);
        if(!data.success){
          throw data.message;
        }
        toast.success("User Registeration Successfull")
      localStorage.setItem('token',data.token);  
navigate('/dashboard');
      }catch(error){
        toast.error(error);
      }
    }
  };
  const googleLogin = async()=>{
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const {data} = await axios.post("/api/auth/google",{
        email:resultsFromGoogle.user.email,
        name:resultsFromGoogle.user.displayName,
        googlePhotoUrl:resultsFromGoogle.user.photoURL
      })
      if(!data.success){
        throw data.message;
      }
      toast.success("User Login Successfull")
      localStorage.setItem('token',data.token); 
      navigate('/dashboard');  
    } catch (error) {
      toast.error("error");
    }
  }

  return (
    <div className={`px-4 flex flex-col w-full h-full`}>
      <div className='px-2 bg-transparent'>
        <h1 className='text-white font-extrabold text-4xl'>Welcome</h1>
        <p className='text-white font-normal text-2xl'>Register to your Account</p>
      </div>
      <form onSubmit={handleSubmit} className='bg-white border-solid border-black shadow-2xl py-4 px-8 flex flex-col justify-around h-full rounded-3xl'>
      <div className='flex border border-blue-500 rounded-lg focus:border-primaryStart px-3 m-2'>
          <input type="text" placeholder="Full Name" value={user.name} onChange={(e) => { setUser((prev) => { return { ...prev, name: e.target.value } }) }} className='py-4 px-3 w-full  placeholder-blue-500 focus:outline-none'/>
        </div>
        <div className='flex border border-blue-500 rounded-lg focus:border-primaryStart px-3 m-2'>
          <input type="email" placeholder="Email" value={user.email} onChange={(e) => { setUser((prev) => { return { ...prev, email: e.target.value } }) }} className='py-4 px-3 w-full  placeholder-blue-500 focus:outline-none'/>
        </div>
        <div className='flex border border-blue-500 rounded-lg focus:border-primaryStart px-3 m-2'>
          <div className='py-4 text-blue-500 border-r-2 pr-2'>+91</div>
          <input type="number" placeholder="Phone No" value={user.phoneNo} onChange={(e) => { setUser((prev) => { return { ...prev, phoneNo: e.target.value } }) }} className='py-4 px-3 w-full  placeholder-blue-500 focus:outline-none'/>
        </div>
        <div className='flex border border-blue-500 rounded-lg focus:border-primaryStart px-3 m-2'>
          <input type={hidePassword ? "password" : "text"} placeholder="Password" value={user.password}
          onChange={(e) => { setUser((prev) => { return { ...prev, password: e.target.value } }) }} className='w-[90%] py-4 px-3 placeholder-blue-500 focus:outline-none' required />
          <img src={`${hidePassword ? hidden : view}`} className='p-1' width={"8%"} alt="showPasswordIcon" onClick={() => { setHidePassword((prev) => { return !prev }) }} />
        </div>
        <div className='flex border border-blue-500 rounded-lg focus:border-primaryStart px-3 m-2'>
          <input type="text" placeholder="Confirm Password" value={user.confPass} onChange={(e) => { setUser((prev) => { return { ...prev, confPass: e.target.value } }) }} className='py-4 px-3 w-full  placeholder-blue-500 focus:outline-none' required/>
        </div>
        <div className='flex border border-blue-500 rounded-lg focus:border-primaryStart px-3 m-2'>
          <input type="text" placeholder="Refferal code (optional)" value={user.referrer} onChange={(e) => { setUser((prev) => { return { ...prev, referrer: e.target.value } }) }} className='py-4 px-3 w-full  placeholder-blue-500 focus:outline-none' />
        </div>
        <div className='flex justify-between m-2'>
          <div className="w-[40%]">
            <input type="checkbox" id="rememberMe" className="m-1" />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
        </div>
        <div className='flex text-lg m-2'>
          <p className="mr-2">Already registered?</p>
          <Link to='../login' className='text-blue-500'>Login now</Link>
        </div>
        <button type='submit' className=' m-2 border border-blue-500 rounded-xl p-3 hover:bg-lightPrimary hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-darkPrimary'>REGISTER</button>
        <span className='m-2 '>Or</span>
        <div className='border m-2 border-blue-500 h-14 rounded-xl p-2 hover:bg-lightPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-darkPrimary text-center flex items-center justify-center' onClick={googleLogin}>
          <img src={google} alt="google-sign-in" width={'8%'} />
          Sign in with Google
        </div>
      </form>
    </div>
  )
}

export default RegisterForm