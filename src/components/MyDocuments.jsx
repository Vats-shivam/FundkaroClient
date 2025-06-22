// src/components/MyDocuments.jsx

import React from 'react';
import { IoDocumentsOutline, IoEyeOutline, IoCloudUploadOutline, IoTrashOutline, IoCheckmarkCircle, IoTime } from 'react-icons/io5';

// Helper for status styles
const statusConfig = {
  Verified: { icon: <IoCheckmarkCircle />, text: 'text-green-600', bg: 'bg-green-100' },
  Pending: { icon: <IoTime />, text: 'text-yellow-600', bg: 'bg-yellow-100' },
};

const DocumentRow = ({ doc, onUpdate, onDelete }) => {
  const status = statusConfig[doc.status] || {};

  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex items-center gap-4 flex-1">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${status.bg} ${status.text}`}>
          {status.icon || <IoDocumentsOutline size={20} />}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{doc.name}</p>
          <p className="text-sm text-gray-500">Last updated: {doc.lastUpdated}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-center">
        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-200 rounded-full transition-colors">
          <IoEyeOutline size={20} title="View Document" />
        </a>
        <button onClick={() => onUpdate(doc._id)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-gray-200 rounded-full transition-colors">
          <IoCloudUploadOutline size={20} title="Update Document" />
        </button>
        <button onClick={() => onDelete(doc._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-200 rounded-full transition-colors">
          <IoTrashOutline size={20} title="Delete Document" />
        </button>
      </div>
    </li>
  );
};

const MyDocuments = ({ documents, onUpdate, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <IoDocumentsOutline className="text-2xl text-darkPrimary" />
        <div>
            <h3 className="text-xl font-bold text-gray-800">My Documents</h3>
            <p className="text-sm text-gray-500">Manage your uploaded documents for faster loan applications.</p>
        </div>
      </div>

      {documents && documents.length > 0 ? (
        <ul className="space-y-3">
          {documents.map(doc => (
            <DocumentRow key={doc._id} doc={doc} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">You haven't uploaded any documents yet.</p>
        </div>
      )}

       <div className="mt-6 text-center">
         <button className="bg-darkPrimary hover:bg-lightPrimary text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
            Upload a New Document
         </button>
       </div>
    </div>
  );
};

export default MyDocuments;