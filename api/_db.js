const mongoose = require('mongoose');

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    cachedDb = db;
    console.log('✅ MongoDB connected');
    
    // Create default admin on first connection
    await createDefaultAdmin();
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

const createDefaultAdmin = async () => {
  try {
    const { Admin } = require('./_models');
    const existingAdmin = await Admin.findOne({ email: 'admin@superior.eg' });
    
    if (!existingAdmin) {
      const admin = new Admin({
        username: 'admin',
        email: 'admin@superior.eg',
        password: 'Superior123!',
        role: 'super_admin'
      });
      await admin.save();
      console.log('✅ Default admin created');
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
};

module.exports = connectDB;
