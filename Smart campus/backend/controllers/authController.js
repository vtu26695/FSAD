const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { validationResult } = require('express-validator');

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, studentId, password } = req.body;

  // Check if email already exists
  db.query('SELECT email FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Error hashing password' });
      }

      // Insert user
      db.query(
        'INSERT INTO users (firstName, lastName, email, studentId, password) VALUES (?, ?, ?, ?, ?)',
        [firstName, lastName, email, studentId, hashedPassword],
        (err, results) => {
          if (err) {
            return res.status(500).json({ message: 'Error registering user' });
          }

          const userId = results.insertId;
          const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '24h' });

          return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: userId, firstName, lastName, email, studentId }
          });
        }
      );
    });
  });
};

exports.login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  db.query('SELECT id, firstName, lastName, email, studentId, password FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error verifying password' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          studentId: user.studentId
        }
      });
    });
  });
};

exports.getCurrentUser = (req, res) => {
  const userId = req.userId;

  db.query('SELECT id, firstName, lastName, email, studentId, createdAt FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: results[0] });
  });
};
