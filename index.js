const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 80;

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

    console.log(req.headers);
    
    if (!req.query.key) {
        res.status(400).json({ status: "ClientError", message: "§4Bad request, key is invalid§r" });
        console.error("a client sent a bad request OwO [" + req.ip + "]")
        return;
    }

    console.log(req.ip + " sent a request: ?key=" + req.query.key);

    if (req.query.key in process.env) {
        const [username, accessCode] = process.env[req.query.key].split(",")
        console.log(username + " //// " + accessCode);
        if (accessCode === "OK") {
            console.log(username + " (or someone with their acess key [" + req.ip + "]) logged in sucessfully UwU :3")
            res.status(200).json({
                status: "OK",
                userName: username,
                message: "Welcome, §p" + username + "§r, your account has been verified §asucessfully§r"
            })
            return;
        } else if (accessCode === "Suspended") {
            console.log(username + " (or someone with their acess key [" + req.ip + "]) tried to log in but their account is suspended xD")
            res.status(200).json({
                status: "Suspended",
                userName: username,
                message: "Welcome, §p" + username + "§r, your account has been §4suspended§r and you cannot use this application"
            })
            return;
        } else if (accessCode === "EasterEgg") {
            console.log("Easter egg with code \"" + req.query.key + "\" was triggered")
            res.status(200).json({
                status: "EasterEgg",
                userName: req.query.key,
                message: username
            })
            return;
        }

    } else {
        console.log("Someone tried to log in with an invalid key [" + req.ip + "]")
        res.status(200).json({
            status: "InvalidAccount",
            message: "§4Invalid§r access key"
        })
        return;
    }
    console.error("i dunno what happened OwO [" + req.ip + "]")
    res.status(500).json({ status: "ServerError", message: "§4Bad request, unknown error§r" });
    return;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
