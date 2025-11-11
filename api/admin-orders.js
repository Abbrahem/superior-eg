const connectDB = require('./_db');
const { Order } = require('./_models');
const authMiddleware = require('./_auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    const admin = await authMiddleware(req);

    if (req.method === 'GET') {
      const { status, page = 1, limit = 50 } = req.query;
      let query = {};

      if (status && status !== 'all') {
        query.status = status;
      }

      const orders = await Order.find(query)
        .populate('items.productId', 'name images')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Order.countDocuments(query);

      return res.status(200).json({
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    }

    if (req.method === 'PATCH') {
      const pathParts = req.url.split('/');
      const id = req.query.id || pathParts[pathParts.indexOf('orders') + 1];
      const { status } = req.body;
      
      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json({ message: 'Order status updated successfully', order });
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
