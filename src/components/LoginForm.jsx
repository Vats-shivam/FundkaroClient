import React, { useState } from 'react'
import view from "../assets/view.svg";
import hidden from "../assets/hidden.svg";
import { Link, useNavigate } from 'react-router-dom';
import google from "../assets/google.png";
import toast from 'react-hot-toast';
import axios from 'axios';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../config/firebase';

const LoginForm = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [user,setUser] = useState({email:"",password:""});
  const [hidePassword,setHidePassword] = useState(false); 
  const handleSubmit = async(event)=>{
    event.preventDefault();
    try{
      const {data} = await axios.post("/api/auth/signin", user);
      console.log(data);
      if(!data.success){
        throw data.message;
      }
      toast.success("User Login Successfull")
      localStorage.setItem('token',data.token);
      console.log(data)
      navigate('/dashboard');
    }catch(error){
      toast.error("error");
    }    
  }
  const googleLogin = async()=>{
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultsFromGoogle);
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
      toast.error(error);
    }
  }
  return (
    <div className={`flex flex-col w-full h-full`}>
      <div className="p-2 bg-transparent">
        <h1 className="text-white font-extrabold text-4xl">Welcome</h1>
        <p className="text-white font-normal text-2xl">Login to your Account</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white border-solid border-black shadow-2xl py-4 sm:py-12 px-8 flex flex-col justify-around h-full rounded-3xl"
      >
        <div className="flex border border-blue-500 rounded-lg focus:border-primaryStart px-3 m-2">
          <input
            type="text"
            placeholder="Email"
            value={user.email}
            autoComplete='username'
            onChange={(e) => {
              setUser((prev) => {
                return { ...prev, email: e.target.value };
              });
            }}
            className="py-4 px-3 w-full  placeholder-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex border border-blue-500 rounded-lg focus:border-primaryStart px-3 m-2">
          <input
            type={hidePassword ? "password" : "text"}
            placeholder="Password"
            autoComplete='current-password' 
            value={user.password}
            onChange={(e) => {
              setUser((prev) => {
                return { ...prev, password: e.target.value };
              });
            }}
            className="w-[90%] py-4 px-3 placeholder-blue-500 focus:outline-none"
          />
          <img
            src={`${hidePassword ? hidden : view}`}
            className="p-1"
            width={"10%"}
            alt="showPasswordIcon"
            onClick={() => {
              setHidePassword((prev) => {
                return !prev;
              });
            }}
          />
        </div>
        <div className="flex justify-between m-2">
          <div className="w-[40%]">
            <input type="checkbox" id="rememberMe" className="m-1" />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <Link to="../forget" className="text-blue-500">
            Forget Password?
          </Link>
        </div>
        <div className="flex text-lg m-2">
          <p className="mr-2">New Here?</p>
          <Link to="../register" className="text-blue-500">
            Register now
          </Link>
        </div>
        <button
          type="submit"
          className=" m-2 border border-blue-500 rounded-xl p-3 hover:bg-lightPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-darkPrimary"
        >
          LOGIN
        </button>
        <span className="m-2 ">Or</span>
        <div className="border m-2 border-blue-500 h-14 rounded-xl p-2 hover:bg-lightPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-darkPrimary text-center flex items-center justify-center" onClick={googleLogin}>
          <img src={google} alt="google-sign-in" width={"8%"} />
          Sign in with Google
        </div>
      </form>
    </div>
  )
}

export default LoginForm