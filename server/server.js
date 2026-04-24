const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequilize = require("./config/db");

const app = express();

app.use(cors({
    origin : process.env.CLIENT_ORIGIN
}));

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("RFQ website is running");
})

app.get("/health",(req,res)=>{
    res.status(200).json({
        success : true,
        message : "Server healthy"
    });
});

const PORT = process.env.PORT||8300;


const startServer = async()=>{
    try{
        // first sequilize connection authentication
        await sequilize.authenticate();
        console.log("Database Connected");

        await sequilize.sync();
        console.log("database synced");

        app.listen(PORT,()=>{
            console.log(`Server is running on ${PORT}`);
        });
    }catch(err){
        console.log(err);
    }
}
startServer();

