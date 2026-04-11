const API_BASE = "http://127.0.0.1:8000";

const CROPS_100 = [
  "wheat","rice","maize","sugarcane","cotton","potato","onion","tomato","mustard",
  "groundnut","soybean","sunflower","chickpea","pigeonpea","lentil","sorghum",
  "pearlmillet","barley","jute","tea","coffee","banana","mango","orange","apple",
  "grapes","papaya","pomegranate","guava","watermelon","muskmelon","pineapple",
  "coconut","cashew","arecanut","rubber","cocoa","brinjal","cauliflower","cabbage",
  "carrot","radish","peas","beans","okra","spinach","capsicum","cucumber","pumpkin",
  "bottle_gourd","bitter_gourd","ridge_gourd","garlic","ginger","turmeric","chilli",
  "coriander","cumin","fennel","fenugreek","cardamom","clove","black_pepper",
  "cinnamon","bay_leaf","safflower","sesame","castor","linseed","niger","moong",
  "urad","masoor","rajma","cowpea","mothbean","horsegram","kidneybean","tobacco",
  "bajra","jowar","ragi","foxtail_millet","little_millet","kodo_millet","barnyard_millet",
  "proso_millet","amaranth","sugarbeet","sweet_potato","tapioca","jackfruit","litchi",
  "custard_apple","fig","date_palm","jamun","kiwi","strawberry","dragon_fruit"
];

// Toast
const toast = (msg) => {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2400);
};

// API status dot
const setApiStatus = (ok) => {
  const dot = document.getElementById("apiDot");
  const text = document.getElementById("apiStatus");

  if (ok) {
    dot.style.background = "#22C55E";
    dot.style.boxShadow = "0 0 0 6px rgba(34,197,94,0.15)";
    text.textContent = "Backend Online (FastAPI running)";
  } else {
    dot.style.background = "#EF4444";
    dot.style.boxShadow = "0 0 0 6px rgba(239,68,68,0.15)";
    text.textContent = "Backend Offline (start uvicorn)";
  }
};

async function pingBackend() {
  try {
    const res = await fetch(`${API_BASE}/docs`, { method: "GET" });
    setApiStatus(res.ok);
  } catch (err) {
    setApiStatus(false);
  }
}

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

//Crop Dropdown + Search
function fillCropDropdown(selectEl, crops, defaultCrop = "wheat") {
  selectEl.innerHTML = "";
  crops.forEach(crop => {
    const opt = document.createElement("option");
    opt.value = crop;
    opt.textContent = crop.replaceAll("_", " ").toUpperCase();
    selectEl.appendChild(opt);
  });
  selectEl.value = defaultCrop;
}

function filterCrops(query) {
  const q = query.trim().toLowerCase();
  if (!q) return CROPS_100;
  return CROPS_100.filter(c => c.includes(q));
}

function setupCropSearch(searchInputId, selectId, defaultCrop) {
function formatCropLabel(crop) {
  return crop.replaceAll("_", " ").toUpperCase();
}

function fillCropDropdown(selectEl, crops, defaultCrop = "wheat") {
  selectEl.innerHTML = "";
  crops.forEach(crop => {
    const opt = document.createElement("option");
    opt.value = crop;
    opt.textContent = formatCropLabel(crop);
    selectEl.appendChild(opt);
  });
  selectEl.value = defaultCrop;
}

function getSuggestions(query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return CROPS_100
    .filter(c => c.includes(q))
    .slice(0, limit);
}

function renderSuggestions(container, suggestions, activeIndex) {
  container.innerHTML = "";

  suggestions.forEach((crop, i) => {
    const item = document.createElement("div");
    item.className = "suggestion-item" + (i === activeIndex ? " active" : "");

    item.innerHTML = `
      <span class="suggestion-name">${formatCropLabel(crop)}</span>
      <span class="suggestion-tag">Crop</span>
    `;

    item.dataset.value = crop;
    container.appendChild(item);
  });
}

function setupCropAutoSuggest(searchInputId, suggestionsId, selectId, defaultCrop) {
  const input = document.getElementById(searchInputId);
  const suggestionsBox = document.getElementById(suggestionsId);
  const select = document.getElementById(selectId);

  fillCropDropdown(select, CROPS_100, CROPS_100[0]);
  select.value = "";
  // input.value = defaultCrop;

  let activeIndex = -1;
  let current = [];

  const hide = () => {
    suggestionsBox.classList.add("hidden");
    suggestionsBox.innerHTML = "";
    activeIndex = -1;
    current = [];
  };

  const show = () => {
    suggestionsBox.classList.remove("hidden");
  };

  const applyCrop = (crop) => {
    if (!crop) return;
    input.value = crop;
    select.value = crop;
    hide();
  };

  input.addEventListener("input", () => {
    const q = input.value;
    current = getSuggestions(q, 10);
    activeIndex = -1;

    if (!current.length) {
      hide();
      return;
    }

    renderSuggestions(suggestionsBox, current, activeIndex);
    show();
  });

  input.addEventListener("focus", () => {
    const q = input.value;
    current = getSuggestions(q, 10);
    if (!current.length) return;
    renderSuggestions(suggestionsBox, current, activeIndex);
    show();
  });

  input.addEventListener("keydown", (e) => {
    if (!current.length && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      current = getSuggestions(input.value, 10);
      if (!current.length) return;
      renderSuggestions(suggestionsBox, current, activeIndex);
      show();
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, current.length - 1);
      renderSuggestions(suggestionsBox, current, activeIndex);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      renderSuggestions(suggestionsBox, current, activeIndex);
      return;
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0 && current[activeIndex]) {
        e.preventDefault();
        applyCrop(current[activeIndex]);
      }
      return;
    }

    if (e.key === "Escape") {
      hide();
      return;
    }
  });

  suggestionsBox.addEventListener("click", (e) => {
    const item = e.target.closest(".suggestion-item");
    if (!item) return;
    applyCrop(item.dataset.value);
  });

  // if user manually changes dropdown, update input
  select.addEventListener("change", () => {
    input.value = select.value;
    hide();
  });

  // click outside closes suggestions
  document.addEventListener("click", (e) => {
    if (!suggestionsBox.contains(e.target) && e.target !== input) {
      hide();
    }
  });
}
}

