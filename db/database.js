// Dependencies
// SQLite3 to connect to the database
    // Verbose execution mode will produce messages in the terminal
    // about the runtime state
    const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the election database.')
});

module.exports = db;