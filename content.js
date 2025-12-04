// Estado Inicial
const defaultState = {
  fontSizePercentage: 100,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  colorBlindness: 'none', // none, protanopia, deuteranopia, tritanopia
  showReadingGuide: false,
  toolbarOpen: false
};

let currentState = { ...defaultState };

// Definições dos Filtros SVG (Matrizes de Cores)
const SVG_DEFINITIONS = `
<svg id="acc-svg-filters" aria-hidden="true">
  <defs>
    <filter id="acc-protanopia">
      <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
    </filter>
    <filter id="acc-deuteranopia">
      <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
    </filter>
    <filter id="acc-tritanopia">
      <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
    </filter>
  </defs>
</svg>
`;

// Template HTML da Barra
const TOOLBAR_HTML = `
<div id="acc-toolbar-container" class="acc-closed">
  <div class="acc-header">
    <span class="acc-header-title">Acessibilidade</span>
    <button id="acc-toggle-btn" class="acc-toggle-btn" aria-label="Abrir/Fechar menu de acessibilidade">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v8M8 12h8"></path>
      </svg>
    </button>
  </div>
  
  <div class="acc-content">
    
    <!-- Tamanho da Fonte -->
    <div class="acc-group">
      <div class="acc-group-title">Tamanho do Texto</div>
      <div class="acc-grid acc-grid-3">
        <button class="acc-btn" id="acc-font-dec">A-</button>
        <button class="acc-btn" id="acc-font-reset">Pad.</button>
        <button class="acc-btn" id="acc-font-inc">A+</button>
      </div>
    </div>

    <!-- Visual -->
    <div class="acc-group">
      <div class="acc-group-title">Visual</div>
      <div class="acc-grid">
        <button class="acc-btn" id="acc-contrast-toggle">Alto Contraste</button>
        <button class="acc-btn" id="acc-grayscale-toggle">P&B</button>
      </div>
      <button class="acc-btn acc-btn-full" id="acc-links-toggle">Destacar Links</button>
    </div>

    <!-- Daltonismo -->
    <div class="acc-group">
      <div class="acc-group-title">Daltonismo</div>
      <div class="acc-grid">
        <button class="acc-btn" data-cb="protanopia">Prot</button>
        <button class="acc-btn" data-cb="deuteranopia">Deut</button>
        <button class="acc-btn" data-cb="tritanopia">Trit</button>
        <button class="acc-btn" data-cb="none">Off</button>
      </div>
    </div>

    <!-- Ferramentas -->
    <div class="acc-group">
      <div class="acc-group-title">Ferramentas</div>
      <button class="acc-btn acc-btn-full" id="acc-guide-toggle">Linha Guia de Leitura</button>
    </div>

  </div>
</div>
`;

// Função de Inicialização
function init() {
  // Injeta SVG Filters
  document.body.insertAdjacentHTML('beforeend', SVG_DEFINITIONS);

  // Injeta Barra
  const wrapper = document.createElement('div');
  wrapper.innerHTML = TOOLBAR_HTML;
  document.body.appendChild(wrapper);

  // Carrega configurações salvas
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.get(['accSettings'], (result) => {
      if (result.accSettings) {
        currentState = { ...currentState, ...result.accSettings };
        applyAllSettings();
      }
    });
  } else {
    // Fallback para desenvolvimento local sem extensão
    applyAllSettings();
  }

  setupEventListeners();
}

