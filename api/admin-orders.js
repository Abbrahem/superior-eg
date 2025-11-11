const connectDB = require('./_db');
const { Order } = require('./_models');
const authMiddleware = require('./_auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,DELETE,OPTIONS');
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

    if (req.method === 'DELETE') {
      // استخراج الـ ID من الـ URL بطريقة أفضل للـ Vercel
      let id = req.query.id;
      
      // لو مش موجود في query، نحاول نستخرجه من الـ path
      if (!id) {
        const pathParts = req.url.split('/');
        const ordersIndex = pathParts.findIndex(part => part === 'orders' || part.includes('orders'));
        if (ordersIndex !== -1 && pathParts[ordersIndex + 1]) {
          const nextPart = pathParts[ordersIndex + 1];
          id = nextPart.split('?')[0];
        } else {
          id = pathParts[pathParts.length - 1].split('?')[0];
        }
      }
      
      console.log('Attempting to delete order with ID:', id);
      
      if (!id || id === 'orders') {
        return res.status(400).json({ message: 'Order ID is required' });
      }
      
      try {
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json({ message: 'Order deleted successfully' });
      } catch (deleteError) {
        console.error('Error deleting order:', deleteError);
        return res.status(500).json({ message: 'Error deleting order', error: deleteError.message });
      }
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
