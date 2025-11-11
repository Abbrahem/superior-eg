const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.toJSON = function() {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['HOODIES', 'T-SHIRTS', 'PANTS', 'ACCESSORIES'] },
  colors: [{ type: String, required: true }],
  sizes: [{ type: String, required: true }],
  images: [{ type: String, required: true }],
  soldOut: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ soldOut: 1 });

const orderSchema = new mongoose.Schema({
  customerInfo: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    phone2: { type: String, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    governorate: { type: String, required: true, trim: true }
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  total: { type: Number, required: true, min: 0 },
  promoCode: { type: String, trim: true },
  discount: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' }
}, { timestamps: true });

orderSchema.index({ 'customerInfo.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discount: { type: Number, required: true, min: 1, max: 100 },
  expiresAt: { type: Date, required: true },
  maxUses: { type: Number, min: 1 },
  usedCount: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

promoCodeSchema.virtual('isValid').get(function() {
  const now = new Date();
  const isNotExpired = this.expiresAt > now;
  const hasUsesLeft = !this.maxUses || this.usedCount < this.maxUses;
  return this.isActive && isNotExpired && hasUsesLeft;
});

promoCodeSchema.index({ code: 1 });
promoCodeSchema.index({ expiresAt: 1 });
promoCodeSchema.index({ isActive: 1 });

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  subject: { type: String, required: true, enum: ['order', 'product', 'return', 'complaint', 'suggestion', 'other'] },
  message: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

contactMessageSchema.index({ isRead: 1 });
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ subject: 1 });

module.exports = {
  Admin: mongoose.models.Admin || mongoose.model('Admin', adminSchema),
  Product: mongoose.models.Product || mongoose.model('Product', productSchema),
  Order: mongoose.models.Order || mongoose.model('Order', orderSchema),
  PromoCode: mongoose.models.PromoCode || mongoose.model('PromoCode', promoCodeSchema),
  ContactMessage: mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema)
};
