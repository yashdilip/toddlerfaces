import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';


export default function Home () {
  const [users, setUsers] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    (
      async () => {
        const results = await fetch("/api/list");
        const resultsJson = await results.json();
        setUsers(resultsJson);
      })();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(min-h-screen_-w-16)]]">
      <h1>Home page MongoDb</h1>
      { status == 'authenticated' &&
        <div className="grid">
        <h2>Welcome, {session.user.name} Role, {session.user.role}</h2>
          {users.map((user) => (
            <div className="card" key={user._id}>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
        }
    </div>
  )
};