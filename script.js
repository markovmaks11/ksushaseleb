const startBtn = document.getElementById('startGameBtn');
const episodesBtn = document.getElementById('episodesBtn');
const episodesPanel = document.getElementById('episodesPanel');
const closeEpisodesBtn = document.getElementById('closeEpisodesBtn');
const episodesList = document.getElementById('episodesList');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const musicToggle = document.getElementById('musicToggle');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const episodeCounter = document.getElementById('episodeCounter');

// ========== СЧЁТЧИК СЕРИЙ И СЕЗОНОВ ==========
const EPISODES_PER_SEASON = 10;
const TOTAL_SEASONS = 3;

let currentSeason = parseInt(localStorage.getItem('ksusha_season')) || 1;
let currentEpisode = parseInt(localStorage.getItem('ksusha_episode')) || 1;

function updateCounterDisplay() {
    if (episodeCounter) {
        episodeCounter.textContent = `${currentEpisode} СЕРИЯ, ${currentSeason} СЕЗОН`;
    }
}

function goToNextEpisode() {
    if (currentEpisode < EPISODES_PER_SEASON) {
        currentEpisode++;
    } else if (currentSeason < TOTAL_SEASONS) {
        currentSeason++;
        currentEpisode = 1;
    } else {
        return;
    }
    
    localStorage.setItem('ksusha_season', currentSeason);
    localStorage.setItem('ksusha_episode', currentEpisode);
    updateCounterDisplay();
}

function getCurrentEpisodePath() {
    return `series/episode${currentEpisode}.html`;
}

updateCounterDisplay();

// ========== СПИСОК СЕРИЙ ==========
const seriesList = [
    { number: 1, title: "НАЧАЛО", file: "series/episode1.html" },
    { number: 2, title: "ВЫБОР ПУТИ", file: "series/episode2.html" },
    { number: 3, title: "НОВЫЕ СОСЕДИ", file: "series/episode3.html" },
    { number: 4, title: "ПУТЬ К СЛАВЕ", file: "series/episode4.html" },
    { number: 5, title: "СКОРО", file: "#", comingSoon: true },
    { number: 6, title: "СКОРО", file: "#", comingSoon: true },
    { number: 7, title: "СКОРО", file: "#", comingSoon: true },
    { number: 8, title: "СКОРО", file: "#", comingSoon: true },
    { number: 9, title: "СКОРО", file: "#", comingSoon: true },
    { number: 10, title: "СКОРО", file: "#", comingSoon: true }
];

function generateEpisodesList() {
    if (!episodesList) return;
    episodesList.innerHTML = '';
    
    seriesList.forEach(series => {
        const card = document.createElement('div');
        card.className = 'series-card';
        
        if (series.comingSoon) {
            card.style.opacity = '0.5';
            card.style.cursor = 'not-allowed';
        }
        
        const availableText = series.comingSoon ? '⚠️ СКОРО' : '▶ ДОСТУПНО';
        
        card.innerHTML = `
            <div class="series-number">СЕРИЯ ${series.number}</div>
            <div class="series-title">${series.title}</div>
            <div class="series-badge">${availableText}</div>
        `;
        
        if (!series.comingSoon) {
            card.onclick = () => {
                window.location.href = series.file;
                episodesPanel.classList.remove('active');
            };
        }
        
        episodesList.appendChild(card);
    });
}

if (episodesBtn) {
    episodesBtn.onclick = (e) => {
        e.stopPropagation();
        generateEpisodesList();
        if (episodesPanel) episodesPanel.classList.add('active');
    };
}

if (closeEpisodesBtn) {
    closeEpisodesBtn.onclick = (e) => {
        e.stopPropagation();
        if (episodesPanel) episodesPanel.classList.remove('active');
    };
}

if (episodesPanel) {
    episodesPanel.onclick = (e) => {
        if (e.target === episodesPanel) {
            episodesPanel.classList.remove('active');
        }
    };
}

// ========== МУЗЫКА ==========
let bgMusic = null;
let musicEnabled = true;
let musicVolume = 0.5;

if (localStorage.getItem('ksusha_musicEnabled') !== null) {
    musicEnabled = localStorage.getItem('ksusha_musicEnabled') === 'true';
}
if (localStorage.getItem('ksusha_musicVolume') !== null) {
    musicVolume = parseFloat(localStorage.getItem('ksusha_musicVolume')) / 100;
}

