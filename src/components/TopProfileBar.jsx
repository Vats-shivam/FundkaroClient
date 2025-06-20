"use client"
import { MdVerifiedUser, MdPhone, MdEmail } from "react-icons/md"

const TopProfileBar = ({ user, isOwnProfile = true, profileType = "own" }) => {
  console.log(user)
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-16 w-16"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user.fullName || user.email || user.phoneNo || "Unknown User"
  }

  const getVerificationStatus = () => {
    if (user.isKYCVerified && user.isProfileCompleted) {
      return { status: "verified", color: "bg-green-500", text: "Fully Verified" }
    } else if (user.isKYCVerified) {
      return { status: "kyc-verified", color: "bg-blue-500", text: "KYC Verified" }
    } else if (user.isProfileCompleted) {
      return { status: "profile-completed", color: "bg-yellow-500", text: "Profile Complete" }
    } else {
      return { status: "pending", color: "bg-orange-500", text: "Verification Pending" }
    }
  }

  const verification = getVerificationStatus()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start space-x-4">
        {/* Profile Avatar */}
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {user.firstName?.charAt(0).toUpperCase() || user.fullName?.charAt(0).toUpperCase() || "U"}
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-800 truncate">{getDisplayName()}</h2>
            {profileType === "own" && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">My Profile</span>
            )}
            {user.isDefault && profileType !== "own" && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Default Profile
              </span>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-1 mb-3">
            {user.phoneNo && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MdPhone className="text-blue-500 flex-shrink-0" />
                <span className="truncate">{user.phoneNo}</span>
              </div>
            )}
            {user.email && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MdEmail className="text-blue-500 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            )}
          </div>

          {/* Verification Status */}
          <div className="flex items-center justify-between">
            <div
              className={`${verification.color} text-white px-3 py-1 rounded-full text-xs font-medium inline-flex items-center`}
            >
              <MdVerifiedUser className="mr-1" />
              {verification.text}
            </div>

            {/* CIBIL Score (if available) */}
            {user.cibilScore && (
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                CIBIL: {user.cibilScore}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Completion Progress (for incomplete profiles) */}
      {!user.isProfileCompleted && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
            <span className="text-sm text-gray-500">
              {Math.round((((user.firstName ? 1 : 0) + (user.email ? 1 : 0) + (user.isKYCVerified ? 1 : 0)) / 3) * 100)}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.round((((user.firstName ? 1 : 0) + (user.email ? 1 : 0) + (user.isKYCVerified ? 1 : 0)) / 3) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TopProfileBar
