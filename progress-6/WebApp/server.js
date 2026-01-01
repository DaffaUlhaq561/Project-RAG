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
    const externalWebhook = process.env.N8N_WEBHOOK_URL || "https://n8n.daffaulhq.online/webhook-test/36d8679c-c4d0-48ac-8357-69b43d397f57";
    const localWebhook = process.env.N8N_LOCAL_WEBHOOK_URL || "http://localhost:5678/webhook/96d331f8-c02e-4fd1-ad6d-4e9d3f081a82";
    const question = req.body.question;

    if (!question) {
        return res.status(400).json({ error: "Question is required" });
    }

    try {
        console.log(`Sending request to: ${externalWebhook}`);
        console.log(`Question: ${question}`);

        const response = await axios.post(externalWebhook, { question }, { timeout: 30000 });

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
                error: error.response.data?.hint || error.response.data?.message || "Error calling n8n webhook" 
            });
        } else if (error.request) {
            // Request made but no response. Try local fallback.
            console.error("No response received from external webhook, attempting local fallback:", localWebhook);
            try {
                const fallbackResp = await axios.post(localWebhook, { question }, { timeout: 30000 });
                console.log("Fallback success. Returning local n8n response.");
                return res.json({ answer: fallbackResp.data });
            } catch (fallbackErr) {
                console.error("Fallback error:", fallbackErr.message);
                return res.status(503).json({ 
                    error: "Tidak bisa menghubungi n8n via Cloudflared maupun lokal. Periksa tunnel dan URL." 
                });
            }
        } else {
            // Error in request setup
            res.status(500).json({ error: "Error setting up request: " + error.message });
        }
    }
});

app.listen(3000, () => console.log("WebApp running at http://localhost:3000"));

