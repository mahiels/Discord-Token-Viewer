const api = typeof browser !== 'undefined' ? browser : chrome;

document.getElementById('getTokenBtn').addEventListener('click', async () => {
  const statusEl = document.getElementById('status');
  const tokenInput = document.getElementById('tokenInput');

  const [tab] = await api.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url || !tab.url.includes('discord.com')) {
    statusEl.innerText = 'Please open Discord in this tab first!';
    statusEl.style.color = '#ed4245';
    return;
  }

  try {
    const results = await api.scripting.executeScript({
      target: { tabId: tab.id },
      world: 'MAIN',
      func: () => {
        try {
          const local = window.localStorage.getItem('token');
          if (local) return local.replace(/^\"|\"$/g, '');
        } catch (e) {}

        try {
          const chunkKey = Object.keys(window).find(k => k.startsWith('webpackChunk'));
          const chunk = chunkKey ? window[chunkKey] : null;
          if (!chunk) return null;

          let foundToken = null;

          chunk.push([
            [Symbol()],
            {},
            (req) => {
              if (!req || !req.c) return;

              for (const id in req.c) {
                const mod = req.c[id];
                if (!mod || !mod.exports) continue;

                const exp = mod.exports;

                try {
                  if (typeof exp?.default?.getToken === 'function') {
                    const t = exp.default.getToken();
                    if (t && typeof t === 'string') { foundToken = t; return; }
                  }
                } catch (e) {}

                try {
                  if (typeof exp?.getToken === 'function') {
                    const t = exp.getToken();
                    if (t && typeof t === 'string') { foundToken = t; return; }
                  }
                } catch (e) {}

                try {
                  for (const key of Object.keys(exp)) {
                    if (exp[key] && typeof exp[key].getToken === 'function') {
                      const t = exp[key].getToken();
                      if (t && typeof t === 'string') { foundToken = t; return; }
                    }
                  }
                } catch (e) {}
              }
            }
          ]);

          if (foundToken) return foundToken;
        } catch (e) {}

        try {
          for (const frame of Array.from(document.querySelectorAll('iframe'))) {
            try {
              const fw = frame.contentWindow;
              const local = fw?.localStorage?.getItem('token');
              if (local) return local.replace(/^\"|\"$/g, '');
            } catch (e) {}
          }
        } catch (e) {}

        return null;
      }
    });

    const foundToken = results?.[0]?.result;

    if (foundToken) {
      tokenInput.value = foundToken;
      statusEl.innerText = 'Token retrieved successfully!';
      statusEl.style.color = '#57f287';
    } else {
      statusEl.innerText = 'Token not found. Make sure you are logged in to Discord.';
      statusEl.style.color = '#ed4245';
    }
  } catch (err) {
    statusEl.innerText = 'Error: ' + err.message;
    statusEl.style.color = '#ed4245';
  }
});

document.getElementById('copyBtn').addEventListener('click', async () => {
  const tokenInput = document.getElementById('tokenInput');
  const statusEl = document.getElementById('status');

  if (!tokenInput.value) {
    statusEl.innerText = 'Get the token first before copying.';
    statusEl.style.color = '#b5bac1';
    return;
  }

  try {
    await navigator.clipboard.writeText(tokenInput.value);
    statusEl.innerText = 'Copied to clipboard!';
    statusEl.style.color = '#57f287';
  } catch (err) {
    try {
      tokenInput.type = 'text';
      tokenInput.select();
      document.execCommand('copy');
      tokenInput.type = 'password';
      statusEl.innerText = 'Copied to clipboard!';
      statusEl.style.color = '#57f287';
    } catch (fallbackErr) {
      statusEl.innerText = 'Copy failed: ' + fallbackErr.message;
      statusEl.style.color = '#ed4245';
    }
  }
});
