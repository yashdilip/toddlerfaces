import clientPromise from "../lib/mongodb";
import { useEffect, useState } from 'react';

export default function Home ({isConnected}) {
  const [restaurants, setRestaurants] = useState([]);

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
        <div className="grid">
          {restaurants.map((restaurant) => (
            <div className="card" key={restaurant._id}>
              <h2>{restaurant.name}</h2>
              <p>{restaurant.cuisine}</p>
            </div>
          ))}
        </div>        
    </div>
  )
};

export async function getServerSideProps(context) {
  try {
    await clientPromise;

    return {
      props: { isConnected: true}
    }
  } catch (error) {
    console.error(error);

    return {
      props: { isConnected: false}
    }
  }
}