import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export const connectDB = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }
  try {
    const instance = await mongoose.connect(`${process.env.MONGO_DB_URI}`, {
      serverSelectionTimeoutMS: 5000,
    });
    connection.isConnected = instance.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);

    // Graceful exit in case of a connection error
    process.exit(1);
  }
};
