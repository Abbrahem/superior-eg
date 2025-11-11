const jwt = require('jsonwebtoken');
const { Admin } = require('./_models');

const authMiddleware = async (req) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin || !admin.isActive) {
      throw new Error('Invalid token or admin not active');
    }

    return admin;
  } catch (error) {
    throw new Error('Unauthorized');
  }
};

module.exports = authMiddleware;
