const EventsModel = require('../models/eventModel');

async function getAllEvents(req, res) {
    try {
        const events = await EventsModel.getAllEvents();
        res.status(200).json({ data: events });
    } catch (error) {
        console.error('Error in getAllEvents controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getEventSummaries(req, res) {
    try {
        const filters = req.query;
        const eventSummaries = await EventsModel.getEventSummaries(filters);
        res.status(200).json({ data: eventSummaries });
    } catch (error) {
        console.error('Error in getEventSummaries controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getHighRatedEventsDetailed(req, res) {
    try {
        const ratingThreshold = parseFloat(req.params.ratingThreshold);
        // Input validation
        if (isNaN(ratingThreshold) || ratingThreshold < 0 || ratingThreshold > 5) {
            return res.status(400).send('Invalid rating threshold. Must be a number between 0 and 5.');
        }
        const highRatedEvents = await EventsModel.getHighRatedEventsDetailed(ratingThreshold);
        res.json({ data: highRatedEvents });
    } catch (error) {
        res.status(500).send('Error getting detailed high rated events');
    }
}

async function getEventsByOrganizerAndName(req, res) {
    try {
        const organizerId = req.query.organizerId ? parseInt(req.query.organizerId) : null;
        const eventName = req.query.eventName || null;
        // Validate organizerId
        if (req.query.organizerId && isNaN(organizerId)) {
            return res.status(400).json({ error: 'Invalid organizerId. Must be an integer.' });
        }
        // Validate eventName
        if (req.query.eventName && typeof eventName !== 'string') {
            return res.status(400).json({ error: 'Invalid eventName. Must be a string.' });
        }

        const events = await EventsModel.getEventsByOrganizerAndName(organizerId, eventName);
        res.json({ data: events });
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ error: error.message });
    }
}

async function addEventController(req, res) {
  const eventDetails = req.body;
  const result = await EventsModel.addEvent(eventDetails);
  if (result && result.success) {
     res.status(201).json({message: 'Event created successfully.'});
  } else {
    res.status(500).json({ error: result ? result.error : 'Unknown error' });
  }
}

async function updateEventController(req, res) {
  const eventID = req.params.id;
  const updateFields = req.body;
  try {
      const result = await EventsModel.updateEvent(eventID, updateFields);

      if (result && result.rowsAffected > 0) {
          res.status(200).json({ message: 'Event updated successfully.' });
      } else {
          // Handle case where no rows are affected
          res.status(404).json({ error: 'No event found with the given ID or no changes made.' });
      }
  } catch (error) {
      // Handle errors from updateEvent function
      console.error('Error in updateEventController:', error);
      res.status(500).json({ error: error.message });
  }
}

async function deleteEventController(req, res) {
  const eventID = req.params.id;
  const result = await EventsModel.deleteEvent(eventID);
  console.log(result);
  if (result.rowsAffected > 0) {
    res.status(201).json({message: 'Event deleted successfully.'});
  } else {
    res.status(500).json(result.error);
  }
}



module.exports = { getAllEvents, addEventController, updateEventController, deleteEventController, getEventSummaries,
getHighRatedEventsDetailed, getEventsByOrganizerAndName};