const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

import { config } from "dotenv";
config();

import { Configuration, OpenAIApi } from "openai";
import readline from "readline";

// DEFINE API KEY
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.API_KEY
}))

// SET UP CONSOLE INTERFACE
const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// DEFINE VAR FOR MESSAGE HISTORY
let messageHistory = [];

// START INTERFACE
userInterface.prompt()
userInterface.on("line", async input => {
    // FORWARD INTERFACE INPUT TO GPT API
    messageHistory.push({ role: "user", content: input });
    const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messageHistory,
        temperature: 0.6
    })
    // DEFINE VARS FOR API
    let tokens = res.data.usage.total_tokens;
    let price = tokens * (0.002 / 1000);
    let assistantMsg = res.data.choices[0].message;
    // PUSH LAST GPT MESSAGE TO MSGHISTORY
    messageHistory.push(assistantMsg);

    // OUTPUT ALL IMPORTANT INFOS
    console.log(res.data.choices[0].message.content);
    console.log("");
    console.log("Total tokens used: " + tokens + ", Price: " + price);
    userInterface.prompt();
})

app.listen(3030, () => {
    console.log('App is running on port 3030')
});