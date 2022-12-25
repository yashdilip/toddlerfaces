import clientPromise from "../lib/mongodb";
import { useEffect, useState } from 'react';
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSession } from 'next-auth/react';


export default function Home ({isConnected}) {
  const [restaurants, setRestaurants] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    (
      async () => {
        const results = await fetch("/api/list");
        const resultsJson = await results.json();
        setRestaurants(resultsJson);
      })();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(min-h-screen_-w-16)]]">
      <h1>Home page { isConnected? "MongoDb": "" }</h1>
      { status == 'authenticated' &&
        <div className="grid">
        <h2>Welcome, {session.user.name}</h2>
          {restaurants.map((restaurant) => (
            <div className="card" key={restaurant._id}>
              <h2>{restaurant.name}</h2>
              <p>{restaurant.cuisine}</p>
            </div>
          ))}
        </div>
        }
    </div>
  )
};

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  try {
    await clientPromise;

    return {
      props: { isConnected: true, session}
    }
  } catch (error) {
    console.error(error);

    return {
      props: { isConnected: false, session}
    }
  }
}