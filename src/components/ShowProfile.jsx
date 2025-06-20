"use client"

import { useState } from "react"
import { MdEdit, MdVerifiedUser, MdCreditCard } from "react-icons/md"
import toast from "react-hot-toast"

const ShowProfile = ({ user, isOwnProfile = true, canEdit = true }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
    address: user?.address || "",
    occupation: user?.occupation || "",
    education: user?.education || "",
  })

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p>Profile not found</p>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    // Here you would typically update the user data
    toast.success("Profile updated successfully!")
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
      address: user?.address || "",
      occupation: user?.occupation || "",
      education: user?.education || "",
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
          {canEdit && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <MdEdit className="text-lg" />
              {isEditing ? "Cancel" : "Edit"}
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={editData.firstName}
                  onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={editData.lastName}
                  onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={editData.dateOfBirth}
                onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={editData.address}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input
                  type="text"
                  value={editData.occupation}
                  onChange={(e) => setEditData({ ...editData, occupation: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <input
                  type="text"
                  value={editData.education}
                  onChange={(e) => setEditData({ ...editData, education: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                <p className="text-gray-800 font-medium">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.fullName || "Not provided"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-gray-800">{user.email || "Not provided"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                <p className="text-gray-800">{user.phoneNo || "Not provided"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                <p className="text-gray-800">
                  {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not provided"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                <p className="text-gray-800">{user.address || "Not provided"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Occupation</label>
                <p className="text-gray-800">{user.occupation || "Not provided"}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KYC Information */}
      {(user.panCardNumber || user.aadharCardNumber) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">KYC Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.panCardNumber && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <MdCreditCard className="text-green-600 text-xl" />
                <div>
                  <p className="text-sm font-medium text-green-800">PAN Card</p>
                  <p className="text-green-700">{user.panCardNumber}</p>
                </div>
              </div>
            )}

            {user.aadharCardNumber && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <MdCreditCard className="text-green-600 text-xl" />
                <div>
                  <p className="text-sm font-medium text-green-800">Aadhar Card</p>
                  <p className="text-green-700">
                    {user.aadharCardNumber.replace(/(\d{4})(\d{4})(\d{4})/, "$1 **** $3")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Credit Information */}
      {user.cibilScore && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Credit Information</h3>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-600">CIBIL Score</p>
              <p className="text-2xl font-bold text-blue-600">{user.cibilScore}</p>
            </div>
            {user.credit_report && (
              <a
                href={user.credit_report}
                download="Credit_Report.pdf"
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Download Report
              </a>
            )}
          </div>
        </div>
      )}

      {/* Profile Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${user.isKYCVerified ? "bg-green-50" : "bg-red-50"}`}>
            <div className="flex items-center space-x-2">
              <MdVerifiedUser className={`text-xl ${user.isKYCVerified ? "text-green-600" : "text-red-600"}`} />
              <div>
                <p className="font-medium">KYC Status</p>
                <p className={`text-sm ${user.isKYCVerified ? "text-green-700" : "text-red-700"}`}>
                  {user.isKYCVerified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${user.isProfileCompleted ? "bg-green-50" : "bg-yellow-50"}`}>
            <div className="flex items-center space-x-2">
              <MdVerifiedUser className={`text-xl ${user.isProfileCompleted ? "text-green-600" : "text-yellow-600"}`} />
              <div>
                <p className="font-medium">Profile Status</p>
                <p className={`text-sm ${user.isProfileCompleted ? "text-green-700" : "text-yellow-700"}`}>
                  {user.isProfileCompleted ? "Complete" : "Incomplete"}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${user.isVerified ? "bg-green-50" : "bg-red-50"}`}>
            <div className="flex items-center space-x-2">
              <MdVerifiedUser className={`text-xl ${user.isVerified ? "text-green-600" : "text-red-600"}`} />
              <div>
                <p className="font-medium">Phone Status</p>
                <p className={`text-sm ${user.isVerified ? "text-green-700" : "text-red-700"}`}>
                  {user.isVerified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowProfile
