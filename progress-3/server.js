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








import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(`
        <form method="POST" action="/ask">
            <input name="question" placeholder="Tanya sesuatu..." />
            <button type="submit">Kirim</button>
        </form>
    `);
});

app.post("/ask", async (req, res) => {
    const webhookUrl = "http://localhost:5678/webhook/96d331f8-c02e-4fd1-ad6d-4e9d3f081a82"; 
    const question = req.body.question;

    try {
        const response = await axios.post(webhookUrl, { question });

        console.log("============== RAW RESPONSE FROM n8n ==============");
        console.log(response.data);
        console.log("==================================================");

        res.send("Jawaban dari n8n: " + response.data);
    } catch (error) {
        console.log("AXIOS ERROR:", error);
        res.send("Error memanggil n8n");
    }
});

app.listen(3000, () => console.log("WebApp running at http://localhost:3000"));

