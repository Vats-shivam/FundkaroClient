import React, { useEffect, useMemo, useState } from "react";
import cursor from "../assets/Cursor Click (1).svg";
import hero from "../assets/hero.svg";
import homeLoan from "../assets/Home Loan Icon.svg";
import buisnessLoan from "../assets/Krakenimages Unsplash 1.svg";
import educationLoan from "../assets/Img4 1.svg";
import { CiGift } from "react-icons/ci";
import { MdMiscellaneousServices, MdMenu, MdClose } from "react-icons/md";
import { RiContactsBook3Fill } from "react-icons/ri";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosMail, IoLogoWhatsapp } from "react-icons/io";
import EMICalculator from "../components/EMICaculater";
import { useNavigate } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTwitter,
  BsYoutube,
} from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
import ProductsCarousel from "../components/ProductsCarousel";
import LoginModal from "../components/LoginModal";
import axios from "axios";

const handleScroll = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const Landing = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    type: "",
  });
  const [email, setEmail] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const emiCalculatorMemo = useMemo(() => <EMICalculator />, []);
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/test")
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "phoneNumber" && value.length > 10) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const { email, name, phoneNumber, type } = formData;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 7) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (!name || name.trim().length < 2) {
      toast.error("Please enter your name");
      return;
    }

    const validTypes = ["homeloan", "educationloan", "carloan", "others"];
    if (!type || !validTypes.includes(type.toLowerCase())) {
      toast.error("Please select a valid loan type");
      return;
    }

    try {
      const payload = {
        email,
        name,
        mobileNumber: phoneNumber,  // match your schema field name here
        loanType: type.toLowerCase(),
      };

      const response = await axios.post('http://localhost:8000/api/query/create', payload);

      if (response.data.success) {
        toast.success("Form Submitted Successfully");
        setFormData({ name: "", email: "", phoneNumber: "", type: "" });

        // optionally clear form here
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const [token, setToken] = useState();
  useEffect(() => {
    let temptoken = localStorage.getItem("token");
    setToken(temptoken);
  }, []);
  const handleSubscribe = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/newsletter/create', { email });

      if (response.data.success) {
        toast.success("Subscribed successfully!");
        setEmail("");
      } else {
        toast.error("Subscription failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const NavLinks = () => (
    <>
      <div className="cursor-pointer" onClick={() => handleScroll("products")}>
        Products
      </div>
      <div className="cursor-pointer" onClick={() => handleScroll("contactus")}>
        Contact us
      </div>
      <div className="cursor-pointer" onClick={() => handleScroll("tools")}>
        Free tools
      </div>
      {token ? (
        <div className="cursor-pointer" onClick={() => navigate("/dashboard")}>
          Dashboard
        </div>
      ) : (
        <>
          <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
            Login
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="w-full min-h-screen h-full">
      <Toaster />
      {/* Navbar */}
      <div className="flex justify-between items-center w-full bg-primary bg-gradient-to-r from-darkPrimary to-lightPrimary p-4">
        <div className="text-white text-[1.2rem]">fundka₹o</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex text-white gap-4">
          <NavLinks />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden text-white">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
          {isMenuOpen && (
            <div className="absolute top-16 right-0 bg-darkPrimary w-full p-4 flex flex-col gap-4 z-50">
              <NavLinks />
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="p-4 flex flex-col md:flex-row h-auto md:h-[35vh] mt-8 md:mt-[8rem]">
        <div className="w-full md:w-1/2 h-full flex items-center justify-center mb-8 md:mb-0">
          <div className="relative text-center md:text-left">
            <span className="w-full pr-8 text-[1.2rem] md:text-[1.5rem] flex">
              Empower Your Journey <br /> Fund Your Tomorrow at
            </span>
            <br />
            <span className="w-full text-justify text-[3rem] md:text-[6rem] text-darkPrimary font-bold">
              FundKa₹o
            </span>
            <img
              src={cursor}
              alt="cursor"
              className="hidden md:block absolute -bottom-4 right-0"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 h-full relative">
          <div className="grid grid-cols-1 md:grid-cols-5 shadow-lg bg-lightPrimary text-white rounded-lg">
            <div className="col-span-full md:col-span-3 p-4 justify-center flex flex-col gap-6">
              <h1>Creating value for everyone</h1>
              <span>
                We provide accessible, personalized loans with educational
                resources and exceptional service. Our affordable options and
                digital innovations empower individuals to achieve their
                financial goals.
              </span>
            </div>
            <div className="col-span-full md:col-span-2 p-4">
              <img src={hero} alt="hero-img" className="w-full" />
            </div>
          </div>
          <div className="bg-yellow-200 m-4 relative md:absolute md:-top-16 p-4 rounded-lg">
            <span className="text-[1rem] md:text-[1.2rem]">
              1st time in India
            </span>
            <br />
            <span className="text-[0.9rem] md:text-[1rem]">
              Redefining how loans are taken
            </span>
          </div>
        </div>
      </div>

      {/* Gift Card Banner */}
      <div className="bg-yellow-300 flex items-center p-4 w-fit mx-auto my-8 md:my-[7rem] text-[0.8rem] rounded-lg shadow-lg">
        <CiGift size={"1.2rem"} />
        Check and avail now to receive guaranteed giftcards.
        <span
          className="text-bold ml-1 text-[1.2rem] hover:text-white cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Apply now
        </span>
      </div>

      {/* Information Cards */}
      <div className="grid grid-rows-1 gap-8 w-full md:w-fit my-12 mx-auto px-4 md:px-8 text-center">
        <div>
          <h2 className="text-[1.4rem] md:text-[1.8rem]">
            Need assistance with your loan? Get in touch with us!
          </h2>
          <p className="text-[0.9rem] md:text-[1rem] text-lightPrimary">
            Get all the information for availing your Loan through our platforms
            below
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-start">
          {/* Service Cards */}
          <div className="bg-yellow-300 p-4 w-full hover:z-10 flex flex-col gap-2 rounded-lg hover:scale-105 shadow-lg">
            <MdMiscellaneousServices size={"3rem"} />
            <h2 className="text-[1.2rem]">Service Portals</h2>
            <p>
              Create a ticket via our Self-Service portals to gain a
              comprehensive understanding of all your loan needs.
            </p>
            <span className="flex gap-2">
              <IoLogoWhatsapp size={"1.5rem"} />
              9804000803
            </span>
            <span className="flex gap-2">
              <IoIosMail size={"1.5rem"} />
              Sales@fundkaro.in
            </span>
          </div>
          {/* Contact Card */}
          <div className="bg-yellow-300 p-4 flex flex-col w-full hover:z-10 gap-2 hover:scale-105 rounded-lg shadow-lg">
            <RiContactsBook3Fill size={"3rem"} />
            <h2 className="text-[1.2rem]">Contact us</h2>
            <p>Avail our services on the go. Get in touch today</p>
            <p>Available Mon-Sat (11 AM -8 PM)</p>
            <span className="flex gap-2">
              <IoLogoWhatsapp size={"1.5rem"} />
              9804000803
            </span>
          </div>
          {/* Location Card */}
          <div className="bg-yellow-300 p-4 flex flex-col gap-2 w-full hover:z-10 hover:scale-105 rounded-lg shadow-lg">
            <FaLocationDot size={"3rem"} />
            <h2 className="text-[1.2rem]">Located at</h2>
            <p>
              Logame Services LLPShop No. 2 & 3, 2nd Floor, No. 126, Laxmi
              Golden Mall, Near Laxmi Natraj Hotel, Nagrathpet, Bengaluru-560002
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      {/* <div className="mt-[4rem] mx-auto text-center w-full px-4" id="products">
                <h2 className="text-[1.4rem] md:text-[1.8rem]">Explore Our Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4">
                    <div>
                        <img src={homeLoan} alt="Home-Loan" className="w-full" />
                        <h2>Home Loan</h2>
                    </div>
                    <div>
                        <img src={buisnessLoan} alt="Buisness-Loan" className="w-full" />
                        <h2>Business Loan</h2>
                    </div>
                    <div>
                        <img src={educationLoan} alt="Eduction-loan" className="w-full" />
                        <h2>Education Loan</h2>
                    </div>
                </div>
            </div> */}
      <ProductsCarousel />

      {/* Tools Section */}
      <div className="text-center my-12 mx-auto px-4" id="tools">
        <h2 className="text-[1.4rem] md:text-[1.8rem]">
          Get the benefit of free tools!
        </h2>
        {emiCalculatorMemo}
        <h2 className="text-[0.8rem]">
          Disclaimer: The aforementioned values, calculations and results are
          for illustrative and informational purposes only and may vary basis
          various parameters laid down by Loan Provider.
        </h2>
      </div>

      {/* Contact Form */}
      <div className="text-center my-12 mx-auto flex flex-col gap-4 px-4">
        <h2 className="text-[1.4rem] md:text-[1.8rem]">
          Let's find a suitable loan for you
        </h2>
        <p className="text-[0.8rem] text-lightPrimary">
          Multiple loan choices, Instant benefits!
        </p>
        <p>
          Enter the following details and click proceed to access the best plan.
        </p>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-2/3 mx-auto"
          id="contactus"
        >
          <div className="flex flex-col col-span-1 items-start">
            <label className="text-lightPrimary text-[1.2rem]">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange}
              name="name"
              className="border px-4 py-2 rounded-lg w-full"
            />
          </div>
          <div className="flex flex-col col-span-1 items-start">
            <label className="text-lightPrimary text-[1.2rem]">Mobile No.</label>
            <input
              type="number"
              value={formData.phoneNumber}
              onChange={handleChange}
              name="phoneNumber"
              className="border px-4 py-2 rounded-lg w-full"
            />
          </div>
          <div className="flex flex-col col-span-1 items-start">
            <label className="text-lightPrimary text-[1.2rem]">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange}
              name="email"
              className="border px-4 py-2 rounded-lg w-full"
            />
          </div>
          <div className="flex flex-col col-span-1 items-start">
            <label className="text-lightPrimary text-[1.2rem]">Loan Type</label>
            <select
              value={formData.type}
              onChange={handleChange}
              name="type"
              className="border px-4 py-2 rounded-lg w-full"
            >
              <option value="null">Choose One</option>
              <option value="homeLoan">Home Loan</option>
              <option value="educationLoan">Education Loan</option>
              <option value="carLoan">Car Loan</option>
              <option value="others">Others</option>
            </select>
          </div>
        </form>
        <button
          className="mx-auto px-8 py-2 rounded-lg my-4 bg-lightPrimary text-white"
          onClick={handleSubmit}
        >
          Proceed
        </button>
      </div>

      {/* Footer */}
      <div className="w-full bg-gradient-to-r from-darkPrimary to-lightPrimary relative p-4 text-white mt-12">
        <div className="flex flex-col md:flex-row justify-between p-4 gap-8">
          <div className="flex flex-col gap-8">
            <h2 className="text-[1.8rem]">FundKa₹o</h2>
            <span className="text-[1.2rem]">
              Stay updated with financial insights.
              <br /> Subscribe our newsletter now!
            </span>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-md text-black"
            />
            <button
              className="bg-yellow-300 w-full md:w-1/2 px-4 py-2 rounded-md text-black"
              onClick={handleSubscribe}
            >
              Subscribe
            </button>
          </div>
          <div className="flex flex-col gap-4 items-center md:items-end justify-center">
            <span className="text-[1.2rem]">Follow us on</span>
            <span className="flex gap-4">
              <BsLinkedin size={20} />
              <BsInstagram size={20} />
              <BsYoutube size={20} />
              <BsTwitter size={20} />
              <BsFacebook size={20} />
            </span>
          </div>
        </div>
      </div>
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Landing;
