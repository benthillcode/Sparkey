const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store or simple JSON file
const SAVES_FILE = path.join(__dirname, 'saves.json');
if (!fs.existsSync(SAVES_FILE)) fs.writeFileSync(SAVES_FILE, JSON.stringify([]));

// API endpoint: proxy to OpenAI
app.post('/api/palette', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const openaiRes = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: `Generate a palette of three distinct hex color codes that evoke "${prompt}"`,
        max_tokens: 60,
        temperature: 0.7
      })
    });
    const data = await openaiRes.json();
    const text = data.choices[0].text;
    const colors = text.match(/#(?:[0-9a-fA-F]{3}){1,2}/g);
    if (colors && colors.length >= 3) {
      res.json({ colors: colors.slice(0, 3) });
    } else {
      res.status(500).json({ error: 'Could not parse colors.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI API error.' });
  }
});

// API endpoint: save design
app.post('/api/save', (req, res) => {
  const { colors, prompt } = req.body;
  const saves = JSON.parse(fs.readFileSync(SAVES_FILE));
  const entry = { id: Date.now(), colors, prompt, timestamp: new Date().toISOString() };
  saves.push(entry);
  fs.writeFileSync(SAVES_FILE, JSON.stringify(saves, null, 2));
  res.json({ success: true, entry });
});

// API endpoint: get saved designs
app.get('/api/saves', (req, res) => {
  const saves = JSON.parse(fs.readFileSync(SAVES_FILE));
  res.json(saves);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
