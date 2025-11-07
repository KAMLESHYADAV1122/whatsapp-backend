import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String
});

export default mongoose.model("Contact", contactSchema);