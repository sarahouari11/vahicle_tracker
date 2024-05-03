const express = require('express');
const router = express.Router();
const vehicle = require('../models/vehicle');
// API endpoint to retrieve vehicles by userId
router.get('/vehicles/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const vehicles = await vehicle.find({ userId });
        res.status(200).json({ vehicles });
    } catch (err) {
        console.error('Error retrieving vehicles:', err);
        res.status(500).json({ error: 'Failed to retrieve vehicles' });
    }
});

module.exports=router;