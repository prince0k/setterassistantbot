import { getSpin, saveSpin } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const spin = await getSpin();
    return res.status(200).json(spin);
  }

  if (req.method === 'POST') {
    const spinData = req.body;
    if (!spinData || typeof spinData !== 'object') {
      return res.status(400).json({ error: 'Invalid spin payload.' });
    }
    const updated = await saveSpin(spinData);
    return res.status(200).json({ success: true, spin: updated });
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
