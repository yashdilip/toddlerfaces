import mongoose from "mongoose"

global.mongoose = {
  conn: null,
  promise: null
}

export async function dbConnect() {

  mongoose.set("strictQuery", false);

  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local')
  }
  
  if (process.env.NODE_ENV === 'development') {
    if (global.mongoose && global.mongoose.conn) {
      console.log('Using Existing mongoose connection');
      return global.mongoose.conn;
    }

    const promise = mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    }).then(mongoose => mongoose);

    global.mongoose = {
      conn: await promise,
      promise
    }

    return await promise;

  } else {
    console.log('Creatnig new mongoose connection');

    // "mongodb+srv://vercel-admin-user:2ee7l4Jqjcho9XDd@cluster0.n74m5tz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    // "mongodb+srv://toddlerfaces:toddler@cluster0.n74m5tz.mongodb.net/toddlerfaces?retryWrites=true&w=majority"

    // const user = process.env.MONGODB_USER || "toddlerfaces";
    // const password = process.env.MONGODB_PASSWORD || "toddler";
    // const database = process.env.MONGODB_DATABASE || "toddlerfaces";

    // const conString = `mongodb+srv://${user}:${password}@cluster0.n74m5tz.mongodb.net/${database}?retryWrites=true&w=majority`;

    const promise = mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    }).then(mongoose => mongoose);

    global.mongoose = {
      conn: await promise,
      promise
    }

    return await promise;
  }
}