const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db");

require("./models");

const authRoutes = require("./routes/authRoutes");
const rfqRoutes = require("./routes/rfqRoutes");
const bidRoutes = require("./routes/bidRoutes");
const logRoutes = require("./routes/logRoutes");

const app = express();


app.use(cors({
  origin: [
    "https://quote-xchange.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());
// app.use(cors({
//   origin: "https://quote-xchange.vercel.app",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

app.options(/.*/, cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("RFQ website is running");
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server healthy"
  });
});

app.use((req,res,next)=>{
  console.log("REQ:", req.method, req.url);
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/rfq", rfqRoutes);
app.use("/api/rfq", bidRoutes);
app.use("/api/rfq", logRoutes);

const PORT = process.env.PORT || 8300;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database Connected");

    await sequelize.sync();
    console.log("Database Synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Startup Error:", err);
  }
}

startServer();