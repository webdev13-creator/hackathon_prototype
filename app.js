// Krṣiveda (कृषिवेद) Precision Agriculture Application Engine
// Complete interactive prototype matching Hackathon PDF & UI Mockups

let currentTab = 'dashboard';
let currentLanguage = 'en'; // 'en' or 'hi'
let currentTheme = 'nature';
let currentRole = 'farmer'; // 'farmer' or 'extension'
let currentZoneLayer = 'grid'; // 'grid', 'ndvi', 'radar', 'thermal'
let selectedZoneId = 'B';
let fertilizerViewMode = 'buy'; // 'buy' or 'sell'
let cart = [];
let isThermalSubscribed = false;
let isSpeaking = false;
let soilChartInstance = null;
let moistureChartInstance = null;
let leafletMapInstance = null;

// Safe Icon Renderer with fallback
function safeRenderIcons() {
  if (typeof lucide !== 'undefined' && lucide && typeof lucide.createIcons === 'function') {
    try {
      lucide.createIcons();
    } catch (e) {
      console.warn('Lucide icon issue:', e);
    }
  }
}

// Global Tab Switching function (exposed on window)
function switchTab(tabId) {
  if (!tabId) return;
  currentTab = tabId;

  // Hide all tab contents
  document.querySelectorAll('.app-tab-content').forEach(tab => {
    tab.classList.add('hidden');
  });

  // Reveal target tab
  const activeTabEl = document.getElementById(`tab-${tabId}`);
  if (activeTabEl) {
    activeTabEl.classList.remove('hidden');
  } else {
    console.warn(`Tab #tab-${tabId} not found`);
  }

  // Update nav link styles (Desktop + Mobile)
  document.querySelectorAll('[data-tab-target]').forEach(btn => {
    const target = btn.getAttribute('data-tab-target');
    if (target === tabId) {
      btn.classList.add('border-b-2', 'border-emerald-700', 'text-emerald-800', 'font-bold', 'bg-emerald-50/50');
      btn.classList.remove('text-slate-600', 'bg-slate-100');
    } else {
      btn.classList.remove('border-b-2', 'border-emerald-700', 'text-emerald-800', 'font-bold', 'bg-emerald-50/50');
      btn.classList.add('text-slate-600');
    }
  });

  // Scroll smoothly to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Post tab actions
  setTimeout(() => {
    safeRenderIcons();
    if (tabId === 'satellite' && !leafletMapInstance) {
      initSatelliteLeafletMap();
    }
  }, 100);
}
window.switchTab = switchTab;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // 1. Setup event listeners first so user clicks ALWAYS work
  try { setupEventListeners(); } catch (e) { console.warn('Listeners setup:', e); }

  // 2. Safely render each dashboard component
  try { updateAuthUI(); } catch (e) { console.warn(e); }
  try { renderWeatherForecast(); } catch (e) { console.warn(e); }
  try { renderCropRecommendations(); } catch (e) { console.warn(e); }
  try { renderZoneGrid(); } catch (e) { console.warn(e); }
  try { renderFertilizers('all'); } catch (e) { console.warn(e); }
  try { renderFarmerSellerStore(); } catch (e) { console.warn(e); }
  try { renderSoilReport(); } catch (e) { console.warn(e); }
  try { renderSDGSection(); } catch (e) { console.warn(e); }
  try { initMoistureTrendChart(); } catch (e) { console.warn(e); }
  try { initSoilTrendChart(); } catch (e) { console.warn(e); }
  try { updateSelectedZoneDetails('B'); } catch (e) { console.warn(e); }
  try { updateTranslations(); } catch (e) { console.warn(e); }
  try { updateCartBadge(); } catch (e) { console.warn(e); }
  safeRenderIcons();
}

// Event Listeners
function setupEventListeners() {
  // Navigation Tabs with event delegation and direct click
  document.querySelectorAll('[data-tab-target]').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-tab-target');
      switchTab(target);
    };
  });

  // Category filter for fertilizers
  document.querySelectorAll('[data-category]').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      document.querySelectorAll('[data-category]').forEach(b => {
        b.classList.remove('bg-emerald-700', 'text-white');
        b.classList.add('bg-emerald-100', 'text-emerald-900', 'hover:bg-emerald-200');
      });
      btn.classList.remove('bg-emerald-100', 'text-emerald-900', 'hover:bg-emerald-200');
      btn.classList.add('bg-emerald-700', 'text-white');
      const cat = btn.getAttribute('data-category');
      renderFertilizers(cat);
    };
  });

  // Fertilizer Search
  const searchInput = document.getElementById('fertilizer-search');
  if (searchInput) {
    searchInput.oninput = (e) => {
      const term = e.target.value.toLowerCase();
      renderFertilizers('all', term);
    };
  }

  // Voice Advisory Button
  const voiceBtn = document.getElementById('btn-play-voice');
  if (voiceBtn) {
    voiceBtn.onclick = toggleVoiceAdvisory;
  }
}

// Language Toggle
function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
  const langToggleBtn = document.getElementById('lang-toggle-text');
  if (langToggleBtn) {
    langToggleBtn.textContent = currentLanguage === 'en' ? 'हिंदी' : 'English';
  }
  updateTranslations();
  renderZoneGrid();
  updateSelectedZoneDetails(selectedZoneId);
  renderCropRecommendations();
  renderFertilizers('all');
  safeRenderIcons();
}

function updateTranslations() {
  document.querySelectorAll('[data-en]').forEach(el => {
    if (currentLanguage === 'hi' && el.getAttribute('data-hi')) {
      el.textContent = el.getAttribute('data-hi');
    } else if (currentLanguage === 'en' && el.getAttribute('data-en')) {
      el.textContent = el.getAttribute('data-en');
    }
  });
}

// Theme Toggle
function toggleTheme() {
  currentTheme = currentTheme === 'nature' ? 'satellite' : 'nature';
  if (currentTheme === 'satellite') {
    document.body.classList.add('satellite-theme');
    document.getElementById('theme-icon').setAttribute('data-lucide', 'sun');
  } else {
    document.body.classList.remove('satellite-theme');
    document.getElementById('theme-icon').setAttribute('data-lucide', 'moon');
  }
  safeRenderIcons();
}