// Weather Widget

async function loadWeather(city) {
  const wCityLabel = document.getElementById("weatherCityLabel");
  const wTemp = document.getElementById("wTemp");
  const wHum = document.getElementById("wHum");
  const wCond = document.getElementById("wCond");

  wTemp.textContent = "--";
  wHum.textContent = "--";
  wCond.textContent = "--";

  if (!city) {
    wCityLabel.textContent = "City: --";
    return; 
  }

  wCityLabel.textContent = `City: ${city}`;

  try {
    const res = await fetch(`${API_BASE}/weather?city=${encodeURIComponent(city)}`);
    const data = await res.json();

    if (!res.ok || data.error) {
      toast("Weather data not available ❌");
      wCond.textContent = "Invalid city";
      return;
    }

    wTemp.textContent = data.temperature;
    wHum.textContent = data.humidity;
    wCond.textContent = data.condition;
  } catch (err) {
    toast("Backend not reachable ❌");
  }
}

//Charts
let yieldChart, irrChart;
const yieldHistory = [];
const irrHistory = [];

function initCharts() {
  const yc = document.getElementById("yieldChart");
  const ic = document.getElementById("irrChart");

  yieldChart = new Chart(yc, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Predicted Yield (tons/acre)",
        data: []
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } }
    }
  });

  irrChart = new Chart(ic, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Recommended Water (mm)",
        data: []
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } }
    }
  });
}

function pushYield(value) {
  const t = new Date().toLocaleTimeString();
  yieldHistory.push({ t, value });
  if (yieldHistory.length > 8) yieldHistory.shift();

  yieldChart.data.labels = yieldHistory.map(x => x.t);
  yieldChart.data.datasets[0].data = yieldHistory.map(x => x.value);
  yieldChart.update();
}

function pushIrr(value) {
  const t = new Date().toLocaleTimeString();
  irrHistory.push({ t, value });
  if (irrHistory.length > 8) irrHistory.shift();

  irrChart.data.labels = irrHistory.map(x => x.t);
  irrChart.data.datasets[0].data = irrHistory.map(x => x.value);
  irrChart.update();
}

// Yield Prediction
document.getElementById("yieldForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const crop = document.getElementById("yieldCrop").value;
  const city = document.getElementById("yieldCity").value.trim();
  const rainfall = document.getElementById("yieldRainfall").value;
  const fertilizer = document.getElementById("yieldFertilizer").value;

  // Update weather widget based on yield city
  await loadWeather(city);

  const url =
    `${API_BASE}/predict-yield?crop=${encodeURIComponent(crop)}` +
    `&rainfall=${encodeURIComponent(rainfall)}` +
    `&fertilizer=${encodeURIComponent(fertilizer)}` +
    `&city=${encodeURIComponent(city)}`;

  try {
    const res = await fetch(url, { method: "POST" });
    const data = await res.json();

    document.getElementById("yieldOutput").textContent = pretty(data);

    if (!res.ok) {
      toast("Yield prediction failed ❌");
      return;
    }

    toast("Yield predicted successfully ✅");
    if (data.predicted_yield !== undefined) pushYield(data.predicted_yield);
  } catch (err) {
    toast("Backend not reachable ❌");
  }
});

//Irrigation Prediction
document.getElementById("irrigationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const crop = document.getElementById("irrCrop").value;
  const city = document.getElementById("irrCity").value.trim();
  const soil = document.getElementById("soilMoisture").value;

  // Update weather widget based on irrigation city
  await loadWeather(city);

  const url =
    `${API_BASE}/predict-irrigation?soil_moisture=${encodeURIComponent(soil)}` +
    `&crop=${encodeURIComponent(crop)}` +
    `&city=${encodeURIComponent(city)}`;

  try {
    const res = await fetch(url, { method: "POST" });
    const data = await res.json();

    document.getElementById("irrOutput").textContent = pretty(data);

    if (!res.ok) {
      toast("Irrigation prediction failed ❌");
      return;
    }

    toast("Irrigation recommendation ready ✅");
    if (data.recommended_water_mm !== undefined) pushIrr(data.recommended_water_mm);
  } catch (err) {
    toast("Backend not reachable ❌");
  }
});

// Refresh — matches id="btnWeatherRefresh" in HTML
document.getElementById("btnWeatherRefresh")?.addEventListener("click", async () => {
  await pingBackend();

  const city =
    document.getElementById("yieldCity").value.trim() ||
    document.getElementById("irrCity").value.trim();

  if (!city) {
    toast("Enter city to refresh weather ❌");
    return;
  }

  await loadWeather(city);
  toast("Dashboard refreshed ✅");
});

function formatCropLabel(crop) {
  return crop.replaceAll("_", " ").toUpperCase();
}

function fillCropDropdown(selectEl, crops, defaultCrop = "wheat") {
  selectEl.innerHTML = "";
  crops.forEach(crop => {
    const opt = document.createElement("option");
    opt.value = crop;
    opt.textContent = formatCropLabel(crop);
    selectEl.appendChild(opt);
  });
  selectEl.value = defaultCrop;
}

function getSuggestions(query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CROPS_100.filter(c => c.includes(q)).slice(0, limit);
}

