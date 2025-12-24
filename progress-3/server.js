// import express from "express";
// import axios from "axios";
// import bodyParser from "body-parser";

// const app = express();
// app.use(bodyParser.json());

// app.get("/", (req, res) => {
//     res.send(`
//         <form method="POST" action="/ask">
//             <input name="question" placeholder="Tanya sesuatu..." />
//             <button type="submit">Kirim</button>
//         </form>
//     `);
// });

// app.post("/ask", express.urlencoded({ extended: true }), async (req, res) => {
//     const webhookUrl = "http://localhost:5678/webhook/96d331f8-c02e-4fd1-ad6d-4e9d3f081a82"; // n8n webhook kamu
//     const question = req.body.question;

//     const response = await axios.post(webhookUrl, { question });
//     res.send("Jawaban dari n8n: " + response.data);
// });

// app.listen(3000, () => console.log("WebApp running at http://localhost:3000"));








const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/chat", async (req, res) => {
    const webhookUrl = "https://joette-undefensed-illatively.ngrok-free.dev/webhook-test/96d331f8-c02e-4fd1-ad6d-4e9d3f081a82"
    // Alternative: const webhookUrl = "http://localhost:5678/webhook/96d331f8-c02e-4fd1-ad6d-4e9d3f081a82"; 
    const question = req.body.question;

    if (!question) {
        return res.status(400).json({ error: "Question is required" });
    }

    try {
        console.log(`Sending request to: ${webhookUrl}`);
        console.log(`Question: ${question}`);
        
        const response = await axios.post(webhookUrl, { question }, {
            timeout: 30000
        });

        console.log("============== RAW RESPONSE FROM n8n ==============");
        console.log(response.data);
        console.log("==================================================");

        res.json({ answer: response.data });
    } catch (error) {
        console.error("AXIOS ERROR:", error.message);
        
        if (error.response) {
            // Server responded with error status
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
            res.status(error.response.status).json({ 
                error: error.response.data?.hint || "Error calling n8n webhook" 
            });
        } else if (error.request) {
            // Request made but no response
            console.error("No response received");
            res.status(503).json({ error: "n8n webhook is not responding. Check if it's running and the URL is correct." });
        } else {
            // Error in request setup
            res.status(500).json({ error: "Error setting up request: " + error.message });
        }
    }
});

app.listen(3000, () => console.log("WebApp running at http://localhost:3000"));

