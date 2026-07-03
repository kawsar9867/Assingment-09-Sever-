const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const sampleTutors = [
  {
    name: "Dr. Clara Oswald",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&q=80",
    subject: "Mathematics",
    availableDays: "Mon, Wed, Fri",
    availableTime: "10:00 AM - 12:00 PM",
    hourlyFee: 45,
    totalSlots: 5,
    sessionStartDate: "2026-07-10",
    registrationStartDate: "2026-07-01",
    registrationEndDate: "2026-07-09",
    institution: "MIT, 8 Years Experience",
    location: "Boston, MA",
    mode: "Both",
    email: "clara.oswald@example.com",
    creatorName: "Clara Oswald"
  },
  {
    name: "Prof. Arthur Pendragon",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    subject: "Physics",
    availableDays: "Tue, Thu",
    availableTime: "3:00 PM - 5:00 PM",
    hourlyFee: 50,
    totalSlots: 8,
    sessionStartDate: "2026-07-15",
    registrationStartDate: "2026-07-02",
    registrationEndDate: "2026-07-14",
    institution: "Cambridge, 10 Years Experience",
    location: "London, UK",
    mode: "Online",
    email: "arthur@example.com",
    creatorName: "Arthur Pendragon"
  },
  {
    name: "Sarah Jane Smith",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    subject: "English",
    availableDays: "Mon, Tue, Wed",
    availableTime: "1:00 PM - 3:00 PM",
    hourlyFee: 35,
    totalSlots: 12,
    sessionStartDate: "2026-07-08",
    registrationStartDate: "2026-06-25",
    registrationEndDate: "2026-07-07",
    institution: "Oxford University, 5 Years Experience",
    location: "Oxford, UK",
    mode: "Both",
    email: "sarahjane@example.com",
    creatorName: "Sarah Jane Smith"
  },
  {
    name: "Dr. John Watson",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
    subject: "Chemistry",
    availableDays: "Sun, Thu",
    availableTime: "6:00 PM - 8:00 PM",
    hourlyFee: 40,
    totalSlots: 0, // fully booked
    sessionStartDate: "2026-07-04",
    registrationStartDate: "2026-06-20",
    registrationEndDate: "2026-07-03",
    institution: "King's College, 6 Years Experience",
    location: "London, UK",
    mode: "Offline",
    email: "watson@example.com",
    creatorName: "John Watson"
  },
  {
    name: "Rose Tyler",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
    subject: "Biology",
    availableDays: "Mon, Thu",
    availableTime: "9:00 AM - 11:00 AM",
    hourlyFee: 38,
    totalSlots: 10,
    sessionStartDate: "2026-08-01", // Future session
    registrationStartDate: "2026-07-05", // Registration starts in future
    registrationEndDate: "2026-07-31",
    institution: "UCL, 4 Years Experience",
    location: "London, UK",
    mode: "Online",
    email: "rose@example.com",
    creatorName: "Rose Tyler"
  },
  {
    name: "Martha Jones",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    subject: "Computer Science",
    availableDays: "Fri, Sat",
    availableTime: "4:00 PM - 7:00 PM",
    hourlyFee: 60,
    totalSlots: 4,
    sessionStartDate: "2026-07-05",
    registrationStartDate: "2026-06-25",
    registrationEndDate: "2026-07-04",
    institution: "Stanford, 7 Years Experience",
    location: "Palo Alto, CA",
    mode: "Both",
    email: "martha@example.com",
    creatorName: "Martha Jones"
  }
];

async function seed() {
  try {
    await client.connect();
    const db = client.db("tutorSphereDB");
    const tutorsCollection = db.collection("tutors");
    
    // Clear existing
    await tutorsCollection.deleteMany({});
    console.log("Cleared old tutors.");
    
    // Insert new
    const result = await tutorsCollection.insertMany(sampleTutors);
    console.log(`Successfully seeded ${result.insertedCount} tutors.`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seed();
