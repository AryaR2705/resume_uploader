const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5500;

// Use cors middleware to enable CORS
app.use(cors());

// MongoDB setup
mongoose.connect('mongodb+srv://aryarramteke:arya1234@resume1.1lzgglz.mongodb.net/resume1?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema and model for storing PDFs
const pdfSchema = new mongoose.Schema({
  name: String,
  data: Buffer
});
const Pdf = mongoose.model('Pdf', pdfSchema);

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle file upload and overwrite existing PDF
app.post('/upload', upload.single('pdf'), async (req, res) => {
  const { password } = req.body;

  // Check if the provided password is correct
  if (password !== '123') {
    return res.status(403).send('Forbidden: Incorrect password.');
  }

  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Overwrite the existing PDF with the new one
    await Pdf.deleteMany({ name: 'resume1.pdf' }); // Remove existing PDF
    const newPdf = new Pdf({
      name: 'resume1.pdf',
      data: req.file.buffer
    });
    await newPdf.save();

    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal server error.');
  }
});

// Route to serve the PDF file
app.get('/pdf', async (req, res) => {
  try {
    const pdf = await Pdf.findOne({ name: 'resume1.pdf' });
    if (!pdf) {
      return res.status(404).send('PDF not found.');
    }

    res.set('Content-Type', 'application/pdf');
    res.send(pdf.data);
  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).send('Internal server error.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
