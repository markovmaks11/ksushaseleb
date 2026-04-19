// ========== СЦЕНАРИЙ 4 СЕРИИ ==========

// АВАТАРКИ
const avatars = {
    default: "image/avtor.jpg",
    ksusha2: "image/ksusha2.jpg",
    alice2: "image/alice2.jpg",
    polinanioly: "image/polinanioly.png",
    instasamka: "image/instasamka.jpg",
    dimamatveev: "image/dimtriymaslennikov.png",
    policeman: "image/police.jpg",
    bushido: "image/bushido.jpg"
};

function getAvatar(speaker) {
    const name = speaker.toLowerCase();
    
    if (name.includes("ксюша")) return avatars.ksusha2;
    if (name.includes("алиса")) return avatars.alice2;
    if (name.includes("полина ниоли") || name.includes("polina")) return avatars.polinanioly;
    if (name.includes("инстасамка") || name.includes("instasamka")) return avatars.instasamka;
    if (name.includes("дима матвеев") || name.includes("матвеев")) return avatars.dimamatveev;
    if (name.includes("бушидо") || name.includes("bushido")) return avatars.bushido;
    if (name.includes("полицейский")) return avatars.policeman;
    
    // Для всех остальных (включая "...") показываем avtor.jpg
    return avatars.default;
}

// ФОНЫ
const backgrounds = {
    studionioly: "image/studionioly.jpg",
    studio: "image/studio.jpeg",
    ksusharoom: "image/ksusharoom.jpg",
    etazh: "image/etazh.jpg"
};

// ========== ПЕРЕМЕННАЯ ДЛЯ ПСЕВДОНИМА ==========
let aliceNickname = localStorage.getItem('aliceNickname') || 'SAAKYAMOMSTER';

// Функция для немедленного обновления всех диалогов с псевдонимом
function updateAllDialoguesWithNickname() {
    // Обновляем сцены в массиве
    for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        if (scene.speaker === "Инстасамка" && scene.originalText) {
            scene.text = scene.originalText.replace(/\{NICKNAME\}/g, aliceNickname);
        }
        if (scene.speaker === "nickname_prompt") {
            scene.text = "отлично, теперь ты будешь известна как " + aliceNickname;
        }
    }
    
    // Обновляем текущий диалог на экране
    if (speakerName && dialogueText && speakerName.innerText === "Инстасамка") {
        const currentSpeaker = speakerName.innerText;
        const currentDisplayText = dialogueText.innerText;
        // Заменяем старый псевдоним на новый в отображаемом тексте
        dialogueText.innerText = currentDisplayText.replace(/[A-Za-zА-Яа-я0-9_]+/g, aliceNickname);
    }
}

// Функция для показа панели ввода псевдонима (как в Клубе Романтики)
async function askForNickname() {
    return new Promise((resolve) => {
        const panel = document.getElementById('nicknamePanel');
        const input = document.getElementById('nicknameInput');
        const confirmBtn = document.getElementById('nicknameConfirm');
        
        if (!panel) {
            resolve();
            return;
        }
        
        input.value = aliceNickname;
        panel.classList.add('active');
        input.focus();
        
        const onConfirm = () => {
            let newNickname = input.value.trim();
            if (newNickname === "") {
                newNickname = aliceNickname;
            }
            
            if (newNickname !== aliceNickname) {
                aliceNickname = newNickname;
                localStorage.setItem('aliceNickname', aliceNickname);
                updateAllDialoguesWithNickname();
            }
            
            panel.classList.remove('active');
            confirmBtn.removeEventListener('click', onConfirm);
            input.removeEventListener('keypress', onEnter);
            resolve();
        };
        
        const onEnter = (e) => {
            if (e.key === 'Enter') {
                onConfirm();
            }
        };
        
        confirmBtn.addEventListener('click', onConfirm);
        input.addEventListener('keypress', onEnter);
    });
}

// ========== ВИДЕО ==========
function showVideo() {
    return new Promise((resolve) => {
        const overlay = document.getElementById('videoOverlay');
        const video = document.getElementById('videoPlayer');
        const closeBtn = document.getElementById('videoCloseBtn');
        
        if (!overlay || !video) {
            resolve();
            return;
        }
        
        overlay.classList.add('active');
        video.play();
        
        const onClose = () => {
            video.pause();
            overlay.classList.remove('active');
            closeBtn.removeEventListener('click', onClose);
            video.removeEventListener('ended', onVideoEnd);
            resolve();
        };
        
        const onVideoEnd = () => {
            onClose();
        };
        
        closeBtn.addEventListener('click', onClose);
        video.addEventListener('ended', onVideoEnd);
    });
}

// ========== МУЗЫКА ДЛЯ ПЕСНИ (запускается без задержки) ==========
let songMusic = null;
let songPlaying = false;

