require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./config/dbConnection");
const { initCronJobs } = require("./utils/cronJobs");
const { seedMarketplaceItems } = require("./utils/seedMarketplace");
const authRoutes = require("./routes/authRoute");
const dashboardRoutes = require("./routes/dashboardRoute");
const taskRoutes = require("./routes/taskRoute");
const marketplaceRoutes = require("./routes/marketplaceRoute");
const taskHistoryRoutes = require("./routes/taskHistoryRoute");
const profileRoutes = require("./routes/profileRoute");

const app = express();   
app.use(cors({
  origin: [
    "https://quest-life.vercel.app",
    "https://quest-life-tushars-projects-4bd6811b.vercel.app",
    "https://quest-life-git-main-tushars-projects-4bd6811b.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});    

app.get("/", (req, res) => {
  res.send("Hello World");
});

connectDB().then(async () => {
  // Initialize cron jobs after database connection
  initCronJobs();
  
  // Seed marketplace with initial items
  await seedMarketplaceItems();
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/history", taskHistoryRoutes);
app.use("/api/profile", profileRoutes);

app.use((err, req, res, next) => {
  console.error(" Error:", err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
    Server is running at Port: ${PORT}
    `);
});
