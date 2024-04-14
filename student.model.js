// student.model.js

const mongoose = require('mongoose');
const QRCode = require('qrcode');



const studentSchema = new mongoose.Schema({
    registeredAs: {
      type: String,
      required: true,
      enum: ['guest', 'resident'] // Enforce valid registration types
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure unique email
    phone: { type: String, required: true }, // Assuming phoneNo is a string
    rollNumber: { type: String, unique: true }, // Assuming roll number is unique for residents
    qrCode: { type: String, required: true },
    qrCodeExpiry: { type: Date, required: true },
    qrCodeImagePath: { type: String } // Path to the QR code image (optional)
  });
  
  module.exports = mongoose.model('Student', studentSchema);