function setupEventListeners() {
  // Toggle Open/Close
  document.getElementById('acc-toggle-btn').addEventListener('click', () => {
    const container = document.getElementById('acc-toolbar-container');
    container.classList.toggle('acc-closed');
    currentState.toolbarOpen = !container.classList.contains('acc-closed');
    saveState();
  });

  // Fonte
  document.getElementById('acc-font-dec').addEventListener('click', () => updateFont(-10));
  document.getElementById('acc-font-inc').addEventListener('click', () => updateFont(10));
  document.getElementById('acc-font-reset').addEventListener('click', () => {
    currentState.fontSizePercentage = 100;
    applyFont();
    saveState();
  });

  // Visual
  document.getElementById('acc-contrast-toggle').addEventListener('click', () => toggleSetting('highContrast'));
  document.getElementById('acc-grayscale-toggle').addEventListener('click', () => toggleSetting('grayscale'));
  document.getElementById('acc-links-toggle').addEventListener('click', () => toggleSetting('highlightLinks'));

  // Daltonismo
  const cbButtons = document.querySelectorAll('[data-cb]');
  cbButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentState.colorBlindness = e.target.getAttribute('data-cb');
      applyColorBlindness();
      saveState();
      updateButtonsUI();
    });
  });

  // Guia
  document.getElementById('acc-guide-toggle').addEventListener('click', () => toggleSetting('showReadingGuide'));
}

function updateFont(delta) {
  let newSize = currentState.fontSizePercentage + delta;
  if (newSize < 50) newSize = 50;
  if (newSize > 200) newSize = 200;
  currentState.fontSizePercentage = newSize;
  applyFont();
  saveState();
}

function toggleSetting(key) {
  currentState[key] = !currentState[key];
  applyAllSettings();
  saveState();
}

function applyAllSettings() {
  applyFont();
  applyVisuals();
  applyColorBlindness();
  applyReadingGuide();
  updateButtonsUI();
}

function applyFont() {
  // Define o font-size no HTML para afetar rem/em
  document.documentElement.style.fontSize = `${currentState.fontSizePercentage}%`;
}

function applyVisuals() {
  const html = document.documentElement;
  
  // Alto Contraste
  if (currentState.highContrast) html.classList.add('acc-high-contrast');
  else html.classList.remove('acc-high-contrast');

  // Grayscale
  if (currentState.grayscale) html.classList.add('acc-grayscale');
  else html.classList.remove('acc-grayscale');

  // Links
  if (currentState.highlightLinks) html.classList.add('acc-highlight-links');
  else html.classList.remove('acc-highlight-links');
}

function applyColorBlindness() {
  const html = document.documentElement;
  // Remove classes anteriores
  html.classList.remove('acc-protanopia', 'acc-deuteranopia', 'acc-tritanopia');
  
  if (currentState.colorBlindness !== 'none') {
    html.classList.add(`acc-${currentState.colorBlindness}`);
  }
}

function applyReadingGuide() {
  let guide = document.getElementById('acc-reading-guide');
  
  if (currentState.showReadingGuide) {
    if (!guide) {
      guide = document.createElement('div');
      guide.id = 'acc-reading-guide';
      guide.innerHTML = '<div id="acc-reading-guide-handle">=</div>';
      document.body.appendChild(guide);
      
      // Lógica de arrastar
      const handle = document.getElementById('acc-reading-guide-handle');
      let isDragging = false;

      handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (isDragging && guide) {
          guide.style.top = `${e.clientY}px`;
        }
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }
    guide.style.display = 'block';
  } else {
    if (guide) guide.style.display = 'none';
  }
}

function updateButtonsUI() {
  // Utilitário para marcar botões como ativos
  const setBtnState = (id, active) => {
    const el = document.getElementById(id);
    if(el) {
      if(active) el.classList.add('active');
      else el.classList.remove('active');
    }
  };

  setBtnState('acc-contrast-toggle', currentState.highContrast);
  setBtnState('acc-grayscale-toggle', currentState.grayscale);
  setBtnState('acc-links-toggle', currentState.highlightLinks);
  setBtnState('acc-guide-toggle', currentState.showReadingGuide);

  // Daltonismo
  document.querySelectorAll('[data-cb]').forEach(btn => {
    if (btn.getAttribute('data-cb') === currentState.colorBlindness) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function saveState() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.set({ accSettings: currentState });
  }
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}