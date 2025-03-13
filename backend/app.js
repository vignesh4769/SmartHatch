const {MongoClient} = require("mongodb");
const uri = require("./atlas_uri");

// console.log(uri)

const client =new MongoClient(uri);
const dbname= "users";
const connectToDatabase = async () => {
    try{
        await client.connect();
        console.log(`Connected to database ${dbname}`);
    }catch(err){
        console.error(`Error connecting to database ${err}`);
    }
};

const main = async () => {
    try{
        await connectToDatabase();
    }catch(err){
        console.error(`Error connecting to database ${err}`);
    }finally{
        await client.close();
        console.log("Connection to database closed");
    }
    
};

main();