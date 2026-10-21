// City Lists matching backend logic
const tier1Cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"];
const tier2Cities = [
  "Jaipur", "Chandigarh", "Indore", "Lucknow", "Patna", "Ranchi", "Visakhapatnam", "Coimbatore",
  "Bhopal", "Nagpur", "Vadodara", "Surat", "Rajkot", "Jodhpur", "Raipur", "Amritsar", "Varanasi",
  "Agra", "Dehradun", "Mysore", "Jabalpur", "Guwahati", "Thiruvananthapuram", "Ludhiana", "Nashik",
  "Allahabad", "Udaipur", "Aurangabad", "Hubli", "Belgaum", "Salem", "Vijayawada", "Tiruchirappalli",
  "Bhavnagar", "Gwalior", "Dhanbad", "Bareilly", "Aligarh", "Gaya", "Kozhikode", "Warangal",
  "Kolhapur", "Bilaspur", "Jalandhar", "Noida", "Guntur", "Asansol", "Siliguri"
];

// App State
let isSmoker = false;
let currentCity = "Mumbai";

// DOM Elements
const ageSlider = document.getElementById('ageSlider');
const ageInput = document.getElementById('ageInput');
const weightSlider = document.getElementById('weightSlider');
const weightInput = document.getElementById('weightInput');
const heightSlider = document.getElementById('heightSlider');
const heightInput = document.getElementById('heightInput');
const incomeSlider = document.getElementById('incomeSlider');
const incomeInput = document.getElementById('incomeInput');

const ageGroupHint = document.getElementById('ageGroupHint');
const cityInput = document.getElementById('city');
const cityTierHint = document.getElementById('cityTierHint');
const occupationSelect = document.getElementById('occupation');

const liveBmi = document.getElementById('liveBmi');
const liveBmiChip = document.getElementById('liveBmiChip');
const liveRisk = document.getElementById('liveRisk');
const liveTier = document.getElementById('liveTier');

const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const standbyState = document.getElementById('standbyState');
const activeState = document.getElementById('activeState');

// Sync Input Pairs helper
function syncPair(slider, numberInput, callback) {
  slider.addEventListener('input', () => {
    numberInput.value = slider.value;
    if (callback) callback();
  });
  numberInput.addEventListener('input', () => {
    slider.value = numberInput.value;
    if (callback) callback();
  });
}

// Smoker toggle
function setSmoker(value) {
  isSmoker = value;
  const noBtn = document.getElementById('smokerNo');
  const yesBtn = document.getElementById('smokerYes');

  if (value) {
    yesBtn.classList.add('active', 'smoker-yes');
    noBtn.classList.remove('active');
  } else {
    noBtn.classList.add('active');
    yesBtn.classList.remove('active', 'smoker-yes');
  }
  updateLiveMetrics();
}

// Select city from pills
function selectCity(city) {
  currentCity = city;
  cityInput.value = city;
  document.querySelectorAll('.city-pill').forEach(pill => {
    pill.classList.toggle('active', pill.innerText.trim().toLowerCase() === city.toLowerCase());
  });
  updateLiveMetrics();
}

cityInput.addEventListener('input', (e) => {
  currentCity = e.target.value.trim();
  document.querySelectorAll('.city-pill').forEach(pill => {
    pill.classList.toggle('active', pill.innerText.trim().toLowerCase() === currentCity.toLowerCase());
  });
  updateLiveMetrics();
});

// Calculate live metrics on client side
function updateLiveMetrics() {
  const age = parseInt(ageInput.value) || 30;
  const weight = parseFloat(weightInput.value) || 68;
  const height = parseFloat(heightInput.value) || 1.72;

  // BMI calculation
  const bmi = height > 0 ? (weight / (height * height)) : 0;
  liveBmi.innerText = bmi.toFixed(2);

  // BMI Category & badge styling
  if (bmi < 18.5) {
    liveBmiChip.innerText = "Underweight";
    liveBmiChip.className = "insight-chip chip-warning";
  } else if (bmi <= 24.9) {
    liveBmiChip.innerText = "Normal";
    liveBmiChip.className = "insight-chip chip-normal";
  } else if (bmi <= 29.9) {
    liveBmiChip.innerText = "Overweight";
    liveBmiChip.className = "insight-chip chip-warning";
  } else {
    liveBmiChip.innerText = "Obese";
    liveBmiChip.className = "insight-chip chip-danger";
  }

  // Age group
  let ageGrp = "senior";
  if (age < 25) ageGrp = "young";
  else if (age < 45) ageGrp = "adult";
  else if (age < 60) ageGrp = "middle_aged";
  ageGroupHint.innerText = ageGrp;

  // City Tier
  let tier = 3;
  if (tier1Cities.some(c => c.toLowerCase() === currentCity.toLowerCase())) {
    tier = 1;
  } else if (tier2Cities.some(c => c.toLowerCase() === currentCity.toLowerCase())) {
    tier = 2;
  }
  cityTierHint.innerText = `Tier ${tier}`;
  liveTier.innerText = `Tier ${tier}`;

  // Lifestyle Risk matching backend logic
  let risk = "Low";
  let riskColor = "var(--accent-emerald)";
  if (isSmoker && bmi > 30) {
    risk = "High";
    riskColor = "var(--accent-rose)";
  } else if (isSmoker || bmi > 27) {
    risk = "Medium";
    riskColor = "var(--accent-amber)";
  }
  liveRisk.innerText = risk;
  liveRisk.style.color = riskColor;
}

