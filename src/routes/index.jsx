import { Suspense } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import LoginPage from "../Pages/LoginPage";
import Loader from "../assets/loader.svg"
import RegisterPage from "../Pages/RegisterPage";
import Dashboard from "../Pages/Dashboard";
import VerifyUser from "../Pages/VerifyUser";
import KycVerify from "../Pages/KycVerify";
import CompleteProfile from "../Pages/CompleteProfile";
import Profile from "../Pages/Profile";
import Documents from "../Pages/Documents";
import AppliedLoans from "../Pages/AppliedLoans";
import LoanDetails from "../Pages/LoanDetails";
import Loans from "../Pages/Loans";
import axios from "axios";
import Landing from "../Pages/Landing";
import SuccessPage from "../Pages/SuccessPage";
import BlogPage from "../Pages/BlogPage";
import MultiStepFormPage from "../Pages/MultiStepForm";
import LoanForm from "../components/LoanForm";
import { UserProvider } from "../context/UserContext";
import { ProfileProvider } from "../context/ProfileContext";

axios.defaults.baseURL = 'http://localhost:8000';
// axios.defaults.baseURL = 'https://fundkaro.in/api';



const MainApp = () => {
  return (
    <Suspense
      fallback={
        <div className={`w-full h-full min-h-screen flex items-center justify-center bg-primary z-20`}>
          <img src={Loader} alt="Loading..." className="h-16" />
        </div>
      }
    >
      <UserProvider>
        <ProfileProvider>
      <Outlet />
        </ProfileProvider>
      </UserProvider>
    </Suspense>
  );
}


export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainApp />}>
        <Route path="/" element={<Landing/>}/>
        <Route path="/test" element={<MultiStepFormPage />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/dashboard/loanmaster/:categoryID" element={<Loans />} />

          {/* <Route element={<UserContextProvider />}> */}
            {/* <Route element={<ProfileContextProvider />}> */}
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/profile/:profileId" element={<Profile />} />
              <Route path="/documents/:userID" element={<Documents />} />
              <Route path="/applied-loans/:userID" element={<AppliedLoans />} />
              <Route path="/loan-details/:loanID" element={<LoanDetails/>} />
              <Route path="/success" element={<SuccessPage/>}/>
              <Route path="/blogs/:internalName" element={<BlogPage />} />
            </Route>
          {/* </Route> */}
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  )
}