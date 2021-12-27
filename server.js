//Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const allNotes = require("./Develop/db/db.json");

//set up server
const PORT = process.env.PORT || 3001;
const app = express();

// Set up express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add a static middleware for serving assets in the public folder
app.use(express.static("./Develop/public"));

// Async processes
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// API Route "GET" request
app.get("/api/notes", function(req, res) {
    readFileAsync("./Develop/db/db.json", "utf8").then(function(data) {
        notes = [].concat(JSON.parse(data));
        res.json(notes);
    });
});

//API post requests
app.post("/api/notes", function(req, res) {
    const note = req.body;
    readFileAsync("./Develop/db/db.json", "utf8")
        .then(function(data) {
            const notes = [].concat(JSON.parse(data));
            note.id = notes.length + 1;
            notes.push(note);
            return notes;
        })
        .then(function(notes) {
            writeFileAsync("./Develop/db/db.json", JSON.stringify(notes));
            res.json(note);
        });
});