function playSong() {
    if (songMusic) {
        songMusic.pause();
        songMusic = null;
    }
    songMusic = new Audio('music/momster.mp3');
    songMusic.loop = false;
    songMusic.volume = musicVolume;
    songMusic.play().catch(e => console.log("не удалось запустить песню"));
    songPlaying = true;
}

function stopSong() {
    if (songMusic) {
        songMusic.pause();
        songMusic = null;
    }
    songPlaying = false;
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
        if (!waitingForChoice && !autoReadPaused && !waitingForCutscene && !waitingForVideo && !waitingForNickname) {
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
    if (autoReadEnabled && !waitingForCutscene && !waitingForVideo && !waitingForNickname) {
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

// ========== МУЗЫКА ФОНОВАЯ ==========
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
    if (songMusic) songMusic.volume = volume;
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

// ========== СЦЕНЫ С ПЛЕЙСХОЛДЕРОМ ДЛЯ ПСЕВДОНИМА ==========
let scenes = [
    { speaker: "...", text: "ксюша поехала к полине ниоли", bg: "studionioly", originalText: null },
    { speaker: "Полина Ниоли", text: "ксюша, я рада, что ты приехала. присаживайся", bg: "studionioly", originalText: null },
    { speaker: "Ксюша", text: "полина, мне нужно узнать, как позвонить домой. я переживаю за родителей", bg: "studionioly", originalText: null },
    { speaker: "Полина Ниоли", text: "понимаю, но в селебовуде специальные селебские телефоны", bg: "studionioly", originalText: null },
    { speaker: "Полина Ниоли", text: "чтобы ты могла позвонить родителям, тебе сначала нужно стать селебой", bg: "studionioly", originalText: null },
    { speaker: "Ксюша", text: "и как это сделать?", bg: "studionioly", originalText: null },
    { speaker: "Полина Ниоли", text: "у меня есть идея. ты будешь сниматься в 'битве экстрасенсов'", bg: "studionioly", originalText: null },
    { speaker: "Ксюша", text: "в битве экстрасенсов? но я же не экстрасенс", bg: "studionioly", originalText: null },
    { speaker: "Полина Ниоли", text: "главное не это. тебе нужно сблизиться с димой матвеевым", bg: "studionioly", originalText: null },
    { speaker: "Ксюша", text: "с димой матвеевым? зачем?", bg: "studionioly", originalText: null },
    { speaker: "Полина Ниоли", text: "он поможет вам выбраться отсюда. поверь мне", bg: "studionioly", originalText: null },
    { speaker: "Ксюша", text: "хорошо, я согласна", bg: "studionioly", originalText: null },
    { speaker: "Полина Ниоли", text: "отлично. я договорюсь о твоем участии", bg: "studionioly", originalText: null },
    { speaker: "...", text: "тем временем алисе позвонила инстасамка", bg: "ksusharoom", originalText: null },
    { speaker: "Алиса", text: "алло?", bg: "ksusharoom", originalText: null },
    { speaker: "Инстасамка", text: "алиса, привет! это инстасамка. приезжай на студию, будем писать хит", bg: "ksusharoom", originalText: null },
    { speaker: "Алиса", text: "прямо сейчас?", bg: "ksusharoom", originalText: null },
    { speaker: "Инстасамка", text: "да, жду тебя. адрес скинула в сообщении", bg: "ksusharoom", originalText: null },
    { speaker: "...", text: "алиса приехала на студию", bg: "studio", originalText: null },
    { speaker: "Инстасамка", text: "алиса, привет! проходи, знакомься. это наша команда", bg: "studio", originalText: null },
    { speaker: "Алиса", text: "привет, очень рада познакомиться", bg: "studio", originalText: null },
    { speaker: "Инстасамка", text: "прежде чем начать, нам нужно придумать тебе псевдоним", bg: "studio", originalText: null },
    { speaker: "Алиса", text: "псевдоним?", bg: "studio", originalText: null },
    { speaker: "Инстасамка", text: "да, у каждого селебы должен быть псевдоним. придумай что-нибудь", bg: "studio", originalText: null },
    { speaker: "nickname_prompt", text: "введи свой псевдоним", bg: "studio", originalText: null },
    { speaker: "...", text: "отлично, теперь ты будешь известна как " + aliceNickname, bg: "studio", originalText: null },
    { speaker: "Инстасамка", text: "итак, {NICKNAME}, готова писать хит?", bg: "studio", originalText: "итак, {NICKNAME}, готова писать хит?" },
    { speaker: "Алиса", text: "да, готова", bg: "studio", originalText: null },
    { speaker: "...", text: "они зовут меня mommy and monster, получается я momster", bg: "studio", originalText: null },
    { speaker: "...", text: "у нищих на завтрак омлет, у меня лобстер", bg: "studio", originalText: null },
    { speaker: "...", text: "я настолько сексуальна, он называет меня постер", bg: "studio", originalText: null },
    { speaker: "...", text: "я приношу в семью bread, я - тостер", bg: "studio", originalText: null },
    { speaker: "...", text: "without sex im self-sufficient. I will step on your ribs cuz you are not deficient", bg: "studio", originalText: null },
    { speaker: "...", text: "I do it like a pro cuz im proficient. im like dima matveev, im also omniscient", bg: "studio", originalText: null },
    { speaker: "...", text: "могу на русском, могу и на английском - it doesn't matter", bg: "studio", originalText: null },
    { speaker: "...", text: "bitches меня любят, потому что я с каждым годом better", bg: "studio", originalText: null },
    { speaker: "...", text: "мне писал в dm guf и умолял вступить в centr", bg: "studio", originalText: null },
    { speaker: "...", text: "я малышка рок звезда считай мои проценты", bg: "studio", originalText: null },
    { speaker: "...", text: "я главная во всем, мои оппы мне не конкуренты", bg: "studio", originalText: null },
    { speaker: "...", text: "они зовут меня mommy and monster, получается я momster", bg: "studio", originalText: null },
    { speaker: "...", text: "у нищих на завтрак омлет, у меня лобстер", bg: "studio", originalText: null },
    { speaker: "...", text: "я настолько сексуальна, он называет меня poster", bg: "studio", originalText: null },
    { speaker: "...", text: "я приношу в семью bread, я - тостер", bg: "studio", originalText: null },
    { speaker: "Инстасамка", text: "вау, {NICKNAME}, это реально круто! хит готов", bg: "studio", originalText: "вау, {NICKNAME}, это реально круто! хит готов" },
    { speaker: "Алиса", text: "правда? тебе понравилось?", bg: "studio", originalText: null },
    { speaker: "Инстасамка", text: "это бомба! теперь нужно снять сниппет", bg: "studio", originalText: null },
    { speaker: "Алиса", text: "прямо сейчас?", bg: "studio", originalText: null },
    { speaker: "Инстасамка", text: "да, команда уже ждет. поехали", bg: "studio", originalText: null },
    { speaker: "...", text: "алиса и инстасамка приехали на съемочную площадку", bg: "studio", originalText: null },
    { speaker: "Инстасамка", text: "все готово? камера, мотор, поехали!", bg: "studio", originalText: null },
    { speaker: "video", text: "alicesnippet.mp4", bg: "studio", originalText: null },
    { speaker: "...", text: "съемки прошли отлично", bg: "studio", originalText: null },
    { speaker: "Инстасамка", text: "{NICKNAME}, ты суперзвезда! сниппет получился шикарным", bg: "studio", originalText: "{NICKNAME}, ты суперзвезда! сниппет получился шикарным" },
    { speaker: "Алиса", text: "спасибо тебе огромное", bg: "studio", originalText: null },
    { speaker: "Инстасамка", text: "отдыхай, а завтра продолжим", bg: "studio", originalText: null },
    { speaker: "...", text: "вечером алиса и ксюша встретились дома", bg: "ksusharoom", originalText: null },
    { speaker: "Алиса", text: "ксюша, у меня новости! я написала хит и сняла сниппет", bg: "ksusharoom", originalText: null },
    { speaker: "Ксюша", text: "серьезно? это же круто!", bg: "ksusharoom", originalText: null },
    { speaker: "Алиса", text: "а у тебя что?", bg: "ksusharoom", originalText: null },
    { speaker: "Ксюша", text: "я была у полины ниоли. она рассказала, чтобы позвонить родителям, нужно стать селебой", bg: "ksusharoom", originalText: null },
    { speaker: "Алиса", text: "и как это сделать?", bg: "ksusharoom", originalText: null },
    { speaker: "Ксюша", text: "полина пропихнет меня на съемки в 'битву экстрасенсов'", bg: "ksusharoom", originalText: null },
    { speaker: "Алиса", text: "зачем?", bg: "ksusharoom", originalText: null },
    { speaker: "Ксюша", text: "я должна познакомиться с димой матвеевым. он поможет нам выбраться отсюда", bg: "ksusharoom", originalText: null },
    { speaker: "Алиса", text: "дима матвеев? тот самый?", bg: "ksusharoom", originalText: null },
    { speaker: "Ксюша", text: "да, тот самый", bg: "ksusharoom", originalText: null },
    { speaker: "Алиса", text: "у нас реально есть шанс выбраться?", bg: "ksusharoom", originalText: null },
    { speaker: "Ксюша", text: "я надеюсь. уже поздно, давай ложиться спать", bg: "ksusharoom", originalText: null },
    { speaker: "Алиса", text: "да, завтра будет новый день", bg: "ksusharoom", originalText: null },
    { speaker: "...", text: "девочки легли спать", bg: "ksusharoom", originalText: null },
    { speaker: "...", text: "но через пару часов в их квартиру ворвалась полиция", bg: "ksusharoom", originalText: null },
    { speaker: "Полицейский", text: "всем не двигаться! вы арестованы", bg: "ksusharoom", originalText: null },
    { speaker: "Ксюша", text: "что происходит? за что?", bg: "ksusharoom", originalText: null },
    { speaker: "Алиса", text: "вы кто?", bg: "ksusharoom", originalText: null },
    { speaker: "Полицейский", text: "мы из отдела по борьбе с нелегальными селебами", bg: "ksusharoom", originalText: null },
    { speaker: "Алиса", text: "погодите... вы же... бушидо жо?", bg: "ksusharoom", originalText: null },
    { speaker: "Бушидо Жо", text: "тихо, я сказал. вы поедете с нами", bg: "ksusharoom", originalText: null },
    { speaker: "Ксюша", text: "за что нас забирают?", bg: "ksusharoom", originalText: null },
    { speaker: "Бушидо Жо", text: "разберемся на месте", bg: "ksusharoom", originalText: null },
    { speaker: "...", text: "ПРОДОЛЖЕНИЕ СЛЕДУЕТ...", bg: "ksusharoom", originalText: null }
];

// Функция для замены плейсхолдера на актуальный псевдоним
function updateNicknameInScenes() {
    for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        if (scene.originalText) {
            scene.text = scene.originalText.replace(/\{NICKNAME\}/g, aliceNickname);
        }
        if (scene.speaker === "nickname_prompt") {
            scene.text = "отлично, теперь ты будешь известна как " + aliceNickname;
        }
    }
}

// Запускаем обновление псевдонима при загрузке
updateNicknameInScenes();

// ========== КОД ДЛЯ РАБОТЫ НОВЕЛЛЫ ==========
let currentSceneIndex = 0;
let waitingForChoice = false;
let waitingForCutscene = false;
let waitingForVideo = false;
let waitingForNickname = false;

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
    if (avatarImg && speaker !== "cutscene" && speaker !== "video" && speaker !== "nickname_prompt") {
        // Если speaker пустой или null, используем default
        let speakerName = speaker;
        if (!speakerName || speakerName === "" || speakerName === "...") {
            speakerName = "...";
        }
        avatarImg.src = getAvatar(speakerName);
        const container = document.querySelector('.avatar-container');
        if (container) {
            container.style.animation = 'none';
            setTimeout(() => { container.style.animation = 'avatarPop 0.4s ease-out'; }, 10);
        }
    }
}

async function showScene(index) {
    if (index >= scenes.length) {
        stopSong();
        if (speakerName) speakerName.innerText = "КОНЕЦ СЕРИИ";
        if (dialogueText) dialogueText.innerText = "Возвращение в меню...";
        setTimeout(() => { 
            window.location.href = "../index.html";
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
    
    if (scene.speaker === "video") {
        waitingForVideo = true;
        await showVideo();
        waitingForVideo = false;
        currentSceneIndex++;
        showScene(currentSceneIndex);
        return;
    }
    
    if (scene.speaker === "nickname_prompt") {
        waitingForNickname = true;
        await askForNickname();
        waitingForNickname = false;
        currentSceneIndex++;
        showScene(currentSceneIndex);
        return;
    }
    
    // Запуск песни ДО того, как текст появится на экране
    if (currentSceneIndex === 26 && !songPlaying) {
        playSong();
    }
    
    // Остановка песни после текста
    if (currentSceneIndex === 42 && songPlaying) {
        stopSong();
    }
    
    if (speakerName) speakerName.innerText = scene.speaker;
    if (dialogueText) dialogueText.innerText = scene.text;
    setBackground(scene.bg);
    updateAvatar(scene.speaker);
    updateProgress();
}

function goToNextScene() {
    if (waitingForChoice || waitingForCutscene || waitingForVideo || waitingForNickname) return;
    if (currentSceneIndex < scenes.length - 1) {
        currentSceneIndex++;
        showScene(currentSceneIndex);
    } else {
        if (dialogueBox) dialogueBox.style.cursor = "default";
        if (speakerName) speakerName.innerText = "КОНЕЦ СЕРИИ";
        if (dialogueText) dialogueText.innerText = "Возвращение в меню...";
        setTimeout(() => { 
            window.location.href = "../index.html";
        }, 2000);
    }
}

document.addEventListener('click', (e) => {
    if (waitingForChoice || waitingForCutscene || waitingForVideo || waitingForNickname) return;
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