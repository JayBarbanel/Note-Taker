//Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const allNotes = require("./db/db.json");

//set up server
const PORT = process.env.PORT || 3001;
const app = express();

// Set up express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add a static middleware for serving assets in the public folder
app.use(express.static("public"));

// Async processes
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// API Route "GET" request
app.get("/api/notes", function(req, res) {
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        notes = [].concat(JSON.parse(data));
        res.json(notes);
    });
});

//API post requests
app.post("/api/notes", function(req, res) {
    const note = req.body;
    readFileAsync("./db/db.json", "utf8")
        .then(function(data) {
            const notes = [].concat(JSON.parse(data));
            note.id = notes.length + 1;
            notes.push(note);
            return notes;
        })
        .then(function(notes) {
            writeFileAsync("./db/db.json", JSON.stringify(notes));
            res.json(note);
        });
});

// HTML Routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//to delete
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];
        console.log(note);
        if (note.id == id) {
            notesArray.splice(i, 1);
            writeFileAsync("./db/db.json", JSON.stringify(notesArray));
            break;
        }
    }
    return notesArray;
}

app.delete("/api/notes/:id", (req, res) => {
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        console.log(data);
        notesArray = deleteNote(req.params.id, JSON.parse(data));
        console.log(notesArray);
        res.json(notesArray);
    });
});

// This will isten for connections
app.listen(PORT, function() {
    console.log("Example app listening at PORT " + PORT);
});