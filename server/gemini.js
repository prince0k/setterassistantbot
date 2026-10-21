import dotenv from 'dotenv';
dotenv.config();

/**
 * Call Gemini API with structured prompt for Setter Assistant
 */
export async function generateSetterResponse({
  conversationText,
  spin,
  goldStandards = [],
  modelName = 'gemini-2.5-flash',
  apiKey = process.env.GEMINI_API_KEY,
  customInstructions = ''
}) {
  if (!apiKey) {
    throw new Error('Gemini API key is required. Please check your .env or settings.');
  }

  // Build few-shot examples text from Gold Standards
  let fewShotText = '';
  if (goldStandards && goldStandards.length > 0) {
    fewShotText = `
### BENCHMARK GOLD STANDARD EXAMPLES (Learn from these high-converting setter replies):
${goldStandards.slice(0, 5).map((ex, i) => `
Example #${i + 1}:
- Lead Name: ${ex.lead_name || 'Lead'}
- Lead Context: "${ex.lead_snippet}"
- Stage: ${ex.stage}
- Direct Reply: "${ex.reply_direct}"
- Empathetic Reply: "${ex.reply_empathetic}"
- Short Reply: "${ex.reply_short}"
- Rationale: ${ex.rationale}
`).join('\n')}
`;
  }

  const systemInstruction = `
You are Alex Neilan, a registered UK dietitian (HCPC registered, surname Neilan) and founder of Sustainable Change (@alexneilan).
You are an expert high-ticket setter helping women lose weight sustainably through mindset, psychology, and habit coaching without crash diets.

### YOUR TONE & VOICE:
1. Warm, deeply empathetic, authoritative, and direct.
2. 100% human and conversational — never sound like an AI assistant. No robotic greetings like "Hello! I am an AI...", no corporate fluff.
3. Natural UK/Irish conversational rhythm: Use terms like "stone" (1 stone = 14 lbs = 6.35 kg), "pop", "ring any bells? Haha", "I hear you [FirstName]...", "spot on", "Does that make sense? :)", "P.S.".
4. You challenge self-limiting beliefs with deep care ("Movement creates motivation", "It wasn't your fault, the diets weren't sustainable", "If we don't make time for health now, we will eventually be forced to make time for illness").

### COMPLETE SALES SPIN RULES & STAGES:
${JSON.stringify(spin, null, 2)}

${fewShotText}

${customInstructions ? `### USER CUSTOM INSTRUCTIONS:\n${customInstructions}\n` : ''}

### YOUR TASK:
Analyze the provided conversation snippet from Instagram/Facebook DMs.
1. Extract the lead's first name. If known, use their name; if unknown, use [FirstName].
2. Identify the EXACT current stage in the spin (Stage 0 to Stage 8 or Objection Handling).
3. Identify all detected obstacles or conditions (e.g. Menopause, Injuries, Thyroid, Lack of Time, Stress, Boredom Eating, etc.).
4. Flag any qualification criteria:
   - If weight loss goal is <= 1 stone or BMI < 29: Flag "One stone VETT later".
   - If salary < £35k / Single Mum / financial stress: Flag "Disqualification: Send Vett/Scholarship Vett".
   - If family history of heart disease, stroke, cancer, diabetes: Flag "Medical History Pitch required".
5. Generate THREE distinct humanized reply variations:
   - OPTION 1 (Direct & Momentum-Building): Moves the lead assertively into the next diagnostic step or call pitch.
   - OPTION 2 (Deeply Empathetic): Validates their personal struggle, hormones, pain, or overwhelm before bridging into the next question.
   - OPTION 3 (Short & Casual Follow-up): A punchy, low-friction text that feels like a natural one-liner DM.
6. Provide "why_this_message": A concise strategic breakdown explaining the psychology, which spin step this tackles, and the immediate goal.

You MUST respond strictly with a valid JSON object matching the required schema.
`;

  const userPrompt = `
Here is the pasted DM conversation snippet between the setter and the lead:

"""
${conversationText}
"""

Diagnose the lead's situation and generate the 3 response options + strategic rationale in JSON format.
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: userPrompt
          }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        {
          text: systemInstruction
        }
      ]
    },
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          lead_name: { type: 'STRING', description: 'Extracted first name of the lead or [FirstName]' },
          stage: { type: 'STRING', description: 'Current identified stage in the spin' },
          current_goal: { type: 'STRING', description: 'Lead weight loss goal if mentioned, or unknown' },
          detected_obstacles: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            description: 'List of obstacles or conditions identified (e.g., Menopause, Sciatica)'
          },
          qualification_flags: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            description: 'Important setter alerts (e.g., One stone VETT later, Salary < 35k flag, Medical history)'
          },
          reply_direct: { type: 'STRING', description: 'Direct, momentum-building reply option' },
          reply_empathetic: { type: 'STRING', description: 'Deeply empathetic, validating reply option' },
          reply_short: { type: 'STRING', description: 'Short casual follow-up message option' },
          why_this_message: { type: 'STRING', description: 'Strategic rationale and sales psychology explanation' },
          next_objective: { type: 'STRING', description: 'Immediate next goal for the setter' }
        },
        required: [
          'lead_name',
          'stage',
          'reply_direct',
          'reply_empathetic',
          'reply_short',
          'why_this_message',
          'next_objective'
        ]
      },
      temperature: 0.7
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const result = await response.json();
  const candidate = result.candidates?.[0];
  const responseText = candidate?.content?.parts?.[0]?.text;

  if (!responseText) {
    throw new Error('Gemini API returned an empty response.');
  }

  try {
    return JSON.parse(responseText);
  } catch (err) {
    console.error('Failed to parse Gemini JSON response:', responseText);
    throw new Error('Could not parse structured response from Gemini API.');
  }
}
