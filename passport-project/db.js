const mongoose = require('mongoose');

// Replace <password> with your MongoDB Atlas password
const mongoURI = 'mongodb+srv://admin:QNW38LM1FR0ev2yQ@cluster0.zasc2xx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

  const connectToMongoDB = async (uri) => {
    try {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB Atlas');
    } catch (err) {
      console.error('Error connecting to MongoDB Atlas:', err);
    }
  };

  connectToMongoDB(mongoURI)
  
module.exports = connectToMongoDB;