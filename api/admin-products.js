const connectDB = require('./_db');
const { Product } = require('./_models');
const authMiddleware = require('./_auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    const admin = await authMiddleware(req);

    // Extract ID from URL path
    const urlPath = req.url.split('?')[0]; // Remove query params
    const pathParts = urlPath.split('/').filter(p => p); // Remove empty parts
    const isToggleSoldOut = urlPath.includes('toggle-sold-out');
    
    // Get product ID - it's the last part before 'toggle-sold-out' or the last part
    let productId = null;
    if (isToggleSoldOut) {
      // URL format: /api/admin/products/{id}/toggle-sold-out
      const idIndex = pathParts.length - 2; // ID is before 'toggle-sold-out'
      productId = pathParts[idIndex];
    } else {
      // URL format: /api/admin/products/{id}
      productId = pathParts[pathParts.length - 1];
    }

    if (req.method === 'POST') {
      const { name, price, description, category, colors, sizes, images } = req.body;

      const product = new Product({
        name,
        price,
        description,
        category: category.toUpperCase(),
        colors,
        sizes,
        images
      });

      await product.save();
      return res.status(201).json({ message: 'Product created successfully', product });
    }

    if (req.method === 'PUT') {
      const { name, price, description, category, colors, sizes, images } = req.body;

      const updateData = {
        name,
        price,
        description,
        category: category.toUpperCase(),
        colors,
        sizes
      };

      if (images && images.length > 0) {
        updateData.images = images;
      }

      const product = await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json({ message: 'Product updated successfully', product });
    }

    if (req.method === 'DELETE') {
      const product = await Product.findByIdAndDelete(productId);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json({ message: 'Product deleted successfully' });
    }

    if (req.method === 'PATCH' && isToggleSoldOut) {
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      product.soldOut = !product.soldOut;
      await product.save();

      return res.status(200).json({ 
        message: `Product ${product.soldOut ? 'marked as sold out' : 'marked as available'}`,
        product 
      });
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
