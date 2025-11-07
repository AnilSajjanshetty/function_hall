// controllers/eventController.js
const Event = require('../models/Event');

exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .sort({ date: -1 })
      .lean();
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    next(error);
  }
};
// Fetch latest 5 events
exports.getLatestEvents = async (req, res, next) => {
  try {
    const latestEvents = await Event.find()
      .sort({ date: -1 })
      .limit(5)
      .lean();

    if (!latestEvents.length) {
      return res.status(404).json({ message: "No events found" });
    }

    res.status(200).json(latestEvents);
  } catch (error) {
    console.error("Error fetching latest events:", error);
    next(error);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { title, type, date, guests, description, images, videos } = req.body;

    if (!title?.trim() || !type?.trim() || !date || !guests || !description?.trim()) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const newEvent = new Event({
      title: title.trim(),
      type: type.trim(),
      date,
      guests: parseInt(guests),
      description: description.trim(),
      images: images || [],
      videos: videos || []
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      event: newEvent,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      success: true,
      event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    next(error);
  }
};