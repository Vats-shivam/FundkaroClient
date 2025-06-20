import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


const LoanMaster = () => {
const dummyCategories = [
    {
      _id: "1",
      category: "Home Loan",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      _id: "2",
      category: "Personal Loan",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      _id: "3",
      category: "Car Loan",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      _id: "4",
      category: "Business Loan",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      _id: "5",
      category: "Education Loan",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      _id: "6",
      category: "Gold Loan",
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]
  const [categories, setCategories] =useState(dummyCategories);
  const navigate = useNavigate();
  const getCategories = async () => {
    try {
      // const data = await axios.get('/api/category/findall');
      // if (data.status != 200) {
      //   throw data;
      // }
      // console.log(data);
      // setCategories(data.data.updatedCategories);
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCategories();
    console.log('-----------------')
    console.log(categories);
  }, [])
  return (
    <div className='flex-1 gap-16 mt-16 md:px-8'>
      <div className='flex flex-col items-start flex-wrap gap-2'>
        <h2 className='text-2xl'>Evaluate rates from different lenders in a matter of minutes.
        </h2>
        <p className='text-2xl font-bold text-[#4169E1]'>Select a product to assess your customized rates.</p>
      </div>
      <div className='flex flex-wrap justify-center pt-16 gap-4'>
        {categories.map((category) => {
          return (
            <div
              key={category._id}
              className="flex items-center justify-around font-bold text-lg bg-[#4169E1] text-white px-2 py-6 rounded-md min-w-[12rem] cursor-pointer hover:bg-[#3557C7] transition-colors"
              onClick={() => navigate(`loanmaster/${category._id}`)}
            >
              <img src={category.logo || "/placeholder.svg"} alt="logo" className="rounded-xl w-10 h-10" />
              {category.category}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LoanMaster