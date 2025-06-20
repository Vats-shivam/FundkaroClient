"use client"

import { createContext, useState, useContext } from "react"

// Create the context
const UserContext = createContext()

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: "main-user-1",
    firstName: "Admin",
    lastName: "User",
    phoneNo: "9999999999",
    email: "admin@example.com",
    cibilScore: 750,
    credit_report: "https://example.com/credit-report.pdf",
    isKYCVerified: true,
    isProfileCompleted: true,
    role: "User",
    refCode:"012345"
  })

  const value = {
    user,
    setUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Export the context for direct use if needed
export { UserContext }
