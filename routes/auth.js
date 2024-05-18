
const express = require('express');
const router = express.Router();
const user = require('../models/users'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const nodemailer=require("nodemailer");

// Route de signup
router.post('/signup', async (req, res) => {
  try {
    // Extract user data
    const { FullName, email, password, confirmPassword, userId } = req.body;
    console.log(FullName);

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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);

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
    const isMatch = await bcrypt.compare(password, existingUser.password);
    console.log(password);
    console.log(existingUser.password);
    
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password' }); 
    }

    // Login successful, generate JWT token
    const userId = existingUser._id; // Assuming User model has an ID field
    const secret = 'your_secret_key'; // Replace with a strong secret key
    const expiresIn = 60 * 60; // Token expires in 1 hour

    const token = jwt.sign({ userId }, secret, { expiresIn });

    // Send the token in the response upon successful login
    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Login error' });
  }
});
// new login with email and password in paramatre
router.post('/login/:email/:password', async (req, res) => {
  try {
    const { email, password } = req.params;
    console.log(email);

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
    const isMatch = await compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password' }); 
    }

    // Login successful, generate JWT token
    const userId = existingUser._id; // Assuming User model has an ID field
    const secret = 'your_secret_key'; // Replace with a strong secret key
    const expiresIn = 60 * 60; // Token expires in 1 hour

    const token = jwt.sign({ userId }, secret, { expiresIn });

    // Send the token in the response upon successful login
    res.status(200).send({ token });
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

// first end point for forgot password 
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    // Find user by email
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Generating token
    const secret = "sara123" + existingUser.password;
    const token = jwt.sign({ email: existingUser.email, id: existingUser.id }, secret, {
      expiresIn: '10m'
    });

    // Constructing reset password link
    const link = `http://localhost:3000/api/auth/reset_password/${existingUser._id}/${token}`;
    console.log(link);

    // Configure nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'trackifyme@gmail.com',
        pass: 'bxne ubxi cntu drlj'   
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    });

    // Email options
    const mailOptions = {
      from: 'trackifyme@gmail.com',
      to: existingUser.email,
      subject: 'Reset Password',
      html: `
        <div>
          <h4>Click on the link below to reset your password</h4>
          <p><a href="${link}">${link}</a></p>
        </div>
      `
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ message: 'Failed to send reset password link' });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ 
          message: 'Reset password link sent successfully. Click on the link to reset your password.',
          the_link: link
        });
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to send reset password link' });
  }
});

// endpoint for get the exact info about user from data and render the user into the page of rest password to enter the new passsword
router.get('/reset_password/:userId/:token', async (req, res) => {
  try {
    const { userId, token } = req.params;
    const existingUser = await user.findOne({ _id: userId });
    if (!existingUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    const secret = "sara123" + existingUser.password;
    try {
      jwt.verify(token, secret);
      res.render("../nvpublic/PROJET/html/reset.ejs", { userId: userId, token: token });
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});
//endpoint for post the new password and save it to database
router.post('/reset_password/:userId/:token', async (req, res) => {
  try {
    const { userId, token } = req.params;
    const { password, confirmPassword } = req.body;
    console.log("ee")

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await user.findOne({ _id: userId });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const secret = "sara123" + existingUser.password;
    try {
      

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      existingUser.password = hashedPassword;
      await existingUser.save();
 
      res.status(200).json({ message: 'Password reset successfully.' });
      
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



const saltRounds = 10;
// Route for changing password
router.post('/change-password', async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    // Check for missing fields
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    // Find user by email
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid old password' });
    }

    // Validate new password length
    if (newPassword.length < 8) {
      return res.status(400).send({ message: 'New password must be at least 8 characters long' });
    }

    // Validate new password match
    if (newPassword !== confirmPassword) {
      return res.status(400).send({ message: 'New passwords do not match' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password
    existingUser.password = hashedNewPassword;
    await existingUser.save();

    res.status(200).send({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to change password', error: error.message });
  }
});
// Route for changing full name
router.post('/change-fullname', async (req, res) => {
  try {
    const { email, newFullName } = req.body;

    // Check for missing fields
    if (!email || !newFullName) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    // Find user by email
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Update user's full name
    existingUser.fullName = newFullName;
    await existingUser.save();

    res.status(200).send({ message: 'Full name changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to change full name' });
  }
});



module.exports = router;