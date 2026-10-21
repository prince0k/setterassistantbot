-- Supabase Schema for Setter Assistant Bot (DMSetterAssistantnew)
-- Run this in your Supabase Project -> SQL Editor to initialize your cloud tables

-- 1. Table for active and custom spin frameworks
CREATE TABLE IF NOT EXISTS spins (
  id TEXT PRIMARY KEY DEFAULT 'default',
  title TEXT NOT NULL,
  author TEXT,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table for Gold Standard responses (Few-shot learning bank)
CREATE TABLE IF NOT EXISTS gold_standards (
  id TEXT PRIMARY KEY,
  lead_name TEXT,
  lead_snippet TEXT NOT NULL,
  stage TEXT,
  reply_direct TEXT,
  reply_empathetic TEXT,
  reply_short TEXT,
  rationale TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table for interaction logs / conversation history
CREATE TABLE IF NOT EXISTS history_logs (
  id TEXT PRIMARY KEY,
  lead_name TEXT,
  conversation_snippet TEXT NOT NULL,
  stage TEXT,
  replies JSONB NOT NULL,
  rationale TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) can be enabled or disabled for public anon key usage:
ALTER TABLE spins ENABLE ROW LEVEL SECURITY;
ALTER TABLE gold_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write with anon key
CREATE POLICY "Allow public read/write on spins" ON spins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on gold_standards" ON gold_standards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on history_logs" ON history_logs FOR ALL USING (true) WITH CHECK (true);
