import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateSetterResponse } from './gemini.js';
import {
  getSpin,
  saveSpin,
  getGoldStandards,
  saveGoldStandard,
  deleteGoldStandard,
  getHistory,
  addHistory
} from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend running locally or on Vercel
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));

// Health Check for Render
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DMSetterAssistant-Backend',
    timestamp: new Date().toISOString()
  });
});

/**
 * Generate 3 suggested replies + reasoning for pasted DM conversation
 */
app.post('/api/generate-reply', async (req, res) => {
  try {
    const {
      conversationText,
      customInstructions = '',
      modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      apiKey = process.env.GEMINI_API_KEY
    } = req.body;

    if (!conversationText || !conversationText.trim()) {
      return res.status(400).json({ error: 'Conversation text is required.' });
    }

    // Retrieve active spin and benchmark gold standards
    const spin = await getSpin();
    const goldStandards = await getGoldStandards();

    // Call Gemini with full context
    const aiResult = await generateSetterResponse({
      conversationText,
      spin,
      goldStandards,
      modelName,
      apiKey: apiKey || process.env.GEMINI_API_KEY,
      customInstructions
    });

    // Automatically log this generation to history
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

    res.json(aiResult);
  } catch (err) {
    console.error('Error generating reply:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate setter response.'
    });
  }
});

/**
 * Get active master spin framework
 */
app.get('/api/spin', async (req, res) => {
  try {
    const spin = await getSpin();
    res.json(spin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Update master spin framework
 */
app.post('/api/spin', async (req, res) => {
  try {
    const spinData = req.body;
    if (!spinData || typeof spinData !== 'object') {
      return res.status(400).json({ error: 'Invalid spin payload.' });
    }
    const updated = await saveSpin(spinData);
    res.json({ success: true, spin: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all Gold Standard examples (Few-shot learning bank)
 */
app.get('/api/gold-standards', async (req, res) => {
  try {
    const examples = await getGoldStandards();
    res.json(examples);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Add / Update a Gold Standard example
 */
app.post('/api/gold-standards', async (req, res) => {
  try {
    const example = req.body;
    if (!example.reply_direct && !example.reply_empathetic && !example.reply_short) {
      return res.status(400).json({ error: 'At least one reply variation is required.' });
    }
    const updatedList = await saveGoldStandard(example);
    res.json({ success: true, list: updatedList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Delete a Gold Standard example
 */
app.delete('/api/gold-standards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedList = await deleteGoldStandard(id);
    res.json({ success: true, list: updatedList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get conversation history logs
 */
app.get('/api/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const history = await getHistory(limit);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Setter Assistant Backend running on http://localhost:${PORT}`);
  });
}
