const express = require('express');
const { body } = require('express-validator');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation middleware
const eventValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('category').isIn(['Academic', 'Sports', 'Cultural', 'Social', 'Workshop', 'Seminar']).withMessage('Valid category is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('organizer').trim().notEmpty().withMessage('Organizer is required')
];

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes
router.post('/', authMiddleware, eventValidation, eventController.createEvent);
router.put('/:id', authMiddleware, eventValidation, eventController.updateEvent);
router.delete('/:id', authMiddleware, eventController.deleteEvent);

router.post('/:eventId/register', authMiddleware, eventController.registerForEvent);
router.delete('/:eventId/register', authMiddleware, eventController.unregisterFromEvent);

router.get('/user/my-events', authMiddleware, eventController.getUserEvents);

module.exports = router;
