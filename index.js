/* Import depencies */
const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const validateRegisteration = require('./utils/validateRegisteration');

const sqlite3 = require('sqlite3').verbose();

/* Initiliaze database */
let db = new sqlite3.Database(
    './apoptoosiSqlite3.db', 
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
    (e) => {
        if(e) {
            throw 'Failure to initiliaze server with ' + e;
        }
        console.log('Database created.');
    }
);
/* Create registeration table */
db.run(
    `CREATE TABLE IF NOT EXISTS Registerations 
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL,
        seatingGroup TEXT,
        alcohol INTEGER DEFAULT 1,
        sillis INTEGER DEFAULT 0,
        allergy TEXT,
        avec TEXT,
        salute INTEGER DEFAULT 0,
        invited INTEGER DEFAULT 0,
        alumni INTEGER DEFAULT 0,
        text TEXT
    )`
    , (err, rows) => { 
        if(err){
            console.log(err);
            db.close();
            return;
        }
        console.log('Registeration table exists.');
    }
);

/* Allow cross site scripting */
app.use(cors());
/* Use body parser middleware */
app.use(bodyParser.json());

/* Starting time of the registeration */
const OPENING_TIME = new Date('2019-01-18T12:00:00');

/* Get registered attendees */
app.get('/api/RegistrationData/Registrations', (req, resp) => {
    console.log('Get request started.');
    /* Do not give any additional info to user */
    db.all(
        `SELECT firstName, lastName, seatingGroup
        FROM Registerations`
        , (e, registerations) => {
            if(e) {
                console.log(e);
                resp.status(400).json({});
                return;
            }
            console.log(registerations);
            resp.status(200).json(registerations);
            return;
        });
});

app.post('/api/RegistrationData/CreateRegistration', (req, resp) => {

    const currentTime = new Date();
    /* Do not accept requests before opening time */
    if(OPENING_TIME.getTime() > currentTime.getTime()) {
        return resp.status(403).json({});
    }

    console.log('Post request started.');

    let body = req.body;
    /* Check that there is valid inputs */
    const valid = validateRegisteration(body);
    if(!valid) {
        resp.status(304).json({});
        return;
    }

    // console.log(body);

    /* Sanitize input */ 
    let query = db.prepare(`
    INSERT INTO Registerations 
    (
        firstName,
        lastName,
        email,
        seatingGroup,
        alcohol,
        allergy,
        sillis,
        avec,
        salute,
        invited,
        alumni,
        text
    ) 

    VALUES
    (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
    )`);
    
    /* Make request */
    query.run(
        [
            body.firstName,
            body.lastName,
            body.email,
            body.seatingGroup,
            body.alcohol,
            body.allergy,
            body.sillis,
            body.avec,
            body.salute,
            body.invited,
            body.alumni,
            body.text
        ],
        err => {
            if(err) {
                console.log(err);
                resp.status(400).json({});
                return;
            }
            /* Successful creation */
            resp.status(201).json({});
        });
});


const PORT = 5000;

http.createServer(app).listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});