const MUSIC_URL = 'series/music/siluet.mp3';

function getBackgroundMusic() {
    if (!bgMusic) {
        bgMusic = new Audio(MUSIC_URL);
        bgMusic.loop = true;
        bgMusic.volume = musicVolume;
    }
    return bgMusic;
}

function updateMusicState() {
    if (musicEnabled) {
        const music = getBackgroundMusic();
        music.play().catch(e => console.log("Нажмите на экран для запуска музыки"));
    } else {
        if (bgMusic) {
            bgMusic.pause();
        }
    }
}

function updateMusicVolume(volume) {
    musicVolume = volume;
    if (bgMusic) {
        bgMusic.volume = volume;
    }
    localStorage.setItem('ksusha_musicVolume', Math.round(volume * 100));
}

function updateMusicEnabled(enabled) {
    musicEnabled = enabled;
    localStorage.setItem('ksusha_musicEnabled', enabled);
    if (enabled) {
        const music = getBackgroundMusic();
        music.play().catch(e => console.log("Не удалось запустить музыку"));
    } else {
        if (bgMusic) {
            bgMusic.pause();
        }
    }
}

document.addEventListener('click', function startMusicOnFirstClick() {
    if (musicEnabled && (!bgMusic || bgMusic.paused)) {
        const music = getBackgroundMusic();
        music.play().catch(e => console.log("Music didn't start"));
    }
    document.removeEventListener('click', startMusicOnFirstClick);
}, { once: false });

// ========== НАСТРОЙКИ UI ==========
if (musicToggle) {
    musicToggle.checked = musicEnabled;
}
if (volumeSlider) {
    volumeSlider.value = musicVolume * 100;
}
if (volumeValue) {
    volumeValue.textContent = Math.round(musicVolume * 100) + '%';
}

if (settingsBtn) {
    settingsBtn.onclick = (e) => {
        e.stopPropagation();
        if (settingsPanel) settingsPanel.classList.add('active');
    };
}

if (closeSettingsBtn) {
    closeSettingsBtn.onclick = (e) => {
        e.stopPropagation();
        if (settingsPanel) settingsPanel.classList.remove('active');
    };
}

if (settingsPanel) {
    settingsPanel.onclick = (e) => {
        if (e.target === settingsPanel) {
            settingsPanel.classList.remove('active');
        }
    };
}

if (musicToggle) {
    musicToggle.addEventListener('change', (e) => {
        e.stopPropagation();
        updateMusicEnabled(e.target.checked);
    });
}

if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        const volume = parseFloat(e.target.value) / 100;
        updateMusicVolume(volume);
        if (volumeValue) volumeValue.textContent = Math.round(volume * 100) + '%';
    });
}

// ========== ЗАПУСК ИГРЫ ==========
if (startBtn) {
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'white';
        flash.style.opacity = '0.8';
        flash.style.zIndex = '9999';
        flash.style.transition = 'opacity 0.2s';
        document.body.appendChild(flash);
        
        const cylinderDiv = document.querySelector('.cylinder');
        if (cylinderDiv) {
            cylinderDiv.style.transform = 'scale(0.9) rotate(20deg)';
            setTimeout(() => {
                cylinderDiv.style.transform = '';
            }, 150);
        }
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => {
                flash.remove();
                window.location.href = getCurrentEpisodePath();
            }, 200);
        }, 100);
    });
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.settings-panel')) return;
    if (e.target.closest('.settings-btn')) return;
    if (e.target.closest('.close-settings')) return;
    if (e.target.closest('.toggle-switch')) return;
    if (e.target.closest('.volume-control')) return;
    if (e.target.closest('input[type="range"]')) return;
    if (e.target.closest('.episodes-panel')) return;
    if (e.target.closest('.episodes-btn')) return;
});

setTimeout(() => {
    if (musicEnabled && (!bgMusic || bgMusic.paused)) {
        const music = getBackgroundMusic();
        music.play().catch(e => console.log("Нажмите на экран для запуска музыки"));
    }
}, 1000);

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1.2s ease';
    setTimeout(() => { document.body.style.opacity = '1'; }, 100);
});

document.addEventListener('contextmenu', (e) => e.preventDefault());