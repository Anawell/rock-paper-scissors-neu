/* ==========================================================================
   Elements
   ========================================================================== */

const ANIMATION = {
    name: 'shakeHands',
    duration: '800',
    timingFunction: 'linear',
    iterationCount: '3'
}

const TIME_BEFORE_RESULT = (parseInt(ANIMATION.duration) * parseInt(ANIMATION.iterationCount)) || 3000;

const COMBINATIONS = [
    {
        weapon: 'rock',
        look: `<path d="M30.9,48.6 M30.5,38.3c-3.1-0.4-3.1-0.4-5.2-0.4c-3.7,0-6.7,8-6.7,11.7c0,1.6,1.5,5,2.4,6.1
        L31,70 M48,83.5h16.4c8,0,14.7-7,14.7-15h0.4V31c0-3.2-2.5-6-5.7-6.1c-3.3-0.1-6.3,1.5-6.3,4.8v4.9v-8.5c0-3-2.1-5.6-5-6.1
        c-3.6-0.6-7,2.1-7,5.7v4.9v-7.5c0-2.7-1.8-5.3-4.4-6c-3.9-1-7.6,1.9-7.6,5.7v9.9l-0.4-0.2l0-5.8c0-3.6-3.1-6.3-6.7-5.7
        c-2.9,0.5-4.8,3.1-4.8,6.1v22"/>`,
        kill: 'scissors'
    },
    {
        weapon: 'paper',
        look: `<path d="M33.5,62 M50,96.5h17c8,0,14.5-6.5,14.5-14.5v0l0-58.6c0-3.2-2.5-6-5.7-6.1c-3.3-0.1-6,2.6-6,5.9
        L69.5,48l0-34.5c0-3-2.1-5.6-5-6.1c-3.6-0.6-7,2.1-7,5.7V44l0-33.5c0-2.7-1.8-5.3-4.4-6c-3.9-1-7.6,1.9-7.6,5.7V46l-0.2-0.2L45.5,17
        c0-3.6-3.3-6.3-6.9-5.7c-2.9,0.5-5,3.1-5,6.1l0,44.6l-8.7-10.6l0.3,0.3c-1.2-1.5-3.1-2.4-5.2-2.4c-3.7,0-6.7,3-6.7,6.7
        c0,1.6,0.5,3,1.4,4.1l18.9,23.3"/>`,
        kill: 'rock'
    },
    {
        weapon: 'scissors',
        look: `<path d="M35.4,82.5L16.3,59.2c-0.9-1.1-1.4-2.6-1.4-4.1c0-3.7,3-6.7,6.7-6.7c2.1,0,3.9,0.9,5.2,2.4
        l-0.3-0.3l9,12.3l-9-45.6c-1.1-5.1,1.8-7.3,4.7-7.8c3.6-0.6,6.9,1.2,7.9,5.7l6.6,31.1l1.4-0.2l2-35.9c0-3.8,3.7-6.7,7.6-5.7
        c2.7,0.7,4.4,3.2,4.4,6l-2,32.5l0.3-3.4c1.3-3.6,3.2-5.7,6.9-5.2c2.9,0.5,5.2,3.2,5.2,6.1v6.5l0.2,0.1c0-3.3,2.6-6,5.9-5.9
        c3.2,0.1,5.9,2.9,5.9,6.1v34h-0.2c0,8-6.7,14-14.7,14H52"/>`,
        kill: 'paper'
    }
]

const buttonChoiceElements = document.querySelectorAll('[data-option]');
const resultsContainerElement = document.getElementById('results');

const countDownElement = document.querySelector('[data-counter]');

const yourResultElement = document.querySelector('[data-result="you"] svg');
const computerResultElement = document.querySelector('[data-result="computer"] svg');

const computerScoreElement = document.querySelector('[data-score="computer"]');
const yourScoreElement = document.querySelector('[data-score="you"]');