function renderSuggestions(container, suggestions, activeIndex) {
  container.innerHTML = "";

  suggestions.forEach((crop, i) => {
    const item = document.createElement("div");
    item.className = "suggestion-item" + (i === activeIndex ? " active" : "");

    item.innerHTML = `
      <span class="suggestion-name">${formatCropLabel(crop)}</span>
      <span class="suggestion-tag">Crop</span>
    `;

    item.dataset.value = crop;
    container.appendChild(item);
  });
}

function setupCropAutoSuggest(searchInputId, suggestionsId, selectId, defaultCrop) {
  const input = document.getElementById(searchInputId);
  const suggestionsBox = document.getElementById(suggestionsId);
  const select = document.getElementById(selectId);

  if (!input || !suggestionsBox || !select) {
    console.error("AutoSuggest missing element:", { searchInputId, suggestionsId, selectId });
    return;
  }

  fillCropDropdown(select, CROPS_100, defaultCrop);
  input.value = defaultCrop;

  let activeIndex = -1;
  let current = [];

  const hide = () => {
    suggestionsBox.classList.add("hidden");
    suggestionsBox.innerHTML = "";
    activeIndex = -1;
    current = [];
  };

  const show = () => {
    suggestionsBox.classList.remove("hidden");
  };

  const applyCrop = (crop) => {
    if (!crop) return;
    input.value = crop;
    select.value = crop;
    hide();
  };

  input.addEventListener("input", () => {
    current = getSuggestions(input.value, 10);
    activeIndex = -1;

    if (!current.length) {
      hide();
      return;
    }

    renderSuggestions(suggestionsBox, current, activeIndex);
    show();
  });

  input.addEventListener("focus", () => {
    current = getSuggestions(input.value, 10);
    if (!current.length) return;
    renderSuggestions(suggestionsBox, current, activeIndex);
    show();
  });

  input.addEventListener("keydown", (e) => {
    if (!current.length && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      current = getSuggestions(input.value, 10);
      if (!current.length) return;
      renderSuggestions(suggestionsBox, current, activeIndex);
      show();
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, current.length - 1);
      renderSuggestions(suggestionsBox, current, activeIndex);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      renderSuggestions(suggestionsBox, current, activeIndex);
      return;
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0 && current[activeIndex]) {
        e.preventDefault();
        applyCrop(current[activeIndex]);
      }
      return;
    }

    if (e.key === "Escape") {
      hide();
      return;
    }
  });

  suggestionsBox.addEventListener("click", (e) => {
    const item = e.target.closest(".suggestion-item");
    if (!item) return;
    applyCrop(item.dataset.value);
  });

  select.addEventListener("change", () => {
    input.value = select.value;
    hide();
  });

  document.addEventListener("click", (e) => {
    if (!suggestionsBox.contains(e.target) && e.target !== input) {
      hide();
    }
  });
}

initCharts();
pingBackend();
// loadWeather("");

setupCropAutoSuggest("yieldCropSearch", "yieldSuggestions", "yieldCrop", "wheat");
setupCropAutoSuggest("irrCropSearch", "irrSuggestions", "irrCrop", "rice");


// ================= DISEASE DETECTION =================

const diseaseInput = document.getElementById("diseaseImage");
const diseasePreview = document.getElementById("diseasePreview");
const diseaseOutput = document.getElementById("diseaseOutput");

// Preview
if (diseaseInput) {
  diseaseInput.addEventListener("change", () => {
    const file = diseaseInput.files[0];
    if (file) {
      diseasePreview.src = URL.createObjectURL(file);
      diseasePreview.style.display = "block";
    }
  });
}

// API Call
async function predictDisease() {
  const file = document.getElementById("diseaseImage").files[0];

  if (!file) {
    toast("Please upload an image ❌");
    return;
  }

  diseaseOutput.textContent = "Analyzing image...";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch(`${API_BASE}/disease/predict`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      diseaseOutput.textContent = "Detection failed";
      toast("Disease detection failed ❌");
      return;
    }

    diseaseOutput.textContent = data.prediction;
    toast("Disease detected successfully 🌿");

  } catch (err) {
    console.error(err);
    diseaseOutput.textContent = "Server error";
    toast("Backend not reachable ❌");
  }
}

// ================= MARKETPLACE =================
window.cropCart = window.cropCart || [];
window.gpsLocation = window.gpsLocation || null;
let editingCropIndex = -1;
let mktImageBase64 = [];
let gpsRequestedOnce = false;

function switchTab(tabName) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.querySelectorAll(".nav-tab").forEach((t) => t.classList.remove("active"));
  const viewEl = document.getElementById("view-" + tabName);
  const tabEl = document.getElementById("tab" + tabName.charAt(0).toUpperCase() + tabName.slice(1));
  if (viewEl) viewEl.classList.add("active");
  if (tabEl) tabEl.classList.add("active");
  if (tabName === "marketplace") loadGovListings();
}

function showLocationBanner(city, state, weatherText = "") {
  const banner = document.getElementById("locationBanner");
  const locText = document.getElementById("locText");
  if (!banner || !locText) return;
  locText.textContent = `📍 ${city || "Unknown"}, ${state || "Unknown"}${weatherText ? " · " + weatherText : ""}`;
  banner.classList.remove("hidden");
  setTimeout(() => dismissBanner(), 6000);
}

function dismissBanner() {
  const banner = document.getElementById("locationBanner");
  if (banner) banner.classList.add("hidden");
}

function showManualLocationPrompt(reason = "Location not detected") {
  toast(`GPS unavailable (${reason}). Please fill location manually.`);
  showLocationBanner("Manual mode", reason);
}

