import React from 'react';
import Image from 'next/image';

const UserProfile = ({ user }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/90" key={user._id}>
      <Image src={user.avatar} alt={user.name} className="mx-auto mb-4 h-32 w-32 rounded-full" />
      <h2 className="mb-2 text-center text-lg font-semibold text-gray-950 dark:text-white">{user.name}</h2>
      <p className="text-center text-gray-600 dark:text-gray-300">{user.email}</p>
      <div className="mt-4 text-center">
        <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white dark:bg-indigo-500 dark:text-white" type="button">Edit profile</button>
      </div>
    </div>
  );
};

export default UserProfile;
