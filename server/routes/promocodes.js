const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const authMiddleware = require('../middleware/auth');

// GET /api/promocodes - Get all promo codes (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
    
    // Add isValid virtual field to each promo code
    const promoCodesWithStatus = promoCodes.map(promo => ({
      ...promo.toObject(),
      isValid: promo.isValid
    }));

    res.json(promoCodesWithStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching promo codes', error: error.message });
  }
});

// POST /api/promocodes - Create new promo code (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { code, discount, validDays, maxUses } = req.body;

    // Check if promo code already exists
    const existingPromo = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existingPromo) {
      return res.status(400).json({ message: 'Promo code already exists' });
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(validDays));

    const promoCode = new PromoCode({
      code: code.toUpperCase(),
      discount: parseInt(discount),
      expiresAt,
      maxUses: maxUses ? parseInt(maxUses) : undefined
    });

    await promoCode.save();
    res.status(201).json({ message: 'Promo code created successfully', promoCode });
  } catch (error) {
    res.status(400).json({ message: 'Error creating promo code', error: error.message });
  }
});

// POST /api/promocodes/validate - Validate promo code (public)
router.post('/validate', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    const promoCode = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!promoCode) {
      return res.status(400).json({ message: 'Invalid or expired promo code' });
    }

    // Check usage limit
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return res.status(400).json({ message: 'Promo code usage limit exceeded' });
    }

    const discountAmount = (orderTotal * promoCode.discount) / 100;
    const newTotal = orderTotal - discountAmount;

    res.json({
      valid: true,
      discount: promoCode.discount,
      discountAmount,
      newTotal,
      message: `${promoCode.discount}% discount applied!`
    });

  } catch (error) {
    res.status(500).json({ message: 'Error validating promo code', error: error.message });
  }
});

// DELETE /api/promocodes/:id - Delete promo code (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
    
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    res.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting promo code', error: error.message });
  }
});

// PATCH /api/promocodes/:id/toggle - Toggle promo code status (admin only)
router.patch('/:id/toggle', authMiddleware, async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    promoCode.isActive = !promoCode.isActive;
    await promoCode.save();

    res.json({ 
      message: `Promo code ${promoCode.isActive ? 'activated' : 'deactivated'}`,
      promoCode 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating promo code', error: error.message });
  }
});

module.exports = router;