const Admin = require('../models/Admin');

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [
        { email: process.env.ADMIN_EMAIL },
        { username: process.env.ADMIN_USERNAME }
      ]
    });

    if (existingAdmin) {
      console.log('✅ Default admin already exists');
      return;
    }

    // Create default admin
    const defaultAdmin = new Admin({
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@superior.eg',
      password: process.env.ADMIN_PASSWORD || 'Superior123!',
      role: 'super_admin'
    });

    await defaultAdmin.save();
    console.log('✅ Default admin created successfully');
    console.log(`📧 Email: ${defaultAdmin.email}`);
    console.log(`👤 Username: ${defaultAdmin.username}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'Superior123!'}`);
    
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

module.exports = createDefaultAdmin;