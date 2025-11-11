const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discount: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  expiresAt: {
    type: Date,
    required: true
  },
  maxUses: {
    type: Number,
    min: 1
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual to check if promo code is still valid
promoCodeSchema.virtual('isValid').get(function() {
  const now = new Date();
  const isNotExpired = this.expiresAt > now;
  const hasUsesLeft = !this.maxUses || this.usedCount < this.maxUses;
  return this.isActive && isNotExpired && hasUsesLeft;
});

// Index for better query performance
promoCodeSchema.index({ code: 1 });
promoCodeSchema.index({ expiresAt: 1 });
promoCodeSchema.index({ isActive: 1 });

module.exports = mongoose.model('PromoCode', promoCodeSchema);