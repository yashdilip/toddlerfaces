import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { UserProfile } from "../components"

export default function Home () {
  const [users, setUsers] = useState([]);
  const { data: session, status, loading } = useSession();

  useEffect(() => {
    if (!session) return;

    axios.get('/api/user', { headers: { 'Authorization': `Bearer ${session.token}` } })
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, [session]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {users.map((user) => (
        <UserProfile user={user} key={user._id} />
      ))}
    </div>
  )
};