// ========== СЦЕНАРИЙ 1 СЕРИИ ==========

// АВАТАРКИ
const avatars = {
    default: "image/avtor.jpg",
    ksusha: "image/ksusha.jpg",
    ksusha2: "image/ksusha2.jpg",
    alice: "image/alice.png",
    alice2: "image/alice2.jpg",
    polinaniely: "image/polinanioly.png",
    morgenshtern: "image/morgenshtern.jpg",
    dilara: "image/dilara.jpg",
    naymayis: "image/ninemice.jpg",
    kaiangel: "image/kaiangel.jpg",
    emmaroberts: "image/emmaroberts.jpg",
    toxis: "image/toxis.png",
    ogbuda: "image/ogbuda.png",
    dmitrynaygiev: "image/dmitriynagiev.png",
    klavakoka: "image/clavakoka.png",
    dmitrymaslennikov: "image/dmitriymaslennikov.png",
    vanyadmitrienko: "image/vanyadmitrienko.png"
};
function getAvatar(speaker, sceneIndex) {
    const name = speaker.toLowerCase();
    
    // Смена аватарок после 22 сцены (индекс 21, так как сцены с 0)
    // 22 диалог по счёту — это сцена с индексом 21
    const isAfterPreparation = currentSceneIndex >= 21;
    
    if ((name.includes("ксюша") || name.includes("ksusha")) && isAfterPreparation) {
        return avatars.ksusha2;
    }
    if (name.includes("ксюша") || name.includes("ksusha")) {
        return avatars.ksusha;
    }
    
    if ((name.includes("алиса") || name.includes("alice")) && isAfterPreparation) {
        return avatars.alice2;
    }
    if (name.includes("алиса") || name.includes("alice")) {
        return avatars.alice;
    }
    
    if (name.includes("полина ниоли") || name.includes("polina")) return avatars.polinaniely;
    if (name.includes("моргенштерн") || name.includes("morgenshtern")) return avatars.morgenshtern;
    if (name.includes("дилара") || name.includes("dilara")) return avatars.dilara;
    if (name.includes("найн майс") || name.includes("naymayis")) return avatars.naymayis;
    if (name.includes("кай энджел") || name.includes("kaiangel")) return avatars.kaiangel;
    if (name.includes("эмма робертс") || name.includes("emma")) return avatars.emmaroberts;
    if (name.includes("токсис") || name.includes("toxis")) return avatars.toxis;
    if (name.includes("og buda") || name.includes("ог буда") || name.includes("гриша")) return avatars.ogbuda;
    if (name.includes("дмитрий нагиев") || name.includes("naygiev")) return avatars.dmitrynaygiev;
    if (name.includes("клава кока") || name.includes("klavakoka")) return avatars.klavakoka;
    if (name.includes("дмитрий масленников") || name.includes("maslennikov")) return avatars.dmitrymaslennikov;
    if (name.includes("ваня дмитриенко") || name.includes("vanya")) return avatars.vanyadmitrienko;
    
    return avatars.default;
}

