
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const crypto = require('crypto');
const moment = require('moment');
const mongoose = require('mongoose');
const Student = require('./student.model');

port = 5000;

app.use(express.static('public'))
app.use(express.json())
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", (req, res) => {
    res.render("index");
    // res.sendFile("./index.html")
    // res.send("YO")
});


// app.post('/', (req, res) => {
//     const name = req.body.name;
//     const email = req.body.email;
//     const phone = req.body.phone;
//     const rollNumber = req.body.rollNumber;
  
   
//     console.log(name, email);
//     res.send('Form submitted successfully!');
// })


app.post("mongodb://localhost:27017/useriitgndb", () => {
    console.log(req.body)
})



////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        const existingUser = await Student.findOne({ rollNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Generate unique QR code string
        const qrCode = generateUniqueQRCode();

        // Calculate QR code expiry time
        const qrCodeExpiry = moment().add(expiryMinutes, 'minutes').toDate();
        
        

        await newStudent.save();

        // Generate QR code image (optional, depending on your needs)
        // const qrCodeImage = await QRCode.toDataURL(qrCode, { type: 'png' });

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
        const user = await Student.findOne({ qrCode });
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
   
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////



app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/useriitgndb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB database'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

app.post('/', (req, res) => {
  const registeredAs = req.body.userType
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const rollNumber = req.body.rollNumber;
  const qrCode = generateUniqueQRCode();
  const qrCodeExpiry = moment().add(30, 'minutes').toDate();
 
   
  console.log(registeredAs ,name, email,phone,rollNumber,qrCode,qrCodeExpiry);
  // res.send('form is submitted')
  // res.send(displayQRCode(qrCode, 'my-qr-code'))
  // res.send();

  const newStudent = new Student({
    registeredAs,
    name,
    email,
    phone,
    rollNumber,
    qrCode,
    qrCodeExpiry,

  });

  newStudent.save()
    .then(savedStudent => {
      console.log('Student saved successfully:', savedStudent);
      // res.status(201).json({ message: 'Student created successfully' });
    })
    .catch(error => {
      console.error('Error saving student:', error);
      // res.status(500).json({ error: 'Internal server error' });
    });


  res.render('image', {
    imgURL: `https://quickchart.io/qr?text=${qrCode}&size=200`
  })
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////









//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => console.log(`Server listening on port ${port}`));