// Role Switcher (Farmer vs Extension Worker)
function toggleRole() {
  currentRole = currentRole === 'farmer' ? 'extension' : 'farmer';
  const badge = document.getElementById('user-role-badge');
  const name = document.getElementById('user-profile-name');
  
  if (currentRole === 'extension') {
    badge.textContent = 'KVK Agronomist';
    badge.className = 'text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full';
    name.textContent = 'Dr. Ananya Sharma';
    showToast('Switched to Extension Worker / Agronomist View: Batch analytics & soil sampling dispatch enabled.');
  } else {
    badge.textContent = 'Farmer';
    badge.className = 'text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full';
    name.textContent = APP_DATA.farmerProfile.name;
    showToast('Switched to Farmer View: Simplified pictorial guidance for Plot 12.');
  }
}

// 7-Day Forecast Rendering (Image 1)
function renderWeatherForecast() {
  const container = document.getElementById('forecast-container');
  if (!container) return;

  container.innerHTML = APP_DATA.weather.forecast.map(item => `
    <div class="bg-white/80 p-3 rounded-xl border border-slate-100 shadow-sm text-center flex flex-col items-center hover:shadow-md transition">
      <span class="text-xs font-semibold text-slate-500">${currentLanguage === 'hi' ? item.dayHi : item.day}</span>
      <span class="text-xs text-slate-400 mb-1">${item.date}</span>
      <div class="my-2 p-2 bg-emerald-50 rounded-full text-emerald-700">
        <i data-lucide="${item.icon}" class="w-6 h-6"></i>
      </div>
      <span class="text-sm font-bold text-slate-800">${item.temp}</span>
      <span class="text-xs text-slate-600 mt-1">${currentLanguage === 'hi' ? item.conditionHi : item.condition}</span>
      <span class="text-[10px] mt-1 font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">💧 ${item.rain}</span>
    </div>
  `).join('');
}

// Crop Recommendations (Image 1)
function renderCropRecommendations() {
  const container = document.getElementById('crop-recommendations-container');
  if (!container) return;

  container.innerHTML = APP_DATA.cropRecommendations.map(crop => `
    <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition">
      <div>
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <img src="${crop.img}" alt="${crop.name}" class="w-12 h-12 rounded-xl object-cover shadow-sm">
            <div>
              <h4 class="font-bold text-slate-900 text-base">${crop.name}</h4>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${crop.badge === 'Recommended' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}">
                ${currentLanguage === 'hi' ? crop.badgeHi : crop.badge}
              </span>
            </div>
          </div>
          <span class="text-lg font-extrabold text-emerald-700">${crop.suitability}%</span>
        </div>

        <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3">
          <div class="bg-emerald-600 h-full rounded-full" style="width: ${crop.suitability}%"></div>
        </div>

        <div class="space-y-2 text-xs text-slate-600">
          <div class="flex items-center gap-2">
            <i data-lucide="droplet" class="w-4 h-4 text-sky-500"></i>
            <span><strong>Water / सिंचाई:</strong> ${currentLanguage === 'hi' ? crop.waterHi : crop.water}</span>
          </div>
          <div class="flex items-center gap-2">
            <i data-lucide="package" class="w-4 h-4 text-amber-600"></i>
            <span><strong>Khad / खाद:</strong> ${currentLanguage === 'hi' ? crop.khadHi : crop.khad}</span>
          </div>
        </div>
      </div>
      <p class="text-[11px] text-slate-500 italic mt-3 pt-2 border-t border-slate-100">${crop.advice}</p>
    </div>
  `).join('');
}

// Field Zone Grid (Slide 9 & Image 4)
function renderZoneGrid() {
  const container = document.getElementById('field-zones-grid');
  if (!container) return;

  const colorStyles = {
    emerald: 'bg-emerald-700 text-white border-emerald-800',
    blue: 'bg-sky-600 text-white border-sky-700',
    amber: 'bg-amber-500 text-white border-amber-600',
    teal: 'bg-emerald-600 text-white border-emerald-700',
    rose: 'bg-rose-600 text-white border-rose-700',
    cyan: 'bg-cyan-600 text-white border-cyan-700'
  };

  container.innerHTML = APP_DATA.zones.map(zone => {
    const isSelected = zone.id === selectedZoneId;
    const isStress = zone.statusColor === 'blue' || zone.statusColor === 'rose' || zone.statusColor === 'amber';
    
    return `
      <div onclick="selectZone('${zone.id}')" 
           class="zone-cell rounded-2xl p-4 flex flex-col justify-between shadow-md transition-all cursor-pointer relative ${colorStyles[zone.statusColor]} ${isSelected ? 'ring-4 ring-white ring-offset-2 scale-[1.02] shadow-xl' : 'opacity-95'} ${isStress ? 'pulse-stress' : ''}">
        
        <div class="flex items-start justify-between">
          <span class="text-3xl font-black">${zone.id}</span>
          <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
            ${zone.area}
          </span>
        </div>

        <div class="my-3">
          <p class="text-xs font-medium text-white/90 truncate">${zone.crop}</p>
          <p class="text-sm font-bold tracking-tight">${currentLanguage === 'hi' ? zone.statusHi : zone.status}</p>
        </div>

        <div class="pt-2 border-t border-white/20 flex items-center justify-between text-[11px]">
          <span>NDVI: <strong>${zone.ndvi}</strong></span>
          <span class="underline flex items-center gap-1 font-semibold">Inspect <i data-lucide="chevron-right" class="w-3 h-3"></i></span>
        </div>
      </div>
    `;
  }).join('');
}

// Select Zone from Grid or Map
function selectZone(zoneId) {
  selectedZoneId = zoneId;
  renderZoneGrid();
  updateSelectedZoneDetails(zoneId);
  safeRenderIcons();
}

