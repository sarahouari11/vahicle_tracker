const express = require('express');
const router = express.Router();
const vehicle = require('../models/vehicle');
const user = require('../models/users'); 
// API endpoint to retrieve vehicles by userId
router.post('/vehicles', async (req, res) => {
    try {
        const { userId } = req.body;
        const vehicles = await vehicle.find({ userId });
        const vehicleCount = vehicles.length; // Calculate the number of vehicles
        res.status(200).json({ vehicles, vehicleCount });
    } catch (err) {
        console.error('Error retrieving vehicles:', err);
        res.status(500).json({ error: 'Failed to retrieve vehicles' });
    }
}); 
// pour le affichage des info sur utilisatteur
router.get('/userr',async (req,res)=>{
    try {
    const {email} =req.body;
    const useR = await user.find({ email});
   
    const fullname = useR.map(data => data.fullName);

    console.log(fullname)
    res.status(200).json({useR});
    console.log(useR)
 } catch (err) {
        console.error('Error retrieving USER:', err);
        res.status(500).json({ error: 'Failed to retrieve USER' }); 
    }
});

module.exports=router;