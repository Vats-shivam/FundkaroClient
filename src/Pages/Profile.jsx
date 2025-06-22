"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { useProfiles } from "../context/ProfileContext"
import toast, { Toaster } from "react-hot-toast"
import TopProfileBar from "../components/TopProfileBar"
import ShowProfile from "../components/ShowProfile"
import { IoIosArrowBack } from "react-icons/io"
import { MdPerson, MdSwapHoriz } from "react-icons/md"
import logo from "../assets/fundkaro.svg"
import KYCVerificationModal from "../components/KYCVerificationModal"
import MyDocuments from "../components/MyDocuments"

const Profile = () => {
  const navigate = useNavigate()
  const { profileId } = useParams() // Get profile ID from URL params
  const { user, setUser } = useUser()
  const { profiles , setProfiles} = useProfiles()

  const [currentProfile, setCurrentProfile] = useState(null)
  const [isOwnProfile, setIsOwnProfile] = useState(true)
  const [showProfileSelector, setShowProfileSelector] = useState(false)
  const [showKYCModal, setShowKYCModal] = useState(false)
  const userWithDocs = {
    ...user,
    documents: [
      { _id: 'doc1', name: 'PAN Card', fileUrl: '#', status: 'Verified', lastUpdated: '2023-10-20' },
      { _id: 'doc2', name: 'Aadhaar Card', fileUrl: '#', status: 'Verified', lastUpdated: '2023-10-20' },
      { _id: 'doc3', name: 'Bank Statement (Last 6 mo)', fileUrl: '#', status: 'Pending', lastUpdated: '2023-11-05' },
    ]
  };
  useEffect(() => {
    setUser(userWithDocs)
    if (profileId) {
      // Looking at a specific profile
      const profile = profiles.find((p) => p._id === profileId)
      if (profile) {
        setCurrentProfile(profile)
        setIsOwnProfile(false)
      } else {
        // Profile not found, redirect to own profile
        navigate("/profile")
      }
    } else {
      // No profile ID, show own profile
      setCurrentProfile(user)
      setIsOwnProfile(true)
    }
  }, [profileId, profiles, user, navigate])

  const handleProfileSwitch = (profile) => {
    if (profile._id === user._id) {
      navigate("/profile")
    } else {
      navigate(`/profile/${profile._id}`)
    }
    setShowProfileSelector(false)
  }

  const getProfileDisplayName = (profile) => {
    if (!profile) return "Loading..."

    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`
    }
    return profile.fullName || profile.email || profile.phoneNo || "Unknown User"
  }
  const handleUpdateDocument = (docId) => {
    // In a real app, this would open a file dialog to upload a new version
    toast.success(`Update functionality for document ID: ${docId} would be triggered here.`);
  };

  const handleDeleteDocument = (docId) => {
    if (window.confirm("Are you sure you want to delete this document? This cannot be undone.")) {
      const updatedDocs = currentProfile.documents.filter(doc => doc._id !== docId);
      
      // Update state to reflect the change immediately
      const updatedProfile = { ...currentProfile, documents: updatedDocs };
      setCurrentProfile(updatedProfile);

      // If you have a setUser in your context, you can update it globally
      if (setUser) {
        setUser(updatedProfile);
      }
      
      toast.success("Document deleted successfully!");
      // In a real app, you would make an API call here to delete from the server
      // await axios.delete(`/api/user/documents/${docId}`);
    }
  };
  if (!currentProfile) {
    return (
      <div className="font-primaryFont min-h-screen w-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-darkPrimary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }
  const handleKYC = () => {
    setShowKYCModal(true)
  }
  return (
    <div className="font-primaryFont min-h-screen w-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-darkPrimary to-lightPrimary shadow-lg">
        <div className="flex items-center justify-between h-16 px-3 sm:px-4 md:px-6">
          <img src={logo || "/placeholder.svg"} className="w-24 sm:w-32 h-7 sm:h-9" alt="Logo" />

          {/* Profile Selector */}
          <div className="relative">
            <button
              onClick={() => setShowProfileSelector(!showProfileSelector)}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-all duration-200 text-white"
            >
              <MdPerson className="text-lg" />
              <span className="hidden sm:inline text-sm font-medium">
                {isOwnProfile ? "My Profile" : getProfileDisplayName(currentProfile)}
              </span>
              <MdSwapHoriz className="text-lg" />
            </button>

            {/* Profile Dropdown */}
            {showProfileSelector && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-[250px] max-h-[400px] overflow-y-auto">
                {/* Own Profile */}
                <button
                  onClick={() => handleProfileSwitch(user)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    isOwnProfile ? "bg-blue-50 text-blue-700" : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.firstName?.charAt(0).toUpperCase() || "M"}
                    </div>
                    <div>
                      <p className="font-semibold">My Profile</p>
                      <p className="text-xs opacity-75">{user.email || user.phoneNo}</p>
                    </div>
                    {isOwnProfile && (
                      <div className="ml-auto">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Current</span>
                      </div>
                    )}
                  </div>
                </button>

                {/* Other Profiles */}
                {profiles && profiles.length > 0 && (
                  <>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Other Profiles</p>
                    </div>
                    {profiles.map((profile) => (
                      <button
                        key={profile._id}
                        onClick={() => handleProfileSwitch(profile)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          !isOwnProfile && currentProfile._id === profile._id
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {profile.firstName?.charAt(0).toUpperCase() ||
                              profile.fullName?.charAt(0).toUpperCase() ||
                              "U"}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{getProfileDisplayName(profile)}</p>
                            <p className="text-xs opacity-75">{profile.email || profile.phoneNo}</p>
                            
                          </div>
                          {!isOwnProfile && currentProfile._id === profile._id && (
                            <div className="ml-auto">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Current</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <Toaster position="top-center" />

      {/* Main Content */}
      <main className=" pt-20 max-w-[912px] mx-auto">
        {/* Profile Bar */}
        <div className="mb-6">
          <TopProfileBar
            user={currentProfile}
            isOwnProfile={isOwnProfile}
            profileType={isOwnProfile ? "own" : "other"}
          />
        </div>

        {/* Navigation and Profile Info */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Back Button */}
          <button
            className="flex items-center gap-1 text-left font-primaryFont font-semibold text-darkPrimary hover:text-lightPrimary transition duration-200 ease-out-in cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <IoIosArrowBack className="text-xl" color="black" />
            <span className="text-sm sm:text-base">Dashboard</span>
          </button>

          {/* Profile Type Indicator */}
          <div className="flex items-center gap-2">
            {!isOwnProfile && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Viewing: {getProfileDisplayName(currentProfile)}
              </div>
            )}
            {isOwnProfile && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">My Profile</div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="mb-8">
          <ShowProfile user={currentProfile} isOwnProfile={isOwnProfile} canEdit={isOwnProfile} />
        </div>
        {isOwnProfile && currentProfile.documents && (
          <div className="mb-8">
            <MyDocuments
              documents={currentProfile.documents}
              onUpdate={handleUpdateDocument}
              onDelete={handleDeleteDocument}
            />
          </div>
        )}


        {/* Additional Actions for Other Profiles */}
        {!isOwnProfile && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Actions</h3>
            <div className="flex flex-wrap gap-3">
              
              {!currentProfile.isKYCVerified && (
                <button
                  onClick={() => handleKYC()}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Complete KYC
                </button>
              )}
              <button
                onClick={() => navigate(`/dashboard`)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Apply for Loan
              </button>
            </div>
          </div>
        )}
      </main>
      {showKYCModal && (
        <KYCVerificationModal
          profile={currentProfile}
          onClose={() => {
            setShowKYCModal(false)
            
          }}
          onSuccess={(updatedProfile) => {
            const updatedProfiles = profiles.map((p) => (p._id === updatedProfile._id ? updatedProfile : p))
            setProfiles(updatedProfiles)
            setShowKYCModal(false)
          }}
        />
      )}
      {/* Click outside to close dropdown */}
      {showProfileSelector && <div className="fixed inset-0 z-10" onClick={() => setShowProfileSelector(false)}></div>}
    </div>
  )
}

export default Profile