function updateSelectedZoneDetails(zoneId) {
  const zone = APP_DATA.zones.find(z => z.id === zoneId);
  if (!zone) return;

  const titleEl = document.getElementById('selected-zone-title');
  const cropEl = document.getElementById('selected-zone-crop');
  const statusEl = document.getElementById('selected-zone-status');
  const ndviEl = document.getElementById('selected-zone-ndvi');
  const moistureEl = document.getElementById('selected-zone-moisture');
  const tempEl = document.getElementById('selected-zone-temp');
  const nutrientsEl = document.getElementById('selected-zone-nutrients');
  const actionEl = document.getElementById('selected-zone-action');
  const satEvidenceEl = document.getElementById('selected-zone-satellite-evidence');

  if (titleEl) titleEl.textContent = currentLanguage === 'hi' ? zone.nameHi : zone.name;
  if (cropEl) cropEl.textContent = `${zone.crop} • Stage: ${zone.cropStage}`;
  if (statusEl) {
    statusEl.textContent = currentLanguage === 'hi' ? zone.statusHi : zone.status;
    statusEl.className = `inline-flex px-3 py-1 rounded-full text-xs font-bold bg-${zone.statusColor}-100 text-${zone.statusColor}-800`;
  }
  if (ndviEl) ndviEl.textContent = zone.ndvi;
  if (moistureEl) moistureEl.textContent = currentLanguage === 'hi' ? zone.moistureHi : zone.moisture;
  if (tempEl) tempEl.textContent = zone.temperature;
  if (nutrientsEl) nutrientsEl.textContent = zone.nutrientStatus;
  if (actionEl) actionEl.textContent = currentLanguage === 'hi' ? zone.actionHi : zone.action;
  if (satEvidenceEl) satEvidenceEl.textContent = zone.satEvidence;
}

// Satellite Layer Switcher (Optical NDVI, Radar SAR, Thermal Heat, Grid)
function switchSatelliteLayer(layer) {
  currentZoneLayer = layer;
  document.querySelectorAll('[data-layer]').forEach(btn => {
    btn.classList.remove('bg-emerald-800', 'text-white');
    btn.classList.add('bg-white', 'text-slate-700');
  });
  const activeBtn = document.querySelector(`[data-layer="${layer}"]`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-white', 'text-slate-700');
    activeBtn.classList.add('bg-emerald-800', 'text-white');
  }

  const thermalPanel = document.getElementById('thermal-overlay-panel');
  if (layer === 'thermal') {
    thermalPanel.classList.remove('hidden');
  } else {
    thermalPanel.classList.add('hidden');
  }

  showToast(`Satellite view changed to: ${layer.toUpperCase()} Layer`);
}

// Thermal Subscription Simulation (Screen 4)
function toggleThermalPreview() {
  isThermalSubscribed = !isThermalSubscribed;
  const lockedView = document.getElementById('thermal-locked-card');
  const unlockedView = document.getElementById('thermal-unlocked-data');
  const btn = document.getElementById('btn-preview-subscriber');

  if (isThermalSubscribed) {
    lockedView.classList.add('hidden');
    unlockedView.classList.remove('hidden');
    btn.textContent = 'Hide Subscriber Preview';
    showToast('Thermal imaging unlocked! Showing real-time canopy surface temperatures.');
  } else {
    lockedView.classList.remove('hidden');
    unlockedView.classList.add('hidden');
    btn.textContent = 'Preview as subscriber';
  }
}

// Soil Health Report Rendering (Image 3)
function renderSoilReport() {
  const container = document.getElementById('soil-chemical-rows');
  if (!container) return;

  container.innerHTML = APP_DATA.soilReport.parameters.map(param => `
    <div class="py-2.5 border-b border-slate-100 last:border-0">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-sm font-semibold text-slate-800">${currentLanguage === 'hi' ? param.nameHi : param.name}</span>
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold text-slate-700">${param.value}</span>
          <span class="text-xs px-2 py-0.5 rounded font-semibold ${
            param.tagColor === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
            param.tagColor === 'rose' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
          }">
            ${currentLanguage === 'hi' ? param.statusHi : param.status}
          </span>
        </div>
      </div>
      <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div class="h-full rounded-full ${
          param.tagColor === 'emerald' ? 'bg-emerald-600' :
          param.tagColor === 'rose' ? 'bg-rose-500' : 'bg-amber-500'
        }" style="width: ${param.pct}%"></div>
      </div>
    </div>
  `).join('');

  // Preservations
  const presContainer = document.getElementById('soil-preservation-list');
  if (presContainer) {
    presContainer.innerHTML = APP_DATA.soilReport.preservations.map(p => `
      <div class="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm">
        <div class="p-2 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
          <i data-lucide="${p.icon}" class="w-5 h-5"></i>
        </div>
        <div>
          <h5 class="text-sm font-bold text-slate-900">${currentLanguage === 'hi' ? p.titleHi : p.title}</h5>
          <p class="text-xs text-slate-600 mt-0.5">${currentLanguage === 'hi' ? p.descHi : p.desc}</p>
        </div>
      </div>
    `).join('');
  }
}