// 3D Parallax Tilt for Morph Image Card
const morphCard = document.getElementById('morphCard');
if (morphCard) {
  morphCard.addEventListener('mousemove', (e) => {
    const rect = morphCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = (x / rect.width - 0.5) * 16;
    const yPct = (y / rect.height - 0.5) * -16;
    morphCard.style.transform = `perspective(800px) rotateY(${xPct}deg) rotateX(${yPct}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  morphCard.addEventListener('mouseleave', () => {
    morphCard.style.transform = `perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
  });
}

// Check Backend Connection
async function checkApiConnection() {
  const dot = document.getElementById('apiStatusDot');
  const text = document.getElementById('apiStatusText');
  try {
    const res = await fetch('/openapi.json', { method: 'GET' });
    if (res.ok) {
      dot.style.background = 'var(--accent-emerald)';
      dot.style.boxShadow = '0 0 10px var(--accent-emerald)';
      text.innerText = 'FastAPI v0.1 Connected';
    } else {
      throw new Error('Non-200 response');
    }
  } catch (err) {
    // If opened via file:/// or another port, try explicit 127.0.0.1:8000
    try {
      const resAlt = await fetch('http://127.0.0.1:8000/openapi.json');
      if (resAlt.ok) {
        dot.style.background = 'var(--accent-emerald)';
        dot.style.boxShadow = '0 0 10px var(--accent-emerald)';
        text.innerText = 'FastAPI (Port 8000) Live';
        return;
      }
    } catch (e) {
      // offline
    }
    dot.style.background = 'var(--accent-amber)';
    dot.style.boxShadow = '0 0 10px var(--accent-amber)';
    text.innerText = 'FastAPI Offline';
  }
}

// Handle Form Submission
async function handlePredict() {
  const age = parseInt(ageInput.value);
  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value);
  const income_lpa = parseFloat(incomeInput.value);
  const city = cityInput.value.trim() || "Mumbai";
  const occupation = occupationSelect.value;

  const payload = {
    age,
    weight,
    height,
    income_lpa,
    smoker: isSmoker,
    city,
    occupation
  };

  // UI Loading State
  submitBtn.disabled = true;
  btnText.innerHTML = `<span class="spinner"></span> Computing ML Inference...`;

  try {
    // Attempt local relative endpoint first, fallback to explicit host
    let response;
    try {
      response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (netErr) {
      response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail ? JSON.stringify(errData.detail) : `Error code: ${response.status}`);
    }

    const data = await response.json();
    displayResults(data, payload);

  } catch (error) {
    alert(`Could not complete prediction:\n${error.message}\nMake sure your FastAPI server is running with 'uvicorn app:app --reload'`);
  } finally {
    submitBtn.disabled = false;
    btnText.innerText = 'Calculate Premium Category';
  }
}

// Render Results on UI
function displayResults(result, inputData) {
  standbyState.style.display = 'none';
  activeState.style.display = 'block';

  const category = (result.predicted_category || "Medium").trim();
  const catLower = category.toLowerCase();
  const badge = document.getElementById('predictionBadge');
  const catVal = document.getElementById('categoryValue');
  const catDesc = document.getElementById('categoryDescription');

  catVal.innerText = category;
  badge.className = 'hero-prediction-badge';

  if (catLower === 'low') {
    badge.classList.add('badge-low');
    catDesc.innerText = 'Optimal health and lifestyle profile. Eligible for prime low-risk discounted premium rates.';
  } else if (catLower === 'high') {
    badge.classList.add('badge-high');
    catDesc.innerText = 'Elevated risk parameters identified. Extended medical underwriting and comprehensive tier recommended.';
  } else {
    badge.classList.add('badge-medium');
    catDesc.innerText = 'Standard risk profile. Balanced premium rating with standard medical coverage inclusions.';
  }

  // Populate Metric Cards
  document.getElementById('resultBmi').innerText = Number(result.bmi).toFixed(2);
  
  // Calculate display parameters
  const age = inputData.age;
  let ageGrp = "Senior";
  if (age < 25) ageGrp = "Young";
  else if (age < 45) ageGrp = "Adult";
  else if (age < 60) ageGrp = "Middle-Aged";
  document.getElementById('resultAgeGroup').innerText = ageGrp;

  let risk = "Low";
  if (inputData.smoker && result.bmi > 30) risk = "High";
  else if (inputData.smoker || result.bmi > 27) risk = "Medium";
  document.getElementById('resultRisk').innerText = risk;

  let tier = 3;
  if (tier1Cities.some(c => c.toLowerCase() === inputData.city.toLowerCase())) tier = 1;
  else if (tier2Cities.some(c => c.toLowerCase() === inputData.city.toLowerCase())) tier = 2;
  document.getElementById('resultTier').innerText = `Tier ${tier}`;

  // JSON Preview
  document.getElementById('jsonPreview').innerText = JSON.stringify(result, null, 2);

  // Smooth scroll to result on mobile
  if (window.innerWidth < 992) {
    document.getElementById('resultsPanel').scrollIntoView({ behavior: 'smooth' });
  }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  syncPair(ageSlider, ageInput, updateLiveMetrics);
  syncPair(incomeSlider, incomeInput, updateLiveMetrics);
  syncPair(weightSlider, weightInput, updateLiveMetrics);
  syncPair(heightSlider, heightInput, updateLiveMetrics);

  updateLiveMetrics();
  checkApiConnection();
});
