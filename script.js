// =====================================
// ELEMENTS
// =====================================

const screen = document.getElementById("screen");

const popupOverlay = document.getElementById("popupOverlay");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupBtn = document.getElementById("popupBtn");

const progressFill = document.getElementById("progressFill");

const heartContainer = document.getElementById("heartContainer");
const burstContainer = document.getElementById("burstContainer");

// =====================================
// APP STATE
// =====================================

let userName = "";

let currentQuestion = 0;
let answers = [];

const SHEET_URL = "https://script.google.com/macros/s/AKfycbxVEXjjAdNi3GwfDOWRmWPkn7i6rmxRvrYbzPkX__dKCrzaINvbvc5fx4trgMtrMO93/exec";
let noClickCount = 0;

// =====================================
// START
// =====================================

showNameScreen();

// =====================================
// NAME SCREEN
// =====================================

function showNameScreen() {

    document.body.className = "blue";

    progressFill.style.width = "0%";

    screen.innerHTML = `

        <h1>${CONFIG.appName}</h1>

        <p>Before we begin...</p>

        <input
            id="nameInput"
            placeholder="Enter your name">

        <button id="continueBtn">

            Continue →

        </button>

    `;

    document
        .getElementById("continueBtn")
        .onclick = saveName;

}

// =====================================
// SAVE NAME
// =====================================

function saveName() {

    const input =
    document.getElementById("nameInput");

    userName =
    input.value.trim();

    if (userName === "") {

        showPopup(

            "⚠️ Name Required",

            "Please enter your name first."

        );

        return;

    }

    currentQuestion = 0;

    showQuestion();

}

// =====================================
// SHOW QUESTION
// =====================================

function showQuestion() {

    const q =
    CONFIG.questions[currentQuestion];

    document.body.className =
    q.theme;

    progressFill.style.width =
        ((currentQuestion + 1) /
        CONFIG.questions.length) * 100 + "%";

    const title =

        currentQuestion === 0

        ? `<h4>Hi ${userName} 👋</h4>`

        : "";

    screen.innerHTML = `

        ${title}

        <p class="question">

            ${q.question.replaceAll("{name}", userName)}

        </p>

        <div class="buttons">

            <button id="yesBtn">

                ${q.yesText || CONFIG.defaultYesText}

            </button>

            <button id="noBtn">

                ${q.noText || CONFIG.defaultNoText}

            </button>

        </div>

    `;

    document
       document.getElementById("yesBtn").onclick = () => {

    answers[currentQuestion] = "Yes";

    nextQuestion();

};

    document
        .getElementById("noBtn")
        .onclick = noClicked;

}
// =====================================
// NEXT QUESTION
// =====================================

function nextQuestion() {

    heartBurst();

    currentQuestion++;
    noClickCount = 0;

    if (currentQuestion >= CONFIG.questions.length) {

        showFinalScreen();
        return;

    }

    showQuestion();

}

// =====================================
// NO BUTTON
// =====================================



function noClicked() {

    const q = CONFIG.questions[currentQuestion];
answers[currentQuestion] = "No";
    noClickCount++;
popupSound.pause();
popupSound.currentTime = 0;
popupOverlay.classList.add("hidden");
    showPopup(
        q.popupTitle,
        q.popupMessage.replaceAll("{name}", userName)
    );

    const noBtn = document.getElementById("noBtn");

    // লেখা পরিবর্তন
    if (CONFIG.noTexts[noClickCount - 1]) {

        noBtn.innerHTML =
            CONFIG.noTexts[noClickCount - 1];

    }

    // 2 বার পর Button পালাবে
    if (noClickCount >= CONFIG.noEscapeAfter) {

        moveNoButton(noBtn);

    }
}
// =====================================
// MOVE NO BUTTON
// =====================================

function moveNoButton(btn) {

    const maxX = 120;
    const maxY = 70;

    const x =
        Math.random() * maxX - maxX / 2;

    const y =
        Math.random() * maxY - maxY / 2;

    btn.style.transform =
        `translate(${x}px, ${y}px)`;

}

// =====================================
// POPUP
// =====================================

function showPopup(title, message) {

    // Popup Sound
    popupSound.pause();
    popupSound.currentTime = 0;
    popupSound.volume = 0.6;
    popupSound.play().catch(() => {});

    popupTitle.innerHTML = title;

    popupMessage.innerHTML = message;

    popupOverlay.classList.remove("hidden");

}

