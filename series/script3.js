// ========== СЦЕНАРИЙ 3 СЕРИИ ==========

// ========== СЦЕНАРИЙ 3 СЕРИИ ==========

// АВАТАРКИ
const avatars = {
    default: "image/avtor.jpg",
    ksusha2: "image/ksusha2.jpg",
    alice2: "image/alice2.jpg",
    arturmikaelyan: "image/arturmikaelyan.jpg",
    yanasemakina: "image/yanasemakina.jpg",
    budeiko: "image/budeiko.jpg",
    kristina: "image/kristina.jpg",
    anton: "image/anton.jpg",
    mashabelova: "image/mashabelova.jpg"
};

function getAvatar(speaker) {
    const name = speaker.toLowerCase();
    
    // ВСЕГДА ВТОРЫЕ АВАТАРКИ
    if (name.includes("ксюша")) return avatars.ksusha2;
    if (name.includes("алиса")) return avatars.alice2;
    if (name.includes("артур микаэлян") || name.includes("артур")) return avatars.arturmikaelyan;
    if (name.includes("яна семакина") || name.includes("яна")) return avatars.yanasemakina;
    if (name.includes("будэйко") || name.includes("валентин")) return avatars.budeiko;
    if (name.includes("кристина")) return avatars.kristina;
    if (name.includes("антон")) return avatars.anton;
    if (name.includes("маша белова") || name.includes("маша")) return avatars.mashabelova;
    
    return avatars.default;
}

