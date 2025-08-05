import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
// 
    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/nextbuy`, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully.");
      return mongoose;
    })

    cached.conn = await cached.promise;
    return cached.conn;
  }

  return cached.conn;
}

export default connectDB;
