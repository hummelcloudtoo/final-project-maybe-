// flexbox-game.js - debug-friendly version
document.addEventListener("DOMContentLoaded", () => {
  console.log("flexbox-game.js loaded — DOM ready");

  // Teams data (keep file names here in the same folder as HTML)
  const TEAMS = [
    { id: 'Red Sox', img: 'boston-red-sox-logo-transparent.png', championships: 9, founded: 1901, followers: 1200000 },
    { id: 'Celtics', img: 'boston-celtics-logo-transparent.png', championships: 17, founded: 1946, followers: 1500000 },
    { id: 'Patriots', img: 'New_England_Patriots_logo.svg.png', championships: 6, founded: 1959, followers: 2000000 },
    { id: 'Bruins', img: 'Boston_Bruins.svg.png', championships: 6, founded: 1924, followers: 800000 }
  ];

  const MODES = [
    { key: 'championships', label: 'Most championships (high → low)', comparator: (a,b)=>b.championships-a.championships, instruction:'Order teams from most championships (left) to least (right).' },
    { key: 'founded', label: 'Date founded (oldest → newest)', comparator: (a,b)=>a.founded-b.founded, instruction:'Order teams from oldest (left) to newest (right).' },
    { key: 'followers', label: 'Most social followers (high → low)', comparator: (a,b)=>b.followers-a.followers, instruction:'Order teams from most social followers (left) to least (right).' }
  ];

  // Elements — abort with console message if missing
  const modeNameEl = document.getElementById('modeName');
  const instructionEl = document.getElementById('instruction');
  const container = document.getElementById('flex-container');
  const checkButton = document.getElementById('checkButton');
  const resetButton = document.getElementById('resetButton');
  const resultEl = document.getElementById('result');

  if (!modeNameEl || !instructionEl || !container || !checkButton || !resetButton || !resultEl) {
    console.error("One or more required DOM elements are missing. Make sure flexbox-game.html includes elements with IDs: modeName, instruction, flex-container, checkButton, resetButton, result.");
    return;
  }

  // Pick random mode
  let mode = MODES[Math.floor(Math.random()*MODES.length)];
  function setMode(m){
    mode = m;
    modeNameEl.textContent = mode.label;
    instructionEl.textContent = mode.instruction;
    console.log("Mode set to:", mode.label);
  }
  setMode(mode);

  // Start with shuffled order
  let currentOrder = shuffleArray(TEAMS.map(t => ({...t})));
  renderCards();

  // Render cards (guarantees visible fallback if image missing)
  function renderCards(){
    container.innerHTML = '';
    currentOrder.forEach(team => {
      const card = document.createElement('div');
      card.className = 'card draggable';
      card.setAttribute('draggable','true');
      card.dataset.team = team.id;

      // img element with error fallback
      const img = document.createElement('img');
      img.src = team.img;
      img.alt = team.id + ' logo';
      img.addEventListener('error', () => {
        // If image fails to load, replace it with a visible placeholder
        console.warn('Image failed to load for', team.img);
        const placeholder = document.createElement('div');
        placeholder.style.width = '100px';
        placeholder.style.height = '60px';
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.background = '#f2f2f2';
        placeholder.style.color = '#222';
        placeholder.style.borderRadius = '6px';
        placeholder.textContent = team.id;
        // swap in placeholder
        img.replaceWith(placeholder);
      });

      const name = document.createElement('div');
      name.className = 'team-name';
      name.textContent = team.id;

      card.appendChild(img);
      card.appendChild(name);

      addDragHandlers(card);
      container.appendChild(card);
    });
    console.log('Rendered', currentOrder.map(c=>c.id));
  }

  // Drag handlers
  let draggingEl = null;
  function addDragHandlers(card){
    card.addEventListener('dragstart', e => {
      draggingEl = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      // small data so dragstart is allowed in some browsers
      try { e.dataTransfer.setData('text/plain', card.dataset.team); } catch(e){ /* ignore */ }
    });
    card.addEventListener('dragend', () => {
      if (draggingEl) draggingEl.classList.remove('dragging');
      draggingEl = null;
    });
  }

  // dragover to reposition element
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterEl = getDragAfterElement(container, e.clientX);
    const dragging = document.querySelector('.dragging');
    if (!dragging) return;
    if (afterEl == null) container.appendChild(dragging);
    else container.insertBefore(dragging, afterEl);
  });

  function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
    let closest = { offset: Number.NEGATIVE_INFINITY, element: null };
    for (const el of draggableElements) {
      const box = el.getBoundingClientRect();
      const offset = x - (box.left + box.width / 2);
      if (offset < 0 && offset > closest.offset) closest = { offset, element: el };
    }
    return closest.element;
  }

  // Check order
  checkButton.addEventListener('click', () => {
    const domOrder = [...container.querySelectorAll('.card')].map(c => c.dataset.team);
    const correct = [...TEAMS].sort(mode.comparator).map(t => t.id);
    console.log('DOM order:', domOrder);
    console.log('Expected order:', correct);
    if (arraysEqual(domOrder, correct)) {
      resultEl.style.color = 'green';
      resultEl.textContent = 'Perfect! You ordered them correctly 🎉';
    } else {
      resultEl.style.color = 'crimson';
      resultEl.textContent = 'Not quite — try again. Expected order: ' + correct.join(' → ');
    }
  });

  // Reset (reshuffle + maybe change mode)
  resetButton.addEventListener('click', () => {
    if (Math.random() < 0.7) setMode(MODES[Math.floor(Math.random()*MODES.length)]);
    currentOrder = shuffleArray(TEAMS.map(t => ({...t})));
    renderCards();
    resultEl.textContent = '';
  });

  // Utilities
  function shuffleArray(arr){
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function arraysEqual(a,b){
    if (a.length !== b.length) return false;
    for (let i=0;i<a.length;i++) if (a[i] !== b[i]) return false;
    return true;
  }

}); // DOMContentLoaded end
