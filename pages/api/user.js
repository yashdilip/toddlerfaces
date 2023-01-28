import { dbConnect } from "../../lib/db-connect";
import User from '../../models/user';

export default async function handler(request, response) {
   try {
       await dbConnect();

       const users = await User
           .find()
           .limit(10);

       response.status(200).json(users);
   } catch (e) {
       console.error(e);
   }
};

/*
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserAPI() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/.netlify/functions/users')
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  const createUser = async (user) => {
    try {
      const res = await axios.post('/.netlify/functions/users', user);
      setUsers([...users, res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const updateUser = async (id, updates) => {
    try {
      const res = await axios.patch(`/.netlify/functions/users/${id}`, updates);
      setUsers(users.map(user => user._id === id ? res.data : user));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/.netlify/functions/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return { users, createUser, updateUser, deleteUser };
}
*/