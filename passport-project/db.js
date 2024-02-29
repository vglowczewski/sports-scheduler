const mongoose = require('mongoose');

// Replace <password> with your MongoDB Atlas password
const mongoURI = 'mongodb+srv://admin:PHoN7bysJOS1qHKc@cluster0.uovspcw.mongodb.net/?retryWrites=true&w=majority';

  const connectToMongoDB = async (uri) => {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB Atlas');
    } catch (err) {
      console.error('Error connecting to MongoDB Atlas:', err);
    }
  };

  connectToMongoDB(mongoURI)
  
module.exports = connectToMongoDB;