// ФОНЫ
const backgrounds = {
    etazh: "image/etazh.jpg",
    arturroom: "image/arturroom.jpg",
    ksusharoom: "image/ksusharoom.jpg",
    studionioly: "image/studionioly.jpg"
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

const MUSIC_URL = 'music/ulalala.mp3';

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
    { speaker: "Артур Микаэлян", text: "ну привет мои новые соседки", bg: "etazh" },
    { speaker: "Ксюша", text: "артур микаэлян?", bg: "etazh" },
    { speaker: "Яна Семакина", text: "артур, кто там?", bg: "etazh" },
    { speaker: "Артур Микаэлян", text: "яна, познакомься, это наши новые соседки ксюша и алиса", bg: "etazh" },
    { speaker: "Яна Семакина", text: "это те самые что ли?", bg: "etazh" },
    { speaker: "Артур Микаэлян", text: "да, да, они самые", bg: "etazh" },
    { speaker: "Яна Семакина", text: "дайте я на вас хоть посмотрю, вы точно настоящие?", bg: "etazh" },
    { speaker: "Ксюша", text: "яна семакина?", bg: "etazh" },
    { speaker: "Алиса", text: "да, мы настоящие", bg: "etazh" },
    { speaker: "Яна Семакина", text: "глазам своим не верится, заходите к нам, вас надо всем показать", bg: "etazh" },
    { speaker: "Ксюша", text: "кому это всем?", bg: "etazh" },
    { speaker: "Яна Семакина", text: "сейчас все сами увидите, проходите", bg: "etazh" },
    { speaker: "...", text: "в квартире артура и яны", bg: "arturroom" },
    { speaker: "Будэйко", text: "ксюша, алиса, приятно познакомиться, я валентин будэйко", bg: "arturroom" },
    { speaker: "Ксюша", text: "я сейчас в обморок упаду", bg: "arturroom" },
    { speaker: "Кристина", text: "так! никому здесь в обморок падать не надо", bg: "arturroom" },
    { speaker: "Антон", text: "ого, кто у нас тут это в обморок упасть собирается?", bg: "arturroom" },
    { speaker: "Маша Белова", text: "ребят, почему так не гостеприимно? девочки проходите, вы, наверное, устали? давайте я вам чай налью", bg: "arturroom" },
    { speaker: "Яна Семакина", text: "да, да, проходите, что вы встали на пороге то", bg: "arturroom" },
    { speaker: "...", text: "ксюша и алиса прошли на кухню", bg: "arturroom" },
    { speaker: "Антон", text: "располагайтесь девчонки", bg: "arturroom" },
    { speaker: "Маша Белова", text: "вот ваш чай", bg: "arturroom" },
    { speaker: "Яна Семакина", text: "ну что рассказывайте, как ваши дела", bg: "arturroom" },
    { speaker: "Ксюша", text: "да все хорошо, просто мы устали сильно и голова кругом от происходящего", bg: "arturroom" },
    { speaker: "Артур Микаэлян", text: "я хочу с вами поделиться одним секретом, который прольет свет на вашу загадку", bg: "arturroom" },
    { speaker: "Алиса", text: "каким?", bg: "arturroom" },
    { speaker: "Артур Микаэлян", text: "по слухам, кроме основного способа, существует второй способ сюда попасть", bg: "arturroom" },
    { speaker: "Ксюша", text: "какой?", bg: "arturroom" },
    { speaker: "Артур Микаэлян", text: "сразу говорю, что это все не точно", bg: "arturroom" },
    { speaker: "Артур Микаэлян", text: "короче пока вы спали, кто то мог пробраться в ваши подсознания и переместить вас сюда специально", bg: "arturroom" },
    { speaker: "Будэйко", text: "такие люди называются - онейроманты!", bg: "arturroom" },
    { speaker: "Артур Микаэлян", text: "да, вот они", bg: "arturroom" },
    { speaker: "Артур Микаэлян", text: "но мне казалось, что если такие и были, то они давно вымерли и сейчас таких нет", bg: "arturroom" },
    { speaker: "Кристина", text: "короче кто то проникнул в ваш сон и в сновидении провел вас в селебовуд", bg: "arturroom" },
    { speaker: "Будэйко", text: "а как известно,сном можно управлять, поэтому какой то онейромант сделал временную плеш и провел вас через неё", bg: "arturroom" },
    { speaker: "Алиса", text: "ничего не понимаю, почему все так сложно", bg: "arturroom" },
    { speaker: "Ксюша", text: "и кому вообще это надо", bg: "arturroom" },
    { speaker: "Алиса", text: "и откуда в нашем мире мог вообще взяться онейромант", bg: "arturroom" },
    { speaker: "Ксюша", text: "и как этот человек вообще узнал о селебовуде", bg: "arturroom" },
    { speaker: "Кристина", text: "так, слишком много вопросов, мы все равно не знаем на них ответ", bg: "arturroom" },
    { speaker: "Яна Семакина", text: "девочки, идите лучше домой", bg: "arturroom" },
    { speaker: "Будэйко", text: "как говорится - утром вечера мудренее", bg: "arturroom" },
    { speaker: "Маша Белова", text: "вам стоит поговорить на эту тему с полиной ниоли", bg: "arturroom" },
    { speaker: "Антон", text: "да, она как создательница селебовуда должна больше знать", bg: "arturroom" },
    { speaker: "Ксюша", text: "чтож, спасибо вам за информацию, мы тогда пошли", bg: "arturroom" },
    { speaker: "...", text: "ксюша и алиса ушли к себе", bg: "ksusharoom" },
    { speaker: "Алиса", text: "офигеть, наши соседи это актеры из сериала универ. новая общага", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "я до сих пор не могу поверить в происходящее", bg: "ksusharoom" },
    { speaker: "Алиса", text: "давай ложиться спать, уже поздно", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "ага, а завтра я тогда поговорю с полиной ниоли", bg: "ksusharoom" },
    { speaker: "Алиса", text: "а я с инстасамкой", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "спокойной ночи, алиса", bg: "ksusharoom" },
    { speaker: "Алиса", text: "спокойной ночи, ксюша", bg: "ksusharoom" },
    { speaker: "...", text: "на следующее утро", bg: "ksusharoom" },
    { speaker: "Алиса", text: "доброе утро ксюша", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "доброе", bg: "ksusharoom" },
    { speaker: "...", text: "за кухонным столом", bg: "ksusharoom" },
    { speaker: "...", text: "девочки пьют чай", bg: "ksusharoom" },
    { speaker: "Алиса", text: "ксюш, а тебе не кажется странным, что за эти два дня нам не писали и не звонили друзья и родители", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "точно, я вообще об этом не задумывалась", bg: "ksusharoom" },
    { speaker: "Алиса", text: "мы же тупо оставили всю личную жизнь, учебу, наших бойфрендов и друзей, родителей и тд", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "ну это легко объяснить, нам было не до этого, столько событий произошло и сразу на голову это все свалилось", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "надо позвонить всем и рассказать обо всем", bg: "ksusharoom" },
    { speaker: "...", text: "ксюша и алиса подошли к своим телефонам", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "что то странное происходит, это же 17 про макс, а у меня 15 был", bg: "ksusharoom" },
    { speaker: "Алиса", text: "странно, у меня тоже", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "а где тогда наши телефоны?", bg: "ksusharoom" },
    { speaker: "Алиса", text: "походу в новосибирске", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "кабздец, нас походу ищут сейчас тупо все", bg: "ksusharoom" },
    { speaker: "Алиса", text: "каринэ уже в розыск нас подала", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "я номер кати помню, сейчас наберу ей", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "странно, номер не набирается", bg: "ksusharoom" },
    { speaker: "Алиса", text: "это как?", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "ну я ввожу катин номер, а мне пишет, что такого номера не существует", bg: "ksusharoom" },
    { speaker: "Алиса", text: "это значит, что в селебовуде какие то селебские телефоны и здесь можно вводить только номера селеб", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "ладно, я сегодня поеду к полине ниоли и во всем разберусь", bg: "ksusharoom" },
    { speaker: "Алиса", text: "надо уже собираться", bg: "ksusharoom" },
    { speaker: "...", text: "ксюша и алиса уже собрались", bg: "ksusharoom" },
    { speaker: "...", text: "через какое то время на студии ниоли", bg: "studionioly" },
    { speaker: "Ксюша", text: "полина ниоли, пришло время тебе все нам рассказать...", bg: "studionioly" },
    { speaker: "...", text: "ПРОДОЛЖЕНИЕ СЛЕДУЕТ...", bg: "studionioly" }
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
        if (dialogueText) dialogueText.innerText = "Переход на 4 серию...";
        setTimeout(() => { 
            window.location.href = "episode4.html";
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

function goToNextScene() {
    if (waitingForChoice || waitingForCutscene) return;
    if (currentSceneIndex < scenes.length - 1) {
        currentSceneIndex++;
        showScene(currentSceneIndex);
    } else {
        if (dialogueBox) dialogueBox.style.cursor = "default";
        if (speakerName) speakerName.innerText = "КОНЕЦ СЕРИИ";
        if (dialogueText) dialogueText.innerText = "Переход на 4 серию...";
        setTimeout(() => { 
            window.location.href = "episode4.html";
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