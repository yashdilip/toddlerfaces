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
