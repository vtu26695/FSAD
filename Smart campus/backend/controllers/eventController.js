const db = require('../config/database');
const { validationResult } = require('express-validator');

// Get all events with optional filtering
exports.getAllEvents = (req, res) => {
  const { category, search } = req.query;

  let query = 'SELECT e.*, u.firstName, u.lastName FROM events e JOIN users u ON e.createdBy = u.id WHERE 1=1';
  const params = [];

  if (category && category !== 'all') {
    query += ' AND e.category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY e.date ASC, e.time ASC';

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    return res.status(200).json(results);
  });
};

// Get single event details
exports.getEventById = (req, res) => {
  const { id } = req.params;

  db.query(
    'SELECT e.*, u.firstName, u.lastName FROM events e JOIN users u ON e.createdBy = u.id WHERE e.id = ?',
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Get registrations count
      db.query('SELECT COUNT(*) as count FROM registrations WHERE eventId = ?', [id], (err, countResults) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }

        const event = results[0];
        event.registeredCount = countResults[0].count;
        return res.status(200).json(event);
      });
    }
  );
};

// Create new event
exports.createEvent = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, date, time, location, category, capacity, organizer } = req.body;
  const createdBy = req.userId;

  db.query(
    'INSERT INTO events (title, description, date, time, location, category, capacity, organizer, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, description, date, time, location, category, capacity, organizer, createdBy],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating event' });
      }

      return res.status(201).json({
        message: 'Event created successfully',
        eventId: results.insertId
      });
    }
  );
};

// Update event
exports.updateEvent = (req, res) => {
  const { id } = req.params;
  const { title, description, date, time, location, category, capacity, organizer } = req.body;
  const userId = req.userId;

  // Check if user is the event creator
  db.query('SELECT createdBy FROM events WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (results[0].createdBy !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this event' });
    }

    db.query(
      'UPDATE events SET title=?, description=?, date=?, time=?, location=?, category=?, capacity=?, organizer=? WHERE id=?',
      [title, description, date, time, location, category, capacity, organizer, id],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating event' });
        }
        return res.status(200).json({ message: 'Event updated successfully' });
      }
    );
  });
};

// Delete event
exports.deleteEvent = (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  db.query('SELECT createdBy FROM events WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (results[0].createdBy !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this event' });
    }

    db.query('DELETE FROM events WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting event' });
      }
      return res.status(200).json({ message: 'Event deleted successfully' });
    });
  });
};

// Register for event
exports.registerForEvent = (req, res) => {
  const { eventId } = req.params;
  const userId = req.userId;

  // Check if event exists and has capacity
  db.query('SELECT capacity, registeredCount FROM events WHERE id = ?', [eventId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = results[0];

    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Check if user is already registered
    db.query('SELECT id FROM registrations WHERE userId = ? AND eventId = ?', [userId, eventId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Already registered for this event' });
      }

      // Register user
      db.query('INSERT INTO registrations (userId, eventId) VALUES (?, ?)', [userId, eventId], (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error registering for event' });
        }

        // Update registered count
        db.query('UPDATE events SET registeredCount = registeredCount + 1 WHERE id = ?', [eventId], (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error updating event' });
          }
          return res.status(200).json({ message: 'Successfully registered for event' });
        });
      });
    });
  });
};

// Unregister from event
exports.unregisterFromEvent = (req, res) => {
  const { eventId } = req.params;
  const userId = req.userId;

  db.query('DELETE FROM registrations WHERE userId = ? AND eventId = ?', [userId, eventId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Update registered count
    db.query('UPDATE events SET registeredCount = registeredCount - 1 WHERE id = ?', [eventId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating event' });
      }
      return res.status(200).json({ message: 'Successfully unregistered from event' });
    });
  });
};

// Get user's registered events
exports.getUserEvents = (req, res) => {
  const userId = req.userId;

  db.query(
    'SELECT e.* FROM events e JOIN registrations r ON e.id = r.eventId WHERE r.userId = ? ORDER BY e.date ASC',
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      return res.status(200).json(results);
    }
  );
};
