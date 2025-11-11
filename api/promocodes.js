const connectDB = require('./_db');
const { PromoCode } = require('./_models');
const authMiddleware = require('./_auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();

    // Extract path to check if it's validate endpoint
    const isValidateEndpoint = req.url.includes('/validate');

    // Validate promo code (public)
    if (req.method === 'POST' && (isValidateEndpoint || (req.body.code && req.body.orderTotal !== undefined))) {
      const { code, orderTotal } = req.body;

      const promoCode = await PromoCode.findOne({ 
        code: code.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() }
      });

      if (!promoCode) {
        return res.status(400).json({ message: 'Invalid or expired promo code' });
      }

      if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
        return res.status(400).json({ message: 'Promo code usage limit exceeded' });
      }

      const discountAmount = (orderTotal * promoCode.discount) / 100;
      const newTotal = orderTotal - discountAmount;

      return res.status(200).json({
        valid: true,
        discount: promoCode.discount,
        discountAmount,
        newTotal,
        message: `${promoCode.discount}% discount applied!`
      });
    }

    // All other routes require authentication
    const admin = await authMiddleware(req);

    if (req.method === 'GET') {
      const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
      const promoCodesWithStatus = promoCodes.map(promo => ({
        ...promo.toObject(),
        isValid: promo.isValid
      }));
      return res.status(200).json(promoCodesWithStatus);
    }

    if (req.method === 'POST') {
      const { code, discount, validDays, maxUses } = req.body;

      const existingPromo = await PromoCode.findOne({ code: code.toUpperCase() });
      if (existingPromo) {
        return res.status(400).json({ message: 'Promo code already exists' });
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(validDays));

      const promoCode = new PromoCode({
        code: code.toUpperCase(),
        discount: parseInt(discount),
        expiresAt,
        maxUses: maxUses ? parseInt(maxUses) : undefined
      });

      await promoCode.save();
      return res.status(201).json({ message: 'Promo code created successfully', promoCode });
    }

    if (req.method === 'DELETE') {
      const pathParts = req.url.split('/');
      const id = req.query.id || pathParts[pathParts.length - 1];
      const promoCode = await PromoCode.findByIdAndDelete(id);
      if (!promoCode) {
        return res.status(404).json({ message: 'Promo code not found' });
      }
      return res.status(200).json({ message: 'Promo code deleted successfully' });
    }

    if (req.method === 'PATCH') {
      const pathParts = req.url.split('/');
      const id = req.query.id || pathParts[pathParts.indexOf('promocodes') + 1];
      const promoCode = await PromoCode.findById(id);
      if (!promoCode) {
        return res.status(404).json({ message: 'Promo code not found' });
      }
      promoCode.isActive = !promoCode.isActive;
      await promoCode.save();
      return res.status(200).json({ message: `Promo code ${promoCode.isActive ? 'activated' : 'deactivated'}`, promoCode });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
