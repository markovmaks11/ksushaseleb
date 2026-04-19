// ========== СЦЕНАРИЙ 2 СЕРИИ ==========

// АВАТАРКИ
const avatars = {
    default: "image/avtor.jpg",
    ksusha2: "image/ksusha2.jpg",
    alice2: "image/alice2.jpg",
    polinanioly: "image/polinanioly.png",
    morgenshtern: "image/morgenshtern.jpg",
    dilara: "image/dilara.jpg",
    vanyadmitrienko: "image/vanyadmitrienko.png",
    instasamka: "image/ninemice.jpg",
    nastyaaleexeeva: "image/nastyaalexeeva.jpg",
    taxist: "images/taxist.jpg"
};

function getAvatar(speaker) {
    const name = speaker.toLowerCase();
    
    // ТОЛЬКО ВТОРЫЕ АВАТАРКИ (после сборов)
    if (name.includes("ксюша")) return avatars.ksusha2;
    if (name.includes("алиса")) return avatars.alice2;
    if (name.includes("полина ниоли") || name.includes("polina")) return avatars.polinanioly;
    if (name.includes("ваня дмитриенко") || name.includes("vanya")) return avatars.vanyadmitrienko;
    if (name.includes("настя алексеевна") || name.includes("nastya")) return avatars.nastyaaleexeeva;
    if (name.includes("таксист")) return avatars.taxi;
    
    return avatars.default;
}

// ФОНЫ
const backgrounds = {
    club: "image/club.jpg",
    taxi: "image/taxi.jpg",
    studionioly: "image/studionioly.jpg",
    etazh: "image/etazh.jpg"
};

// ========== КАТСЦЕНЫ ==========
const cutscenes = {};

function showCutscene(cutsceneName) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('cutsceneOverlay');
        const img = document.getElementById('cutsceneImg');
        const closeBtn = document.getElementById('cutsceneClose');
        
        if (cutscenes[cutsceneName]) {
            img.src = cutscenes[cutsceneName];
            overlay.classList.add('active');
            
            const onClose = () => {
                overlay.classList.remove('active');
                closeBtn.removeEventListener('click', onClose);
                overlay.removeEventListener('click', onOverlayClick);
                resolve();
            };
            
            const onOverlayClick = (e) => {
                if (e.target === overlay) {
                    onClose();
                }
            };
            
            closeBtn.addEventListener('click', onClose);
            overlay.addEventListener('click', onOverlayClick);
        } else {
            resolve();
        }
    });
}

// ========== АВТОЧТЕНИЕ ==========
let autoReadEnabled = false;
let autoReadInterval = null;
let autoReadSpeed = 3000;
let autoReadPaused = false;
let pauseTimeout = null;

if (localStorage.getItem('ksusha_autoReadEnabled') === 'true') {
    autoReadEnabled = true;
}
if (localStorage.getItem('ksusha_autoReadSpeed')) {
    autoReadSpeed = parseInt(localStorage.getItem('ksusha_autoReadSpeed'));
}

function startAutoRead() {
    if (autoReadInterval) clearInterval(autoReadInterval);
    autoReadInterval = setInterval(() => {
        if (!waitingForChoice && !autoReadPaused && !waitingForCutscene) {
            goToNextScene();
        }
    }, autoReadSpeed);
}

function stopAutoRead() {
    if (autoReadInterval) {
        clearInterval(autoReadInterval);
        autoReadInterval = null;
    }
}

function toggleAutoRead() {
    autoReadEnabled = !autoReadEnabled;
    if (autoReadEnabled) {
        startAutoRead();
        showNotification('⚡ Авточтение ВКЛ');
    } else {
        stopAutoRead();
        showNotification('⏹️ Авточтение ВЫКЛ');
    }
    localStorage.setItem('ksusha_autoReadEnabled', autoReadEnabled);
}

function setAutoReadSpeed(speed) {
    autoReadSpeed = speed;
    if (autoReadEnabled) {
        startAutoRead();
    }
    localStorage.setItem('ksusha_autoReadSpeed', speed);
}

