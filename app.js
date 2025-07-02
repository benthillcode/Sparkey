document.getElementById('randomBtn').addEventListener('click', () => {
  const colors = [chroma.random(), chroma.random(), chroma.random()];
  applyColors(colors);
});

document.getElementById('promptBtn').addEventListener('click', async () => {
  const prompt = document.getElementById('promptInput').value.trim();
  if (!prompt) return alert('Please enter a prompt.');
  try {
    const res = await fetch('/api/palette', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    applyColors(data.colors);
  } catch (e) {
    console.error(e);
    alert('Error fetching palette.');
  }
});

document.getElementById('saveBtn').addEventListener('click', async () => {
  const bodyColor = document.getElementById('body').getAttribute('fill');
  const btnColor = document.getElementById('button').getAttribute('fill');
  const flameColor = document.getElementById('flame').getAttribute('fill');
  const prompt = document.getElementById('promptInput').value.trim();
  try {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colors: [bodyColor, btnColor, flameColor], prompt })
    });
    const { entry } = await res.json();
    addSavedEntry(entry);
  } catch (e) {
    console.error(e);
    alert('Error saving design.');
  }
});

function applyColors(colors) {
  document.getElementById('body').setAttribute('fill', colors[0]);
  document.getElementById('button').setAttribute('fill', colors[1]);
  document.getElementById('flame').setAttribute('fill', colors[2]);
}

async function loadSaves() {
  try {
    const res = await fetch('/api/saves');
    const saves = await res.json();
    saves.forEach(addSavedEntry);
  } catch (e) {
    console.error(e);
  }
}

function addSavedEntry(entry) {
  const li = document.createElement('li');
  li.textContent = `${entry.prompt || 'Random'}: ${entry.colors.join(', ')} (Saved @ ${new Date(entry.timestamp).toLocaleString()})`;
  document.getElementById('savedList').appendChild(li);
}

// Initialize saved list
loadSaves();
