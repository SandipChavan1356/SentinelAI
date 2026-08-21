import "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "./constant";
import dns from "dns";

dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectdb = async() => {
    try {
        const connectdbInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB is Connected!!! DB host: ${connectdbInstance.connection.host}`);
    } catch (error) {
        console.log("ERRROR is " , error);
        process.exit(1);
    }
}

export default connectdb;