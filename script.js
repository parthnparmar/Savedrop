// Loading Animation
window.onload = function() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
    }
    checkUserLogin();
};

function checkUserLogin() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        document.getElementById('userInfo').style.display = 'flex';
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('loginLink').style.display = 'none';
        loadUserData(currentUser);
    } else {
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('loginLink').style.display = 'flex';
        showLoginReminder();
    }
}

function showLoginReminder() {
    const reminderShown = localStorage.getItem('loginReminderShown');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!reminderShown && !currentUser) {
        setTimeout(() => {
            const popup = document.getElementById('loginReminderPopup');
            if (popup) popup.classList.add('show');
        }, 5000);
    }
}

function closeLoginReminder() {
    document.getElementById('loginReminderPopup').classList.remove('show');
    localStorage.setItem('loginReminderShown', 'true');
}

function loadUserData(user) {
    if (user.waterTracker) localStorage.setItem('waterTracker', JSON.stringify(user.waterTracker));
    if (user.challenges) localStorage.setItem('challenges', JSON.stringify(user.challenges));
    if (user.pledges) localStorage.setItem('pledges', JSON.stringify(user.pledges));
    if (user.unlockedBadges) localStorage.setItem('unlockedBadges', JSON.stringify(user.unlockedBadges));
}

function saveUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('aquaguard_users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].waterTracker = JSON.parse(localStorage.getItem('waterTracker')) || {};
            users[userIndex].challenges = JSON.parse(localStorage.getItem('challenges')) || {};
            users[userIndex].pledges = JSON.parse(localStorage.getItem('pledges')) || [];
            users[userIndex].unlockedBadges = JSON.parse(localStorage.getItem('unlockedBadges')) || [];
            localStorage.setItem('aquaguard_users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
    }
}

function handleLogout() {
    saveUserData();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberUser');
    window.location.href = 'login.html';
}

// Navbar
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.style.padding = window.scrollY > 50 ? '0.5rem 0' : '1rem 0';
});

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
if (hamburger) {
    hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navMenu.classList.remove('active');
        const targetId = link.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Counters
function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = current.toFixed(1);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toFixed(1);
        }
    };
    updateCounter();
}

// Scroll Reveal
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 100) element.classList.add('active');
    });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

let countersAnimated = false;
window.addEventListener('scroll', () => {
    if (!countersAnimated) {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const heroTop = heroSection.getBoundingClientRect().top;
            if (heroTop < window.innerHeight && heroTop > -heroSection.offsetHeight) {
                document.querySelectorAll('.counter').forEach(counter => animateCounter(counter));
                countersAnimated = true;
            }
        }
    }
});

// Calculator
function calculateWaterUsage() {
    const numPeople = parseInt(document.getElementById('numPeople').value) || 0;
    const showerMinutes = parseInt(document.getElementById('showerMinutes').value) || 0;
    const washingUses = parseInt(document.getElementById('washingUses').value) || 0;
    const totalUsage = (numPeople * showerMinutes * 9 * 30) + (washingUses * 4 * 50) + (numPeople * 150 * 30);
    
    document.getElementById('usageValue').textContent = totalUsage.toLocaleString();
    document.getElementById('progressFill').style.width = Math.min((totalUsage / 20000) * 100, 100) + '%';
    
    const statusElement = document.getElementById('usageStatus');
    const tipsElement = document.getElementById('usageTips');
    if (totalUsage < 10000) {
        statusElement.innerHTML = '<i class="fas fa-check-circle"></i><span>Excellent! Low water usage</span>';
        statusElement.style.background = '#d1fae5';
        statusElement.style.color = '#065f46';
        tipsElement.innerHTML = '<p>Great job! Keep it up!</p>';
    } else if (totalUsage < 15000) {
        statusElement.innerHTML = '<i class="fas fa-info-circle"></i><span>Good! Moderate water usage</span>';
        statusElement.style.background = '#fef3c7';
        statusElement.style.color = '#92400e';
        tipsElement.innerHTML = '<p>Try reducing shower time by 2 minutes.</p>';
    } else {
        statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>High water usage</span>';
        statusElement.style.background = '#fee2e2';
        statusElement.style.color = '#991b1b';
        tipsElement.innerHTML = '<p>Consider shorter showers and fixing leaks.</p>';
    }
}

