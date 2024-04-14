const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
// const crypto = require('crypto-js');
const crypto = require('crypto');
const moment = require('moment');
const User = require('./student.model'); // Import your user model
const mongoose = require('mongoose');

const port = process.env.PORT || 3000; // Listen on environment port or default 3000
const Student = require('./student.model'); // Assuming student.model.js is in the same directory
const app = express();

app.use(bodyParser.json());

//db connection

mongoose.connect('mongodb://localhost:27017/useriitgndb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB database'))
.catch(error => console.error('Error connecting to MongoDB:', error));




//unique
function generateUniqueQRCode() {
  const buffer = Buffer.alloc(32); // Allocate a 32-byte buffer
  crypto.randomFillSync(buffer); // Fill the buffer with random bytes
  return buffer.toString('hex'); // Convert the buffer to a hexadecimal string
}


// Function to check if a QR code is expired
function isQRCodeExpired(qrCodeExpiry) {
    return moment().isAfter(moment(qrCodeExpiry));
}

// Route to generate a new QR code for a user
app.post('/generate-qr', async (req, res) => {
    const { rollNumber, data, expiryMinutes } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ rollNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Generate unique QR code string
        const qrCode = generateUniqueQRCode();

        // Calculate QR code expiry time
        const qrCodeExpiry = moment().add(expiryMinutes, 'minutes').toDate();

        const newUser = new User({
            rollNumber,
            data,
            qrCode,
            qrCodeExpiry
        });

        await newUser.save();

        // Generate QR code image (optional, depending on your needs)
        const qrCodeImage = await QRCode.toDataURL(qrCode, { type: 'png' });

        res.status(201).json({
            qrCode,
            qrCodeExpiry,
            qrCodeImage: qrCodeImage || null // Only include if image is generated
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

  // Route to verify a QR code (simulate security check-in/check-out)
  app.post('/verify-qr', async (req, res) => {
    const { qrCode } = req.body;

    try {
        const user = await User.findOne({ qrCode });
        if (!user) {
            return res.status(404).json({ error: 'Invalid QR code' });
        }

        if (isQRCodeExpired(user.qrCodeExpiry)) {
            return res.status(400).json({ error: 'QR code expired' });
        }

        // Perform security check-in/check-out logic here (e.g., update timestamps)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
     }
    //   finally {
    //     // Optional code to execute regardless of errors or successful execution
    // }
});



//new student
const newStudent = new Student({
    rollNumber: '12345',
    data: { name: 'John Doe', department: 'CSE' },
    qrCode: generateUniqueQRCode(), // Replace with your logic for generating unique QR codes
    // qrCodeExpiry: moment().add(30, 'minutes').toDate() // Set expiry to 30 minutes from now
    qrCodeExpiry: new Date('2024-04-13T12:00:00') // Set the expiry date and time here

});

newStudent.save()
    .then(savedStudent => {
        const qrCodeString = savedStudent.qrCode;
        console.log('Student and QR code created successfully:', qrCodeString);

        // You can use the qrCodeString here for further actions (e.g., display it for user)
    })
    .catch(error => console.error('Error creating student:', error));



//
    Student.findOne({ qrCode: 'qrCodeString' })
    .then(student => {
      if (student) {
        // Check if QR code is expired
        if (isQRCodeExpired(student.qrCodeExpiry)) {
          console.log('Student found, but QR code is expired');
          // You can also return an error response here (optional)
         // res.status(400).json({ error: 'QR code expired' }); // Example error response
        } else {
          console.log('Student found:', student);
          // Perform security check-in/check-out logic here (if applicable)
        }
      } else {
        console.log('Student with that QR code not found');
      }
    })
    .catch(error => console.error('Error finding student:', error));
  
