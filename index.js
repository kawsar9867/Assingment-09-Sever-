const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyJWT = require("./verifyJWT");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("tutorSphereDB");
    const tutorsCollection = db.collection("tutors");
    const bookingsCollection = db.collection("bookings");

    // JWT Generate Endpoint
    app.post("/jwt", (req, res) => {
      const user = req.body;
      if (!user || !user.email) {
        return res
          .status(400)
          .send({ error: true, message: "Email is required" });
      }
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    });

    // Public / Protected Tutor Endpoints

    // GET 6 tutors for home page (limit operator)
   // GET 6 tutors for home page (limit operator)
    app.get("/tutors/limit", async (req, res) => {
      try {
        const result = await tutorsCollection.find().limit(6).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: true, message: error.message });
      }
    });
   // GET all tutors (with Search by name and Filter by registration dates)
    app.get("/tutors", async (req, res) => {
      try {
        const { search, startDate, endDate } = req.query;
        let query = {};

        // Case-insensitive regex search for tutor name
        if (search) {
          query.name = { $regex: search, $options: "i" };
        }



run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TutorSphere Server is running fine!");
});

app.listen(PORT, () => {
  console.log(`TutorSphere server running on port ${PORT}`);
});
