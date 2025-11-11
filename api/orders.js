const connectDB = require('./_db');
const { Order, Product, PromoCode } = require('./_models');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();

    if (req.method === 'POST') {
      const { productId, customerName, address, phone1, phone2, selectedColor, selectedSize, quantity, promoCode } = req.body;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }

      if (product.soldOut) {
        return res.status(400).json({ message: 'Product is sold out' });
      }

      if (!product.colors.includes(selectedColor) || !product.sizes.includes(selectedSize)) {
        return res.status(400).json({ message: 'Invalid color or size' });
      }

      const customerInfo = {
        name: customerName,
        email: `${customerName.replace(/\s+/g, '').toLowerCase()}@customer.com`,
        phone: phone1,
        phone2: phone2 || null,
        address: address,
        city: 'Cairo',
        governorate: 'Cairo'
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

      if (promoCode) {
        const validPromoCode = await PromoCode.findOne({ 
          code: promoCode.toUpperCase(),
          isActive: true,
          expiresAt: { $gt: new Date() }
        });

        if (!validPromoCode) {
          return res.status(400).json({ message: 'Invalid or expired promo code' });
        }

        if (validPromoCode.maxUses && validPromoCode.usedCount >= validPromoCode.maxUses) {
          return res.status(400).json({ message: 'Promo code usage limit exceeded' });
        }

        discount = (total * validPromoCode.discount) / 100;
        validPromoCode.usedCount += 1;
        await validPromoCode.save();
      }

      const finalTotal = total - discount;

      const order = new Order({
        customerInfo,
        items,
        total: finalTotal,
        promoCode: promoCode || null,
        discount
      });

      await order.save();

      return res.status(201).json({
        message: 'Order created successfully',
        order,
        orderSummary: { subtotal: total, discount, total: finalTotal }
      });
    }

    if (req.method === 'GET') {
      const { id } = req.query;
      
      if (id) {
        const order = await Order.findById(id).populate('items.productId', 'name images');
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json(order);
      }
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
