"use client"

import { useState } from "react"
import { useProfiles } from "../context/ProfileContext"
import { useUser } from "../context/UserContext"
import { MdAdd, MdVerifiedUser, MdPhone, MdEmail } from "react-icons/md"
import { FiMoreVertical } from "react-icons/fi"
import KYCVerificationModal from "./KYCVerificationModal"
import AddAccountModal from "./AddAccounts.jsx"
import { useNavigate } from "react-router-dom"

const Accounts = () => {
  const { profiles, setProfiles } = useProfiles()
  const { user } = useUser()
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showKYCModal, setShowKYCModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showDropdown, setShowDropdown] = useState(null)

  const handleAddAccounts = () => {
    setShowAddModal(true)
  }

  const handleKYC = (profile) => {
    setSelectedProfile(profile)
    setShowKYCModal(true)
  }

  // const handleViewProfile = (profile) => {
  //   setSelectedProfile(profile)
  //   setShowProfileModal(true)
  // }

  

  const handleDeleteProfile = (profileId) => {
    const updatedProfiles = profiles.filter((profile) => profile._id !== profileId)
    setProfiles(updatedProfiles)
    setShowDropdown(null)
  }

  const getVerificationStatus = (profile) => {
    if (profile.isKYCVerified && profile.isProfileCompleted) {
      return { status: "verified", color: "bg-green-500", text: "Fully Verified" }
    } else if (profile.isKYCVerified) {
      return { status: "kyc-verified", color: "bg-blue-500", text: "KYC Verified" }
    } else if (profile.isProfileCompleted) {
      return { status: "profile-completed", color: "bg-yellow-500", text: "Profile Complete" }
    } else {
      return { status: "pending", color: "bg-orange-500", text: "Verification Pending" }
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Credit Score Section */}
      <div className="lg:w-1/3">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Credit Score</h2>
        <div className="space-y-4">
          {user.cibilScore && user.credit_report ? (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold opacity-90">CIBIL Score</h3>
                  <p className="text-3xl font-bold">{user.cibilScore}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-2">
                  <MdVerifiedUser className="text-2xl" />
                </div>
              </div>
              <div className="mt-4">
                <a
                  href={user.credit_report}
                  download="Credit_report.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 inline-block w-full text-center font-medium"
                >
                  Download Credit Report
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-gray-200 rounded-xl p-6 text-gray-600 shadow-lg">
              <div className="text-center">
                <MdVerifiedUser className="text-4xl mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Credit Report Available</h3>
                <p className="text-sm opacity-75">Complete your profile to generate credit report</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-px bg-gray-300"></div>

      {/* Profiles Section */}
      <div className="lg:w-2/3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Profiles</h2>
          <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
            {profiles?.length || 0} Profile{profiles?.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Existing Profiles */}
          {profiles &&
            profiles.map((profile) => {
              const verification = getVerificationStatus(profile)
              return (
                <div
                  key={profile._id}
                  className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 `}
                >
                  {/* Profile Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {profile.firstName
                          ? profile.firstName.charAt(0).toUpperCase()
                          : profile.fullName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {profile.firstName && profile.lastName
                            ? `${profile.firstName} ${profile.lastName}`
                            : profile.fullName || "Unknown User"}
                        </h3>
                        {profile.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Default</span>
                        )}
                      </div>
                    </div>

                    
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MdPhone className="text-blue-500" />
                      <span>{profile.phoneNo || "No phone number"}</span>
                    </div>
                    {profile.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MdEmail className="text-blue-500" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Verification Status */}
                  <div className="mb-4">
                    <div
                      className={`${verification.color} text-white px-3 py-1 rounded-full text-xs font-medium inline-block`}
                    >
                      {verification.text}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {!profile.isKYCVerified && (
                      <button
                        onClick={() => handleKYC(profile)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Verify KYC
                      </button>
                    )}
                    <button
                      onClick={() =>  navigate(`/profile/${profile._id}`)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              )
            })}

          {/* Add New Profile Card */}
          <div
            onClick={handleAddAccounts}
            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center min-h-[280px]"
          >
            <div className="text-center">
              <MdAdd className="text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Add New Profile</h3>
              <p className="text-sm opacity-90">Create a new account profile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddAccountModal
          onClose={() => setShowAddModal(false)}
          onSuccess={(newProfile) => {
            setProfiles([...profiles, newProfile])
            setShowAddModal(false)
          }}
        />
      )}

      {showKYCModal && selectedProfile && (
        <KYCVerificationModal
          profile={selectedProfile}
          onClose={() => {
            setShowKYCModal(false)
            setSelectedProfile(null)
          }}
          onSuccess={(updatedProfile) => {
            const updatedProfiles = profiles.map((p) => (p._id === updatedProfile._id ? updatedProfile : p))
            setProfiles(updatedProfiles)
            setShowKYCModal(false)
            setSelectedProfile(null)
          }}
        />
      )}

      {/* {showProfileModal && selectedProfile && (
        <ProfileDetailsModal
          profile={selectedProfile}
          onClose={() => {
            setShowProfileModal(false)
            setSelectedProfile(null)
          }}
          onUpdate={(updatedProfile) => {
            const updatedProfiles = profiles.map((p) => (p._id === updatedProfile._id ? updatedProfile : p))
            setProfiles(updatedProfiles)
          }}
        />
      )} */}

      {/* Click outside to close dropdown */}
      {showDropdown && <div className="fixed inset-0 z-5" onClick={() => setShowDropdown(null)}></div>}
    </div>
  )
}

export default Accounts
