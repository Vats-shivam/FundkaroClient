// src/pages/LoanMaster.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// --- ICONS ---
// We are using react-icons for themed, high-quality icons.
import {
  IoHomeOutline,
  IoPersonOutline,
  IoCarSportOutline,
  IoBusinessOutline,
  IoSchoolOutline,
  IoDiamondOutline,
  IoArrowForward,
} from 'react-icons/io5';

// --- DUMMY DATA (Updated to remove the old logo URLs) ---
const dummyCategories = [
  { _id: "1", category: "Home Loan" },
  { _id: "2", category: "Personal Loan" },
  { _id: "3", category: "Car Loan" },
  { _id: "4", category: "Business Loan" },
  { _id: "5", category: "Education Loan" },
  { _id: "6", category: "Gold Loan" },
];

// --- A mapping object to associate category names with their new icons ---
const categoryIcons = {
  "Home Loan": { icon: <IoHomeOutline />, color: 'blue' },
  "Personal Loan": { icon: <IoPersonOutline />, color: 'purple' },
  "Car Loan": { icon: <IoCarSportOutline />, color: 'red' },
  "Business Loan": { icon: <IoBusinessOutline />, color: 'green' },
  "Education Loan": { icon: <IoSchoolOutline />, color: 'indigo' },
  "Gold Loan": { icon: <IoDiamondOutline />, color: 'yellow' },
};

// --- A reusable and styled CategoryCard component ---
const CategoryCard = ({ category, iconData, onClick }) => {
    // Dynamically generate Tailwind classes for colors
    const colorClasses = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'hover:border-blue-500' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'hover:border-purple-500' },
        red: { bg: 'bg-red-100', text: 'text-red-600', border: 'hover:border-red-500' },
        green: { bg: 'bg-green-100', text: 'text-green-600', border: 'hover:border-green-500' },
        indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'hover:border-indigo-500' },
        yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'hover:border-yellow-500' },
    };

    const styles = colorClasses[iconData.color] || colorClasses.blue;

    return (
        <div
            onClick={onClick}
            className={`group relative bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer 
                        transition-all duration-300 ease-in-out 
                        hover:shadow-lg hover:-translate-y-2 ${styles.border}`}
        >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 ${styles.bg} ${styles.text}`}>
                {iconData.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800">{category.category}</h3>
            <p className="text-sm text-gray-500 mt-1">Compare Offers</p>
            <IoArrowForward className="absolute bottom-6 right-6 text-gray-300 text-2xl transition-all duration-300 group-hover:text-blue-500 group-hover:right-5" />
        </div>
    );
};


const LoanMaster = () => {
  const [categories, setCategories] = useState(dummyCategories);
  const navigate = useNavigate();

  // Your data fetching logic (can be uncommented when ready)
  // const getCategories = async () => {
  //   try {
  //     const { data } = await axios.get('/api/category/findall');
  //     if (data.status === 200) {
  //       setCategories(data.updatedCategories);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getCategories();
  // }, []);

  return (
    <div className='flex-1'>
        <div className='max-w-5xl mx-auto px-4 py-12 sm:py-16'>
            {/* --- Enhanced Header Section --- */}
            <div className='text-center mb-12'>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-800 tracking-tight'>
                    Find Your Perfect Loan in Minutes
                </h1>
                <p className='mt-3 text-lg text-gray-600 max-w-2xl mx-auto'>
                    Select a product to instantly compare customized rates from India's top lenders.
                </p>
            </div>

            {/* --- Enhanced Card Grid --- */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {categories.map((category) => (
                    <CategoryCard
                        key={category._id}
                        category={category}
                        iconData={categoryIcons[category.category] || categoryIcons["Home Loan"]}
                        onClick={() => navigate(`loanmaster/${category._id}`)}
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

export default LoanMaster;