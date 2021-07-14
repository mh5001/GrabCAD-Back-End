const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const jobDatabase = new sqlite3.Database('./printing-job.db');
const app = express();

'use strict';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(1000, () => {
    console.log("Server is ready!");
    jobDatabase.serialize(() => {
        jobDatabase.run(`CREATE TABLE IF NOT EXISTS PrintingListings (
            name TEXT,
            date TEXT,
            printHour INTEGER,
            printMin INTEGER,
            fileName TEXT,
            fileDesc TEXT,
            printerInfo TEXT
        )`);
    });
});

app.get('/', (_, res) => {
    res.sendFile('./index.html');
});

app.post('/api/jobs', (req, res) => {
    const keys = Object.keys(req.body);
    let isFormOk = keys.length === 7;
    keys.forEach((key, i) => {
        if (!toString(req.body[key]).length) {
            isFormOk = false;
        }
    });
    if (!isFormOk) res.sendStatus(406);
    else {
        const stmp = jobDatabase.prepare("INSERT INTO PrintingListings VALUES (?, ?, ?, ?, ?, ?, ?)");
        stmp.run(
            req.body['name'],
            req.body['date'],
            req.body['printHour'],
            req.body['printMin'],
            req.body['fileName'],
            req.body['fileDesc'],
            req.body['printerInfo']
        );
        stmp.finalize();
        console.log('Created print job');
        res.sendStatus(201);
    }
});

app.get('/api/jobs', (_, res) => {
    jobDatabase.all("SELECT * FROM PrintingListings", (err, data) => {
        if (err) res.send(err);
        else res.json(data);
    });
});