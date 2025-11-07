import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/whatsapp_contacts";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Schema & Model
const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
});
const Contact = mongoose.model("Contact", contactSchema);

// ✅ Seed 25 static contacts if DB empty
async function seedContacts() {
  const count = await Contact.countDocuments();
  if (count === 0) {
    const sampleContacts = Array.from({ length: 25 }).map((_, i) => ({
      name: `User ${i + 1}`,
      phone: `91${Math.floor(1000000000 + Math.random() * 9000000000)}`, // random 10-digit number
    }));

    await Contact.insertMany(sampleContacts);
    console.log("🌱 Seeded 25 sample contacts into MongoDB.");
  } else {
    console.log(`ℹ️ ${count} contacts already exist. Skipping seeding.`);
  }
}
seedContacts();

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ✅ Get all contacts
app.get("/api/contacts", async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

// ✅ Add new contact
app.post("/api/contacts", async (req, res) => {
  const { name, phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: "Phone is required" });

  const newContact = new Contact({ name, phone });
  await newContact.save();
  res.json({ success: true, message: "Contact added successfully" });
});

// ✅ Delete contact
app.delete("/api/contacts/:id", async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Deleted successfully" });
});

// ✅ Update contact
app.put("/api/contacts/:id", async (req, res) => {
  const { name, phone } = req.body;
  await Contact.findByIdAndUpdate(req.params.id, { name, phone });
  res.json({ success: true, message: "Updated successfully" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
