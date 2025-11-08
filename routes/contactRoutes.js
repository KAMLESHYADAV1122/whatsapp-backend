import express from "express";
import Contact from "../models/contact.js";

const router = express.Router();

// ✅ Create new contact
router.post("/", async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone is required" });

    const existing = await Contact.findOne({ phone });
    if (existing) {
      return res.json({ success: true, message: "Already exists", data: existing });
    }

    const contact = await Contact.create({ name, phone });
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Update contact
router.put("/:id", async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, phone },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Delete contact
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