// Tracker
function initTracker() {
    const today = new Date().toDateString();
    let trackerData = JSON.parse(localStorage.getItem('waterTracker')) || {};
    if (!trackerData[today]) trackerData[today] = 0;
    updateTrackerDisplay();
}

function addWaterSaved() {
    const input = document.getElementById('waterSaved');
    const amount = parseInt(input.value) || 0;
    if (amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    const today = new Date().toDateString();
    let trackerData = JSON.parse(localStorage.getItem('waterTracker')) || {};
    trackerData[today] = (trackerData[today] || 0) + amount;
    localStorage.setItem('waterTracker', JSON.stringify(trackerData));
    input.value = '';
    updateTrackerDisplay();
    updateImpact();
    updateWaterLevel();
    checkAchievements();
    updateLeaderboard();
    saveUserData();
}

function updateTrackerDisplay() {
    const trackerData = JSON.parse(localStorage.getItem('waterTracker')) || {};
    const today = new Date().toDateString();
    document.getElementById('todaySaved').textContent = (trackerData[today] || 0) + ' L';
    
    let weekTotal = 0;
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        weekTotal += trackerData[date.toDateString()] || 0;
    }
    document.getElementById('weekSaved').textContent = weekTotal + ' L';
    
    let monthTotal = 0;
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        monthTotal += trackerData[date.toDateString()] || 0;
    }
    document.getElementById('monthSaved').textContent = monthTotal + ' L';
    updateChart();
}

function updateChart() {
    const canvas = document.getElementById('waterChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const trackerData = JSON.parse(localStorage.getItem('waterTracker')) || {};
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const days = [];
    const values = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        values.push(trackerData[date.toDateString()] || 0);
    }
    const maxValue = Math.max(...values, 100);
    const barWidth = chartWidth / 7 - 10;
    ctx.clearRect(0, 0, width, height);
    values.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * (chartWidth / 7) + 5;
        const y = height - padding - barHeight;
        const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
        gradient.addColorStop(0, '#0ea5e9');
        gradient.addColorStop(1, '#10b981');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.fillStyle = '#1e293b';
        ctx.font = '12px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText(value + 'L', x + barWidth / 2, y - 5);
        ctx.fillText(days[index], x + barWidth / 2, height - padding + 20);
    });
}

// Accordion
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// Eco Score
function updateEcoScore() {
    const challenges = document.querySelectorAll('.challenge-item input[type="checkbox"]');
    let completed = 0;
    challenges.forEach(challenge => { if (challenge.checked) completed++; });
    const score = completed * 20;
    document.getElementById('ecoScore').textContent = score;
    const scoreMessage = document.getElementById('scoreMessage');
    if (score === 0) scoreMessage.textContent = 'Complete challenges to increase your score!';
    else if (score < 60) scoreMessage.textContent = 'Good start! Keep completing challenges.';
    else if (score < 100) scoreMessage.textContent = 'Great work! You\'re making a difference.';
    else scoreMessage.textContent = 'Perfect! You\'re an eco champion! 🌟';
    const challengeStates = {};
    challenges.forEach((challenge, index) => {
        challengeStates[`challenge${index + 1}`] = challenge.checked;
    });
    localStorage.setItem('challenges', JSON.stringify(challengeStates));
    checkAchievements();
    saveUserData();
}

function loadChallenges() {
    const saved = JSON.parse(localStorage.getItem('challenges')) || {};
    Object.keys(saved).forEach(key => {
        const checkbox = document.getElementById(key);
        if (checkbox) checkbox.checked = saved[key];
    });
    updateEcoScore();
}