// =====================================
// HEART BURST
// =====================================

function heartBurst() {

    for (let i = 0; i < 10; i++) {

        const heart =
            document.createElement("div");

        heart.className = "burstHeart";

        heart.innerHTML = "❤️";

        heart.style.left = "50%";
        heart.style.top = "55%";

        heart.style.setProperty(
            "--x",
            (Math.random() * 220 - 110) + "px"
        );

        heart.style.setProperty(
            "--y",
            (Math.random() * 220 - 110) + "px"
        );

        burstContainer.appendChild(heart);

        setTimeout(() => {

            heart.remove();

        }, 900);

    }

}
// =====================================
// FLOATING HEARTS
// =====================================

startHearts();

function startHearts() {

    setInterval(createHeart, 800);

}

function createHeart() {

    const heart = document.createElement("div");

    heart.className = "heart";

    heart.innerHTML = "❤️";

    heart.style.left = Math.random() * 100 + "%";

    heart.style.fontSize =
        (18 + Math.random() * 18) + "px";

    heart.style.animationDuration =
        (4 + Math.random() * 3) + "s";

    heartContainer.appendChild(heart);

    setTimeout(() => {

        heart.remove();

    }, 7000);

}

// =====================================
// FINAL SCREEN
// =====================================

function showFinalScreen() {
sendAnswersToSheet();
    document.body.className = "red";

    screen.innerHTML = `

        <h1 class="final-title">

            ${CONFIG.finalTitle}

        </h1>

        <p
        style="
        font-size:22px;
        margin-top:20px;
        line-height:1.8;
        ">

            ${CONFIG.finalMessage}

        </p>

        <br>

        <button id="letterBtn">

            ${CONFIG.finalButtonText}

        </button>

    `;

    document

        .getElementById("letterBtn")

        .onclick = startHeartScan;

}



// =====================================
// RESTART
// =====================================

function restartApp() {

    currentQuestion = 0;

    noClickCount = 0;

    userName = "";

    popupOverlay.classList.add("hidden");

    showNameScreen();

}
// =====================================
// V1.5 COMPLETE
// EXTRA EFFECTS
// =====================================

// Smooth popup close

popupOverlay.addEventListener("click",(e)=>{

    if(e.target===popupOverlay){

        popupOverlay.classList.add("hidden");

    }

});

// =====================================
// BETTER NO BUTTON
// =====================================

function moveNoButton(btn){

    const container=document.querySelector(".buttons");

    const area=container.getBoundingClientRect();

    const btnWidth=btn.offsetWidth;

    const btnHeight=btn.offsetHeight;

    const x=Math.random()*(area.width-btnWidth);

    const y=(Math.random()*160)-80;

    btn.style.position="relative";

    btn.style.left=x+"px";

    btn.style.top=y+"px";

}

// =====================================
// BUTTON ANIMATION
// =====================================

document.addEventListener("click",(e)=>{

    if(e.target.id==="yesBtn"){

        e.target.animate([

            {

                transform:"scale(1)"

            },

            {

                transform:"scale(1.15)"

            },

            {

                transform:"scale(1)"

            }

        ],{

            duration:300

        });

    }

});

// =====================================
// PAGE FADE
// =====================================

function fadeScreen(){

    screen.animate([

        {

            opacity:0

        },

        {

            opacity:1

        }

    ],{

        duration:250

    });

}

// showQuestion-এর পরে animation
const oldShowQuestion = showQuestion;

showQuestion = function(){

    oldShowQuestion();

    fadeScreen();

};
// =====================================
// LOVE LETTER
// =====================================

function openLoveLetter() {

    document.body.className = "pink";

    const letter = CONFIG.loveLetter.replaceAll(
        "{name}",
        userName
    );

    screen.innerHTML = `

        <h1>💌 Love Letter</h1>

        <div id="letterBox">

            <p id="letterText"></p>

        </div>

    `;

    typeLetter(letter);

}

// =====================================
// TYPEWRITER
// =====================================

function typeLetter(text) {

    const target =
    document.getElementById("letterText");

    let i = 0;

    function typing() {

        if (i < text.length) {

            target.innerHTML += text.charAt(i);

            i++;

            setTimeout(typing, 35);

        }

    }

    typing();

}
// =====================================
// HEART RAIN
// =====================================

