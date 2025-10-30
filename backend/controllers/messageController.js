// controllers/messageController.js
const Message = require('../models/Message');

exports.getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .lean();
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    ).lean();

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ 
      success: true, 
      message 
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    next(error);
  }
};

exports.createMessage = async (req, res, next) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();

    res.status(201).json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error creating message:', error);
    next(error);
  }
};