const express = require('express');
const router = express.Router();
const vehicle = require('../models/vehicle');
const user = require('../models/users');
// Middleware for message verification
const verifyMessage = (req, res, next) => {
    if (!req.body.userId  ||!req.body.idcar || !req.body.model || !req.body.registration) {
        return res.status(400).json({ error: 'Missing required fields in the request body' });
    }
    next();
};
// API endpoint to add a new vehicle
router.post('/vehicles', verifyMessage, async (req, res) => {
    try {
        const { userId ,idcar, model, registration } = req.body;

        // Check for existing user
        const existingUser = await user.findOne({ userId });
        if (!existingUser) {
          return res.status(400).send({ message: 'An account with this id address does not exists' });
        }
            // Check for existing idcar
            const existingidcar = await vehicle.findOne({ idcar });
            if (existingidcar) {
              return res.status(400).send({ message: 'An account with this idcar address already exists' });
            }

        const newVehicle = new vehicle({
            userId,
            idcar,
            model,
            registration,
        });
        await newVehicle.save();
        res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
    } catch (err) {
        console.error('Error adding vehicle:', err);
        res.status(500).json({ error: 'Failed to add vehicle' });
    }
});

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.delete('/vehicles', async (req, res) => {
    try {
        const { idcar } = req.body;
        if (!ObjectId.isValid(idcar)) {
            return res.status(400).json({ error: 'Invalid vehicle ID' });
        }
        const deletedVehicle = await vehicle.findByIdAndDelete(idcar);
        if (!deletedVehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.status(200).json({ message: 'Vehicle deleted successfully', vehicle: deletedVehicle });
    } catch (err) {
        console.error('Error deleting vehicle:', err);
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
});


// API endpoint to update a vehicle
router.put('/vehicles/:id', verifyMessage, async (req, res) => {
    try {
        const { id } = req.params;
        const { idcar, model,  registration } = req.body;
        const updatedVehicle = await vehicle.findByIdAndUpdate(id, {
            idcar,
            model,
            registration,
        }, { new: true });
        if (!updatedVehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.status(200).json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });
    } catch (err) {
        console.error('Error updating vehicle:', err);
        res.status(500).json({ error: 'Failed to update vehicle' });
    }
});
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

module.exports = router;
