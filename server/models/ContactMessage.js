const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['order', 'product', 'return', 'complaint', 'suggestion', 'other']
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
contactMessageSchema.index({ isRead: 1 });
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ subject: 1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);