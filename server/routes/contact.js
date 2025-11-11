const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const authMiddleware = require('../middleware/auth');

// POST /api/contact - Submit contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contactMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      message
    });

    await contactMessage.save();

    res.status(201).json({
      message: 'Message sent successfully! We will get back to you soon.',
      messageId: contactMessage._id
    });

  } catch (error) {
    res.status(400).json({ message: 'Error sending message', error: error.message });
  }
});

// GET /api/contact - Get all contact messages (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
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

    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      unreadCount
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// PATCH /api/contact/:id/read - Mark message as read (admin only)
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message marked as read', contactMessage: message });
  } catch (error) {
    res.status(500).json({ message: 'Error updating message', error: error.message });
  }
});

// DELETE /api/contact/:id - Delete contact message (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
});

module.exports = router;