require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const userRoutes = require("./routes/user");


const corsOptions = {
  origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));

app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes setup

app.get("/test", (req, res) => {
  res.status(200).json({ message: "Test route is working!" });
});

app.use("/auth", authRoutes);
app.use("/auth", userRoutes);
app.use("/auth", loginRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