function showNotification(msg) {
    const notif = document.createElement('div');
    notif.className = 'auto-read-notification';
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

document.addEventListener('click', () => {
    if (autoReadEnabled && !waitingForCutscene) {
        autoReadPaused = true;
        if (pauseTimeout) clearTimeout(pauseTimeout);
        pauseTimeout = setTimeout(() => {
            autoReadPaused = false;
        }, 3000);
    }
});

if (autoReadEnabled) {
    startAutoRead();
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

const MUSIC_URL = 'music/siluet.mp3';

function getBackgroundMusic() {
    if (!bgMusic) {
        bgMusic = new Audio(MUSIC_URL);
        bgMusic.loop = true;
        bgMusic.volume = musicVolume;
    }
    return bgMusic;
}

function updateMusicVolume(volume) {
    musicVolume = volume;
    if (bgMusic) bgMusic.volume = volume;
    localStorage.setItem('ksusha_musicVolume', Math.round(volume * 100));
}

function updateMusicEnabled(enabled) {
    musicEnabled = enabled;
    localStorage.setItem('ksusha_musicEnabled', enabled);
    if (enabled) {
        getBackgroundMusic().play().catch(e => console.log("Нажмите на экран"));
    } else if (bgMusic) {
        bgMusic.pause();
    }
}

document.addEventListener('click', function startMusic() {
    if (musicEnabled && (!bgMusic || bgMusic.paused)) {
        getBackgroundMusic().play().catch(e => console.log("Ошибка"));
    }
}, { once: false });

// ========== СЦЕНЫ ==========
const scenes = [
    { speaker: "Ваня Дмитриенко", text: "проходите девочки, присаживайтесь, вам налить чего нибудь?", bg: "club" },
    { speaker: "Ксюша", text: "нет, спасибо", bg: "club" },
    { speaker: "...", text: "ксюша и алиса сели", bg: "club" },
    { speaker: "Ваня Дмитриенко", text: "ну что, рассказывайте", bg: "club" },
    { speaker: "Ксюша", text: "а я если честно не знаю, что рассказывать", bg: "club" },
    { speaker: "Ксюша", text: "мы обычные студентки из новосибирска, живем вместе в съемной квартире", bg: "club" },
    { speaker: "Ваня Дмитриенко", text: "извините, что перебиваю, но можно личный вопрос?", bg: "club" },
    { speaker: "Полина Ниоли", text: "ваня!", bg: "club" },
    { speaker: "Ксюша", text: "да все нормально, спрашивай", bg: "club" },
    { speaker: "Ваня Дмитриенко", text: "вы встречаетесь?", bg: "club" },
    { speaker: "Алиса", text: "да", bg: "club" },
    { speaker: "Ксюша", text: "нет!", bg: "club" },
    { speaker: "Ваня Дмитриенко", text: "и как это понимать", bg: "club" },
    { speaker: "Ксюша", text: "я вообще встречаюсь с артемом жаткиным", bg: "club" },
    { speaker: "Алиса", text: "извини, вань, это шутка была, я встречаюсь с данилом душутиным", bg: "club" },
    { speaker: "Ваня Дмитриенко", text: "ладно не суть, я все равно не знаю, кто это", bg: "club" },
    { speaker: "Ваня Дмитриенко", text: "продолжайте свой рассказ", bg: "club" },
    { speaker: "Ксюша", text: "да здесь нечего рассказывать, уснули там, проснулись здесь", bg: "club" },
    { speaker: "Полина Ниоли", text: "а вы слышали раньше про селебовуд?", bg: "club" },
    { speaker: "Алиса", text: "неа", bg: "club" },
    { speaker: "Полина Ниоли", text: "а я основательница этого города и сюда просто так не попадешь, только по моему закрытому приглашению", bg: "club" },
    { speaker: "Ксюша", text: "тогда как мы сюда попали?", bg: "club" },
    { speaker: "Полина Ниоли", text: "это нам и предстоит выяснить", bg: "club" },
    { speaker: "Алиса", text: "зачем что то выяснять, просто отправьте нас обратно", bg: "club" },
    { speaker: "Полина Ниоли", text: "к сожалению это невозможно", bg: "club" },
    { speaker: "Ксюша", text: "но почему?", bg: "club" },
    { speaker: "Полина Ниоли", text: "потому что до сюда нет открытого пути обратно", bg: "club" },
    { speaker: "Ксюша", text: "тогда как сюда попадают люди?", bg: "club" },
    { speaker: "Полина Ниоли", text: "это очень долгий путь", bg: "club" },
    { speaker: "Полина Ниоли", text: "все начинает с америки, с нью йорка", bg: "club" },
    { speaker: "Полина Ниоли", text: "сначала из нью-йорка селеба должна попасть в лос-анджелес на премию оскарсс", bg: "club" },
    { speaker: "Полина Ниоли", text: "оттуда будет служебный вход для селеб и он ведет на золотой глобус", bg: "club" },
    { speaker: "Полина Ниоли", text: "потом сзади глобуса есть тайный туннель, который ведет в канны", bg: "club" },
    { speaker: "Полина Ниоли", text: "и уже в каннах селеб ждет прайват джет", bg: "club" },
    { speaker: "Полина Ниоли", text: "на нем селебы летят до середины тихого моря, куда дальше прыгают с парашюта", bg: "club" },
    { speaker: "Полина Ниоли", text: "оттуда они приземляются на катер и пересаживаются на лодку", bg: "club" },
    { speaker: "Полина Ниоли", text: "на лодке они доплывают до буйков и их там ждет подводная лодка", bg: "club" },
    { speaker: "Полина Ниоли", text: "на подводной лодке селебы доплывают до острова \"селебовуд\"", bg: "club" },
    { speaker: "Полина Ниоли", text: "и вот здесь главная проблема, чтобы врата в селебовуд открылись, каждая селеба вставляет в сканер специальный пропуск", bg: "club" },
    { speaker: "Ксюша", text: "и проблема в том, что этих пропусков у нас нет и селебовуд нас не выпустит?", bg: "club" },
    { speaker: "Полина Ниоли", text: "все верно", bg: "club" },
    { speaker: "Алиса", text: "что за алькатрас на максималках", bg: "club" },
    { speaker: "Ксюша", text: "полин, так сделай нам пропуски в чем проблема?", bg: "club" },
    { speaker: "Полина Ниоли", text: "проблема в том, что пропуски выдает программа с базой признанных селеб", bg: "club" },
    { speaker: "Ксюша", text: "и нас в этой базе нет?", bg: "club" },
    { speaker: "Полина Ниоли", text: "да", bg: "club" },
    { speaker: "Ксюша", text: "и что нам делать?", bg: "club" },
    { speaker: "Полина Ниоли", text: "единственный выход, вы должны стать селебами", bg: "club" },
    { speaker: "Алиса", text: "ЧТО?", bg: "club" },
    { speaker: "Полина Ниоли", text: "у вас есть выбор", bg: "club" },
    { speaker: "Ксюша", text: "какой?", bg: "club" },
    { speaker: "Полина Ниоли", text: "первый - вы можете остаться в тени и жить в тайне здесь, второй - стать селебой и тогда вы сможете выбраться отсюда", bg: "club" },
    { speaker: "Ксюша", text: "хорошо, мы станем селебами", bg: "club" },
    { speaker: "Полина Ниоли", text: "тогда выбирайте, вот вам список", bg: "club" },
    { speaker: "...", text: "1. рэп путь 2. моделинг 3. танцовщица 4. тик-ток блогерство 5. ютюб блогерство 6. актерское", bg: "club" },
    { speaker: "Ксюша", text: "я выбираю актерское", bg: "club" },
    { speaker: "Алиса", text: "я выбираю рэп путь", bg: "club" },
    { speaker: "Полина Ниоли", text: "отлично, тогда определились", bg: "club" },
    { speaker: "Полина Ниоли", text: "ксюш, я беру тебя под свое крыло, ты будешь моим талантом", bg: "club" },
    { speaker: "Полина Ниоли", text: "алис, а тебя возьмет под свое крыло - INSTASAMKA", bg: "club" },
    { speaker: "Алиса", text: "ЧТО? ИНСТАСАМКА?", bg: "club" },
    { speaker: "Полина Ниоли", text: "именно она, я напишу ей сегодня, завтра вы встретитесь на студии и начнете свой путь", bg: "club" },
    { speaker: "Алиса", text: "ахуеть", bg: "club" },
    { speaker: "Полина Ниоли", text: "давайте обменяемся номерами, чтоб не потерять связь", bg: "club" },
    { speaker: "...", text: "ксюша, алиса и полина ниоли обменялись контактами", bg: "club" },
    { speaker: "Полина Ниоли", text: "на сегодня это все, вы можете идти, моя ассистентка уже заказала вам такси, оно ждет вас у клуба, можете идти, до завтра", bg: "club" },
    { speaker: "Ваня Дмитриенко", text: "пока будущие селебы", bg: "club" },
    { speaker: "Ксюша", text: "до встречи всем", bg: "club" },
    { speaker: "...", text: "ксюша и алиса ушли", bg: "club" },
    { speaker: "...", text: "через пару минут в такси", bg: "taxi" },
    { speaker: "Алиса", text: "я просто не верю в происходящее, я не верю, что завтра буду писать рэп с инстасамкой", bg: "taxi" },
    { speaker: "Ксюша", text: "а я стану актрисой в фильмах", bg: "taxi" },
    { speaker: "Алиса", text: "но мне кажется,что нам стоит во всем разобраться", bg: "taxi" },
    { speaker: "Ксюша", text: "я тоже так думаю", bg: "taxi" },
    { speaker: "Алиса", text: "как мы могли здесь оказаться, это же невозможно", bg: "taxi" },
    { speaker: "Ксюша", text: "в теории невозможно - да, но вдруг есть какой то обходной путь?", bg: "taxi" },
    { speaker: "Алиса", text: "и какой?", bg: "taxi" },
    { speaker: "Ксюша", text: "откуда я знаю, это просто предположение", bg: "taxi" },
    { speaker: "Алиса", text: "ты устала?", bg: "taxi" },
    { speaker: "Ксюша", text: "если честно, то безумно, у меня голова кругом идет от происходящего", bg: "taxi" },
    { speaker: "Таксист", text: "мы приехали", bg: "taxi" },
    { speaker: "Алиса", text: "стоп, вы..", bg: "taxi" },
    { speaker: "Ксюша", text: "настя алексеевна, бывшая шайни!", bg: "taxi" },
    { speaker: "Настя Алексеевна", text: "а я уже подумала, что вы не узнали меня", bg: "taxi" },
    { speaker: "Алиса", text: "надо привыкать, что мы в селебовуде и здесь нет обычных людей, кроме нас", bg: "taxi" },
    { speaker: "Ксюша", text: "извини, насть, мы устали и были погружены в свои мысли", bg: "taxi" },
    { speaker: "Настя Алексеевна", text: "да ничего, а я так понимаю, вы те самые нашумевшие ксюша и алиса", bg: "taxi" },
    { speaker: "Ксюша", text: "да, это мы", bg: "taxi" },
    { speaker: "Настя Алексеевна", text: "приятно познакомиться с вами лично!", bg: "taxi" },
    { speaker: "Алиса", text: "нам тоже!!", bg: "taxi" },
    { speaker: "Настя Алексеевна", text: "доброй ночи девочки", bg: "taxi" },
    { speaker: "Ксюша", text: "тебе тоже насть", bg: "taxi" },
    { speaker: "...", text: "ксюша и алиса поднялись на свой этаж", bg: "etazh" },
    { speaker: "Артур Микаэлян", text: "ну привет, мои новые соседки", bg: "etazh" },
    { speaker: "...", text: "ПРОДОЛЖЕНИЕ СЛЕДУЕТ...", bg: "etazh" }
];

// ========== КОД ДЛЯ РАБОТЫ НОВЕЛЛЫ ==========
let currentSceneIndex = 0;
let waitingForChoice = false;
let waitingForCutscene = false;

const bgElement = document.getElementById('background');
const fadeOverlay = document.getElementById('fadeOverlay');
const speakerName = document.getElementById('speakerName');
const dialogueText = document.getElementById('dialogueText');
const dialogueBox = document.getElementById('dialogueBox');
const choicesPanel = document.getElementById('choicesPanel');
const choicesList = document.getElementById('choicesList');
const progressFill = document.getElementById('progressFill');
const backToMenu = document.getElementById('backToMenu');
const avatarImg = document.getElementById('avatarImg');
const statusBadge = document.getElementById('statusBadge');

if (backToMenu) {
    backToMenu.onclick = () => window.location.href = "../index.html";
}

function updateProgress() {
    if (scenes.length > 0 && progressFill) {
        const percent = (currentSceneIndex / (scenes.length - 1)) * 100;
        progressFill.style.width = percent + '%';
    }
}

function setBackground(bgKey) {
    const bgUrl = backgrounds[bgKey];
    if (bgUrl && bgElement) {
        bgElement.style.backgroundImage = `url('${bgUrl}')`;
        bgElement.style.backgroundSize = 'cover';
        bgElement.style.backgroundPosition = 'center';
    }
}

function updateAvatar(speaker) {
    if (avatarImg && speaker !== "cutscene") {
        avatarImg.src = getAvatar(speaker);
        const container = document.querySelector('.avatar-container');
        if (container) {
            container.style.animation = 'none';
            setTimeout(() => { container.style.animation = 'avatarPop 0.4s ease-out'; }, 10);
        }
    }
}

async function showScene(index) {
    if (index >= scenes.length) {
        if (speakerName) speakerName.innerText = "КОНЕЦ СЕРИИ";
        if (dialogueText) dialogueText.innerText = "Переход на 3 серию...";
        setTimeout(() => { 
            window.location.href = "episode3.html";
        }, 2000);
        return;
    }
    
    const scene = scenes[index];
    
        if (scene.speaker === "cutscene") {
        waitingForCutscene = true;
        await showCutscene(scene.text);
        waitingForCutscene = false;
        currentSceneIndex++;
        showScene(currentSceneIndex);
        return;
    }
    
    if (speakerName) speakerName.innerText = scene.speaker;
    if (dialogueText) dialogueText.innerText = scene.text;
    setBackground(scene.bg);
    updateAvatar(scene.speaker);
    updateProgress();
}

localStorage.setItem('ksusha_episode', 3);
localStorage.setItem('ksusha_season', 1);

function goToNextScene() {
    if (waitingForChoice || waitingForCutscene) return;
    if (currentSceneIndex < scenes.length - 1) {
        currentSceneIndex++;
        showScene(currentSceneIndex);
    } else {
        if (dialogueBox) dialogueBox.style.cursor = "default";
        if (speakerName) speakerName.innerText = "КОНЕЦ СЕРИИ";
        if (dialogueText) dialogueText.innerText = "Переход на 3 серию...";
        setTimeout(() => { 
            window.location.href = "episode3.html";
        }, 2000);
    }
}

document.addEventListener('click', (e) => {
    if (waitingForChoice || waitingForCutscene) return;
    if (e.target.closest('.back-to-menu')) return;
    if (e.target.closest('.choices-panel')) return;
    if (e.target.closest('.choice-btn')) return;
    if (e.target.closest('.settings-btn-series')) return;
    if (e.target.closest('.settings-panel-series')) return;
    if (e.target.closest('.close-settings-series')) return;
    if (e.target.closest('.toggle-switch-series')) return;
    if (e.target.closest('input[type="range"]')) return;
    goToNextScene();
});

// ========== НАСТРОЙКИ В СЕРИИ ==========
const settingsBtnSeries = document.getElementById('settingsBtnSeries');
const settingsPanelSeries = document.getElementById('settingsPanelSeries');
const closeSettingsBtnSeries = document.getElementById('closeSettingsBtnSeries');
const musicToggleSeries = document.getElementById('musicToggleSeries');
const volumeSliderSeries = document.getElementById('volumeSliderSeries');
const volumeValueSeries = document.getElementById('volumeValueSeries');

if (musicToggleSeries) {
    musicToggleSeries.checked = musicEnabled;
    musicToggleSeries.addEventListener('change', (e) => {
        e.stopPropagation();
        updateMusicEnabled(e.target.checked);
    });
}

if (volumeSliderSeries) {
    volumeSliderSeries.value = musicVolume * 100;
    if (volumeValueSeries) volumeValueSeries.textContent = Math.round(musicVolume * 100) + '%';
    volumeSliderSeries.addEventListener('input', (e) => {
        e.stopPropagation();
        const volume = parseFloat(e.target.value) / 100;
        updateMusicVolume(volume);
        if (volumeValueSeries) volumeValueSeries.textContent = Math.round(volume * 100) + '%';
    });
}

if (settingsBtnSeries) {
    settingsBtnSeries.onclick = (e) => {
        e.stopPropagation();
        if (settingsPanelSeries) settingsPanelSeries.classList.add('active');
    };
}
if (closeSettingsBtnSeries) {
    closeSettingsBtnSeries.onclick = (e) => {
        e.stopPropagation();
        if (settingsPanelSeries) settingsPanelSeries.classList.remove('active');
    };
}
if (settingsPanelSeries) {
    settingsPanelSeries.onclick = (e) => {
        if (e.target === settingsPanelSeries) settingsPanelSeries.classList.remove('active');
    };
}

showScene(0);
if (choicesPanel) choicesPanel.classList.remove('active');
waitingForChoice = false;