const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 1024;

app.use(express.json());

// POST endpoint
app.post("/", (req, res) => {
    processReq(req, res, false)
});

app.get("/", (req, res) => {
    processReq(req, res, true)
});

function processReq(req, res, isGet) {

    if (isGet) {
        console.warn("A request was made with isGet set to true, you should be aware that get requests are for quickly testing the API in the search bar and shouldn't be used for production")
    }

    if (!req.query.key) {
        res.status(400).json("§4Bad request, key is invalid§r");
        console.error("a client sent a bad request OwO")
    }
    console.log("0");
    if (req.query.key in process.env) {
        console.log("1");
        const [username, accessCode] = process.env[req.query.key].split(",")
        console.log(username + " //// " + accessCode);
        if (accessCode == "OK") {
            console.log(username + " (or someone with their acess key) logged in sucessfully UwU :3")
            res.status(200).json({ userName: username, message: "Welcome, §p" + username + "§r, your account has been verified §asucessfully§r" })
        } else if (accessCode == "SUSP") {
            console.log(username + " (or someone with their acess key) tried to log in but their account is suspended xD")
            res.status(401).json({ userName: username, message: "Welcome, §p" + username + "§r, your account has been §4suspended§r and you cannot use this application" })
        }
    } else {
        console.log("Someone tried to log in with an invalid key")
        res.status(401).json({ message: "§4Invalid§r access key" })
    }
    console.error("i dunno what happened OwO")
    res.status(500).json({ message: "§4Bad request, unknown error§r"});
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
