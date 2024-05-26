import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
const UploadPDF = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !password) return;

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('password', password); // Add password to the form data

    try {
      await axios.post('https://resume-back-8.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpload(); // Notify the parent component about the upload
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">Upload</button>
      </form>
      <br>
      </br>
    </div>
  );
};

const DisplayPDF = ({ fetchPDF }) => {
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    fetchPDF().then((url) => setPdfData(url));
  }, [fetchPDF]);

  return (
    <div>
      {pdfData && (
        <iframe src={pdfData} width="100%" height="600" type="application/pdf" />
      )}
    </div>
  );
};

const App = () => {
  const fetchPDF = async () => {
    try {
      const response = await axios.get('https://resume-back-8.onrender.com/pdf', {
        responseType: 'arraybuffer',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  const handleUpload = () => {
    fetchPDF().then((url) => setPdfData(url));
  };

  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    fetchPDF().then((url) => setPdfData(url));
  }, []);

  return (
    <div>
      <UploadPDF onUpload={handleUpload} />
      <DisplayPDF fetchPDF={fetchPDF} />
    </div>
  );
};

export default App;
