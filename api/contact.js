const connectDB = require('./_db');
const { ContactMessage } = require('./_models');
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

    // Submit contact message (public)
    if (req.method === 'POST' && !req.headers.authorization) {
      const { name, email, phone, subject, message } = req.body;

      const contactMessage = new ContactMessage({
        name,
        email,
        phone,
        subject,
        message
      });

      await contactMessage.save();

      return res.status(201).json({
        message: 'Message sent successfully! We will get back to you soon.',
        messageId: contactMessage._id
      });
    }

    // All other routes require authentication
    const admin = await authMiddleware(req);

    if (req.method === 'GET') {
      const { isRead, subject, page = 1, limit = 20 } = req.query;
      let query = {};

      if (isRead !== undefined) {
        query.isRead = isRead === 'true';
      }

      if (subject && subject !== 'all') {
        query.subject = subject;
      }

      const messages = await ContactMessage.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await ContactMessage.countDocuments(query);
      const unreadCount = await ContactMessage.countDocuments({ isRead: false });

      return res.status(200).json({
        messages,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
        unreadCount
      });
    }

    if (req.method === 'PATCH') {
      const pathParts = req.url.split('/');
      const id = req.query.id || pathParts[pathParts.indexOf('contact') + 1];
      const message = await ContactMessage.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );

      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      return res.status(200).json({ message: 'Message marked as read', contactMessage: message });
    }

    if (req.method === 'DELETE') {
      const pathParts = req.url.split('/');
      const id = req.query.id || pathParts[pathParts.length - 1];
      const message = await ContactMessage.findByIdAndDelete(id);
      
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      return res.status(200).json({ message: 'Contact message deleted successfully' });
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
