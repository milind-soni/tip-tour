import OpenAI from "openai";
import express from 'express';

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post('/api/openai', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });

    const response = chatCompletion.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
});

export default router;