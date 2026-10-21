import { generateSetterResponse } from './_gemini.js';
import { getSpin, getGoldStandards, addHistory } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      conversationText,
      customInstructions = '',
      modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      apiKey = process.env.GEMINI_API_KEY
    } = req.body || {};

    if (!conversationText || !conversationText.trim()) {
      return res.status(400).json({ error: 'Conversation text is required.' });
    }

    const spin = await getSpin();
    const goldStandards = await getGoldStandards();

    const aiResult = await generateSetterResponse({
      conversationText,
      spin,
      goldStandards,
      modelName,
      apiKey: apiKey || process.env.GEMINI_API_KEY,
      customInstructions
    });

    await addHistory({
      lead_name: aiResult.lead_name,
      conversation_snippet: conversationText.slice(0, 500),
      stage: aiResult.stage,
      replies: {
        direct: aiResult.reply_direct,
        empathetic: aiResult.reply_empathetic,
        short: aiResult.reply_short
      },
      rationale: aiResult.why_this_message
    });

    res.status(200).json(aiResult);
  } catch (err) {
    console.error('Error generating reply in serverless:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate setter response.'
    });
  }
}
