require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({
    backend: "working",
    hasKey: !!process.env.OPENROUTER_API_KEY
  });
});

app.post("/chat", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI Student Companion. Give short, clear, helpful study advice."
          },
          {
            role: "user",
            content: req.body.message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.json({
      reply: "AI failed. Your API key/model may not be active."
    });
  }
});

app.listen(4000, () => {
  console.log("Backend running on port 4000");
});