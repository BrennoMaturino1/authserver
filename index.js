const express = require("express");
const axios = require('axios');

require("dotenv").config();

const app = express();
const port = process.env.PORT || 80;

const hookURL = process.env.hookURL.split(",")[0]

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

    const userKey = req.body.key;
    if (userKey in process.env) {
        const [username, accessCode] = process.env[userKey].split(",");

        console.log(username + " //// " + accessCode);

        if (accessCode === "OK") {
            if (req.body.userName !== username) {
                hook(hookURL, "Warning!\nA player named \"" + req.body.userName + "\" logged in with " + username + "'s account")
            }
            else {
                hook(hookURL, req.body.userName + " logged in with their account")
            }
            res.status(200).json({
                status: "OK",
                userName: username,
                message: "Welcome, §p" + username + "§r, your account has been verified §asucessfully§r"
            });
            return;
        }

        else if (accessCode === "Suspended") {
            if (req.body.userName !== username) {
                hook(process.env.hookURL, "Warning!\nA player named \"" + req.body.userName + "\" tried to log in with " + username + "'s account")
            }
            else {
                hook(process.env.hookURL, req.body.userName + " tried to log in with their account")
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

        else if (accessCode === "ServerData") {
            res.status(500).json({ status: "ServerError", message: "§4Invalid key format§r" });
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
    res.status(500).json({ status: "ServerError", message: "§4Unknown error on server side§r" });
}

// Start the server
app.listen(port, () => {
    console.log(`MiliDuper Backend V2.1\nServer is running on port ${port}`);
});




/**
 * Sends a webhook message to a Discord channel.
 * 
 * @param {string} webhookUrl - The Discord webhook URL.
 * @param {string} message - The message to send.
 * @returns {Promise<void>}
 */
async function hook(webhookUrl, message) {
  try {
    const response = await axios.post(webhookUrl, {
      content: message,
    });

    if (response.status === 204) {
      console.log('Message sent successfully');
    } else {
      console.log('Failed to send message', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}
