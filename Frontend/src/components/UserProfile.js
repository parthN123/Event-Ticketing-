import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const backendUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001';

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <img
          src={`${backendUrl}/api/users/avatar/${user?.avatar || 'default.jpg'}`}
          alt="Profile"
          className="h-16 w-16 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `${backendUrl}/api/users/avatar/default.jpg`;
          }}
        />
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 