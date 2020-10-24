# U-Develop-It Voting Application

## Project Description
This application uses Node and SQLite to set up the back end for a voting application for a fictional meet-up group, U-Develop-It.

## Tools Used to Create This Project
* JavaScript ES5 and ES6
* Node.js
* SQLite3
* Express.js

## Installation

### Project Setup
* Clone the repository to your computer
* In the directory where the project is saved, make sure any required dependencies are installed. As necessary for your system and setup:
    * Install Node.js from their website
    * Initialize npm
        * type `npm init --y` in your command line
    * Type `npm install` in yor command line to install the packages as noted in the package.json file

### Database Setup
* Install SQLite3 from their website and follow the set up instructions
* Add SQLite3 to the system Environmental Variables
* Type `sqlite3 db/election.db` or `npm run db` in the command line in the directory for this project to connect to the database
* Type `npm run migrate` and press enter, then type `npm run seed` and press enter to create the tables and seed them with data.

## Usage
* You can type `npm run db` to start SQLite3 and make SQL queries from the command line or, if you prefer...
* Type `npm start` to start the server
* You can then either access the API endpoints through a browser window or test them with an application such as Postman or Insomnia Core
    * The port is set to 3001, so point your URLs to http://localhost:3001/api/ (and the API that you would like to use here, e.g. candidates)
* You can always reinitiate the database and reseed with the starting data using the commands in database setup above