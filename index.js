const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 80;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST endpoint
app.post("/", (req, res) => {
    processReq(req, res, false);
});

app.get("/", (req, res) => {
    processReq(req, res, true);
});

function processReq(req, res, isGet) {
    if (isGet) {
        console.warn("A GET request was made!!!!");
    }

    console.log(req.headers);
    console.log(req.body);

    if (!req.body.key) {
        res.status(400).json({ status: "ClientError", message: "§4Bad request, key is invalid§r" });
        console.error("a client sent a bad request OwO [" + req.ip + "]");
        return;
    }

    console.log(req.ip + " sent a request: ?key=" + req.query.key);

    const userKey = req.body.key;
    if (userKey in process.env) {
        const [username, accessCode] = process.env[userKey].split(",");

        console.log(username + " //// " + accessCode);

        if (accessCode === "OK") {
            if (req.body.userName !== username) {
                // alert logic here if needed
            }
            res.status(200).json({
                status: "OK",
                userName: username,
                message: "Welcome, §p" + username + "§r, your account has been verified §asucessfully§r"
            });
            return;
        }

        else if (accessCode === "SUSP") {
            if (req.body.userName !== username) {
                // alert logic here if needed
            }
            res.status(200).json({
                status: "Suspended",
                userName: username,
                message: "Welcome, §p" + username + "§r, your account has been §4suspended§r and you cannot use this application"
            });
            return;
        }

        else if (accessCode === "EasterEgg") {
            console.log("Easter egg with code \"" + userKey + "\" was triggered");
            res.status(200).json({
                status: "EasterEgg",
                userName: userKey,
                message: username
            });
            return;
        }

    } else {
        console.log("Someone tried to log in with an invalid key [" + req.ip + "]");
        res.status(200).json({
            status: "InvalidAccount",
            message: "§4Invalid§r access key"
        });
        return;
    }
    console.error("i dunno what happened OwO [" + req.ip + "]");
    res.status(500).json({ status: "ServerError", message: "§4Bad request, unknown error (probably invalid `accessCode`, check .env file)§r" });
}

// Start the server
app.listen(port, () => {
    console.log(`MiliDuper Backend V2.1\nServer is running on port ${port}`);
});
