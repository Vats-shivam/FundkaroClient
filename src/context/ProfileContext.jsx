"use client"

import { createContext, useState, useContext } from "react"

// Create the context
const ProfileContext = createContext()

// Custom hook to use the context
export const useProfiles = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error("useProfiles must be used within a ProfileProvider")
  }
  return context
}

// Provider component
export const ProfileProvider = ({ children }) => {
  // Dummy data for demonstration
  const [profiles, setProfiles] = useState([
    {
      _id: "1",
      firstName: "John",
      lastName: "Doe",
      fullName: "John Doe",
      phoneNo: "9876543210",
      email: "john.doe@example.com",
      dateOfBirth: "1990-05-15",
      isKYCVerified: true,
      isProfileCompleted: true,
      isVerified: true,
      isDefault: true,
      creditReportPulled: true,
      panCardNumber: "ABCDE1234F",
      aadharCardNumber: "123456789012",
      interestedLoan: "homeloan",
    },
    {
      _id: "2",
      firstName: "Jane",
      lastName: "Smith",
      fullName: "Jane Smith",
      phoneNo: "8765432109",
      email: "jane.smith@example.com",
      dateOfBirth: "1985-08-22",
      isKYCVerified: false,
      isProfileCompleted: true,
      isVerified: true,
      isDefault: false,
      creditReportPulled: false,
      interestedLoan: "carloan",
    },
    {
      _id: "3",
      firstName: "Mike",
      lastName: "Johnson",
      fullName: "Mike Johnson",
      phoneNo: "7654321098",
      email: null,
      dateOfBirth: null,
      isKYCVerified: false,
      isProfileCompleted: false,
      isVerified: true,
      isDefault: false,
      creditReportPulled: false,
    },
  ])

  const value = {
    profiles,
    setProfiles,
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

// Export the context for direct use if needed
export { ProfileContext }
