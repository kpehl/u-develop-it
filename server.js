// Dependencies
// Express.js to create the server
const express = require('express');
// SQLite3 to connect to the database
    // Verbose execution mode will produce messages in the terminal
    // about the runtime state
const sqlite3 = require('sqlite3').verbose();
// Error check module
const inputCheck = require('./utils/inputCheck');

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
    const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id`;
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
    const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id 
                WHERE candidates.id = ?`;
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

// An Express route to create a candidate
app.post('/api/candidate', ({ body }, res) => {
    // check the input for errors, and if there are any, return a 400 error to the client
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    // if no errors are found, proceed with the SQL route to insert a row
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
              VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    // ES5 function (not arrow function) so the code can use `this`
    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
            id: this.lastID
        });
    });
  });

// An Express route to get all data from the parties table
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
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

// An Express route to get data on a single party by id
app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
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

// An Express route to delete a party by id from the parties table
app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }
        res.json({ message: 'successfully deleted', changes: this.changes });
    });
});

// 404 Resource Not Found Route
// Default response for any other request(Not Found) Catch-all
// (Place after all other routes so it does not override)
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