function startHeartRain() {

    const rain = setInterval(() => {

        const heart = document.createElement("div");

        heart.className = "rainHeart";

        heart.innerHTML = CONFIG.heartEmoji;

        heart.style.left = Math.random() * 100 + "%";

        heart.style.fontSize =
            (18 + Math.random() * 22) + "px";

        heart.style.animationDuration =
            (3 + Math.random() * 2) + "s";

        document.body.appendChild(heart);

        setTimeout(() => {

            heart.remove();

        }, 5000);

    }, 180);

    // 20 সেকেন্ড পরে Rain বন্ধ
    setTimeout(() => {

        clearInterval(rain);

    }, 8000);

}

// =====================================
// CAMERA FLASH
// =====================================

function flashScreen() {

    const flash =
        document.getElementById("flash");

    flash.classList.add("flash");

    setTimeout(() => {

        flash.classList.remove("flash");

    }, 400);

}

// =====================================
// FINAL MAGIC
// =====================================

// আগের openLoveLetter() save করি
const oldOpenLoveLetter = openLoveLetter;

// নতুন version
openLoveLetter = function () {
heartSound.currentTime = 0;
heartSound.volume = 0.4;
heartSound.play().catch(() => {});
    flashScreen();

    startHeartRain();

    setTimeout(() => {

        oldOpenLoveLetter();

        // Title beat করবে
        setTimeout(() => {

            const title =
                document.querySelector("#screen h1");

            if (title) {

                title.classList.add("beat");

            }

        }, 300);

    }, 350);

};
// =====================================
// AI HEART SCAN
// =====================================

function startHeartScan() {

    document.body.className = "blue";

    screen.innerHTML = `
 // এখানেই বসাও
    scanSound.currentTime = 0;
    scanSound.play().catch(() => {});
        <h1>🤖 AI Heart Scan</h1>

        <div class="scanBox">

            <div class="scanBar">

                <div id="scanFill"></div>

            </div>

            <p id="scanText">

                Initializing...

            </p>

        </div>

    `;

    const fill = document.getElementById("scanFill");
    const text = document.getElementById("scanText");

    const steps = [

        {
            progress:15,
            text:"Connecting..."
        },

        {
            progress:35,
            text:"Reading Heart..."
        },

        {
            progress:55,
            text:"Checking Honesty..."
        },

        {
            progress:75,
            text:"Almost Done..."
        },

        {
            progress:90,
            text:"❤️ Perfect Match Found..."
        },

        {
            progress:100,
            text:"Made for each other"
        }

    ];

    let i = 0;
function nextStep() {

    if (i >= steps.length) {

        setTimeout(() => {

            openLoveLetter();

        }, 1000);

        return;

    }

    // 🔊 Scan Sound
    scanSound.pause();
    scanSound.currentTime = 0;
    scanSound.volume = 0.4;
    scanSound.play().catch(() => {});

    fill.style.width = steps[i].progress + "%";
    text.innerHTML = steps[i].text;

    i++;

    setTimeout(nextStep, 800);

}

nextStep();
    function nextStep(){

        if(i >= steps.length){

            setTimeout(()=>{

                openLoveLetter();

            },1200);

            return;

        }

        fill.style.width =
        steps[i].progress + "%";

        text.innerHTML =
        steps[i].text;

        i++;

        setTimeout(nextStep,900);

    }

    nextStep();

}// =====================================
// MUSIC SYSTEM
// =====================================

const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

let musicStarted = false;

// Default Volume
bgMusic.volume = 0.30;

// First User Interaction
document.addEventListener("click", startMusicOnce, { once: true });

function startMusicOnce() {

    bgMusic.play()
        .then(() => {

            musicStarted = true;

            musicBtn.innerHTML = "🔊";

        })
        .catch(() => {

            console.log("Music autoplay blocked.");

        });

}

// Music Button
musicBtn.onclick = function () {

    if (!musicStarted) {

        bgMusic.play();

        musicStarted = true;

        musicBtn.innerHTML = "🔊";

        return;

    }

    if (bgMusic.paused) {

        bgMusic.play();

        musicBtn.innerHTML = "🔊";

    } else {

        bgMusic.pause();

        musicBtn.innerHTML = "🔇";

    }

};// =====================================
// SECRET DOOR SYSTEM
// =====================================

const doorOverlay = document.getElementById("doorOverlay");
const secretDoor = document.getElementById("secretDoor");

