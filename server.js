

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











////////////////////////////////////////////////////////////////////////////////////////////////////////////

var name =document.querySelector(".myName")
var email =document.querySelector(".myEmail")
var phone_no =document.querySelector(".myPhone")
var rollNumber =document.querySelector(".myRoll")


button.addEventListner("click",()=>{
    var obj={
        name :name.value,
        email:email.value,
        phone:phone_no.value,
        roll:rollNumber.value,
    }



////////////////////////////////////////////////////////////////////////////////////////////////////////////


//new student
// const newStudent = new Student({
//     object:obj,
//     qrCode: generateUniqueQRCode(), // Replace with your logic for generating unique QR codes
//     // qrCodeExpiry: moment().add(30, 'minutes').toDate() // Set expiry to 30 minutes from now
//     qrCodeExpiry: new Date('2024-04-13T12:00:00'),// Set the expiry date and time here
//     // qrCodeImagePath:

// });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const newStudent = new Student({
    name: "obj.name",
    email: "obj.email",
    phoneNo: "obj.phone", // Assuming phoneNo is a string
    rollNumber: "obj.roll",
    qrCode: generateUniqueQRCode(),
    qrCodeExpiry: new Date('2024-04-13T12:00:00'),
});


})


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

Student.save()
.then(savedStudent => {
    const qrCodeString = savedStudent.qrCode;
    console.log('Student and QR code created successfully:', qrCodeString);

    // You can use the qrCodeString here for further actions (e.g., display it for user)
})
.catch(error => console.error('Error creating student:', error));



//
newStudent.save()
    .then(savedStudent => {
        const qrCodeString = savedStudent.qrCode;
        console.log('Student and QR code created successfully:', qrCodeString);
        // You can use the qrCodeString here for further actions (e.g., display it for user)
        res.status(201).json({ qrCode: qrCodeString });
    })
    .catch(error => {
        console.error('Error creating student:', error);
        res.status(500).json({ error: 'Internal server error' });
    });




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Student.findOne({ qrCode: 'qrCodeString' })
    // .then(student => {
    //   if (student) {
    //     // Check if QR code is expired
    //     if (isQRCodeExpired(student.qrCodeExpiry)) {
    //       console.log('Student found, but QR code is expired');
    //       // You can also return an error response here (optional)
    //      // res.status(400).json({ error: 'QR code expired' }); // Example error response
    //     } else {
    //       console.log('Student found:', student);
    //       // Perform security check-in/check-out logic here (if applicable)
    //     }
    //   } else {
    //     console.log('Student with that QR code not found');
    //   }
    // })
    // .catch(error => console.error('Error finding student:', error));
  

     // Make a POST request to the backend server to save the data
     fetch('/generate-qr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data saved successfully:', data);
        // Handle success response if needed
    })
    .catch(error => {
        console.error('Error saving data:', error);
        // Handle error response if needed
    });


   




    var button = document.querySelector(".submitBtn"); // Assuming you have a button with class "submitBtn"
button.addEventListener("click", () => {
    var obj = {
        name: name.value,
        email: email.value,
        phone: phone_no.value,
        roll: rollNumber.value,
    }})

   