// Fertilizer Marketplace Rendering (Farmer-to-Farmer Circular Economy)
function renderFertilizers(category = 'all', searchQuery = '') {
  const container = document.getElementById('fertilizer-grid');
  if (!container) return;

  let filtered = APP_DATA.fertilizers;
  if (category !== 'all') {
    filtered = filtered.filter(f => f.category === category);
  }
  if (searchQuery) {
    filtered = filtered.filter(f => 
      f.title.toLowerCase().includes(searchQuery) || 
      f.titleHi.includes(searchQuery) ||
      f.seller.toLowerCase().includes(searchQuery) ||
      (f.sellerFarmerName && f.sellerFarmerName.toLowerCase().includes(searchQuery))
    );
  }

  container.innerHTML = filtered.map(item => `
    <div class="bg-white rounded-2xl border ${item.isCurrentUser ? 'border-amber-400 ring-2 ring-amber-200' : 'border-slate-200'} overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div class="relative h-44 overflow-hidden bg-slate-100">
          <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover hover:scale-105 transition duration-300">
          <div class="absolute top-2 left-2 flex flex-col gap-1">
            <span class="bg-white/95 backdrop-blur text-emerald-900 font-extrabold text-[10px] px-2.5 py-1 rounded-md shadow flex items-center gap-1">
              <i data-lucide="sprout" class="w-3 h-3 text-emerald-600"></i>
              ${currentLanguage === 'hi' ? item.badgeHi : item.badge}
            </span>
            ${item.isCurrentUser ? `
              <span class="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded shadow tracking-wide uppercase">
                ★ Your Farm Produce / आपकी उपज
              </span>
            ` : ''}
          </div>
          <span class="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white font-semibold text-[10px] px-2 py-0.5 rounded">
            📦 ${item.stockKg} kg left
          </span>
        </div>
        
        <div class="p-4">
          <div class="flex items-start justify-between gap-2 mb-1">
            <h4 class="font-bold text-slate-900 text-base leading-tight">${item.title}</h4>
            <span class="text-xs text-slate-500 font-medium whitespace-nowrap">(${item.titleHi})</span>
          </div>

          <!-- Farmer Producer Attribution -->
          <div class="bg-emerald-50/70 rounded-xl p-2.5 my-2 border border-emerald-100/80 text-xs">
            <div class="flex items-center gap-1.5 font-bold text-emerald-900">
              <i data-lucide="user-check" class="w-3.5 h-3.5 text-emerald-600"></i>
              <span>Farmer: ${item.sellerFarmerName || item.seller}</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>📍 ${item.sellerVillage || 'Varanasi'}</span>
              <span class="text-emerald-700 font-semibold font-mono">${item.distance || 'Local'}</span>
            </div>
          </div>

          <div class="flex items-center gap-1 text-xs text-amber-500 font-bold mb-2">
            <span>★</span>
            <span class="text-slate-800">${item.rating}</span>
            <span class="text-slate-400 font-normal">(${item.reviews} farmer reviews)</span>
          </div>

          <p class="text-xs text-slate-500 line-clamp-2">${item.description}</p>
        </div>
      </div>

      <div class="p-4 pt-0 border-t border-slate-50 flex items-center justify-between">
        <div>
          <span class="text-xl font-black text-slate-900">₹${item.price}</span>
          <span class="text-xs text-slate-500">/${item.unit}</span>
        </div>
        <div class="flex items-center gap-2">
          ${item.isCurrentUser ? `
            <button onclick="setFertilizerMode('sell')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 transition">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              <span>Manage Listing</span>
            </button>
          ` : `
            <button onclick="addToCart('${item.id}')" 
                    class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95">
              <i data-lucide="shopping-cart" class="w-4 h-4"></i>
              <span>Buy / Cart</span>
            </button>
          `}
        </div>
      </div>
    </div>
  `).join('');
  safeRenderIcons();
}

// Switch between Buy from Farmers vs Sell Your Own Fertilizer
function setFertilizerMode(mode) {
  fertilizerViewMode = mode;
  const buyView = document.getElementById('fertilizer-buy-view');
  const sellView = document.getElementById('fertilizer-sell-view');
  const btnBuy = document.getElementById('btn-fertilizer-buy-mode');
  const btnSell = document.getElementById('btn-fertilizer-sell-mode');

  if (mode === 'buy') {
    if (buyView) buyView.classList.remove('hidden');
    if (sellView) sellView.classList.add('hidden');
    if (btnBuy) {
      btnBuy.className = 'px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold bg-emerald-800 text-white shadow-sm transition flex items-center gap-2';
    }
    if (btnSell) {
      btnSell.className = 'px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold bg-white text-slate-700 hover:text-emerald-800 border border-slate-200 transition flex items-center gap-2';
    }
  } else {
    if (buyView) buyView.classList.add('hidden');
    if (sellView) sellView.classList.remove('hidden');
    if (btnSell) {
      btnSell.className = 'px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold bg-amber-600 text-white shadow-sm transition flex items-center gap-2';
    }
    if (btnBuy) {
      btnBuy.className = 'px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold bg-white text-slate-700 hover:text-emerald-800 border border-slate-200 transition flex items-center gap-2';
    }
    renderFarmerSellerStore();
  }
  safeRenderIcons();
}

