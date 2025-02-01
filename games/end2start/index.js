document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
});

let timer = 10;
let timerInterval;
let usedWords = [];
let score = 0;
let prevWord = "";
let gameEnd = false;
let timerStarted = false;
let used = document.getElementById("used");
let scoreTxt = document.getElementById("score");
let wordInput = document.getElementById("wordInput");
let timerTxt = document.getElementById("timer");
let submitButton = document.querySelector('input[type="submit"]');
let result = document.getElementById("result");
let lastWordTime = 0;
let streakCount = 0;
let lastCorrectTime = Date.now();

function startGame() {
    wordInput.disabled = false;
    submitButton.disabled = false;
}

function startTimer() {
    if (timerStarted) return;
    timerStarted = true;


    timerInterval = setInterval(() => {
        if (timer > 0) {
            timer = Math.max(0, timer - 0.05);
            timerTxt.textContent = timer.toFixed(2);
        }

        if (timer <= 3) {
            timerTxt.classList.add("low-time");
            timerTxt.classList.remove("mid-time");
        } else if (timer <= 5) {
            timerTxt.classList.add("mid-time");
        }
        if (timer <= 0) {
            clearInterval(timerInterval);
            setTimeout(() => {
                if (timer <= 0) gameOver();
            }, 100);
        }

    }, 50); // Runs every 50ms for smooth decrement
}

function adjustTimer() {
    let currentTime = Date.now();

    if (currentTime - lastWordTime <= 2000) {  // If within 2 seconds, increase streak
        streakCount++;
    } else {
        streakCount = 1;
    }

    lastWordTime = currentTime;

    let bonusTime = 0.5 * streakCount;
    timer += bonusTime;

    timerTxt.textContent = timer.toFixed(2);
    showBonusEffect(bonusTime);
}

function showBonusEffect(seconds) {
    let bonusText = document.createElement("div");
    bonusText.className = "bonus-text";
    bonusText.innerText = `+${seconds.toFixed(1)}s`;
    bonusText.style.transform = "translate(100px,0px)";

    let timerContainer = document.querySelector(".score");
    timerContainer.appendChild(bonusText);

    setTimeout(() => {
        bonusText.style.opacity = "0";
        bonusText.style.transform = "translate(100px,-20px)";
    }, 100);

    setTimeout(() => {
        bonusText.remove();
    }, 1000);
}

function showBonusScore(bonusScore) {
    let bonusText = document.createElement("div");
    bonusText.className = "bonus-text";
    bonusText.innerText = `+${bonusScore.toFixed(1)}`;
    bonusText.style.transform = "translate(-80px,0px)";

    let timerContainer = document.querySelector(".score");
    timerContainer.appendChild(bonusText);

    setTimeout(() => {
        bonusText.style.opacity = "0";
        bonusText.style.transform = "translate(-80px,-20px)";
    }, 100);

    setTimeout(() => {
        bonusText.remove();
    }, 1000);
}

function gameOver() {
    clearInterval(timerInterval);
    gameEnd = true;
    wordInput.placeholder = "Game Over!";
    wordInput.value = "";
    wordInput.disabled = true;
    wordInput.blur();
    submitButton.value = "Retry";
    result.textContent = "REFRESH TO PLAY AGAIN!";
    result.className = "error";
}

async function checkWord() {
    console.log(usedWords);
    if (!gameEnd) {
        const word = wordInput.value.trim().toLowerCase();
        if (!word) {
            result.textContent = "Please enter a word!";
            result.className = "error";
            return;
        }

        if (prevWord && word[0] !== prevWord[prevWord.length - 1]) {
            result.textContent = `The word must start with "${prevWord[prevWord.length - 1]}"! ❌`;
            result.className = "error";
            return;
        }

        if (!isNotUsed(word)) {
            result.textContent = `${word} is already used! ❌`;
            result.className = "error";
            return;
        }

        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await response.json();
            if (data.title === "No Definitions Found") {
                result.textContent = `${word} is NOT a valid word ❌`;
                if (usedWords.length == 0) {
                    used.innerHTML = `💀 ${word}`;
                } else {
                    used.innerHTML += ` 💀 ${word}`;
                }
                gameOver();
            } else {
                result.textContent = `${word} is a valid word ✅`;
                result.className = "success";
                usedWords.push(word);
                used.innerHTML = usedWords.join(" 🤜 ");
                prevWord = word;

                let currentTime = Date.now();
                let gap = (currentTime - lastCorrectTime) / 1000;
                lastCorrectTime = currentTime;

                let speedBonus = Math.max(0, (2 - gap) / 2);
                score += 1 + speedBonus;
                scoreTxt.innerHTML = score.toFixed(1);

                showBonusScore(speedBonus);

                if (!timerStarted) {
                    startTimer();
                } else {
                    adjustTimer();
                }
            }

            // const response = await fetch(
            //     `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&api_key=${API_KEY}`
            // );
            // const data = await response.json();

            // if (data.length > 0) {
            //     result.textContent = `${word} is a valid word ✅`;
            //     result.className = "success";
            //     usedWords.push(word);
            //     score++;
            //     scoreTxt.innerHTML = score;
            //     used.innerHTML = usedWords.join(" 🤜 ");
            //     prevWord = word;

            //     if (!timerStarted) {
            //         startTimer();
            //     } else {
            //         adjustTimer();
            //     }
            // } else {
            //     result.textContent = `${word} is NOT a valid word ❌`;
            //     result.className = "error";
            // }

        } catch (error) {
            result.textContent = "Error checking word. Try again!";
            result.className = "error";
            console.error(error);
        }

        wordInput.value = "";
    } else {
        location.reload();
    }

}

function isNotUsed(word) {
    return !usedWords.includes(word);
}

startGame();