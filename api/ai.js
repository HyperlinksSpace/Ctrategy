/**
 * Strategy site AI gateway (Vercel serverless).
 * Matches the Hyperlinks Space Program /api/ai contract used by js/ai-chat.js.
 *
 * Requires OPENAI (or OPENAI_API_KEY) in Vercel project env.
 * Deploy this repo on Vercel and add ctrategy.hyperlinks.space to aiChat.sameOriginHosts
 * in js/settings.js so the static site can call same-origin /api/ai.
 */

const CORS_PATTERNS = [
  /^https:\/\/([a-z0-9-]+\.)?hyperlinks\.space$/i,
  /^https:\/\/[a-z0-9-]+\.github\.io$/i,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/
];

function allowOrigin(req) {
  const origin = String(req.headers.origin || '');
  if (!origin) return '';
  return CORS_PATTERNS.some(function (re) { return re.test(origin); }) ? origin : '';
}

function applyCors(req, res) {
  const origin = allowOrigin(req);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return null;
    }
  }
  return null;
}

function getOpenAiKey() {
  return (process.env.OPENAI || process.env.OPENAI_API_KEY || '').trim();
}

async function callOpenAi(input, instructions) {
  const apiKey = getOpenAiKey();
  if (!apiKey) {
    return { ok: false, error: 'OPENAI env is not configured on the server.' };
  }

  const model = (process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();
  const messages = [];
  if (instructions) {
    messages.push({ role: 'system', content: instructions });
  }
  messages.push({ role: 'user', content: input });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 800
    })
  });

  const body = await response.json().catch(function () { return null; });
  if (!response.ok) {
    const message = body && body.error && body.error.message
      ? body.error.message
      : 'OpenAI request failed (' + response.status + ').';
    return { ok: false, error: message };
  }

  const text = body && body.choices && body.choices[0] && body.choices[0].message
    ? String(body.choices[0].message.content || '').trim()
    : '';
  if (!text) {
    return { ok: false, error: 'Empty response from OpenAI.' };
  }

  return { ok: true, output_text: text, provider: 'openai', mode: 'chat' };
}

module.exports = async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      ai: true,
      source: 'strategy-site',
      configured: !!getOpenAiKey()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const payload = readBody(req);
  if (!payload) {
    return res.status(400).json({ ok: false, error: 'Invalid JSON body' });
  }

  const input = typeof payload.input === 'string' ? payload.input.trim() : '';
  if (!input) {
    return res.status(400).json({ ok: false, error: "Field 'input' (string) is required." });
  }

  const instructions = typeof payload.instructions === 'string' ? payload.instructions : '';
  const result = await callOpenAi(input, instructions);
  return res.status(result.ok ? 200 : 500).json(result);
};
