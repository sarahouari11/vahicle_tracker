const express = require("express");
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const Article11 = require("./models/article11.js"); 
const authRoutes = require('./routes/auth');
const updateRoutes= require('./routes/update');
const affichageRoutes =require('./routes/affichage');
app.use(express.static('nvpublic/PROJET'));

app.use(express.json());
// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/update',updateRoutes);
app.use('/api/affichage',affichageRoutes); 
mongoose.connect("mongodb+srv://sara:sara123@firstdatabases.hiellyx.mongodb.net/all-data?retryWrites=true&w=majority&appName=firstdatabases", {
    useNewUrlParser: true,
    useUnifiedTopology: true     
})

    .then(() => {
        console.log("Connected to MongoDB"); 
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
            
        })
    })
    .catch((error) => { // Fixed typo here
        console.error("Error connecting to MongoDB:", error);
    });
 



app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/nvpublic/PROJET/html/index.html"); 
 
});



// Endpoint to receive data from Arduino and store in MongoDB
app.post('/data', async (req, res) => {
    
    
    try {
        
        const { sensorData1, sensorData2, sensorData3, sensorData4, sensorData5, sensorData6, sensorData7, sensorData8, sensorData9, sensorData10 } = req.body;
        console.log('Received data from Arduino:');
        console.log('Sensor Data 1:', req.body.Time);
        console.log('Sensor Data 2:', req.body.Date);
        console.log('Sensor Data 3:', req.body.Fix);
        console.log('Sensor Data 4:', req.body.Satellites);
        console.log('Sensor Data 5:', req.body.quality); 
        console.log('Sensor Data 6:',req.body.Location);
        console.log('Sensor Data 7:',req.body.GoogleMapslocation );
        console.log('Sensor Data 8:', req.body.Speed);
        console.log('Sensor Data 9:', req.body.Heading);
        console.log('Sensor Data 10:', req.body.Altitude);

        // Create a new document using the sensor data
        const newSensorData = new Article11();
        newSensorData.Time= req.body.Time;
        newSensorData.Date= req.body.Date;
        newSensorData.Fix= req.body.Fix;
        newSensorData. Satellites=req.body.Satellites ;
        newSensorData.quality=req.body.quality;
        newSensorData.Location=req.body.Location;
        newSensorData. GoogleMapslocation=req.body.GoogleMapslocation ;
        newSensorData. Speed=req.body.Speed;
        newSensorData. Heading= req.body.Heading;
        newSensorData.Altitude= req.body.Altitude;  
        newSensorData.carid= req.body.carid;  
       
        
        // Save the sensor data to MongoDB
        await newSensorData.save();
 
        console.log('Data inserted successfully');
        res.status(200).send('Data received and stored in MongoDB');
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Internal Server Error');  
    }
    
});app.get('/api/data', async (req, res) => { 
    
const carid=7891;
    try {
        // Find data by carid
        const sensorData = await Article11.find({ carid });

        // If data is found, send it as response
        if (sensorData) {
            res.status(200).json(sensorData);
           
            
        } else {
            res.status(404).json({ message: 'Data not found for the given carid' });
        }
    } catch (error) {
        console.error('Error fetching data by carid:', error);
        res.status(500).send('Internal Server Error');}
     
});
app.get('/api/data/h/:carid', async (req, res) => {
    const { carid } = req.params;

    try {
        // Find data by carid
        const sensorData = await Article11.find({ carid });

        // If data is found, send it as response
        if (sensorData && sensorData.length > 0) {
            // Extract headings from sensorData array
            const headings = sensorData.map(data => data.Heading);
            const altitudes = sensorData.map(data => data.Altitude);

            // Send headings as response
            res.status(200).json({ headings,altitudes });
           
        } else {
            res.status(404).json({ message: 'Data not found for the given carid' });
        }
    } catch (error) {
        console.error('Error fetching data by carid:', error);
        res.status(500).send('Internal Server Error');
    }
});

    