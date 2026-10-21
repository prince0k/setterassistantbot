import { getGoldStandards, saveGoldStandard, deleteGoldStandard } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const list = await getGoldStandards();
    return res.status(200).json(list);
  }

  if (req.method === 'POST') {
    const example = req.body;
    if (!example?.reply_direct && !example?.reply_empathetic && !example?.reply_short) {
      return res.status(400).json({ error: 'At least one reply variation is required.' });
    }
    const updated = await saveGoldStandard(example);
    return res.status(200).json({ success: true, list: updated });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID is required.' });
    const updated = await deleteGoldStandard(id);
    return res.status(200).json({ success: true, list: updated });
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
