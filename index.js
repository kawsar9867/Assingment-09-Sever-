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
 // Date filtering using $gte and $lte (handling comparison as strings or parsed dates)
        if (startDate && endDate) {
          query.registrationStartDate = { $gte: startDate };
          query.registrationEndDate = { $lte: endDate };
        } else if (startDate) {
          query.registrationStartDate = { $gte: startDate };
        } else if (endDate) {
          query.registrationEndDate = { $lte: endDate };
        }

        const result = await tutorsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: true, message: error.message });
      }
    });

    // POST add tutor (Private route)
    app.post("/tutors", verifyJWT, async (req, res) => {
      try {
        const newTutor = req.body;
        // Verify email in token matches email of creator
        if (req.decoded.email !== newTutor.email) {
          return res.status(403).send({ error: true, message: "forbidden access" });
        }
        // Force conversion of slot and price to numbers
        newTutor.totalSlots = parseInt(newTutor.totalSlots) || 0;
        newTutor.hourlyFee = parseFloat(newTutor.hourlyFee) || 0;
        
        const result = await tutorsCollection.insertOne(newTutor);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: true, message: error.message });
      }
    });

    // PUT update tutor (Private route)
    app.put("/tutors/:id", verifyJWT, async (req, res) => {
      try {
        const id = req.params.id;
        const updatedTutor = req.body;
        
        // Find existing tutor to verify ownership
        const query = { _id: new ObjectId(id) };
        const existing = await tutorsCollection.findOne(query);
        if (!existing) {
          return res.status(404).send({ error: true, message: "Tutor not found" });
        }
        
        if (req.decoded.email !== existing.email) {
          return res.status(403).send({ error: true, message: "forbidden access" });
        }

        const updateDoc = {
          $set: {
            name: updatedTutor.name,
            image: updatedTutor.image,
            subject: updatedTutor.subject,
            availableDays: updatedTutor.availableDays,
            availableTime: updatedTutor.availableTime,
            hourlyFee: parseFloat(updatedTutor.hourlyFee) || 0,
            totalSlots: parseInt(updatedTutor.totalSlots) || 0,
            sessionStartDate: updatedTutor.sessionStartDate,
            registrationStartDate: updatedTutor.registrationStartDate,
            registrationEndDate: updatedTutor.registrationEndDate,
            institution: updatedTutor.institution,
            location: updatedTutor.location,
            mode: updatedTutor.mode,
          },
        };

        const result = await tutorsCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: true, message: error.message });
      }
    });
    
  // DELETE tutor (Private route)
    app.delete("/tutors/:id", verifyJWT, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        
        const existing = await tutorsCollection.findOne(query);
        if (!existing) {
          return res.status(404).send({ error: true, message: "Tutor not found" });
        }

        if (req.decoded.email !== existing.email) {
          return res.status(403).send({ error: true, message: "forbidden access" });
        }

        const result = await tutorsCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: true, message: error.message });
      }
    });


run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TutorSphere Server is running fine!");
});

app.listen(PORT, () => {
  console.log(`TutorSphere server running on port ${PORT}`);
});
