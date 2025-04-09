// File: api/ask.js (for Vercel serverless function)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST allowed' });
    }
  
    const { question } = req.body;
  
    const prompt = `You are a Socratic tutor. When someone asks you a question, you do not give the answer directly. Instead, you guide them with helpful questions, hints, or analogies that help them arrive at the answer themselves. Respond to this question accordingly: ${question}`;
  
    try {
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Set in Vercel dashboard
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });
  
      const data = await openaiRes.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
  
      res.status(200).json({ reply });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong.' });
    }
  }
  