// Render Farmer's Own Listings & Incoming Buyer Orders
function renderFarmerSellerStore() {
  const listingsContainer = document.getElementById('farmer-my-listings');
  const ordersContainer = document.getElementById('farmer-incoming-orders');

  // Filter listings by current user
  const myListings = APP_DATA.fertilizers.filter(f => f.isCurrentUser);

  // Update seller KPI cards
  const totalEarningsEl = document.getElementById('seller-kpi-earnings');
  const activeCountEl = document.getElementById('seller-kpi-active-listings');
  const stockCountEl = document.getElementById('seller-kpi-stock');

  if (totalEarningsEl) totalEarningsEl.textContent = `₹${APP_DATA.currentUser.totalSalesEarnings.toLocaleString('en-IN')}`;
  if (activeCountEl) activeCountEl.textContent = `${myListings.length} Products`;
  if (stockCountEl) {
    const totalStock = myListings.reduce((sum, item) => sum + (item.stockKg || 0), 0);
    stockCountEl.textContent = `${totalStock} kg`;
  }

  // Render My Listings
  if (listingsContainer) {
    if (myListings.length === 0) {
      listingsContainer.innerHTML = `
        <div class="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">
          <i data-lucide="package" class="w-10 h-10 mx-auto text-slate-400 mb-2"></i>
          <p class="font-bold text-sm">No fertilizer listings active right now.</p>
          <p class="text-xs text-slate-400 mt-1">List your farm's compost or manure to sell directly to local farmers.</p>
          <button onclick="openSellModal()" class="mt-4 bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl">
            + List Your First Fertilizer
          </button>
        </div>
      `;
    } else {
      listingsContainer.innerHTML = myListings.map(item => `
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition">
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <div class="flex items-center gap-3">
                <img src="${item.img}" class="w-14 h-14 rounded-xl object-cover shadow-sm">
                <div>
                  <h5 class="font-bold text-slate-900 text-sm">${item.title}</h5>
                  <span class="text-xs text-emerald-700 font-semibold font-mono">₹${item.price}/kg</span>
                </div>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Active</span>
            </div>
            <p class="text-xs text-slate-500 line-clamp-2 my-2">${item.description}</p>
            <div class="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-xl my-2">
              <span>Available Stock:</span>
              <span class="font-bold text-slate-900">${item.stockKg} kg</span>
            </div>
          </div>
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button onclick="openEditStockModal('${item.id}')" class="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Update Stock
            </button>
            <button onclick="deleteFarmerListing('${item.id}')" class="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Remove
            </button>
          </div>
        </div>
      `).join('');
    }
  }

  // Render Incoming Orders
  if (ordersContainer) {
    ordersContainer.innerHTML = APP_DATA.incomingFarmerOrders.map(ord => `
      <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h5 class="font-bold text-slate-900 text-sm">${ord.buyerFarmer}</h5>
              <span class="text-xs text-slate-400">• ${ord.buyerVillage}</span>
            </div>
            <p class="text-xs text-slate-600 mt-0.5">
              Ordered: <strong>${ord.qtyKg} kg</strong> of <em>${ord.productTitle}</em>
            </p>
            <span class="text-[11px] text-slate-400">${ord.date} • Order: ${ord.orderId}</span>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
          <div class="text-right sm:mr-3">
            <span class="text-sm font-extrabold text-slate-900 block">₹${ord.totalAmount}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
              ord.statusColor === 'amber' ? 'bg-amber-100 text-amber-800' :
              ord.statusColor === 'emerald' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }">${ord.status}</span>
          </div>

          ${ord.status === 'Pending Dispatch' ? `
            <button onclick="handleAcceptOrder('${ord.orderId}')" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm whitespace-nowrap">
              Accept & Pack
            </button>
          ` : `
            <span class="text-xs text-slate-400 font-semibold px-2 py-1">Ready</span>
          `}
        </div>
      </div>
    `).join('');
  }
  safeRenderIcons();
}

// Handle Farmer creating a new listing
function handleFarmerCreateListing(event) {
  event.preventDefault();
  const title = document.getElementById('seller-form-title')?.value || 'Farm Pure Vermicompost';
  const category = document.getElementById('seller-form-category')?.value || 'vermicompost';
  const price = Number(document.getElementById('seller-form-price')?.value) || 12;
  const stock = Number(document.getElementById('seller-form-stock')?.value) || 300;
  const desc = document.getElementById('seller-form-desc')?.value || '100% natural, farm-produced organic fertilizer.';

  const newId = `prod-user-${Date.now()}`;
  const newProduct = {
    id: newId,
    title: title,
    titleHi: title,
    category: category,
    seller: `${APP_DATA.currentUser.name} (You)`,
    sellerFarmerName: `${APP_DATA.currentUser.name} (You)`,
    sellerVillage: APP_DATA.currentUser.village,
    distance: 'Your Farm',
    isCurrentUser: true,
    stockKg: stock,
    verified: true,
    rating: 5.0,
    reviews: 1,
    price: price,
    unit: 'kg',
    badge: 'Your Farm Listing • Verified',
    badgeHi: 'आपकी खेत लिस्टिंग • प्रमाणित',
    img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400&q=80',
    description: desc
  };

  APP_DATA.fertilizers.unshift(newProduct);
  APP_DATA.currentUser.activeListingsCount++;
  closeSellModal();
  renderFertilizers('all');
  renderFarmerSellerStore();
  showToast(`Successfully listed "${title}"! Fellow farmers in ${APP_DATA.currentUser.village} can now buy directly from you.`);
}

function deleteFarmerListing(id) {
  APP_DATA.fertilizers = APP_DATA.fertilizers.filter(f => f.id !== id);
  renderFertilizers('all');
  renderFarmerSellerStore();
  showToast('Listing removed.');
}

function handleAcceptOrder(orderId) {
  const order = APP_DATA.incomingFarmerOrders.find(o => o.orderId === orderId);
  if (order) {
    order.status = 'Ready for Pickup';
    order.statusColor = 'emerald';
    renderFarmerSellerStore();
    showToast(`Order ${orderId} accepted! Buyer notified via SMS for farm pickup.`);
  }
}

function openEditStockModal(id) {
  const item = APP_DATA.fertilizers.find(f => f.id === id);
  if (!item) return;
  const newStock = prompt(`Update stock (in kg) for ${item.title}:`, item.stockKg);
  if (newStock !== null && !isNaN(Number(newStock))) {
    item.stockKg = Number(newStock);
    renderFertilizers('all');
    renderFarmerSellerStore();
    showToast(`Stock updated to ${item.stockKg} kg.`);
  }
}

// Shopping Cart Logic
function addToCart(productId) {
  const product = APP_DATA.fertilizers.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartBadge();
  renderCartDrawer();
  showToast(`Added ${product.title} to Cart!`);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count-badge');
  const totalItems = cart.reduce((acc, curr) => acc + curr.qty, 0);
  if (badge) {
    badge.textContent = totalItems;
    badge.className = totalItems > 0 
      ? 'absolute -top-1.5 -right-1.5 bg-emerald-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce' 
      : 'hidden';
  }
}

function toggleCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  drawer.classList.toggle('translate-x-full');
  renderCartDrawer();
  safeRenderIcons();
}

