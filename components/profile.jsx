import React from 'react';
import { Image } from 'next/image';

const UserProfile = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4" key={user._id}>
      <Image src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
      <h2 className="text-lg font-medium text-center mb-2">{user.name}</h2>
      <p className="text-gray-600 text-center">{user.email}</p>
      <div className="text-center mt-4">
        <button className="bg-blue-500 text-white p-2 rounded-lg">Edit Profile</button>
      </div>
    </div>
  );
};

export default UserProfile;