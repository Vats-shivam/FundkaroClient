import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Documents = () => {
  const {userID} = useParams();
  useEffect(()=>{
    console.log(userID);
  },[])
  return (
    <div>Documents</div>
  )
}

export default Documents