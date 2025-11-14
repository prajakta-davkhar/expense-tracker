import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // ✅ Connect to MongoDB Atlas using URI from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Stop server if DB fails to connect
  }

  // 🟡 Optional: Monitor connection events (useful during dev)
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected!");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected!");
  });

  mongoose.connection.on("error", (err) => {
    console.error("🚨 MongoDB Error:", err.message);
  });
};

export default connectDB;