const resultWinnerElement = document.querySelector('[data-result-winner]');
const resultWinnerNameElement = document.querySelector('[data-result-winner-name]');


/* ==========================================================================
   EventListeners
   ========================================================================== */

buttonChoiceElements.forEach(buttonChoice => {
    buttonChoice.addEventListener('click', () => {
        initGame(buttonChoice);
    });
});

buttonChoiceElements.forEach(buttonChoice => {
    buttonChoice.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            initGame(buttonChoice);
        }
    });
});

resultsContainerElement.addEventListener('animationend', () => {
    resultsContainerElement.style.animation = 'none';
})

/* ==========================================================================
   Functions
   ========================================================================== */

function initGame(buttonChoice) {
    resetGame();
    countDown(parseInt(ANIMATION.iterationCount));
    const yourChoiceName = buttonChoice.dataset.option;
    const yourChoice = COMBINATIONS.find(combination => combination.weapon === yourChoiceName);
    animateHands();
    setTimeout(() => {
        countDownElement.innerText = '';
        getPlayersChoices(yourChoice);
    }, TIME_BEFORE_RESULT);
}

function getPlayersChoices(yourChoice) {
    const computerChoice = getComputerChoice();
    const youAreWinner = isWinner(yourChoice, computerChoice);
    const computerIsWinner = isWinner(computerChoice, yourChoice);
    showPlayersResults(yourResultElement, yourChoice, youAreWinner);
    showPlayersResults(computerResultElement, computerChoice, computerIsWinner);

    if (youAreWinner) {
        incrementScore(yourScoreElement);
        sayWhoIsWinner("youuu");
    }
    else if (computerIsWinner) {
        incrementScore(computerScoreElement);
        sayWhoIsWinner("computer");
    } else {
        sayWhoIsWinner("nobody");
    }
}

function getComputerChoice() {
    const index = Math.floor(Math.random() * COMBINATIONS.length);
    return COMBINATIONS[index];
}

function isWinner(choice, oppositeChoice) {
    return choice.kill === oppositeChoice.weapon;
}

function showPlayersResults(playerSvg, choice, winner) {
    resultWinnerElement.classList.remove('--is-hidden');
    if (winner) {
        playerSvg.parentNode.classList.add('--is-winner');
    } else {
        playerSvg.parentNode.classList.add('--is-looser');
    }
    playerSvg.innerHTML = choice.look;
    playerSvg.parentNode.setAttribute('aria-label', choice.weapon);
}

function incrementScore(scoreElement) {
    scoreElement.innerText = parseInt(scoreElement.innerText) + 1;
}

function sayWhoIsWinner(playerName) {
    resultWinnerNameElement.innerText = playerName;
}

function resetGame() {
    resultsContainerElement.classList.remove('--is-hidden');
    resultWinnerElement.classList.add('--is-hidden');
    yourResultElement.parentNode.classList.remove('--is-winner', '--is-looser');
    computerResultElement.parentNode.classList.remove('--is-winner', '--is-looser');
    yourResultElement.innerHTML = COMBINATIONS[0].look;
    computerResultElement.innerHTML = COMBINATIONS[0].look;
    yourResultElement.parentNode.setAttribute('aria-label', '');
    computerResultElement.parentNode.setAttribute('aria-label', '');
}

function animateHands() {
    resultsContainerElement.style.animationName = ANIMATION.name;
    resultsContainerElement.style.animationDuration = `${ANIMATION.duration}ms`;
    resultsContainerElement.style.animationTimingFunction = ANIMATION.timingFunction;
    resultsContainerElement.style.animationIterationCount = ANIMATION.iterationCount;
}

function countDown(fromNumber) {
    countDownElement.innerText = fromNumber;
    let nextNumber = fromNumber - 1;
    if (nextNumber > 0) {
        setTimeout(() => {
            countDown(nextNumber);
        }, parseInt(ANIMATION.duration));    
    }
}


