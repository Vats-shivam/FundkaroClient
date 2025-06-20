import React from 'react'
import { useContext } from 'react';
import VectorLogout from "../assets/VectorLogout.svg";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
function Logout({className}) {
  const {setUser} =useContext(UserContext);
  const navigate =useNavigate();
  const Logout = async () => {
    setUser({});
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={` border border-blue-600 p-4 rounded-lg flex items-center justify-center hover:bg-lightPrimary cursor-pointer ${className}`} onClick={Logout}>
      <img className="inline-block" src={VectorLogout}></img>
      <div className='pl-4'>Logout</div>
    </div>
  )
}

export default Logout