function renderCartDrawer() {
  const container = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 text-slate-400">
        <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto mb-2 opacity-50"></i>
        <p class="font-medium">Your cart is empty.</p>
        <p class="text-xs mt-1">Explore lab-verified organic fertilizers.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '₹0';
    if (totalEl) totalEl.textContent = '₹0';
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    return `
      <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
        <div class="flex items-center gap-3">
          <img src="${item.img}" class="w-12 h-12 rounded-lg object-cover">
          <div>
            <h6 class="text-xs font-bold text-slate-800">${item.title}</h6>
            <span class="text-xs text-slate-500">₹${item.price} / kg</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="changeQty('${item.id}', -1)" class="w-6 h-6 rounded bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center">-</button>
          <span class="text-xs font-bold text-slate-800">${item.qty}</span>
          <button onclick="changeQty('${item.id}', 1)" class="w-6 h-6 rounded bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center">+</button>
          <span class="text-xs font-extrabold text-slate-900 w-12 text-right">₹${itemTotal}</span>
        </div>
      </div>
    `;
  }).join('');

  const delivery = subtotal > 0 ? 50 : 0;
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (totalEl) totalEl.textContent = `₹${subtotal + delivery}`;
}

function changeQty(productId, delta) {
  const item = cart.find(c => c.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== productId);
  }
  updateCartBadge();
  renderCartDrawer();
  safeRenderIcons();
}

function checkoutCart() {
  if (cart.length === 0) {
    showToast('Cart is empty!');
    return;
  }
  cart = [];
  updateCartBadge();
  toggleCartDrawer();
  showModal('Order Placed Successfully!', 'Your order has been forwarded to local verified farmer-dealers. Delivery scheduled in 2 days with SMS confirmation token.');
}

// Vernacular Voice Advisory (Web Speech API)
function toggleVoiceAdvisory() {
  if (!('speechSynthesis' in window)) {
    alert('Web Speech API is not supported in this browser.');
    return;
  }

  const voiceWaves = document.getElementById('voice-waves');
  const btnText = document.getElementById('voice-btn-label');

  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    if (voiceWaves) voiceWaves.classList.add('hidden');
    if (btnText) btnText.textContent = currentLanguage === 'hi' ? 'सलाह सुनें (आवाज़)' : 'Listen Voice Advisory';
  } else {
    const textEn = `Namaskar Ramesh ji. Krishi-veda satellite report for Plot number 12. Zone B shows moisture deficit, please give light irrigation tomorrow morning 6 am. Zone C shows phosphorus deficiency clues, avoid excess urea and apply vermicompost. Heavy rain expected in 2 days.`;
    const textHi = `नमस्कार रमेश जी। कृषिवेद उपग्रह रिपोर्ट के अनुसार आपके खेत के ज़ोन बी में नमी की कमी है, कल सुबह छह बजे हल्की सिंचाई करें। ज़ोन सी में फास्फोरस की कमी है, अंधाधुंध यूरिया न डालें और वर्मीकंपोस्ट का उपयोग करें। दो दिनों में बारिश की संभावना है।`;

    const utterance = new SpeechSynthesisUtterance(currentLanguage === 'hi' ? textHi : textEn);
    utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => {
      isSpeaking = true;
      if (voiceWaves) voiceWaves.classList.remove('hidden');
      if (btnText) btnText.textContent = 'Speaking... (Click to Stop)';
    };

    utterance.onend = () => {
      isSpeaking = false;
      if (voiceWaves) voiceWaves.classList.add('hidden');
      if (btnText) btnText.textContent = currentLanguage === 'hi' ? 'सलाह सुनें (आवाज़)' : 'Listen Voice Advisory';
    };

    window.speechSynthesis.speak(utterance);
  }
}

// Send Vernacular SMS Simulator
function simulateSendSMS() {
  const phone = document.getElementById('sms-input-phone')?.value || '+91 98765 43210';
  showModal('SMS & WhatsApp Dispatched!', `Actionable advisory in vernacular language sent to ${phone}: "[कृषिवेद अलर्ट] प्लॉट 12: ज़ोन बी में कल सुबह सिंचाई करें। ज़ोन सी में मिट्टी परीक्षण हेतु संपर्क करें।"`);
}

// SDG Hackathon Section (from PDF)
function renderSDGSection() {
  const container = document.getElementById('sdg-cards-container');
  if (!container) return;

  container.innerHTML = APP_DATA.impactStats.sdgs.map(sdg => `
    <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-xl text-white font-extrabold text-lg flex items-center justify-center shadow" style="background-color: ${sdg.color}">
            SDG ${sdg.num}
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-sm">${sdg.title}</h4>
            <span class="text-xs text-slate-500">${sdg.titleHi}</span>
          </div>
        </div>
        <p class="text-xs font-semibold text-slate-700">${sdg.goal}</p>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-100">
        <span class="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md">
          Impact: ${sdg.metric}
        </span>
      </div>
    </div>
  `).join('');
}

// Interactive Charts (Chart.js)
function initMoistureTrendChart() {
  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById('moistureTrendChart');
  if (!ctx) return;

  if (moistureChartInstance) {
    moistureChartInstance.destroy();
  }

  try {
    moistureChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Soil Moisture (%)',
          data: [48, 62, 70, 58, 52, 60, 68],
          borderColor: '#2d6a4f',
          backgroundColor: 'rgba(45, 106, 79, 0.12)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: '#1b4332',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { callback: v => v + '%' },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  } catch (err) {
    console.warn('Moisture chart rendering:', err);
  }
}

