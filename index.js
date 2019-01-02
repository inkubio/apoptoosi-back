const http = require('http');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const validateRegisteration = require('./utils/validateRegisteration');

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(
    './db/apoptoosiSqlite3.db', 
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
    (e) => {
        if(e) {
            throw 'Failure to initiliaze server with ' + e;
        }
        console.log('Database created.');
    }
);

db.run(
    `CREATE TABLE IF NOT EXISTS Registerations 
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL,
        seatingGroup TEXT,
        alcohol INTEGER DEFAULT 1,
        salute INTEGER DEFAULT 0,
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

app.use(cors());
app.use(bodyParser.json());

const OPENING_TIME = new Date('2019-01-18T12:00:00');

// app.get('/', (req, res) => {
//     res.send(`<p>Hello World!</p>`);
// });

app.get('/api/RegistrationData/Registrations', (req, resp) => {
    console.log('Get request started.');
    db.all(
        `SELECT firstName, lastName, seatingGroup, text 
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
    // resp.status(400).json({});
});

app.post('/api/RegistrationData/CreateRegistration', (req, resp) => {

    const currentTime = new Date();
    if(OPENING_TIME.getTime() > currentTime.getTime()) {
        return resp.status(403).json({});
    }

    console.log('Post request started.');

    let body = req.body;
    // console.log(req);
    // console.log(body);
    const valid = validateRegisteration(body);
    if(!valid) {
        resp.status(304).json({});
        return;
    }

    console.log(body);

    let query = db.prepare(`
    INSERT INTO Registerations 
    (
        firstName,
        lastName,
        email,
        seatingGroup,
        alcohol,
        salute,
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
        ?
    )`);
    
    query.run(
        [
            body.firstName,
            body.lastName,
            body.email,
            body.seatingGroup,
            body.alcohol,
            body.salute,
            body.text
        ],
        err => {
            if(err) {
                console.log(err);
                resp.status(400).json({});
                return;
            }
            resp.status(201).json({});
        });
});


const PORT = 5000;

http.createServer(app).listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});