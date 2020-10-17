// Dependencies
// Express.js to create the server
const express = require('express');
// SQLite3 to connect to the database
    // Verbose execution mode will produce messages in the terminal
    // about the runtime state
const sqlite3 = require('sqlite3').verbose();

// Define the port and create the server application
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware to parse strings and JSON data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to the database
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the election database.')
});

// // An SQL route to return ALL the data in the candidates table
// db.all(`SELECT * FROM candidates`, (err, rows) => {
//     if(err) {
//         console.log(err);
//     }    
//     console.log(rows);
// });

// // An SQL route to GET a single candidate
// db.get(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// // An SQL route to delete a candidate
// const delSql = `DELETE FROM candidates WHERE id = ?`;
// const delParams = 1;
// db.run(delSql, delParams, function(err,result) {
//     if (err) {
//         console.log(err)
//     }
//     console.log(result, this, this.changes);
// });

// // An SQL route to create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
//               VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// // ES5 function, not arrow function, to use this
// db.run(sql, params, function(err, result) {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result, this.lastID);
// });

// 404 Resource Not Found Route
// Default response for any other request(Not Found) Catch-all
// Place after all other routes
app.use((req,res) => {
    res.status(404).end();
});

// Start the server only after the connection to the database is established
db.on('open', () => {
    // Listen on the specified port when the server is running
    app.listen(PORT, () => {
        console.log(`Server running on port ${ PORT }`);
    });
});