function initSoilTrendChart() {
  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById('soilTrendChart');
  if (!ctx) return;

  if (soilChartInstance) {
    soilChartInstance.destroy();
  }

  try {
    soilChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: APP_DATA.soilReport.trend.map(t => t.month),
        datasets: [{
          label: 'Soil Health Score',
          data: APP_DATA.soilReport.trend.map(t => t.score),
          borderColor: '#52b788',
          backgroundColor: 'rgba(82, 183, 136, 0.15)',
          fill: true,
          tension: 0.3,
          borderWidth: 3,
          pointBackgroundColor: '#2d6a4f',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            min: 40,
            max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  } catch (err) {
    console.warn('Soil trend chart rendering:', err);
  }
}

// Leaflet Map Initialization for Real Farmland Coordinates in Varanasi
function initSatelliteLeafletMap() {
  if (typeof L === 'undefined') return;
  const mapContainer = document.getElementById('leaflet-satellite-map');
  if (!mapContainer || leafletMapInstance) return;

  try {
    // Farmlands in Varanasi (Chitaipur / BHU outskirts: 25.275, 82.975)
    leafletMapInstance = L.map('leaflet-satellite-map', {
      zoomControl: true,
      attributionControl: false
    }).setView([25.2755, 82.9750], 16);
  } catch (err) {
    console.warn('Leaflet map error:', err);
    return;
  }

  // Satellite Imagery tile layer (ESRI World Imagery)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18
  }).addTo(leafletMapInstance);

  // Add 6 Zone Polygons representing Plot 12 Sub-divisions
  const zoneCoords = [
    { id: 'A', bounds: [[25.2770, 82.9730], [25.2770, 82.9750], [25.2755, 82.9750], [25.2755, 82.9730]], color: '#10b981' },
    { id: 'B', bounds: [[25.2770, 82.9750], [25.2770, 82.9770], [25.2755, 82.9770], [25.2755, 82.9750]], color: '#0284c7' },
    { id: 'C', bounds: [[25.2770, 82.9770], [25.2770, 82.9790], [25.2755, 82.9790], [25.2755, 82.9770]], color: '#f59e0b' },
    { id: 'D', bounds: [[25.2755, 82.9730], [25.2755, 82.9750], [25.2740, 82.9750], [25.2740, 82.9730]], color: '#059669' },
    { id: 'E', bounds: [[25.2755, 82.9750], [25.2755, 82.9770], [25.2740, 82.9770], [25.2740, 82.9750]], color: '#e11d48' },
    { id: 'F', bounds: [[25.2755, 82.9770], [25.2755, 82.9790], [25.2740, 82.9790], [25.2740, 82.9770]], color: '#06b6d4' }
  ];

  zoneCoords.forEach(z => {
    const polygon = L.polygon(z.bounds, {
      color: z.color,
      fillColor: z.color,
      fillOpacity: 0.45,
      weight: 2
    }).addTo(leafletMapInstance);

    polygon.bindTooltip(`<strong>Zone ${z.id}</strong> (Click to inspect)`, { sticky: true });
    polygon.on('click', () => {
      selectZone(z.id);
    });
  });
}

// Soil Test Booking Workflow
function openSoilTestModal() {
  document.getElementById('soil-test-modal').classList.remove('hidden');
}

function closeSoilTestModal() {
  document.getElementById('soil-test-modal').classList.add('hidden');
}

function submitSoilTestBooking(event) {
  event.preventDefault();
  closeSoilTestModal();
  showModal('Soil Test Booked Successfully!', 'Krishi Mitr Extension Agent assigned for sample collection on selected date. Sample ID: SOIL-VNS-2026-904. SMS confirmation sent.');
}

// Generic Toast & Modal Helper
function showToast(msg) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 3500);
}

function showModal(title, msg) {
  const modal = document.getElementById('generic-dialog-modal');
  document.getElementById('dialog-title').textContent = title;
  document.getElementById('dialog-message').textContent = msg;
  modal.classList.remove('hidden');
}

function closeDialog() {
  document.getElementById('generic-dialog-modal').classList.add('hidden');
}

// ==========================================
// AUTHENTICATION & LOGIN MANAGEMENT
// ==========================================

function openLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.remove('hidden');
    // Reset to step 1 (Phone input)
    document.getElementById('login-step-phone')?.classList.remove('hidden');
    document.getElementById('login-step-otp')?.classList.add('hidden');
  }
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.classList.add('hidden');
}

function handleSendOTP(event) {
  if (event) event.preventDefault();
  const phone = document.getElementById('login-input-phone')?.value || '9876543210';
  
  // Transition to OTP step
  document.getElementById('login-step-phone')?.classList.add('hidden');
  document.getElementById('login-step-otp')?.classList.remove('hidden');
  
  const sentPhoneText = document.getElementById('otp-sent-phone-text');
  if (sentPhoneText) sentPhoneText.textContent = `+91 ${phone}`;

  // Pre-fill demo OTP 2026
  const otpInput = document.getElementById('login-input-otp');
  if (otpInput) otpInput.value = '2026';

  showToast(`OTP 2026 sent to +91 ${phone}. (Demo code prefilled)`);
}

function handleVerifyOTP(event) {
  if (event) event.preventDefault();
  const otp = document.getElementById('login-input-otp')?.value;
  const roleSelect = document.getElementById('login-role-selector')?.value || 'farmer';

  if (!otp || otp.length < 4) {
    showToast('Please enter the 4-digit OTP.');
    return;
  }

  // Set user profile according to role
  quickDemoLogin(roleSelect);
}

function quickDemoLogin(role = 'farmer') {
  APP_DATA.isLoggedIn = true;
  APP_DATA.currentRole = role;

  if (role === 'farmer') {
    APP_DATA.currentUser = {
      id: 'farmer-1',
      name: 'Ramesh Yadav',
      nameHi: 'रमेश यादव',
      role: 'farmer',
      phone: '+91 98765 43210',
      village: 'Chitaipur, Varanasi',
      plotId: 'Plot No. 12',
      plotArea: '2.4 acres (0.97 ha)',
      totalSalesEarnings: 14200,
      activeListingsCount: 2
    };
  } else {
    APP_DATA.currentUser = {
      id: 'ext-1',
      name: 'Dr. Ananya Sharma',
      nameHi: 'डॉ. अनन्या शर्मा',
      role: 'extension',
      phone: '+91 91234 56780',
      village: 'KVK Varanasi Central',
      plotId: 'Cluster Lead',
      plotArea: 'District North',
      totalSalesEarnings: 0,
      activeListingsCount: 0
    };
  }

  updateAuthUI();
  renderFarmerSellerStore();
  closeLoginModal();
  showToast(`Logged in successfully as ${APP_DATA.currentUser.name} (${role === 'farmer' ? 'Farmer' : 'Extension Officer'})!`);
}

