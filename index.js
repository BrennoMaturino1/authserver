const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// POST endpoint
app.post("/", (req, res) => {
    const key = req.query.key;

    if (process.env[key]) {
        res.status(200).json({ userName: process.env[key] });
    } else {
        res.status(401);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
