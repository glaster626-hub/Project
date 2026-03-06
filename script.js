// Начальные значения
let eggs = parseInt(localStorage.getItem('eggs')) || 0;
let clicks = parseInt(localStorage.getItem('clicks')) || 0;
let rebirths = parseInt(localStorage.getItem('rebirths')) || 0;
let clickPower = 1 + rebirths * 0.1; // +10% за каждое перерождение

const eggCountEl = document.getElementById('eggCount');
const clickCountEl = document.getElementById('clickCount');
const rebirthCountEl = document.getElementById('rebirthCount');
const eggEl = document.getElementById('egg');
const upgradeListEl = document.getElementById('upgradeList');
const achievementListEl = document.getElementById('achievementList');
const rebirthBtn = document.getElementById('rebirthBtn');

// Апгрейды (пример)
const upgrades = [
    {name: "Click +1", cost: 50, power: 1, owned: 0},
    {name: "Click +5", cost: 500, power: 5, owned: 0},
    {name: "Auto Egg +1/sec", cost: 200, power: 1, owned: 0, passive: true}
];

// Достижения
const achievements = [
    {name: "First Click", achieved: false, condition: ()=>clicks>=1},
    {name: "100 Clicks", achieved: false, condition: ()=>clicks>=100},
    {name: "1,000 Eggs", achieved: false, condition: ()=>eggs>=1000}
];

// Обновление интерфейса
function updateUI() {
    eggCountEl.textContent = Math.floor(eggs);
    clickCountEl.textContent = clicks;
    rebirthCountEl.textContent = rebirths;

    // Апгрейды
    upgradeListEl.innerHTML = '';
    upgrades.forEach((u, i) => {
        const btn = document.createElement('button');
        btn.textContent = `${u.name} (${u.cost} eggs)`;
        btn.className = 'upgrade-item';
        btn.disabled = eggs < u.cost;
        btn.onclick = () => buyUpgrade(i);
        upgradeListEl.appendChild(btn);
    });

    // Достижения
    achievementListEl.innerHTML = '';
    achievements.forEach(a => {
        if (!a.achieved && a.condition()) {
            a.achieved = true;
            alert(`Achievement unlocked: ${a.name}`);
        }
        if (a.achieved) {
            const li = document.createElement('li');
            li.textContent = a.name;
            li.className = 'achievement-item';
            achievementListEl.appendChild(li);
        }
    });

    saveGame();
}

// Клик по яйцу
eggEl.addEventListener('click', () => {
    eggs += clickPower;
    clicks++;
    updateUI();
});

// Покупка апгрейда
function buyUpgrade(index) {
    const u = upgrades[index];
    if (eggs >= u.cost) {
        eggs -= u.cost;
        u.owned++;
        if (!u.passive) {
            clickPower += u.power;
        } else {
            setInterval(()=>{eggs += u.power; updateUI();}, 1000);
        }
        updateUI();
    }
}

// Перерождение
rebirthBtn.addEventListener('click', () => {
    if (eggs >= 5000000) { // 5M минимум для примера
        rebirths++;
        eggs = 0;
        clicks = 0;
        clickPower = 1 + rebirths * 0.1;
        upgrades.forEach(u => u.owned = 0);
        alert(`Rebirth complete! Click power +${(rebirths*10).toFixed(0)}%`);
        updateUI();
    } else {
        alert('Not enough eggs to rebirth!');
    }
});

// Сохранение
function saveGame() {
    localStorage.setItem('eggs', eggs);
    localStorage.setItem('clicks', clicks);
    localStorage.setItem('rebirths', rebirths);
}

// Начальное обновление UI
updateUI();
