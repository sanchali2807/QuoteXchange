const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/db");
//import models 
require("./models");
const authRoutes = require("./routes/authRoutes");
const rfqRoutes = require("./routes/rfqRoutes");
const bidRoutes = require("./routes/bidRoutes");
const logRoutes = require("./routes/logRoutes");
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
        await sequelize.authenticate();
        console.log("Database Connected");

        await sequelize.sync()
.then(() => {
  app.listen(PORT);
});
        console.log("database synced");

        //routes
        app.use("/api/auth",authRoutes);
        app.use("/api/rfq",rfqRoutes);
        app.use("/api/rfq",bidRoutes);
        app.use("/api/rfq",logRoutes);

        app.listen(PORT,()=>{
            console.log(`Server is running on ${PORT}`);
        });
    }catch(err){
        console.log(err);
    }
}
startServer();

