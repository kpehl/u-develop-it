// Dependencies
// Express.js to create the server
const express = require('express');

// Define the port and create the server application
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware to parse strings and JSON data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 404 Resource Not Found Route
// Default response for any other request(Not Found) Catch-all
// Place after all other routes
app.use((req,res) => {
    res.status(404).end();
});

// Listen on the specified port when the server is running
app.listen(PORT, () => {
    console.log(`Server running on port ${ PORT }`);
});