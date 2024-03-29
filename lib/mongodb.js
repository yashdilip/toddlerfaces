import { MongoClient } from "mongodb";


const uri = process.env.MONGODB_URI;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};
console.log("url ", uri)
let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
    // in development mode, use a global variable so thta the value
    // is presented across module reloads caused by MHR (Hot Module Replacement).

    if (!global.mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }

    clientPromise = global._mongoClientPromise;
} else {
    //in production mode, it's best to not use a global variable

    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

console.log("connected!!!!");
// Export a module-scoped MongoClient promise. By doing this in a separate module,
// the client can be shared across functions.
export default clientPromise;