async function onGPSSuccess(pos) {
  const { latitude, longitude } = pos.coords;
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    const data = await res.json();
    const adminList = Array.isArray(data.localityInfo?.administrative) ? data.localityInfo.administrative : [];
    const city = data.city || data.locality || data.localityInfo?.informative?.[0]?.name || "";
    const state = data.principalSubdivision || adminList.find((a) => a?.order === 1)?.name || adminList[0]?.name || "";
    const district = data.locality || adminList.find((a) => a?.order === 2 || a?.order === 3)?.name || "";
    const pincode = data.postcode || "";

    // ✔ Fill dashboard city fields
    const yieldCity = document.getElementById("yieldCity");
    const irrCity = document.getElementById("irrCity");
    if (yieldCity) yieldCity.value = city;
    if (irrCity) irrCity.value = city;

    // ✔ Auto-load weather into the floating widget with the detected city
    if (city) {
      loadWeather(city).catch(() => {});
      // Update widget city label immediately (even before weather API responds)
      const cityLabel = document.getElementById("weatherCityLabel");
      if (cityLabel) cityLabel.textContent = city;
    }

    window.gpsLocation = {
      city,
      state,
      district,
      pincode,
      lat: latitude,
      lng: longitude,
      source: "gps",
    };

    // ✔ Fill marketplace identity form
    const stateEl = document.getElementById("mktState");
    const districtEl = document.getElementById("mktDistrict");
    const villageEl = document.getElementById("mktVillage");
    const pinEl = document.getElementById("mktPincode");
    if (stateEl) stateEl.value = state || city || "";
    if (districtEl) districtEl.value = district || city || "";
    if (villageEl && !villageEl.value) villageEl.value = city || district || "";
    if (pinEl) pinEl.value = pincode || "";
    [stateEl, districtEl].forEach((el) => {
      if (el) el.readOnly = true;
    });

    if (!stateEl?.value && !districtEl?.value) {
      showManualLocationPrompt("Reverse geocode returned empty fields");
      return;
    }
    showLocationBanner(city || district || "Detected", state || "Location");
  } catch (e) {
    onGPSFail({ code: 2 });
  }
}

function onGPSFail(error) {
  const code = error && typeof error.code === "number" ? error.code : 0;
  if (code === 1) showManualLocationPrompt("Permission denied");
  else if (code === 2) showManualLocationPrompt("Position unavailable");
  else if (code === 3) showManualLocationPrompt("Request timed out");
  else showManualLocationPrompt("Unknown reason");
}

function getGeoPermissionState() {
  if (!navigator.permissions || !navigator.permissions.query) return Promise.resolve("unknown");
  return navigator.permissions
    .query({ name: "geolocation" })
    .then((res) => res.state)
    .catch(() => "unknown");
}

async function requestGPSLocation() {
  if (!("geolocation" in navigator)) {
    showManualLocationPrompt("Geolocation unsupported");
    return;
  }
  const state = await getGeoPermissionState();
  if (state === "denied") {
    showManualLocationPrompt("Permission blocked in browser");
    return;
  }
  if (state === "prompt") {
    toast("Allow location access in browser prompt.");
  } else if (state === "granted" && gpsRequestedOnce) {
    showLocationBanner("Using saved permission", "Fetching updated location...");
  }
  gpsRequestedOnce = true;
  navigator.geolocation.getCurrentPosition(onGPSSuccess, onGPSFail, {
    timeout: 9000,
    maximumAge: 300000,
    enableHighAccuracy: false,
  });
}

function goToCropStep() {
  document.getElementById("mktStepIdentity")?.classList.remove("active");
  document.getElementById("mktStepCrop")?.classList.add("active");
  document.getElementById("cropDot")?.classList.add("done");
}

function getSelectedGrade() {
  return document.querySelector('input[name="mktGrade"]:checked')?.value || "B";
}

function clearCropForm() {
  ["mktVariety", "mktHarvestDate", "mktQuantity", "mktMoisture", "mktPrice", "mktCropSearch"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const cropEl = document.getElementById("mktCrop");
  if (cropEl) cropEl.selectedIndex = 0;
  document.querySelectorAll('input[name="mktGrade"]').forEach((r, i) => { r.checked = i === 0; });
  editingCropIndex = -1;
  mktImageBase64 = [];
  const preview = document.getElementById("mktImagePreview");
  if (preview) preview.innerHTML = "";
}

async function convertFilesToBase64(files) {
  const tasks = Array.from(files).slice(0, 3).map((file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.readAsDataURL(file);
  }));
  return Promise.all(tasks);
}

function addCropToCart() {
  const crop = document.getElementById("mktCrop")?.value;
  const variety = document.getElementById("mktVariety")?.value.trim();
  const season = document.getElementById("mktSeason")?.value;
  const harvest_date = document.getElementById("mktHarvestDate")?.value;
  const quantity_qtl = Number(document.getElementById("mktQuantity")?.value || 0);
  const grade = getSelectedGrade();
  const moisture_pct = Number(document.getElementById("mktMoisture")?.value || 0) || null;
  const is_organic = document.getElementById("mktOrganic")?.value === "yes";
  const storage_type = document.getElementById("mktStorage")?.value;
  const price_per_qtl = Number(document.getElementById("mktPrice")?.value || 0);
  const negotiable = document.getElementById("mktNegotiable")?.value === "yes";
  if (!crop || !quantity_qtl || !price_per_qtl) {
    toast("Crop, quantity and price are required.");
    return;
  }
  const item = {
    crop_id: "crop_" + Date.now(),
    name: crop,
    variety,
    season,
    harvest_date,
    quantity_qtl,
    grade,
    moisture_pct,
    is_organic,
    storage_type,
    price_per_qtl,
    negotiable,
    images: [...mktImageBase64],
  };
  if (editingCropIndex >= 0) window.cropCart[editingCropIndex] = item;
  else window.cropCart.push(item);
  renderCart();
  clearCropForm();
  toast("Crop added to cart ✅");
}

