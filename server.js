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

// An Express route to return all the data in the SQLite3 candidates table
// An error will result in a server error (500) sent back to the client
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      } 
      res.json({
        message: 'success',
        data: rows
      });
    });
  });

// An Express route to get a single candidate by id from the SQLite3 candidates table
// An error will result in a request not accepted (400) sent back to the client
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      } 
      res.json({
        message: 'success',
        data: row
      });
    });
  });

// An Express route to delete a candidate
// An error will result in a request not accepted (400) sent back to the client
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      } 
      res.json({
        message: 'successfully deleted',
        changes: this.changes
      });
    });
  });

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
