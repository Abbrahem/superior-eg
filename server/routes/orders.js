const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const PromoCode = require('../models/PromoCode');

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const { productId, customerName, address, phone1, phone2, selectedColor, selectedSize, quantity, promoCode } = req.body;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }

    if (product.soldOut) {
      return res.status(400).json({ message: 'Product is sold out' });
    }

    // Validate color and size
    if (!product.colors.includes(selectedColor)) {
      return res.status(400).json({ message: `Color ${selectedColor} not available` });
    }

    if (!product.sizes.includes(selectedSize)) {
      return res.status(400).json({ message: `Size ${selectedSize} not available` });
    }

    const customerInfo = {
      name: customerName,
      email: `${customerName.replace(/\s+/g, '').toLowerCase()}@customer.com`, // Generate email
      phone: phone1,
      phone2: phone2 || null,
      address: address,
      city: 'Cairo', // Default
      governorate: 'Cairo' // Default
    };

    const items = [{
      productId: product._id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity || 1
    }];

    let total = product.price * (quantity || 1);
    let discount = 0;

    let validPromoCode = null;

    // Apply promo code if provided
    if (promoCode) {
      validPromoCode = await PromoCode.findOne({ 
        code: promoCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() }
      });

      if (!validPromoCode) {
        return res.status(400).json({ message: 'Invalid or expired promo code' });
      }

      // Check usage limit
      if (validPromoCode.maxUses && validPromoCode.usedCount >= validPromoCode.maxUses) {
        return res.status(400).json({ message: 'Promo code usage limit exceeded' });
      }

      discount = (total * validPromoCode.discount) / 100;
      
      // Update promo code usage
      validPromoCode.usedCount += 1;
      await validPromoCode.save();
    }

    const finalTotal = total - discount;

    // Create order
    const order = new Order({
      customerInfo,
      items,
      total: finalTotal,
      promoCode: promoCode || null,
      discount
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order,
      orderSummary: {
        subtotal: total,
        discount,
        total: finalTotal,
        promoCodeApplied: !!promoCode
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

module.exports = router;