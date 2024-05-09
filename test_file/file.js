const express = require('express');
const app = express();

// Define a route to serve your frontend files
app.use(express.static('public')); // Assuming your frontend files are in a directory named 'public'

// Define an API endpoint to handle a GET request
app.get('/api/data', (req, res) => {
    // Process the request and send back some data
    const data = { message: 'Hello from the server!' };
    res.json(data);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