// Love Letter খোলার আগে Door দেখাবে
const oldStartHeartScan = startHeartScan;

startHeartScan = function () {

    doorOverlay.classList.remove("hiddenDoor");

};

// Door Click

secretDoor.onclick = function () {

    // Door খুলবে
    secretDoor.classList.add("open");

    // Sound effect পরে যোগ করব

    setTimeout(() => {

        flashScreen();

    }, 800);

    setTimeout(() => {

        doorOverlay.classList.add("hiddenDoor");

        // এবার AI Scan শুরু হবে
        oldStartHeartScan();

    }, 1300);

};// =====================================
// DOOR SOUND + USER NAME
// =====================================

const doorSound = document.getElementById("doorSound");

// আগের startHeartScan save
const oldDoorScan = startHeartScan;

// নতুন version
startHeartScan = function () {
scanSound.currentTime = 0;
scanSound.play().catch(() => {});

    document.body.className = "blue";
    // Door Title-এ User Name বসাও
    const title = doorOverlay.querySelector("h2");

    title.innerHTML = `🔐 ${userName}'s Secret Door`;

    doorOverlay.classList.remove("hiddenDoor");

};

// Door Click
secretDoor.onclick = function () {

   doorSound.pause();
doorSound.currentTime = 0;

doorSound.volume = 0.85;

doorSound.play().catch(err => {
    console.log(err);
});

    // Phone Vibration
    if (navigator.vibrate) {
        navigator.vibrate([120, 60, 120]);
    }

    // Screen Shake
    document.body.classList.add("shake");

    setTimeout(() => {
        document.body.classList.remove("shake");
    }, 450);

    // Door Animation
    secretDoor.classList.add("open");

    // Door Light
    const doorLight = document.getElementById("doorLight");
    doorLight.classList.add("active");

    // Music Volume Low
    if (!bgMusic.paused) {
        fadeMusic(0.12);
    }

    // Flash
    setTimeout(() => {
        flashScreen();
    }, 700);

    // Door Close → AI Scan
    setTimeout(() => {

        doorLight.classList.remove("active");
        doorOverlay.classList.add("hiddenDoor");

        if (!bgMusic.paused) {
            fadeMusic(0.30);
        }

        // 🚀 এখানেই সরাসরি AI Scan
        document.body.className = "blue";

        screen.innerHTML = `
            <h1>🤖 AI Heart Scan</h1>

            <div class="scanBox">
                <div class="scanBar">
                    <div id="scanFill"></div>
                </div>

                <p id="scanText">Initializing...</p>
            </div>
        `;

        const fill = document.getElementById("scanFill");
        const text = document.getElementById("scanText");

        const steps = [
            {progress:15,text:"Connecting..."},
            {progress:35,text:"Reading Heart..."},
            {progress:55,text:"Checking Honesty..."},
            {progress:75,text:"Almost Done..."},
            {progress:90,text:"❤️ Perfect Match Found..."},
            {progress:100,text:"Made for each other"}
        ];

        let i = 0;

        function scan(){

            if(i >= steps.length){

                setTimeout(() => {

                    openLoveLetter();

                },1200);

                return;
            }

            fill.style.width = steps[i].progress + "%";
            text.innerHTML = steps[i].text;

            i++;

            setTimeout(scan,900);

        }

        scan();

    },1400);

};function fadeMusic(targetVolume, duration = 800){

    const start = bgMusic.volume;

    const step = 20;

    const diff = targetVolume - start;

    let current = 0;

    const interval = setInterval(()=>{

        current++;

        bgMusic.volume =
        start + (diff * current / step);

        if(current >= step){

            bgMusic.volume = targetVolume;

            clearInterval(interval);

        }

    }, duration / step);

}


if (popupBtn) {
    popupBtn.onclick = function () {

        // Popup hide
        popupOverlay.classList.add("hidden");

        // Stop warning sound
        popupSound.pause();
        popupSound.currentTime = 0;

        // Click sound
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    };
}
function sendAnswersToSheet() {

    fetch(SHEET_URL, {

        method: "POST",

        mode: "no-cors",

        headers: {
            "Content-Type": "text/plain"
        },

        body: JSON.stringify({

            name: userName,

            q1: answers[0] || "",

            q2: answers[1] || "",

            q3: answers[2] || "",

            q4: answers[3] || "",

            q5: answers[4] || "",

            q6: answers[5] || ""

        })

    });

}