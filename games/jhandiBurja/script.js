const diceImages = [
    'jhandi.svg',
    'burja.svg',
    'paan.svg',
    'chidi.svg',
    'hukum.svg',
    'itta.svg',
];

const diceDivs = document.getElementsByClassName('dice');
const resetButton = document.getElementById('reset');
const rollButton = document.getElementById('roll');
const rollSound = new Audio('./img/dice-cup.wav');

resetButton.disabled = true;

function roll() {
    const diceArray = Array.from(diceDivs);
    // console.log(diceArray);
    rollButton.disabled = true;
    resetButton.disabled = true;
    const interval = setInterval(() => {
        diceArray.forEach((dice) => {
            const imgElement = dice.querySelector('.dice-img');
            const randomIndex = Math.floor(Math.random() * diceImages.length);
            const randomImage = diceImages[randomIndex];
            rollSound.play();
            imgElement.src = `./img/${randomImage}`;
        });
    }, 150);

    setTimeout(() => {
        clearInterval(interval);
        rollSound.pause();
        rollButton.disabled = false;
        resetButton.disabled = false;
    }, 5000);
}


function reset() {
    const diceArray = Array.from(diceDivs);
    diceArray.forEach((dice, index) => {
        const imgElement = dice.querySelector('.dice-img');
        imgElement.src = `./img/${diceImages[index]}`;
    });
}
