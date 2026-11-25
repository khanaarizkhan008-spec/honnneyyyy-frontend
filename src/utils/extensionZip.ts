import JSZip from 'jszip';

const MANIFEST_JSON = {
  manifest_version: 3,
  name: 'Honnnneyyyy — Your Protective Bestie',
  version: '1.0.0',
  description:
    'Taps you quietly on the shoulder with a Honnnneyyyy alert when someone on WhatsApp Web, Instagram DMs, or Telegram acts a little too sweet.',
  permissions: ['activeTab', 'storage'],
  host_permissions: [
    'https://web.whatsapp.com/*',
    'https://www.instagram.com/*',
    'https://web.telegram.org/*',
  ],
  web_accessible_resources: [
    {
      resources: ['honnnneyyyy-alert.mp3'],
      matches: [
        'https://web.whatsapp.com/*',
        'https://www.instagram.com/*',
        'https://web.telegram.org/*',
      ],
    },
  ],
  action: {
    default_popup: 'popup.html',
    default_title: 'Honnnneyyyy',
  },
  content_scripts: [
    {
      matches: [
        'https://web.whatsapp.com/*',
        'https://www.instagram.com/*',
        'https://web.telegram.org/*',
      ],
      js: ['content.js'],
      run_at: 'document_idle',
    },
  ],
};

const CONTENT_JS = `(() => {
  const SUGAR_TRIGGERS = [
    { rx: /telegram|move off|off this app/i, label: 'Off-app pivot' },
    { rx: /keep us secret|don'?t tell/i, label: 'Secrecy request' },
    { rx: /soulmate|dream person|never felt/i, label: 'Love-bombing rush' },
    { rx: /crypto|usdt|arbitrage|18% weekly|trading/i, label: 'Crypto / trading hook' },
    { rx: /private photo|video call|30 seconds|if you trust me/i, label: 'Private photo pressure' },
    { rx: /wrong number|assistant/i, label: 'Scripted opener' }
  ];

  let badgeEl = null;
  let lastAlertKey = '';
  let soundMuted = false;

  function playAlertAudio() {
    if (soundMuted) return;
    try {
      const audio = new Audio(chrome.runtime.getURL('honnnneyyyy-alert.mp3'));
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch {}
  }

  function ensureBadge(labels) {
    const key = labels.join('|');
    if (key === lastAlertKey && badgeEl) return;
    lastAlertKey = key;

    if (!badgeEl) {
      badgeEl = document.createElement('div');
      badgeEl.id = 'honnnneyyyy-shoulder-tap';
      Object.assign(badgeEl.style, {
        position: 'fixed',
        bottom: '22px',
        right: '22px',
        zIndex: '2147483647',
        background: '#FAF3E8',
        color: '#1A1110',
        border: '2px solid #D91E36',
        borderRadius: '18px',
        padding: '14px 16px',
        maxWidth: '300px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '13px',
        lineHeight: '1.45',
        boxShadow: '4px 4px 0px #1A1110'
      });
      document.body.appendChild(badgeEl);
    }

    badgeEl.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;">' +
        '<span style="font-weight:800;color:#D91E36;font-style:italic;font-size:15px;">Honnnneyyyy!</span>' +
        '<button id="hny-mute-btn" style="border:1px solid #1A1110;background:#F7C5CC;color:#1A1110;border-radius:999px;padding:2px 8px;font-size:11px;cursor:pointer;">' +
          (soundMuted ? 'Unmute' : 'Mute') +
        '</button>' +
      '</div>' +
      '<div style="margin-bottom:8px;">Bestie, pause for a second. Spotted: <strong>' + labels.join(', ') + '</strong>.</div>' +
      '<button id="hny-open-btn" style="width:100%;background:#1A1110;color:#FAF3E8;border:none;border-radius:10px;padding:8px 10px;font-weight:700;font-size:12px;cursor:pointer;">Check Receipts Together</button>';

    const muteBtn = badgeEl.querySelector('#hny-mute-btn');
    if (muteBtn) {
      muteBtn.onclick = (e) => {
        e.stopPropagation();
        soundMuted = !soundMuted;
        muteBtn.textContent = soundMuted ? 'Unmute' : 'Mute';
      };
    }

    const openBtn = badgeEl.querySelector('#hny-open-btn');
    if (openBtn) {
      openBtn.onclick = () => {
        window.open('http://localhost:5173/check', '_blank');
      };
    }

    playAlertAudio();
  }

  function scanVisibleChat() {
    const text = document.body?.innerText || '';
    const hits = SUGAR_TRIGGERS.filter((t) => t.rx.test(text)).map((t) => t.label);
    if (hits.length >= 2) {
      ensureBadge(hits.slice(0, 3));
    }
  }

  const observer = new MutationObserver(() => {
    scanVisibleChat();
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
  setInterval(scanVisibleChat, 3500);
})();
`;

const POPUP_HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        margin: 0;
        width: 310px;
        background: #120B0A;
        color: #FAF3E8;
        font-family: system-ui, -apple-system, sans-serif;
        padding: 16px;
      }
      .card {
        background: #FAF3E8;
        color: #1A1110;
        border-radius: 14px;
        padding: 14px;
        border: 2px solid #D91E36;
      }
      h1 {
        margin: 0 0 6px;
        font-size: 20px;
        color: #D91E36;
        font-style: italic;
      }
      p {
        margin: 0 0 10px;
        font-size: 13px;
        line-height: 1.45;
      }
      .note {
        font-size: 11px;
        color: #6E5A56;
        margin-bottom: 12px;
      }
      a {
        display: block;
        text-align: center;
        background: #D91E36;
        color: #FAF3E8;
        text-decoration: none;
        padding: 10px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Honnnneyyyy</h1>
      <p>Watching your back quietly on WhatsApp Web, Instagram DMs, and Telegram Web with instant audio + shoulder-tap alerts.</p>
      <p class="note">v1.0: Live pattern &amp; audio alerts. Upcoming v1.1: Full on-page Gemini AI rewriting.</p>
      <a href="http://localhost:5173/check" target="_blank">Open Full Receipt Checker</a>
    </div>
  </body>
</html>
`;

export async function downloadChromeExtensionZip(): Promise<void> {
  const zip = new JSZip();
  zip.file('manifest.json', JSON.stringify(MANIFEST_JSON, null, 2));
  zip.file('content.js', CONTENT_JS);
  zip.file('popup.html', POPUP_HTML);

  try {
    const audioRes = await fetch('/honnnneyyyy-alert.mp3');
    if (audioRes.ok) {
      const audioBlob = await audioRes.blob();
      zip.file('honnnneyyyy-alert.mp3', audioBlob);
    }
  } catch {
    // Continue even if audio fetch fails
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'honnnneyyyy-chrome-extension.zip';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