// Impact
function updateImpact() {
    const trackerData = JSON.parse(localStorage.getItem('waterTracker')) || {};
    let totalSaved = 0;
    Object.values(trackerData).forEach(value => { totalSaved += value; });
    document.getElementById('impactWater').textContent = totalSaved.toLocaleString();
    document.getElementById('impactTrees').textContent = Math.floor(totalSaved / 200);
    document.getElementById('impactCarbon').textContent = (totalSaved * 0.0005).toFixed(2);
    document.getElementById('impactMoney').textContent = (totalSaved * 0.002).toFixed(2);
}

// Pledge
document.getElementById('pledgeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('pledgeName').value;
    const email = document.getElementById('pledgeEmail').value;
    if (name && email) {
        const pledges = JSON.parse(localStorage.getItem('pledges')) || [];
        pledges.push({ name, email, date: new Date().toISOString() });
        localStorage.setItem('pledges', JSON.stringify(pledges));
        const currentCount = parseInt(document.getElementById('pledgeCount').textContent.replace(/,/g, ''));
        document.getElementById('pledgeCount').textContent = (currentCount + 1).toLocaleString();
        document.getElementById('thankYouPopup').classList.add('show');
        document.getElementById('pledgeForm').reset();
        checkAchievements();
        saveUserData();
    }
});

function closePopup() {
    document.getElementById('thankYouPopup').classList.remove('show');
}

// Water Level
function updateWaterLevel() {
    const trackerData = JSON.parse(localStorage.getItem('waterTracker')) || {};
    let totalSaved = 0;
    Object.values(trackerData).forEach(value => { totalSaved += value; });
    const percentage = Math.min((totalSaved / 1000) * 100, 100);
    const waterLevel = document.getElementById('waterLevel');
    const levelLabel = document.getElementById('levelLabel');
    if (waterLevel && levelLabel) {
        waterLevel.style.height = percentage + '%';
        levelLabel.textContent = Math.round(percentage) + '%';
    }
}

// Achievements
const achievements = {
    'first-drop': { name: 'First Drop', condition: (total) => total >= 1 },
    'week-warrior': { name: 'Week Warrior', condition: () => Object.keys(JSON.parse(localStorage.getItem('waterTracker')) || {}).length >= 7 },
    'hundred-club': { name: '100L Club', condition: (total) => total >= 100 },
    'eco-champion': { name: 'Eco Champion', condition: () => Array.from(document.querySelectorAll('.challenge-item input[type="checkbox"]')).every(c => c.checked) },
    'pledge-taker': { name: 'Pledge Taker', condition: () => (JSON.parse(localStorage.getItem('pledges')) || []).length > 0 },
    'thousand-saver': { name: '1000L Saver', condition: (total) => total >= 1000 }
};

function checkAchievements() {
    const trackerData = JSON.parse(localStorage.getItem('waterTracker')) || {};
    let totalSaved = 0;
    Object.values(trackerData).forEach(value => { totalSaved += value; });
    const unlockedBadges = JSON.parse(localStorage.getItem('unlockedBadges')) || [];
    Object.keys(achievements).forEach(badgeId => {
        const badge = document.querySelector(`[data-badge="${badgeId}"]`);
        if (badge && achievements[badgeId].condition(totalSaved)) {
            if (!unlockedBadges.includes(badgeId)) {
                unlockedBadges.push(badgeId);
                localStorage.setItem('unlockedBadges', JSON.stringify(unlockedBadges));
                badge.classList.add('unlocked');
            } else {
                badge.classList.add('unlocked');
            }
        }
    });
}

