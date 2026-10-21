import { createClient } from '@supabase/supabase-js';
import { defaultSpin } from './_defaultSpin.js';
import { defaultGold } from './_defaultGold.js';

let supabase = null;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (supabaseUrl && supabaseKey) {
  try {
    const cleanUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
    supabase = createClient(cleanUrl, supabaseKey);
  } catch (err) {
    console.warn('Supabase init failed in serverless:', err.message);
  }
}

// In-memory runtime cache for serverless execution
let cachedSpin = defaultSpin;
let cachedGold = defaultGold;
let cachedHistory = [];

export async function getSpin() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('spins').select('content').eq('id', 'default').maybeSingle();
      if (!error && data?.content) {
        return data.content;
      }
    } catch (e) {
      console.warn('Error reading spin from Supabase:', e.message);
    }
  }
  return cachedSpin;
}

export async function saveSpin(spinContent) {
  cachedSpin = spinContent;
  if (supabase) {
    try {
      await supabase.from('spins').upsert({
        id: 'default',
        title: spinContent.title || 'Alex Neilan Spin',
        author: spinContent.author || 'Alex Neilan',
        content: spinContent,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Error saving spin to Supabase:', e.message);
    }
  }
  return cachedSpin;
}

export async function getGoldStandards() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('gold_standards').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Error reading gold from Supabase:', e.message);
    }
  }
  return cachedGold;
}

export async function saveGoldStandard(example) {
  const item = {
    id: example.id || `gold_${Date.now()}`,
    created_at: new Date().toISOString(),
    ...example
  };
  cachedGold.unshift(item);

  if (supabase) {
    try {
      await supabase.from('gold_standards').upsert(item);
    } catch (e) {
      console.warn('Error saving gold to Supabase:', e.message);
    }
  }
  return cachedGold;
}

export async function deleteGoldStandard(id) {
  cachedGold = cachedGold.filter(g => g.id !== id);
  if (supabase) {
    try {
      await supabase.from('gold_standards').delete().eq('id', id);
    } catch (e) {
      console.warn('Error deleting gold from Supabase:', e.message);
    }
  }
  return cachedGold;
}

export async function addHistory(item) {
  const log = {
    id: `hist_${Date.now()}`,
    created_at: new Date().toISOString(),
    ...item
  };
  cachedHistory.unshift(log);
  if (cachedHistory.length > 50) cachedHistory.pop();

  if (supabase) {
    try {
      await supabase.from('history_logs').insert(log);
    } catch (e) {
      console.warn('Error adding history to Supabase:', e.message);
    }
  }
  return log;
}

export async function getHistory(limit = 30) {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('history_logs').select('*').order('created_at', { ascending: false }).limit(limit);
      if (!error && data) return data;
    } catch (e) {
      console.warn('Error reading history from Supabase:', e.message);
    }
  }
  return cachedHistory.slice(0, limit);
}