// ФОНЫ
const backgrounds = {
    ksusharoom: "image/ksusharoom.jpg",
    bustop: "image/busstop.jpg",
    entrance: "image/entrance.jpg",
    club: "image/club.jpg",
    doornextclub: "image/doornextclub.jpg",
    scene: "image/scene.jpg"
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
    { speaker: "...", text: "это был обычный день", bg: "ksusharoom" },
    { speaker: "...", text: "ксюша как обычно проснулась и потянулась", bg: "ksusharoom" },
    { speaker: "...", text: "в спальню заходит алиса", bg: "ksusharoom" },
    { speaker: "Алиса", text: "доброе утро засоня, я принесла нам два кофе", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "как я люблю? раф на лавандовом?", bg: "ksusharoom" },
    { speaker: "Алиса", text: "лучше! раф на кокосовом", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "АЛИСАААА", bg: "ksusharoom" },
    { speaker: "Алиса", text: "ксюшечка, ты помнишь какой сегодня день нас ждет?", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "конечно! мы идем на концерт вани дмитриенко", bg: "ksusharoom" },
    { speaker: "Алиса", text: "значит надо пить и кофе и начинать собираться", bg: "ksusharoom" },
    { speaker: "...", text: "ксюша и алиса начали пить кофе", bg: "ksusharoom" },
    { speaker: "Алиса", text: "как думаешь, как пройдет концерт?", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "мне кажется превосходно", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "я очень жду, когда ваня будет бедрышками эть эть", bg: "ksusharoom" },
    { speaker: "Алиса", text: "КСЮШАААА, мы твин, я тоже обожаю этот его танец", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "тупой ваня, почему он встречается с этой аней пересильд", bg: "ksusharoom" },
    { speaker: "Алиса", text: "а с кем должен?", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "со мной конечно же", bg: "ksusharoom" },
    { speaker: "Алиса", text: "ксюша ты совсем", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "ладно давай собираться нам скоро выходить", bg: "ksusharoom" },
    { speaker: "...", text: "спустя 2 часа ксюша и алиса собрались", bg: "ksusharoom" },
    { speaker: "Алиса", text: "ну что выходим?", bg: "ksusharoom" },
    { speaker: "Ксюша", text: "да, пошли", bg: "ksusharoom" },
    { speaker: "...", text: "ксюша и алиса вышли на улицу", bg: "entrance" },
    { speaker: "...", text: "мимо них прошла полина ниоли", bg: "entrance" },
    { speaker: "Алиса", text: "ксюша, ксюша, ты тоже это видела?", bg: "entrance" },
    { speaker: "Ксюша", text: "это же полина ниоли..", bg: "entrance" },
    { speaker: "Полина Ниоли", text: "девочки это вы мне?", bg: "entrance" },
    { speaker: "Алиса", text: "полина, привет", bg: "entrance" },
    { speaker: "Ксюша", text: "полина, что ты тут делаешь?", bg: "entrance" },
    { speaker: "Полина Ниоли", text: "я подписала в свое агентство талантов нового таланта ваню дмитриенко", bg: "entrance" },
    { speaker: "Полина Ниоли", text: "у него сегодня выступления, где будут селебы", bg: "entrance" },
    { speaker: "Полина Ниоли", text: "я как вип гость пошла смотреть, чтобы он не факапнулся, а ебашил и делал посевы", bg: "entrance" },
    { speaker: "Алиса", text: "о круто, мы тоже идем на концерт вани", bg: "entrance" },
    { speaker: "Полина Ниоли", text: "удачного вам концерта тогда", bg: "entrance" },
    { speaker: "Ксюша", text: "спасибо, тебе тоже удачной работы тогда", bg: "entrance" },
    { speaker: "...", text: "полина ниоли ушла", bg: "entrance" },
    { speaker: "Ксюша", text: "мне это не показалось?", bg: "entrance" },
    { speaker: "Алиса", text: "я задаюсь тем же вопросом", bg: "entrance" },
    { speaker: "...", text: "девочки пошли к остановке", bg: "entrance" },
    { speaker: "...", text: "мимо них проехал моргенштерн с диларой", bg: "busstop" },
    { speaker: "Моргенштерн", text: "девочки, вас подвезти?", bg: "busstop" },
    { speaker: "Ксюша", text: "МОРГЕНШТЕРН?", bg: "busstop" },
    { speaker: "Алиса", text: "ДИЛАРА?", bg: "busstop" },
    { speaker: "...", text: "мимо на машине проехал найн майс и кай энджел", bg: "busstop" },
    { speaker: "Найн Майс", text: "ПОЛНАЯ ДИЛАРА", bg: "busstop" },
    { speaker: "Кай Энджел", text: "липстик, я наношу на себя липстик", bg: "busstop" },
    { speaker: "...", text: "кай и майс уехали", bg: "busstop" },
    { speaker: "Дилара", text: "господи, опять эти", bg: "bustop" },
    { speaker: "Моргенштерн", text: "так че, вас подвезти", bg: "busstop" },
    { speaker: "Ксюша", text: "а вы куда?", bg: "busstop" },
    { speaker: "Дилара", text: "мы на концерт вани дмитриенко", bg: "busstop" },
    { speaker: "Ксюша", text: "мы тоже туда", bg: "busstop" },
    { speaker: "Моргенштерн", text: "ну так запрыгивайте", bg: "busstop" },
    { speaker: "...", text: "ксюша и алиса сели в машину к моргенштерну", bg: "busstop" },
    { speaker: "Моргенштерн", text: "как дела, как дела, это новый каделак", bg: "busstop" },
    { speaker: "...", text: "все приехали на концерт вани дмитриенко", bg: "doornextclub" },
    { speaker: "...", text: "в очереди уже стояло много человек", bg: "doornextclub" },
    { speaker: "Эмма Робертс", text: "hi, morgenshtern, who is it with you?", bg: "doornextclub" },
    { speaker: "Моргенштерн", text: "hi, emma, these are some new people i know", bg: "doornextclub" },
    { speaker: "Эмма Робертс", text: "hmm, okay", bg: "doornextclub" },
    { speaker: "Эмма Робертс", text: "what are your names, girls?", bg: "doornextclub" },
    { speaker: "Ксюша", text: "yo, emma, my name is ksusha", bg: "doornextclub" },
    { speaker: "Алиса", text: "ohh sorry my english very bad, but my friend maksim know english very good", bg: "doornextclub" },
    { speaker: "Ксюша", text: "her name is alice", bg: "doornextclub" },
    { speaker: "Эмма Робертс", text: "nice to meet you!", bg: "doornextclub" },
    { speaker: "Ксюша", text: "nice to meet you too!", bg: "doornextclub" },
    { speaker: "Токсис", text: "привет девчонки, а вы кто? впервые вас вижу в городе селеб", bg: "doornextclub" },
    { speaker: "OG Buda", text: "хэй девчонки, извините моего другана за грубость, я гриша, а он андрей. а вас как зовут?", bg: "doornextclub" },
    { speaker: "Ксюша", text: "город селеб? что? мы разве не в новосибирске?", bg: "doornextclub" },
    { speaker: "Токсис", text: "ну да, мы сейчас в городе селеб - \"селебовуд\".", bg: "doornextclub" },
    { speaker: "Дмитрий Нагиев", text: "да че вы поцы, не грузите девчат", bg: "doornextclub" },
    { speaker: "Алиса", text: "андрей, гриш, если честно мы не знаем, как сюда попали...", bg: "doornextclub" },
    { speaker: "Ксюша", text: "мы обычные студентки из новосибирска, уснули там, а проснулись здесь", bg: "doornextclub" },
    { speaker: "Токсис", text: "это действительно странно, но ладно, разберемся с этим позже", bg: "doornextclub" },
    { speaker: "Клава Кока", text: "че пацаны, как дела, скоро запуск, вы готовы к концерту?", bg: "doornextclub" },
    { speaker: "Клава Кока", text: "о у нас новенькие что ли, как вас зовут?", bg: "doornextclub" },
    { speaker: "OG Buda", text: "мне их даже жалко, им щас всем придется объяснять кто они", bg: "doornextclub" },
    { speaker: "Дмитрий Масленников", text: "у меня идея получше, девочки, вы не хотите сегодня выйти на сцену к ване и представиться всем сразу и рассказать откуда вы", bg: "doornextclub" },
    { speaker: "Ксюша", text: "отличная идея!", bg: "doornextclub" },
    { speaker: "Дмитрий Масленников", text: "ну тогда отлично, сейчас напишу ване и все организуем", bg: "doornextclub" },
    { speaker: "...", text: "двери в концертную площадку открылись и все начали проходить", bg: "doornextclub" },
    { speaker: "...", text: "концерт начался", bg: "scene" },
    { speaker: "Ваня Дмитриенко", text: "до меня дошел слух, что сегодня у нас на площадке две неизвестных девочки", bg: "scene" },
    { speaker: "Ваня Дмитриенко", text: "выйдите пожалуйста на сцену и представьтесь", bg: "scene" },
    { speaker: "...", text: "ксюша и алиса вышли на сцену", bg: "scene" },
    { speaker: "Ксюша", text: "всем привет, меня зовут ксюша, а это моя подруга алиса", bg: "scene" },
    { speaker: "Ксюша", text: "если честно, мы вообще не знаем, как сюда попали", bg: "scene" },
    { speaker: "Алиса", text: "мы обычные студентки из новосибирска, вчера уснули там, а проснулись здесь", bg: "scene" },
    { speaker: "Ваня Дмитриенко", text: "девочки это действительно запутанная история", bg: "scene" },
    { speaker: "Ваня Дмитриенко", text: "зайдите в гримерку после концерта мы во всем разберемся", bg: "scene" },
    { speaker: "...", text: "после концерта вани в гримерке", bg: "club" },
    { speaker: "...", text: "ПРОДОЛЖЕНИЕ СЛЕДУЕТ...", bg: "club" }
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
function updateAvatar(speaker, sceneIndex) {
    if (avatarImg && speaker !== "cutscene") {
        avatarImg.src = getAvatar(speaker, sceneIndex);
        const container = document.querySelector('.avatar-container');
        if (container) {
            container.style.animation = 'none';
            setTimeout(() => { container.style.animation = 'avatarPop 0.4s ease-out'; }, 10);
        }
    }
}

localStorage.setItem('ksusha_episode', 2);
localStorage.setItem('ksusha_season', 1);

async function showScene(index) {
    if (index >= scenes.length) {
        if (speakerName) speakerName.innerText = "КОНЕЦ СЕРИИ";
        if (dialogueText) dialogueText.innerText = "Переход на 2 серию...";
        setTimeout(() => { 
            window.location.href = "episode2.html";
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
   updateAvatar(scene.speaker, currentSceneIndex);
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
        if (dialogueText) dialogueText.innerText = "Переход на 2 серию...";
        setTimeout(() => { 
            window.location.href = "episode2.html";
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