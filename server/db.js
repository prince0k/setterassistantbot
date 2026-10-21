import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const SPIN_FILE = path.join(DATA_DIR, 'defaultSpin.json');
const GOLD_FILE = path.join(DATA_DIR, 'goldStandards.json');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

// Initialize Supabase if credentials are provided in environment
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  try {
    const cleanUrl = process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
    supabase = createClient(cleanUrl, process.env.SUPABASE_KEY);
    console.log('Connected to Supabase PostgreSQL database:', cleanUrl);

    // Auto-seed initial spin and gold standards if cloud database is empty
    setTimeout(async () => {
      try {
        const { data: existingSpin } = await supabase.from('spins').select('id').eq('id', 'default').maybeSingle();
        if (!existingSpin) {
          const localSpin = await readJson(SPIN_FILE, {});
          if (localSpin && localSpin.title) {
            console.log('Seeding initial Alex Neilan Spin into Supabase...');
            await supabase.from('spins').upsert({
              id: 'default',
              title: localSpin.title,
              author: localSpin.author,
              content: localSpin,
              updated_at: new Date().toISOString()
            });
          }
        }

        const { data: existingGold } = await supabase.from('gold_standards').select('id').limit(1);
        if (!existingGold || existingGold.length === 0) {
          const localGold = await readJson(GOLD_FILE, []);
          if (localGold && localGold.length > 0) {
            console.log(`Seeding ${localGold.length} Gold Standards into Supabase...`);
            await supabase.from('gold_standards').upsert(localGold);
          }
        }
      } catch (seedErr) {
        console.warn('Supabase auto-seed notice:', seedErr.message);
      }
    }, 1000);
  } catch (err) {
    console.warn('Could not initialize Supabase, using local JSON storage:', err.message);
  }
} else {
  console.log('No Supabase credentials provided; using robust local JSON storage');
}

// Helper for reading JSON files
async function readJson(filePath, defaultValue = []) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

// Helper for writing JSON files
async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Get the master spin
 */
export async function getSpin() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('spins')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (!error && data && data.content) {
        return data.content;
      }
    } catch (err) {
      console.warn('Supabase getSpin failed, falling back to local file:', err.message);
    }
  }

  return await readJson(SPIN_FILE, {});
}

/**
 * Save / Update master spin
 */
export async function saveSpin(spinContent) {
  // Always update local file as reliable cache
  await writeJson(SPIN_FILE, spinContent);

  if (supabase) {
    try {
      await supabase.from('spins').upsert({
        id: 'default',
        title: spinContent.title || 'Alex Neilan Spin',
        author: spinContent.author || 'Alex Neilan',
        content: spinContent,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase saveSpin sync failed:', err.message);
    }
  }

  return spinContent;
}

/**
 * Get all Gold Standard examples for few-shot learning
 */
export async function getGoldStandards() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('gold_standards')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase getGoldStandards failed, falling back to local:', err.message);
    }
  }

  return await readJson(GOLD_FILE, []);
}

/**
 * Add or update a Gold Standard example
 */
export async function saveGoldStandard(example) {
  const list = await readJson(GOLD_FILE, []);
  const existingIdx = list.findIndex(item => item.id === example.id);

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...example };
  } else {
    list.unshift({
      id: example.id || `gold_${Date.now()}`,
      created_at: new Date().toISOString(),
      ...example
    });
  }

  await writeJson(GOLD_FILE, list);

  if (supabase) {
    try {
      await supabase.from('gold_standards').upsert({
        id: example.id || `gold_${Date.now()}`,
        lead_name: example.lead_name,
        lead_snippet: example.lead_snippet,
        stage: example.stage,
        reply_direct: example.reply_direct,
        reply_empathetic: example.reply_empathetic,
        reply_short: example.reply_short,
        rationale: example.rationale,
        created_at: example.created_at || new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase saveGoldStandard failed:', err.message);
    }
  }

  return list;
}

/**
 * Delete a Gold Standard example
 */
export async function deleteGoldStandard(id) {
  const list = await readJson(GOLD_FILE, []);
  const filtered = list.filter(item => item.id !== id);
  await writeJson(GOLD_FILE, filtered);

  if (supabase) {
    try {
      await supabase.from('gold_standards').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteGoldStandard failed:', err.message);
    }
  }

  return filtered;
}

/**
 * Log a conversation analysis to history
 */
export async function addHistory(logItem) {
  const history = await readJson(HISTORY_FILE, []);
  const item = {
    id: `hist_${Date.now()}`,
    created_at: new Date().toISOString(),
    ...logItem
  };

  history.unshift(item);
  if (history.length > 100) history.pop(); // keep last 100
  await writeJson(HISTORY_FILE, history);

  if (supabase) {
    try {
      await supabase.from('history_logs').insert({
        id: item.id,
        lead_name: item.lead_name,
        conversation_snippet: item.conversation_snippet,
        stage: item.stage,
        replies: item.replies,
        rationale: item.rationale,
        created_at: item.created_at
      });
    } catch (err) {
      console.warn('Supabase addHistory failed:', err.message);
    }
  }

  return item;
}

/**
 * Get conversation history logs
 */
export async function getHistory(limit = 30) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('history_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase getHistory failed, falling back to local file:', err.message);
    }
  }

  const list = await readJson(HISTORY_FILE, []);
  return list.slice(0, limit);
}
