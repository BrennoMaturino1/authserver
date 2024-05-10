const express = require("express");
require("dotenv").config();
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Middleware to serve index.html for GET requests to root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// POST endpoint
app.post("/", (req, res) => {
    const { key } = req.query;
    const [usernameKey, codeKey] = process.env.USERNAME_CODE.split(", ");

    if (process.env[usernameKey] && process.env[codeKey]) {
        const username = process.env[usernameKey];
        const code = process.env[codeKey];

        if (key === code) {
            res.status(200).json({ userName: username });
        } else {
            res.status(401).json({ userName: username });
        }
    } else {
        res.status(500).send("Environment variables not properly configured.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
