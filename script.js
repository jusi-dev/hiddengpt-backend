import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

console.log(process.env.API_KEY);

import { config } from "dotenv";
config();

import { Configuration, OpenAIApi } from "openai";

const oneTimeAccessCodes = ['84aqjB', 'hGnN1W', 'Mm26D3', 'JJrk45', 'mI1C27', 'F2mOgo', 'xyDSGc', 'QyqNny', 'Xbf6ex', 'rcQvtM']

// DEFINE API KEY
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.API_KEY
}))

async function generateAnswer(msgHistory) {
    const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: msgHistory,
        temperature: 0.6
    });
    return res;
}

app.post('/api/addKey', (req, res) => {
    oneTimeAccessCodes.push(req.body.KEY);
    return res.status(200).send('Successful added key!');
});

app.post('/api/checkOTAC', (req, res) => {
    console.log(req.body);
    console.log(req.body.OTAC);
    for (let i = 0; i < oneTimeAccessCodes.length; i++) {
        if (oneTimeAccessCodes[i] == req.body.OTAC) {
            delete oneTimeAccessCodes[i];
            return res.json('success')
        }
    }
    return res.status(500).send("Something went wrong.")
});

app.post('/api/getReply', (req, res) => {
    console.log(req.body);
    console.log(req.body.messageHistory);
    generateAnswer(req.body.messageHistory)
        .then ((response) => {
            let tokens = response.data.usage.total_tokens;
            let price = tokens * (0.002 / 1000);
            let assistantMsg = response.data.choices[0].message;
            let msgContent = response.data.choices[0].message.content;

            res.json(assistantMsg)
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Internat server error');
        })
        
    // console.log(req.body)
});

app.listen(3030, () => {
    console.log('App is running on port 3030')
});