function editCropInCart(index) {
  const item = window.cropCart[index];
  if (!item) return;
  editingCropIndex = index;
  document.getElementById("mktCrop").value = item.name || "";
  document.getElementById("mktCropSearch").value = item.name || "";
  document.getElementById("mktVariety").value = item.variety || "";
  document.getElementById("mktSeason").value = item.season || "Kharif";
  document.getElementById("mktHarvestDate").value = item.harvest_date || "";
  document.getElementById("mktQuantity").value = item.quantity_qtl || "";
  document.getElementById("mktMoisture").value = item.moisture_pct || "";
  document.getElementById("mktPrice").value = item.price_per_qtl || "";
  const radio = document.querySelector(`input[name="mktGrade"][value="${item.grade || "B"}"]`);
  if (radio) radio.checked = true;
  document.getElementById("mktOrganic").value = item.is_organic ? "yes" : "no";
  document.getElementById("mktStorage").value = item.storage_type || "Open Field";
  document.getElementById("mktNegotiable").value = item.negotiable ? "yes" : "no";
  mktImageBase64 = item.images || [];
  toast("Editing crop item");
}

function removeCropFromCart(index) {
  window.cropCart.splice(index, 1);
  renderCart();
}

function renderCart() {
  const container = document.getElementById("mktCartContainer");
  const count = document.getElementById("cartCount");
  if (!container || !count) return;
  count.textContent = String(window.cropCart.length);
  if (!window.cropCart.length) {
    container.innerHTML = "<p class='muted'>No crops added yet.</p>";
    return;
  }
  container.innerHTML = window.cropCart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">🌾 ${item.name} · ${item.quantity_qtl} Qtl · Grade ${item.grade} · ₹${item.price_per_qtl}/qtl</div>
        <div class="cart-item-meta">${item.variety || "-"} · ${item.season || "-"} · ${item.storage_type || "-"}</div>
      </div>
      <div class="cart-item-actions">
        <button class="btn-edit-crop" onclick="editCropInCart(${idx})">Edit</button>
        <button class="btn-remove-crop" onclick="removeCropFromCart(${idx})">Remove</button>
      </div>
    </div>
  `).join("");
}

async function submitMarketplaceListing() {
  if (!window.cropCart.length) {
    toast("Add at least one crop before submitting.");
    return;
  }
  const farmerName = document.getElementById("mktFarmerName")?.value.trim() || "";
  if (!farmerName) {
    toast("⚠️ Please fill your name before submitting.");
    return;
  }
  const payload = {
    session_id: "sess_" + Date.now(),
    farmer: {
      name: farmerName,
      phone: document.getElementById("mktFarmerPhone")?.value.trim() || "",
      farmer_id: document.getElementById("mktFarmerID")?.value.trim() || "",
      language: document.getElementById("mktFarmerLang")?.value || "en",
      location_source: window.gpsLocation?.source || "manual",
      coords: {
        lat: window.gpsLocation?.lat || null,
        lng: window.gpsLocation?.lng || null,
      },
      state: document.getElementById("mktState")?.value.trim() || "",
      district: document.getElementById("mktDistrict")?.value.trim() || "",
      village: document.getElementById("mktVillage")?.value.trim() || "",
      pincode: document.getElementById("mktPincode")?.value.trim() || "",
      nearest_mandi: document.getElementById("mktMandi")?.value.trim() || "",
    },
    crops: window.cropCart,
  };
  try {
    const res = await fetch(`${API_BASE}/marketplace/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      const detail = data?.detail || data?.message || JSON.stringify(data);
      toast(`❌ Submit error: ${detail}`);
      console.error("Submit error:", data);
      return;
    }
    toast(`✅ Submitted! Ref: ${data.listing_id}`);
    window.cropCart = [];
    renderCart();
    // Show success card
    const cartSec = document.querySelector(".cart-section");
    if (cartSec) {
      const successEl = document.createElement("div");
      successEl.className = "submit-success-banner";
      successEl.innerHTML = `✅ <b>Listing submitted!</b> Reference ID: <code>${data.listing_id}</code>`;
      cartSec.prepend(successEl);
      setTimeout(() => successEl.remove(), 8000);
    }
    loadGovListings();
  } catch (e) {
    console.error("Submit listing exception:", e);
    toast("❌ Could not reach backend. Is uvicorn running?");
  }
}

