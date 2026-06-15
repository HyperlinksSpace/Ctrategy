/**
 * AI CORE — general chat via Hyperlinks Space AI API (or OpenAI-compatible proxy).
 */
(function () {
  'use strict';

  var history = [];
  var activeController = null;

  function resolveEndpoint(config) {
    if (config.preferSameOrigin && typeof window !== 'undefined') {
      var host = window.location.hostname || '';
      if (host.indexOf('hyperlinks.space') !== -1 || host === 'localhost' || host === '127.0.0.1') {
        return window.location.origin.replace(/\/$/, '') + '/api/ai';
      }
    }
    return config.endpoint || '';
  }

  function getConfig() {
    var settings = window.HLS_SETTINGS && window.HLS_SETTINGS.aiChat;
    if (!settings) return {};
    var config = Object.assign({}, settings);
    config.endpoint = resolveEndpoint(config);
    return config;
  }

  function trimHistory(max) {
    var limit = max || 12;
    if (history.length > limit) {
      history = history.slice(history.length - limit);
    }
  }

  function formatHistoryBlock() {
    if (!history.length) return '';
    var lines = history.map(function (entry) {
      var role = entry.role === 'assistant' ? 'assistant' : 'user';
      return role + ': ' + entry.content;
    });
    return 'Previous conversation:\n' + lines.join('\n') + '\n\nCurrent message:\n';
  }

  function getInstructions(lang) {
    var config = getConfig();
    var map = config.instructions || {};
    return map[lang] || map.en || '';
  }

  function parseHspResponse(res, body) {
    if (!res.ok) {
      return {
        ok: false,
        error: (body && body.error) || ('Request failed (' + res.status + ').')
      };
    }
    if (!body || body.ok === false) {
      return { ok: false, error: (body && body.error) || 'AI service returned an error.' };
    }
    var text = (body.output_text || body.text || body.message || '').trim();
    if (!text) {
      return { ok: false, error: 'Empty response from AI service.' };
    }
    return { ok: true, text: text };
  }

  function isAbortError(err) {
    return !!(err && (err.name === 'AbortError' || err.code === 20));
  }

  function askHsp(input, lang, signal) {
    var config = getConfig();
    var payload = {
      input: formatHistoryBlock() + 'user: ' + input,
      mode: config.mode || 'chat',
      context: {
        source: 'strategy-site',
        locale: lang,
        surface: 'ai-core'
      }
    };

    var instructions = getInstructions(lang);
    if (instructions) payload.instructions = instructions;

    return fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: signal
    })
      .then(function (res) {
        return res.text().then(function (raw) {
          var body;
          try {
            body = raw ? JSON.parse(raw) : null;
          } catch (e) {
            return { ok: false, error: 'invalid_json' };
          }
          return parseHspResponse(res, body);
        });
      })
      .catch(function (err) {
        if (isAbortError(err)) {
          return { ok: false, error: 'aborted' };
        }
        return { ok: false, error: 'network' };
      });
  }

  function askOpenAi(input, lang, signal) {
    var config = getConfig();
    var messages = [];
    var instructions = getInstructions(lang);
    if (instructions) {
      messages.push({ role: 'system', content: instructions });
    }
    history.forEach(function (entry) {
      messages.push({ role: entry.role, content: entry.content });
    });
    messages.push({ role: 'user', content: input });

    var headers = { 'Content-Type': 'application/json' };
    if (config.apiKey) {
      headers.Authorization = 'Bearer ' + config.apiKey;
    }

    return fetch(config.endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      }),
      signal: signal
    })
      .then(function (res) {
        return res.json().then(function (body) {
          if (!res.ok) {
            return {
              ok: false,
              error: (body && body.error && body.error.message) || ('Request failed (' + res.status + ').')
            };
          }
          var text = body.choices && body.choices[0] && body.choices[0].message
            ? String(body.choices[0].message.content || '').trim()
            : '';
          if (!text) return { ok: false, error: 'Empty response from AI service.' };
          return { ok: true, text: text };
        });
      })
      .catch(function (err) {
        if (isAbortError(err)) {
          return { ok: false, error: 'aborted' };
        }
        return { ok: false, error: 'network' };
      });
  }

  function ask(input, lang) {
    var config = getConfig();
    var text = String(input || '').trim();
    if (!text) {
      return Promise.resolve({ ok: false, error: 'empty' });
    }
    if (config.enabled === false || !config.endpoint) {
      return Promise.resolve({ ok: false, error: 'disabled' });
    }

    if (activeController) {
      activeController.abort();
    }
    activeController = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var signal = activeController ? activeController.signal : undefined;

    var request = config.format === 'openai'
      ? askOpenAi(text, lang, signal)
      : askHsp(text, lang, signal);

    return request.then(function (result) {
      activeController = null;
      if (result.ok && result.text) {
        history.push({ role: 'user', content: text });
        history.push({ role: 'assistant', content: result.text });
        trimHistory(config.maxHistory || 12);
      }
      return result;
    });
  }

  function cancel() {
    if (activeController) {
      activeController.abort();
      activeController = null;
    }
  }

  function clearHistory() {
    history = [];
  }

  window.HLS = window.HLS || {};
  window.HLS.aiChat = {
    ask: ask,
    cancel: cancel,
    clearHistory: clearHistory,
    isEnabled: function () {
      var config = getConfig();
      return config.enabled !== false && !!config.endpoint;
    }
  };
})();
