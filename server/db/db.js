import mongoose from "mongoose";

const connectToDatabase= async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000
        });
        console.log("Connected to MongoDB");
    }catch(err){
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
}

export default connectToDatabase;