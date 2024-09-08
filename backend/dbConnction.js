// import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// const uri = process.env.DATABASE_URL;

// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     },
//     connectTimeoutMS: 30000,  // Set the connection timeout to 30 seconds
//     socketTimeoutMS: 30000,
// });

// const dbConnect = async () => {

//     try {
//         const connecyionInstance=await client.connect();
//         console.log("Successfully connected to MongoDB");
//         console.log(connecyionInstance);

//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//         throw error; // Propagate the error to the caller
//     }
// };


const dbConnect = async () => {
    const uri = `${process.env.DATABASE_URL}/tunestream`;
    try {
        const conn = await mongoose.connect(uri);
        console.log(`\n☘️  MongoDB Connected! Db host: ${conn.connection.host}:${conn.connection.port}\n`);
    }
    catch (err) {
        console.log("Failed to connect to MongoDB" + err + "\n");
        return err.message;
    }

}

export default dbConnect;