async function updateListingStatus(id, status) {
  const govt_notes = status === "rejected" ? (prompt("Enter rejection note") || "") : "";
  try {
    const res = await fetch(`${API_BASE}/marketplace/listing/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, govt_notes }),
    });
    if (!res.ok) throw new Error("status update failed");
    toast(`Listing ${status} ✅`);
    loadGovListings();
  } catch (e) {
    toast("Status update failed ❌");
  }
}

function statusClass(status) {
  if (status === "approved") return "status-approved";
  if (status === "rejected") return "status-rejected";
  return "status-pending";
}

async function loadGovListings() {
  const crop = document.getElementById("govCropFilter")?.value || "";
  const state = document.getElementById("govStateFilter")?.value || "";
  const status = document.getElementById("govStatusFilter")?.value || "";
  const params = new URLSearchParams();
  if (crop) params.set("crop", crop);
  if (state) params.set("state", state);
  if (status) params.set("status", status);
  try {
    const res = await fetch(`${API_BASE}/marketplace/listings?${params.toString()}`);
    const data = await res.json();
    const list = data.listings || [];
    const container = document.getElementById("govListings");
    if (!container) return;
    if (!list.length) {
      container.innerHTML = "<p class='muted'>No listings found.</p>";
      return;
    }
    container.innerHTML = list.map((listing) => {
      const cropItem = listing.crops?.[0] || {};
      return `
      <div class="listing-card">
        <div class="listing-card-header">
          <div class="listing-crop-name">🌾 ${cropItem.name || "-"}</div>
          <span class="status-badge ${statusClass(listing.status)}">${(listing.status || "pending").toUpperCase()}</span>
        </div>
        <div class="listing-meta">
          Farmer: ${listing.farmer?.name || "-"} | ${listing.farmer?.district || ""}, ${listing.farmer?.state || ""}<br/>
          Price: ₹${cropItem.price_per_qtl || "-"} /qtl | Qty: ${cropItem.quantity_qtl || "-"}<br/>
          Harvest: ${cropItem.harvest_date || "-"} | Storage: ${cropItem.storage_type || "-"}
        </div>
        <div class="listing-actions">
          <button class="btn-approve" onclick="updateListingStatus('${listing._id}','approved')">✅ Approve</button>
          <button class="btn-reject" onclick="updateListingStatus('${listing._id}','rejected')">❌ Reject</button>
          <button class="btn-view-full" onclick="viewListingFull('${listing._id}')">👁 View Full</button>
        </div>
      </div>`;
    }).join("");
  } catch (e) {
    toast("Could not load listings ❌");
  }
}

async function viewListingFull(listingId) {
  try {
    const res = await fetch(`${API_BASE}/marketplace/listing/${listingId}`);
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to load listing");
    showListingModal(data);
  } catch (e) {
    toast("Could not load full listing ❌");
  }
}

function showListingModal(data) {
  const modal = document.getElementById("listingModal");
  const body = document.getElementById("listingModalBody");
  if (!modal || !body) return;
  const f = data.farmer || {};
  const crops = (data.crops || []).map((c, i) => `
    <div class="modal-crop-card">
      <div class="modal-crop-name">🌾 ${c.name || "-"} · Grade ${c.grade || "-"} · ${c.quantity_qtl || 0} Qtl</div>
      <div class="modal-crop-meta">
        Variety: ${c.variety || "-"} &nbsp;|&nbsp; Season: ${c.season || "-"} &nbsp;|&nbsp; Harvest: ${c.harvest_date || "-"}<br/>
        Price: ₹${c.price_per_qtl || "-"}/qtl &nbsp;|&nbsp; Storage: ${c.storage_type || "-"} &nbsp;|&nbsp; Organic: ${c.is_organic ? "Yes" : "No"}
      </div>
      ${(c.images || []).length ? `<div class="modal-images">${c.images.map(img => `<img src="data:image/jpeg;base64,${img}" class="modal-thumb"/>`).join("")}</div>` : ""}
    </div>`).join("");
  body.innerHTML = `
    <div class="modal-section">
      <div class="modal-label">👨‍🌾 Farmer Details</div>
      <div class="modal-info-grid">
        <span><b>Name:</b> ${f.name || "-"}</span>
        <span><b>Phone:</b> ${f.phone || "-"}</span>
        <span><b>State:</b> ${f.state || "-"}</span>
        <span><b>District:</b> ${f.district || "-"}</span>
        <span><b>Village:</b> ${f.village || "-"}</span>
        <span><b>Pincode:</b> ${f.pincode || "-"}</span>
        <span><b>Mandi:</b> ${f.nearest_mandi || "-"}</span>
        <span><b>Location:</b> ${f.location_source || "manual"}</span>
      </div>
    </div>
    <div class="modal-section">
      <div class="modal-label">🌾 Crops (${(data.crops || []).length})</div>
      ${crops}
    </div>
    <div class="modal-section">
      <div class="modal-label">📋 Status</div>
      <span class="status-badge ${statusClass(data.status)}">${(data.status || "pending").toUpperCase()}</span>
      ${data.govt_notes ? `<p class="modal-notes">📝 ${data.govt_notes}</p>` : ""}
    </div>`;
  modal.classList.remove("hidden");
}

function closeListingModal() {
  const modal = document.getElementById("listingModal");
  if (modal) modal.classList.add("hidden");
}

async function updateMSPHint() {
  const crop = document.getElementById("mktCrop")?.value || "wheat";
  const hint = document.getElementById("mspHint");
  if (!hint) return;
  hint.textContent = "Fetching price...";
  try {
    const res = await fetch(`${API_BASE}/marketplace/prices?crop=${encodeURIComponent(crop)}`);
    const data = await res.json();
    if (data.source === "data_gov" && data.live_price) {
      const market = data.market ? ` (${data.market}${data.state ? ', ' + data.state : ''})` : '';
      const date = data.arrival_date ? ` · ${data.arrival_date}` : '';
      hint.innerHTML = `🟢 Live mandi: <b>₹${data.live_price}/qtl</b>${market}${date} &nbsp;|&nbsp; Govt MSP: ₹${data.msp_price}/qtl`;
      hint.style.color = '#166534';
    } else {
      hint.textContent = `Govt MSP: ₹${data.msp_price}/qtl (live prices unavailable)`;
      hint.style.color = '';
    }
  } catch (e) {
    if (hint) { hint.textContent = "Rate unavailable (backend offline)"; hint.style.color = ''; }
  }
}

document.getElementById("mktImages")?.addEventListener("change", async (e) => {
  const files = e.target.files || [];
  mktImageBase64 = await convertFilesToBase64(files);
  const preview = document.getElementById("mktImagePreview");
  if (!preview) return;
  preview.innerHTML = mktImageBase64.map((img) => `<img src="data:image/jpeg;base64,${img}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;" />`).join("");
});

document.getElementById("mktPrice")?.addEventListener("focus", updateMSPHint);
document.getElementById("mktCrop")?.addEventListener("change", updateMSPHint);
document.getElementById("mktEditLocation")?.addEventListener("click", (e) => {
  e.preventDefault();
  ["mktState", "mktDistrict", "mktVillage", "mktPincode"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.readOnly = false;
  });
});

// govCropFilter is populated by initGovCropFilter() below — no duplicate needed
setupCropAutoSuggest("mktCropSearch", "mktSuggestions", "mktCrop", "wheat");
renderCart();
document.getElementById("retryGpsBtn")?.addEventListener("click", requestGPSLocation);
window.addEventListener("dashboard:started", requestGPSLocation);
// GPS is triggered after user clicks "Get Started" via dashboard:started event only.
// Do NOT fire on raw window.load — the permission prompt should not appear before the user has seen the welcome screen.

// Ensure government crop filter always has full crop list.
function initGovCropFilter() {
  const select = document.getElementById("govCropFilter");
  if (!select) return;
  select.innerHTML = "";
  const all = document.createElement("option");
  all.value = "";
  all.textContent = "All";
  select.appendChild(all);
  CROPS_100.forEach((crop) => {
    const opt = document.createElement("option");
    opt.value = crop;
    opt.textContent = formatCropLabel(crop);
    select.appendChild(opt);
  });
}

initGovCropFilter();

// =====================================================================
// 🎤 VOICE FILL SYSTEM — speaks one sentence → fills multiple fields
// Uses browser built-in webkitSpeechRecognition (Chrome/Edge only)
// =====================================================================

const VOICE_CROP_MAP = {
  // Hindi
  'गेहूं': 'wheat', 'गेहू': 'wheat', 'चावल': 'rice', 'धान': 'rice',
  'मक्का': 'maize', 'मकई': 'maize', 'गन्ना': 'sugarcane',
  'कपास': 'cotton', 'आलू': 'potato', 'प्याज': 'onion',
  'टमाटर': 'tomato', 'सरसों': 'mustard', 'सोयाबीन': 'soybean',
  'चना': 'chickpea', 'मूंग': 'moong', 'उड़द': 'urad',
  'मसूर': 'lentil', 'मासूर': 'lentil', 'मूंगफली': 'groundnut',
  'बाजरा': 'pearlmillet', 'ज्वार': 'sorghum', 'जौ': 'barley',
  'रागी': 'ragi', 'तिल': 'sesame', 'अरहर': 'pigeonpea',
  // Gujarati
  'ઘઉં': 'wheat', 'ઘઉ': 'wheat', 'ચોખા': 'rice', 'ડાંગર': 'rice',
  'મકાઈ': 'maize', 'શેરડી': 'sugarcane', 'કપાસ': 'cotton',
  'બટાકા': 'potato', 'ડુંગળી': 'onion', 'ટામેટા': 'tomato',
  'સરસવ': 'mustard', 'સોયાબીન': 'soybean', 'ચણા': 'chickpea',
  'મગ': 'moong', 'મસૂર': 'lentil', 'મગફળી': 'groundnut',
  'બાજરો': 'pearlmillet', 'જુવાર': 'sorghum',
  // Marathi
  'गहू': 'wheat', 'तांदूळ': 'rice', 'भात': 'rice', 'मका': 'maize',
  'ऊस': 'sugarcane', 'कापूस': 'cotton', 'बटाटा': 'potato',
  'कांदा': 'onion', 'टोमॅटो': 'tomato', 'मोहरी': 'mustard',
  'सोयाबीन': 'soybean', 'हरभरा': 'chickpea', 'मसूर': 'lentil',
  'भुईमूग': 'groundnut', 'बाजरी': 'pearlmillet', 'ज्वारी': 'sorghum',
  // Punjabi
  'ਕਣਕ': 'wheat', 'ਝੋਨਾ': 'rice', 'ਮੱਕੀ': 'maize', 'ਕਪਾਹ': 'cotton',
  'ਆਲੂ': 'potato', 'ਸਰੋਂ': 'mustard', 'ਛੋਲੇ': 'chickpea',
  // Telugu
  'గోధుమ': 'wheat', 'వరి': 'rice', 'మొక్కజొన్న': 'maize',
  'చెరకు': 'sugarcane', 'పత్తి': 'cotton', 'ఆలుగడ్డ': 'potato',
  // English fallback
  'wheat': 'wheat', 'rice': 'rice', 'maize': 'maize', 'corn': 'maize',
  'sugarcane': 'sugarcane', 'cotton': 'cotton', 'potato': 'potato',
  'onion': 'onion', 'tomato': 'tomato', 'mustard': 'mustard',
  'soybean': 'soybean', 'chickpea': 'chickpea', 'groundnut': 'groundnut',
  'lentil': 'lentil', 'moong': 'moong', 'urad': 'urad',
  'barley': 'barley', 'sorghum': 'sorghum', 'millet': 'pearlmillet',
  'bajra': 'pearlmillet', 'jowar': 'sorghum', 'ragi': 'ragi',
};

const VOICE_GRADE_MAP = {
  'a': 'A', 'ए': 'A', 'एक': 'A', 'one': 'A', 'best': 'A', 'अच्छा': 'A', 'first': 'A',
  'b': 'B', 'बी': 'B', 'दो': 'B', 'two': 'B', 'medium': 'B', 'second': 'B',
  'c': 'C', 'सी': 'C', 'तीन': 'C', 'three': 'C', 'third': 'C',
};

/**
 * Converts simple spoken Hindi/English numbers to integers.
 * e.g. "दो हज़ार दो सौ" → 2200
 */
function convertSpokenNumber(spokenStr) {
  const words = {
    'एक': 1, 'one': 1, 'दो': 2, 'two': 2, 'तीन': 3, 'three': 3,
    'चार': 4, 'four': 4, 'पाँच': 5, 'पांच': 5, 'five': 5,
    'छह': 6, 'six': 6, 'सात': 7, 'seven': 7, 'आठ': 8, 'eight': 8,
    'नौ': 9, 'nine': 9, 'दस': 10, 'ten': 10, 'बीस': 20, 'twenty': 20,
    'तीस': 30, 'thirty': 30, 'चालीस': 40, 'forty': 40,
    'पचास': 50, 'fifty': 50, 'साठ': 60, 'sixty': 60,
    'सत्तर': 70, 'seventy': 70, 'अस्सी': 80, 'eighty': 80,
    'नब्बे': 90, 'ninety': 90,
    'सौ': 100, 'hundred': 100,
    'हज़ार': 1000, 'हजार': 1000, 'thousand': 1000,
    'लाख': 100000, 'lakh': 100000,
  };
  let total = 0, current = 0;
  spokenStr.trim().split(/\s+/).forEach(w => {
    const v = words[w.toLowerCase()];
    if (!v) return;
    if (v >= 100) { current = (current || 1) * v; total += current; current = 0; }
    else current += v;
  });
  return (total + current) || null;
}

/**
 * Parses a spoken transcript and extracts crop, quantity, price, grade.
 */
function parseVoiceTranscript(transcript) {
  const text = transcript.toLowerCase().trim();
  const filled = {};

  // ── CROP NAME ──
  for (const [keyword, cropValue] of Object.entries(VOICE_CROP_MAP)) {
    if (text.includes(keyword.toLowerCase())) {
      filled.crop = cropValue;
      break;
    }
  }

  // ── QUANTITY (digit + quintal/qtl/क्विंटल) ──
  const qtyMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:quintal|क्विंटल|kvint|qtl|kvintal)/i);
  if (qtyMatch) filled.quantity = parseFloat(qtyMatch[1]);

  // Spoken number fallback (e.g. "पचास क्विंटल")
  if (!filled.quantity) {
    const spokenQty = text.match(/(\w+(?:\s+\w+)?)\s*(?:quintal|क्विंटल|qtl)/i);
    if (spokenQty) { const n = convertSpokenNumber(spokenQty[1]); if (n) filled.quantity = n; }
  }

  // ── PRICE (digit after price/कीमत/रेट/₹) ──
  const priceMatch =
    text.match(/(?:price|कीमत|दाम|रेट|rate|rupee|रुपये|₹)\s*[:\s]*(\d[\d,]*(?:\.\d+)?)/i) ||
    text.match(/(\d{3,6})\s*(?:rupee|रुपये|per|प्रति|\/)/i);
  if (priceMatch) filled.price = parseFloat(priceMatch[1].replace(/,/g, ''));

  // Spoken number price fallback (दो हज़ार दो सौ)
  if (!filled.price) {
    const spokenPrice = text.match(/(?:कीमत|price|दाम|रेट)\s+((?:\w+\s*){1,6}(?:हज़ार|हजार|thousand|सौ|hundred)(?:\s+\w+)*)/i);
    if (spokenPrice) filled.price = convertSpokenNumber(spokenPrice[1]);
  }

  // ── GRADE (letter or keyword) ──
  const gradeMatch = text.match(/(?:grade|ग्रेड|गुणवत्ता|quality)\s*[:\s]*([abc])\b/i);
  if (gradeMatch) {
    filled.grade = gradeMatch[1].toUpperCase();
  } else {
    for (const [kw, grade] of Object.entries(VOICE_GRADE_MAP)) {
      if (new RegExp('\\b' + kw + '\\b', 'i').test(text)) { filled.grade = grade; break; }
    }
  }

  return filled;
}

/**
 * Applies parsed fills to the marketplace crop form fields.
 */
function applyVoiceFill(filled) {
  if (filled.crop) {
    const sel = document.getElementById('mktCrop');
    const inp = document.getElementById('mktCropSearch');
    if (sel) sel.value = filled.crop;
    if (inp) inp.value = filled.crop;
  }
  if (filled.quantity) { const el = document.getElementById('mktQuantity'); if (el) el.value = filled.quantity; }
  if (filled.price)    { const el = document.getElementById('mktPrice');    if (el) el.value = filled.price;    }
  if (filled.grade)   {
    const r = document.querySelector(`input[name="mktGrade"][value="${filled.grade}"]`);
    if (r) r.checked = true;
  }

  const count = Object.keys(filled).length;
  if (!count) { toast('🎤 Could not detect any fields — try again'); return; }

  const summary = Object.entries(filled).map(([k, v]) => `${k}: ${v}`).join(' · ');
  toast(`✅ Voice filled — ${summary}`);

  // Highlight still-empty required fields in amber
  ['mktVariety', 'mktSeason', 'mktHarvestDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value) el.style.borderColor = 'rgba(245,158,11,0.6)';
  });
}

function resetVoiceBtn(btn) {
  btn.classList.remove('listening');
  btn.innerHTML = '🎤 Fill by Voice';
  btn.disabled = false;
}

/**
 * Main voice fill entry point — triggered by the 🎤 button.
 * Chrome/Edge only (webkitSpeechRecognition).
 */
function startVoiceFill() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    toast('Voice input needs Chrome or Edge ❌');
    return;
  }
  const btn = document.getElementById('btnVoiceFill');
  if (!btn) return;

  const recognition = new SpeechRec();
  recognition.lang = document.getElementById('voiceLang')?.value || 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;
  recognition.continuous = false;

  btn.classList.add('listening');
  btn.innerHTML = '🔴 Listening…';
  btn.disabled = true;

  recognition.start();

  recognition.onresult = (event) => {
    // Try all alternatives, pick the one with the most fields detected
    let bestFilled = {};
    let bestCount = 0;
    for (let i = 0; i < event.results[0].length; i++) {
      const parsed = parseVoiceTranscript(event.results[0][i].transcript);
      if (Object.keys(parsed).length > bestCount) {
        bestCount = Object.keys(parsed).length;
        bestFilled = parsed;
      }
    }
    applyVoiceFill(bestFilled);
    resetVoiceBtn(btn);
  };

  recognition.onerror = (e) => {
    if (e.error === 'no-speech') toast('No speech detected — try again 🎤');
    else if (e.error === 'not-allowed') toast('Microphone access denied ❌');
    else toast('Voice error: ' + e.error + ' ❌');
    resetVoiceBtn(btn);
  };

  recognition.onend = () => resetVoiceBtn(btn);
}