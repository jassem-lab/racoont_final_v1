const express = require("express");
const app = express();
require("dotenv").config({ path: "./config/.env" });
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const cors = require("cors");

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET , HEAD , PUT , PATCH , POST , DELETE ",
  preflightContinue: false,
};

// Database settings

mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(()=>console.log("====== Database Connected ======"));
  

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

// Routes

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
// JWT

app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

// Server Running

app.listen(process.env.PORT, () => {
  console.log(`====== Server listening on port ${process.env.PORT} ======`);
});


// Production Server

if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });} 
