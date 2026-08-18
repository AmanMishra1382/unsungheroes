const API = window.API_BASE_URL;

function showStatus(message) {
  const el = document.getElementById('statusMsg');
  if (!el) return;
  el.hidden = false;
  el.textContent = message;
}

function hideStatus() {
  const el = document.getElementById('statusMsg');
  if (el) el.hidden = true;
}

async function apiGet(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json();
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// Renders the shared correction dialog. Call once per page that includes it.
function wireCorrectionDialog(getSoldierId) {
  const dialog = document.getElementById('correctionDialog');
  if (!dialog) return;

  const openDialog = (name) => {
    const forNameEl = document.getElementById('correctionForName');
    if (forNameEl) forNameEl.textContent = name || '';
    document.getElementById('correctionMessage').value = '';
    document.getElementById('correctionName').value = '';
    document.getElementById('correctionResult').hidden = true;
    dialog.showModal();
  };

  document.getElementById('cancelCorrection').addEventListener('click', () => dialog.close());

  document.getElementById('correctionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = document.getElementById('correctionMessage').value;
    const submittedBy = document.getElementById('correctionName').value;
    const resultEl = document.getElementById('correctionResult');

    try {
      const res = await fetch(`${API}/api/soldiers/${getSoldierId()}/report-correction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, submittedBy })
      });
      const data = await res.json();
      resultEl.hidden = false;
      resultEl.textContent = res.ok ? data.message : (data.error || 'Something went wrong.');
      if (res.ok) setTimeout(() => dialog.close(), 1500);
    } catch (err) {
      resultEl.hidden = false;
      resultEl.textContent = 'Could not reach the server. Please try again later.';
    }
  });

  return openDialog;
}

function soldierCardHTML(s) {
  return `
    <article class="card">
      <a class="rank-name" href="soldier.html?id=${s.id}">${s.name}</a>
      <p class="regiment">${s.regiment}</p>
      <div class="badge-row">
        <span class="badge">${s.award_name || 'Unlisted award'}</span>
        <span class="badge status">${s.status === 'martyr' ? 'Martyr' : 'Awardee'}</span>
      </div>
      <p class="citation">${s.citation}</p>
      <a class="read-more" href="soldier.html?id=${s.id}">Read full story →</a>
    </article>
  `;
}