function handleLogout() {
  APP_DATA.isLoggedIn = false;
  updateAuthUI();
  showToast('Logged out successfully.');
}

function updateAuthUI() {
  const loggedInContainer = document.getElementById('user-logged-in-profile');
  const loggedOutContainer = document.getElementById('user-logged-out-btn');
  const profileName = document.getElementById('user-profile-name');
  const roleBadge = document.getElementById('user-role-badge');
  const plotDesc = document.getElementById('user-plot-desc');

  if (APP_DATA.isLoggedIn) {
    if (loggedInContainer) loggedInContainer.classList.remove('hidden');
    if (loggedOutContainer) loggedOutContainer.classList.add('hidden');
    if (profileName) profileName.textContent = APP_DATA.currentUser.name;
    if (roleBadge) {
      if (APP_DATA.currentUser.role === 'farmer') {
        roleBadge.textContent = 'Farmer';
        roleBadge.className = 'text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full';
      } else {
        roleBadge.textContent = 'KVK Agronomist';
        roleBadge.className = 'text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full';
      }
    }
    if (plotDesc) plotDesc.textContent = `${APP_DATA.currentUser.plotId}, ${APP_DATA.currentUser.village.split(',')[0]}`;
  } else {
    if (loggedInContainer) loggedInContainer.classList.add('hidden');
    if (loggedOutContainer) loggedOutContainer.classList.remove('hidden');
  }
}

// ==========================================
// FEATURE: KISAN AI ASSISTANT (CHATTING)
// ==========================================

function toggleKisanAiModal() {
  const modal = document.getElementById('kisan-ai-modal');
  if (modal) {
    modal.classList.toggle('hidden');
    safeRenderIcons();
  }
}

function askQuickPrompt(promptText) {
  const input = document.getElementById('kisan-ai-input');
  if (input) input.value = promptText;
  handleKisanAiSubmit();
}

function handleKisanAiSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('kisan-ai-input');
  const chatMessages = document.getElementById('kisan-ai-messages');
  if (!input || !chatMessages) return;

  const userText = input.value.trim();
  if (!userText) return;

  // Append user bubble
  chatMessages.innerHTML += `
    <div class="flex justify-end mb-3">
      <div class="bg-emerald-700 text-white text-xs px-3.5 py-2.5 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm">
        ${userText}
      </div>
    </div>
  `;
  input.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // AI Thinking indicator
  const thinkingId = `ai-think-${Date.now()}`;
  chatMessages.innerHTML += `
    <div id="${thinkingId}" class="flex items-start gap-2 mb-3">
      <div class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
        AI
      </div>
      <div class="bg-slate-100 text-slate-500 text-xs px-3.5 py-2 rounded-2xl rounded-tl-none animate-pulse">
        Analyzing satellite telemetry for Plot 12...
      </div>
    </div>
  `;
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    document.getElementById(thinkingId)?.remove();

    // Match keywords against knowledge base
    const lower = userText.toLowerCase();
    let matched = APP_DATA.kisanAiQna.find(q => q.keywords.some(k => lower.includes(k.toLowerCase())));

    let reply = "";
    if (matched) {
      reply = currentLanguage === 'hi' ? matched.replyHi : matched.replyEn;
    } else {
      reply = currentLanguage === 'hi' 
        ? `🌱 **कृषिवेद एआई सहायक:** प्लॉट 12 (वाराणसी) में ज़ोन बी में नमी 34% (कम) और ज़ोन सी में फास्फोरस 22 kg/ha (कम) दर्ज है। बुधवार की भारी बारिश से पहले केवल ज़ोन बी में कल सुबह हल्की सिंचाई करें।`
        : `🌱 **Kṛṣiveda AI Agronomist:** For Plot 12 (Varanasi), Zone B has low moisture (34%) and Zone C shows low phosphorus (22 kg/ha). Light irrigation is recommended tomorrow morning at 6 AM for Zone B. What else can I check for your crops?`;
    }

    chatMessages.innerHTML += `
      <div class="flex items-start gap-2 mb-3">
        <div class="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
          🌾
        </div>
        <div class="bg-emerald-50/80 border border-emerald-100 text-slate-800 text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm space-y-1">
          <div>${reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
          <span class="text-[10px] text-emerald-700 font-semibold block pt-1">Synced with Sentinel-2 & SAR Telemetry</span>
        </div>
      </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    safeRenderIcons();
  }, 700);
}

// ==========================================
// FEATURE: MONSOON CLOUD RADAR SIMULATOR
// ==========================================

let isMonsoonSimActive = false;
function toggleMonsoonRadarSimulation() {
  isMonsoonSimActive = !isMonsoonSimActive;
  const overlay = document.getElementById('monsoon-cloud-overlay');
  const btn = document.getElementById('btn-monsoon-radar');
  const note = document.getElementById('monsoon-radar-note');

  if (isMonsoonSimActive) {
    if (overlay) overlay.classList.remove('hidden');
    if (note) note.classList.remove('hidden');
    if (btn) btn.innerHTML = `<i data-lucide="sun" class="w-3.5 h-3.5"></i> Clear Monsoon Clouds`;
    showToast('Monsoon cloud simulation active! Sentinel-1 SAR Radar successfully penetrating thick clouds.');
  } else {
    if (overlay) overlay.classList.add('hidden');
    if (note) note.classList.add('hidden');
    if (btn) btn.innerHTML = `<i data-lucide="cloud-rain" class="w-3.5 h-3.5"></i> Test Monsoon Cloud Radar Mode`;
    showToast('Returned to standard clear-sky satellite view.');
  }
  safeRenderIcons();
}

// ==========================================
// FEATURE: GOVERNMENT SOIL HEALTH CARD MODAL
// ==========================================

function openPrintSoilCardModal() {
  document.getElementById('soil-card-print-modal')?.classList.remove('hidden');
  safeRenderIcons();
}

function closePrintSoilCardModal() {
  document.getElementById('soil-card-print-modal')?.classList.add('hidden');
}

function triggerPrintSoilCard() {
  window.print();
}