// Leaderboard
function updateLeaderboard() {
    const currentUser = localStorage.getItem('userName') || 'You';
    const trackerData = JSON.parse(localStorage.getItem('waterTracker')) || {};
    let userTotal = 0;
    Object.values(trackerData).forEach(value => { userTotal += value; });
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [
        { name: 'Sarah Chen', saved: 2450 },
        { name: 'Mike Johnson', saved: 2100 },
        { name: 'Emma Davis', saved: 1850 },
        { name: 'Alex Kumar', saved: 1600 },
        { name: 'Lisa Wang', saved: 1400 }
    ];
    const userIndex = leaderboard.findIndex(u => u.name === currentUser);
    if (userIndex >= 0) leaderboard[userIndex].saved = userTotal;
    else leaderboard.push({ name: currentUser, saved: userTotal });
    leaderboard.sort((a, b) => b.saved - a.saved);
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    const leaderboardList = document.getElementById('leaderboardList');
    if (leaderboardList) {
        leaderboardList.innerHTML = leaderboard.map((user, index) => `
            <div class="leaderboard-item">
                <div class="leaderboard-rank">${index + 1}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${user.name}</div>
                    <div class="leaderboard-score">Water Saved</div>
                </div>
                <div class="leaderboard-value">${user.saved}L</div>
            </div>
        `).join('');
    }
}

// Social Share
function shareOnSocial(platform) {
    const trackerData = JSON.parse(localStorage.getItem('waterTracker')) || {};
    let totalSaved = 0;
    Object.values(trackerData).forEach(value => { totalSaved += value; });
    const text = `I've saved ${totalSaved} liters of water with AquaGuard! 💧🌍`;
    const url = window.location.href;
    let shareUrl = '';
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Voice
let isSpeaking = false;
function toggleVoice() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        voiceBtn.classList.remove('speaking');
        voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        const facts = ['Welcome to AquaGuard. Every drop counts.', 'Only 0.5% of Earth\'s water is available freshwater.'];
        let currentIndex = 0;
        isSpeaking = true;
        voiceBtn.classList.add('speaking');
        voiceBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        function speakNext() {
            if (currentIndex < facts.length && isSpeaking) {
                const utterance = new SpeechSynthesisUtterance(facts[currentIndex]);
                utterance.onend = () => { currentIndex++; if (currentIndex < facts.length && isSpeaking) setTimeout(speakNext, 1000); else { isSpeaking = false; voiceBtn.classList.remove('speaking'); voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>'; } };
                window.speechSynthesis.speak(utterance);
            }
        }
        speakNext();
    }
}

// Detail Pages
const detailPages = {
    'global-scarcity': { content: `<h2 style="color: #0ea5e9;"><i class="fas fa-globe-americas"></i> Global Water Scarcity</h2><p style="line-height: 1.8;">Only 0.5% of Earth's water is available freshwater. By 2025, half the world's population will live in water-stressed areas.</p><h3 style="color: #10b981; margin-top: 1rem;">Key Facts:</h3><ul style="line-height: 1.8;"><li>2.2 billion people lack access to safe drinking water</li><li>4.2 billion lack safely managed sanitation</li><li>Water scarcity affects 40% of global population</li></ul>` },
    'health-impact': { content: `<h2 style="color: #0ea5e9;"><i class="fas fa-heartbeat"></i> Health Impact</h2><p style="line-height: 1.8;">829,000 people die each year from diseases attributed to unsafe water and poor sanitation.</p><h3 style="color: #10b981; margin-top: 1rem;">Major Risks:</h3><ul style="line-height: 1.8;"><li>Diarrheal diseases - leading cause of child deaths</li><li>Cholera affects 1.3-4 million annually</li><li>1,000 children die daily from water-related diseases</li></ul>` },
    'ecosystem-balance': { content: `<h2 style="color: #0ea5e9;"><i class="fas fa-seedling"></i> Ecosystem Balance</h2><p style="line-height: 1.8;">Water conservation protects wetlands, rivers, and wildlife habitats essential for biodiversity.</p><h3 style="color: #10b981; margin-top: 1rem;">Impact:</h3><ul style="line-height: 1.8;"><li>64-71% of wetlands lost since 1900</li><li>83% decline in freshwater species since 1970</li><li>2/3 of world's rivers no longer flow freely</li></ul>` },
    'economic-savings': { content: `<h2 style="color: #0ea5e9;"><i class="fas fa-dollar-sign"></i> Economic Savings</h2><p style="line-height: 1.8;">Reducing water usage by 20% can save an average household $170 annually on utility bills.</p><h3 style="color: #10b981; margin-top: 1rem;">Savings:</h3><ul style="line-height: 1.8;"><li>Fix leaks: Save up to $600/year</li><li>Low-flow showerheads: Save $70-150/year</li><li>Efficient toilets: Save $110/year</li><li>Shorter showers: Save $100/year</li></ul>` }
};

function openDetailPage(pageId) {
    const page = detailPages[pageId];
    if (page) {
        document.getElementById('detailContent').innerHTML = page.content;
        document.getElementById('detailPopup').classList.add('show');
    }
}

function closeDetailPopup() {
    document.getElementById('detailPopup').classList.remove('show');
}

// Facts Carousel
let currentFactIndex = 0;
function initFactCarousel() {
    const factItems = document.querySelectorAll('.fact-item');
    const factDotsContainer = document.getElementById('factDots');
    if (factItems.length === 0 || !factDotsContainer) return;
    factItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'fact-dot' + (index === 0 ? ' active' : '');
        dot.onclick = () => showFact(index);
        factDotsContainer.appendChild(dot);
    });
    setInterval(() => {
        currentFactIndex = (currentFactIndex + 1) % factItems.length;
        showFact(currentFactIndex);
    }, 5000);
}

