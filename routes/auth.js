
const express = require('express');
const router = express.Router();
const user = require('../models/users'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Route de signup
router.post('/signup', async (req, res) => {
  try {
    // Extract user data
    const { FullName, email, password, confirmPassword, userId } = req.body;

    // Validate required fields
    if (!FullName || !email || !password || !confirmPassword || !userId ) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).send({ message: 'Password must be at least 8 characters long' });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).send({ message: 'Passwords do not match' });
    }

    // Check for existing user
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'An account with this email address already exists' });
    }

    // Validate password complexity (optional)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send({ message: 'The password must contain at least one uppercase letter, one lowercase letter, and one number' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
      // Generate userId
      

    // Create new user instance with proper casing for 'FullName'
     // Create new user instance
     const newUser = new user({
      userId: userId || uuidv4(), // Generate userId if not provided
      fullName: FullName, // Corrected field name
      email,
      password: hashedPassword,
    });

    // Save the new user
    await newUser.save();

    // Send successful registration response
    res.status(201).send({ message: 'Successful registration' }); 
  } catch (error) {
    // Handle database validation errors (optional)
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
      }));
      return res.status(400).send({ message: 'Failed validation', errors: validationErrors });
    }

    // Handle other errors
    console.error(error);
    res.status(500).send({ message: 'Sign-up failed' });
  }
});




// Route de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; 


    // Check for missing fields
    if (!email || !password) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    // Find user by email
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Compare password using bcrypt (assuming User model has comparePassword)
    const isMatch = await bcrypt.compare(password , existingUser.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password' }); 
    }

    // Login successful, generate JWT token
    const userId = existingUser._id; // Assuming User model has an ID field
    const secret = 'your_secret_key'; // Replace with a strong secret key
    const expiresIn = 60 * 60; // Token expires in 1 hour

    const token = jwt.sign({ userId }, secret, { expiresIn });

    // Send response with token
    res.status(200).send({ message: 'Login successful', token });


  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Login error' });
  }
});
// Route for logout
router.post('/logout', (req, res) => {
  // Clear token on the client-side
  res.clearCookie('token'); // if you're using cookies
  // res.setHeader('Authorization', ''); // if you're using headers
  res.status(200).send({ message: 'Logout successful' });
});


module.exports = router;