function showFact(index) {
    const factItems = document.querySelectorAll('.fact-item');
    factItems.forEach((item, i) => item.classList.toggle('active', i === index));
    document.querySelectorAll('.fact-dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
    currentFactIndex = index;
}

// Download Report
function downloadReport() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to download your impact report!');
        window.location.href = 'login.html';
        return;
    }
    const trackerData = JSON.parse(localStorage.getItem('waterTracker')) || {};
    let totalSaved = 0;
    Object.values(trackerData).forEach(value => { totalSaved += value; });
    const trees = Math.floor(totalSaved / 200);
    const carbon = (totalSaved * 0.0005).toFixed(2);
    const money = (totalSaved * 0.002).toFixed(2);
    const reportHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>AquaGuard Report</title><style>body{font-family:Arial;padding:40px;background:linear-gradient(135deg,#e0f2fe,#d1fae5)}.container{max-width:800px;margin:0 auto;background:white;padding:40px;border-radius:20px}h1{color:#0ea5e9;text-align:center;border-bottom:3px solid #10b981;padding-bottom:20px}h2{color:#0ea5e9;margin-top:30px}.stat{background:linear-gradient(135deg,#e0f2fe,#d1fae5);padding:20px;margin:15px 0;border-radius:10px}.stat-value{font-size:2em;font-weight:bold;color:#0ea5e9}</style></head><body><div class="container"><h1>🌊 AquaGuard Impact Report</h1><p style="text-align:center">Generated on ${new Date().toLocaleDateString()}</p><h2>💧 Water Conservation Summary</h2><div class="stat"><div class="stat-value">${totalSaved} Liters</div><div>Total Water Saved</div></div><h2>🌍 Environmental Impact</h2><div class="stat"><div class="stat-value">${trees} Trees | ${carbon} kg CO₂ | $${money}</div></div><p style="text-align:center;margin-top:40px"><strong>Thank you for contributing to water conservation!</strong></p></div></body></html>`;
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AquaGuard_Report_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportHTML);
    printWindow.document.close();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTracker();
    loadChallenges();
    updateImpact();
    updateWaterLevel();
    checkAchievements();
    updateLeaderboard();
    initFactCarousel();
    const pledges = JSON.parse(localStorage.getItem('pledges')) || [];
    if (pledges.length > 0) {
        const pledgeCountEl = document.getElementById('pledgeCount');
        if (pledgeCountEl) pledgeCountEl.textContent = (1247 + pledges.length).toLocaleString();
    }
});

window.addEventListener('resize', () => updateChart());
