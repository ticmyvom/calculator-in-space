const display = document.querySelector('#display');
const prevExprs = document.querySelector('#prev-exprs');
const ceBtn = document.querySelector('.ce-button');
const acBtn = document.querySelector('.ac-button')
const numBtns = document.querySelectorAll('.number-button');
const opBtns = document.querySelectorAll('.operator-button');
const eqBtn = document.querySelector('.equal-button');
const musicToggleBtn = document.querySelector('#music-on-off');
const backgroundAudio = document.querySelector('.background-music audio');

let decimals = 3;

const leds = [
    document.getElementById("LED-+-on"),
    document.getElementById("LED---on"),
    document.getElementById("LED-*-on"),
    document.getElementById("LED-/-on")
];

const modeSwitchBtn = document.querySelector('.mode-switch-button');
const switchAtXImg = document.querySelector('#switch-at-X');

const openMorpherImage = document.querySelector('#open-morpher');
const closedMorpherImage = document.querySelector('#closed-morpher');

const morpherState = {
    isOpen: true,
    mode: 'calculator', // 'calculator' or 'ranger'
    playingMinigame912: false
}

let codeInput = "";

// note that the clearsound version has more chance of occuring
const letsrocketClearSound = new Audio("./sound/letsrocket_clearsound.mp3");
const letRocketSounds = [
    new Audio("./sound/letsrocket.mp3"),
    new Audio("./sound/letsrocket_2.mp3"),
    new Audio("./sound/letsrocket_together.mp3"),
    letsrocketClearSound,
    letsrocketClearSound,
    letsrocketClearSound, 
];

// note that the toy version has more chance of occuring
const toy335 = new Audio("./sound/335_toy.mp3");
const morphSounds = [
    toy335,
    toy335,
    toy335,
    toy335,
    new Audio("./sound/335_1.mp3"),
    new Audio("./sound/335_2.mp3"),
    new Audio("./sound/335_blueranger.mp3"),
    new Audio("./sound/335_long.mp3"),
    new Audio("./sound/335_longest.mp3"), 
    new Audio("./sound/335_powerranger.mp3"),
    new Audio("./sound/335_powerranger.mp3"),
];

const sounds = {
    "259": new Audio("./sound/259.mp3"),
    "761": new Audio("./sound/761.mp3"),
    "108": new Audio("./sound/108.mp3"),
    "541": new Audio("./sound/541.mp3"),
    "912": new Audio("./sound/912_minigame.mp3"),
    "correct": new Audio("./sound/correct_minigame.mp3"),
    "incorrect_lostalife": new Audio("./sound/incorrect_lostalife_minigame.mp3"),
    "end": new Audio("./sound/end_minigame.mp3"),
    "0": new Audio("./sound/0.mp3"),
    "1": new Audio("./sound/1.mp3"),
    "2": new Audio("./sound/2.mp3"),
    "3": new Audio("./sound/3.mp3"),
    "4": new Audio("./sound/4.mp3"),
    "5": new Audio("./sound/5.mp3"),
    "6": new Audio("./sound/6.mp3"),
    "7": new Audio("./sound/7.mp3"),
    "8": new Audio("./sound/8.mp3"),
    "9": new Audio("./sound/9.mp3"),
    "communicating": new Audio("./sound/communicating.mp3"),
    "lid_open": new Audio("./sound/lid_open.mp3"),
    "lid_close": new Audio("./sound/lid_close.mp3"),
    "enter_1time": new Audio("./sound/Enter_1time.mp3"),
    "enter": new Audio("./sound/Enter.mp3"),
    "morpher_on": new Audio("./sound/morpher_on.mp3"),
    "physical_switch": new Audio("./sound/physical_switch.mp3"),
}

function createEnum(values) {
    const enumObject = {};
    for (const val of values) {
      enumObject[val] = val;
    }
    return Object.freeze(enumObject);
}

// NOTE: the current setup may make adding a backspace button challenging

// we'll use calcState to determine which button can take effect
let calcState = createEnum(['init', 'num1', 'op', 'num2']);
let currentState = calcState.init

function getCalculatorState() {
    return currentState;
}

function setCalculatorState(newState) {
    currentState = newState;
}

// NOTE: adding a '+' sign before a variable converts it into a number
function add(n1, n2) {
    return +n1 + +n2;
}

function subtract(n1, n2) {
    return +n1 - +n2;
}

function multiply(n1, n2) {
    return +n1 * +n2;
}

function divide(n1, n2) {
    n2 = +n2;
    if (n2 === 0) return "lma0"; // it's undefined when dividing by zero
    return +n1 / n2;
}

function operate(operator, num1, num2) {
    switch (operator) {
        case "+":
            return add(num1, num2);
        case "-":
            return subtract(num1, num2);
        case "×":
            return multiply(num1, num2);
        case "÷":
            return divide(num1, num2);
        default:
            return (`${operator} is undefined.`);
        }
}

let loopSoundTimerId = 0;
let loopCommLedsTimerId = 0;
ceBtn.addEventListener('click', () => {
    let audio = sounds["communicating"];

    if (morpherState.mode === 'calculator') {
        audio.play();
        setCalculatorState(calcState.init);
        display.textContent = '';
    } else if (morpherState.mode === 'ranger') {
        let audioLength = 700; // how long communating.mp3 is
        loopSoundTimerId = setTimeout(function loopSound() {
            audio.play();
            loopSoundTimerId = setTimeout(loopSound, audioLength); 
        }, 5);

        let ledsEffectLength = 3000;
        loopCommLedsTimerId = setTimeout(function loopCommLeds() {
            displayCommunicating();
            loopCommLedsTimerId = setTimeout(loopCommLeds, ledsEffectLength);
        }, 5);
    }
});

acBtn.addEventListener('click', () => {
    // Play button sound 
    sounds["lid_open"].play();

    if (morpherState.mode === 'calculator') {
        setCalculatorState(calcState.init);
        display.textContent = '';
        prevExprs.textContent = '';
    }

    // Also open the morpher if it is closed
    if (!morpherState.isOpen) {
        openMorpherImage.style.opacity = 1;
        closedMorpherImage.style.opacity = 0;
        morpherState.isOpen = true;
        
        enableFullUI(morpherState.mode);

        // play a random "let's rocket" sound when opening the morpher during ranger mode
        if (morpherState.mode === 'ranger') {
            const soundIndex = getRandomInt(letRocketSounds.length)
            letRocketSounds[soundIndex].play();
        }
    }
});

function updateDisplay(content) {
    display.textContent += content;
}

// Play button sound 
const annouceNumber = (number) => {
    // const sound = sounds[number].cloneNode();
    // sound.play();
    sounds[number].play();
}

numBtns.forEach((numBtn) => {
    numBtn.addEventListener('click', () => {
        // console.log(getCalculatorState());
        // console.log(`clicked ${numBtn.textContent} `);

        if (morpherState.playingMinigame912 === false) {
            annouceNumber(numBtn.textContent);
        }

        if (morpherState.mode === 'calculator') {
            if (getCalculatorState() === calcState.op){
                setCalculatorState(calcState.num2);
                updateDisplay(numBtn.textContent);
                return;
            }

            if  (getCalculatorState() === calcState.init){
                setCalculatorState(calcState.num1);
            }
            updateDisplay(numBtn.textContent);
        } else if (morpherState.mode === 'ranger') {
            codeInput += numBtn.textContent;
        }

    });
});

opBtns.forEach((opBtn) => {
    opBtn.addEventListener('click', () => {
        // console.log(getCalculatorState());
        let currentOperator;
        if (opBtn.textContent === "−") {
            // mixing - and − is not ideal so I'll stick with -
            // − is just the subtraction symbol since it looks better
            currentOperator = "-";
        } else {
            currentOperator = opBtn.textContent;
        }

        // in the beginning, only allow the operator - to be clicked
        if (getCalculatorState() === calcState.init && currentOperator === '-'){
            setCalculatorState(calcState.num1);
            updateDisplay(currentOperator);
            return;
        }

        if (getCalculatorState() === calcState.num1){
            if (/[\d]+/.test(display.textContent) === false) {
                // console.log("no multiple ops allows when entering num1")
                return
            };

            setCalculatorState(calcState.op);
            updateDisplay(currentOperator);
            return;
        }

        // if we're at the op state, only allow clicking + or - operators
        if (getCalculatorState() === calcState.op){
            if (currentOperator === '-' || currentOperator === '+'){
                setCalculatorState(calcState.num2);
                updateDisplay(currentOperator);
                return;
            }
            else {
                return; 
            }
        }

        if (getCalculatorState() === calcState.num2){
            // if user finishes choosing the second number and hit an operator button, 
            // we'll evaluate the current expression
            // (this disallows expressions like 1+++1****3)
            let latestChar = display.textContent.trim().slice(-1);
            if (/\d/.test(latestChar)){
                calculate(); 
                updateDisplay(currentOperator);
                setCalculatorState(calcState.op);
            }
            
            return;
        }
    });
});

eqBtn.addEventListener('click', () => {
    if (morpherState.mode === 'calculator') {
        // Play button sound 
        sounds["enter_1time"].play();

        blinkAllLeds();
        calculate();
    } else if (morpherState.mode === 'ranger') {
        if (loopSoundTimerId != 0) {
            disableCommunicating();
            return;
        }

        switch (codeInput) {
            case "335":
                display335();
                break;
            case "259":
                display259();
                break;
            case "761":
                display761();
                break;
            case "108":
                display108();
                break;
            case "541":
                display541();
                break;
            case "912":
                playMinigame912();
                break;
            default:
                // Unidentified code was entered, play the generic sound and effect
                sounds["enter"].play();
                blinkAllLedsTwice();
        }
        codeInput = "";
    }
});

function calculate() {
    if (getCalculatorState() === calcState.init ||
        getCalculatorState() === calcState.num1 ||
        getCalculatorState() === calcState.op ){
        return; // do nothing if = is pressed without any input
    }
    
    let input = display.textContent;
    let expression = display.textContent;
    input = input.replace(/\s+/g, '');
    
    // currently won't work with really big number like -6.666666600000001e+27 but that's fine
    const validExpression = /^(?<num1>-?[\d]+(\.?[\d]+)*)(?<operator>[+\-×÷])(?<num2>[+-]?[\d]+(\.?[\d]+)*)$/;
    let parsedInput;
    try {
        parsedInput = input.match(validExpression).groups;
    } catch (e)  {
        if (e instanceof TypeError) {
            alert("Oops! This calculator is not compatible with the scientific notation at the moment.");
            ceBtn.click(); // to clear the current expression display
            return;
        } else {
            alert(`Something else is wrong:\n${e}`)
        }
    }

    let num1 = parsedInput.num1,
        num2 = parsedInput.num2,
        operator = parsedInput.operator;

    num1 = parseFloat(num1)
    num2 = parseFloat(num2);
    
    if (isNaN(num2)) return; // so that we don't evaluate "num1--"

    let result = operate(operator, num1, num2);
    result = parseFloat(result.toFixed(decimals));
    display.textContent = result;
    setCalculatorState(calcState.num1);
    // console.log(num1, operator, num2, '=', result);

    const expressionDiv = document.createElement("div");
    expression = expression.concat("=", result.toString());
    expressionDiv.textContent = expression;
    prevExprs.prepend(expressionDiv);
}

// KEYBOARD SUPPORT
function getKeyboardSupport(keyboardEvent) {
    let key = keyboardEvent.key;
    // console.log('a key has been pressed down', key);
    switch (key) {
        //   case '.':
        //     document.getElementById('dot').click();
        //     break;

        case 'Backspace':
            ceBtn.click();
            break;
        case 'Escape':
            acBtn.click();
            break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            // console.log('key is ', key, typeof key);
            document.getElementById(key).click();
            break;
        case '+':
        case '-':
        case '/': // pressing / on Firefox opens the Quick Find at the bottom. Proceed with caution.
        case '*':
            document.getElementById(key).click();
            break;
        case 'Enter':
        case '=':
            eqBtn.click();
            break;
        case '.':
            handlingDecimal();
            break;
        default:
            break;
    }
    return false;
}

function handlingDecimal() {
    const enteringNum1Regex = /^-?[\d]+$/;
    const enteringNum2Regex = /^-?[\d]+(?:\.?[\d]+)*[+\-×÷]-?[\d]+$/;
    if (enteringNum1Regex.test(display.textContent.trim()) ||
        enteringNum2Regex.test(display.textContent.trim())) {
            updateDisplay('.');
    }
    // else {
    //     console.log("not gonna update with .")
    //     console.log(display.textContent.trim())
    // }
}

document.addEventListener('keydown', (keyboardEvent) => {
    if (morpherState.isOpen && morpherState.mode === 'calculator') {
        if (keyboardEvent.key === 'Enter') {
            // pressing Enter should perform its job, rather than its default action:
            // clicking the focused button
            keyboardEvent.preventDefault();  
        }
        
        getKeyboardSupport(keyboardEvent);
    }
});

// AUDIO MUSIC
musicToggleBtn.addEventListener('click', () => {
    backgroundAudio.volume = 0.05;
    backgroundAudio.paused ? backgroundAudio.play() : stopMusic();
});

function stopMusic() {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
}

// this will repeat the instrumental theme forever or until the user toggles
// src: https://code-boxx.com/background-music-html/
backgroundAudio.onended = () => {
    backgroundAudio.src = './sound/Power Rangers in Space Instrumental Theme.mp3';
    backgroundAudio.pause();
    backgroundAudio.load();
    backgroundAudio.play();
}

const turnLedOn = (ledIndex) => {
    leds[ledIndex].classList.add("led-on");
    // leds[ledIndex].style.opacity = 1;
    // console.log(leds[ledIndex], " should be on now");
}

const turnLedOff = (ledIndex) => {
    leds[ledIndex].classList.remove("led-on");
}

// flash all the leds for a given time period
const blinkAllLeds = (time = 340) => {
    for (let i = 0; i < leds.length; i++) {
        turnLedOn(i);
    }
    
    setTimeout(() => {
        for (let i = 0; i < leds.length; i++) {
            turnLedOff(i);
        }
    }, time);
}

const blinkAllLedsTwice = () => {
    blinkAllLeds();
    setTimeout(blinkAllLeds, 500);
}

// time in ms
const keepLedOnForSometime = (ledIndex, delay) => {
    turnLedOn(ledIndex);
    setTimeout(turnLedOff, delay, ledIndex);
}

const displayLeds = (pattern) => {
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === 0) {
            turnLedOff(i);
        } else {
            turnLedOn(i);
        }
    }
}

let displayCommunicatingTimerId = [];
const displayCommunicating = () => {
    let cycleTime = 500;
    let ledPatterns = [
        [0,1,1,1], 
        [1,0,1,1], 
        [1,1,0,1], 
        [1,1,1,0], 
        [1,1,0,1], 
        [1,0,1,1], 
        [0,1,1,1]
    ];

    // Clear any previous timeouts
    displayCommunicatingTimerId.forEach(clearTimeout);
    displayCommunicatingTimerId = []

    ledPatterns.forEach((pattern, index) => {
        const timerId = setTimeout(displayLeds, index * cycleTime, pattern);
        displayCommunicatingTimerId.push(timerId);
    })
}

const disableCommunicating = () => {
    // Cancel communicating sound when Enter button is clicked or when switching mode
    clearTimeout(loopSoundTimerId);
    clearTimeout(loopCommLedsTimerId);
    displayCommunicatingTimerId.forEach(clearTimeout);

    loopSoundTimerId = 0;
    loopCommLedsTimerId = 0;
    displayCommunicatingTimerId = []
    displayLeds([0,0,0,0]); // turn off all leds
}

const display335 = () => {
    const time = 200;

    const blink0213 = () => {
        keepLedOnForSometime(0, time);
        keepLedOnForSometime(2, time);

        setTimeout(keepLedOnForSometime, time, 1, time);
        setTimeout(keepLedOnForSometime, time, 3, time);
    }

    // randomize 335 tracks
    const soundIndex = getRandomInt(morphSounds.length);
    morphSounds[soundIndex].play();

    // LED sequence 1
    keepLedOnForSometime(3, 1200);
    setTimeout(keepLedOnForSometime, 400, 2, 1200);
    setTimeout(keepLedOnForSometime, 800, 1, 1200);
    setTimeout(keepLedOnForSometime, 1200, 0, 1200);

    // LED sequence 2
    setTimeout(blink0213, 2800);
    setTimeout(blink0213, 3200);
    setTimeout(blink0213, 3600);
    setTimeout(blink0213, 4000);
    setTimeout(blink0213, 4400);
    setTimeout(blink0213, 4800);
    setTimeout(blink0213, 5200);
    setTimeout(blink0213, 5600);
    setTimeout(blinkAllLeds, 6005, time);
}

const display259 = () => {
    sounds["259"].play();

    let cycleTime = 250;
    let ledPatterns = [
        [0,1,1,0], 
        [1,0,0,1], 
        [1,1,1,1], 
        [0,0,0,0], 
        [1,1,1,1], 
        [0,0,0,0], 
        [1,1,1,1], 
        [0,0,0,0],
    ];

    ledPatterns.forEach((pattern, index) => {
        setTimeout(displayLeds, index * cycleTime, pattern);
    })
}

const display761 = () => {
    sounds["761"].play();

    let cycleTime = 162 ;
    let ledPatterns = [
        [0,1,1,0], 
        [1,0,0,1], 
        [0,1,1,0], 
        [1,0,0,1],
        [0,1,1,0], 
        [1,0,0,1],
        [0,1,1,0],
        [1,0,0,1],
        [0,1,1,0],
        [1,0,0,1],
        [0,1,1,0],
        [1,0,0,1],
        [1,1,1,1], 
        [0,0,0,0],
    ];

    ledPatterns.forEach((pattern, index) => {
        setTimeout(displayLeds, index * cycleTime, pattern);
    })
}

const display108 = () => {
    sounds["108"].play();

    let cycleTime = 140;
    let ledPatterns = [
        [1,0,0,0], 
        [0,1,1,1], 
        [0,0,1,0], 
        [1,0,0,1],
        [0,0,1,1], 
        [1,1,1,0],
        [0,1,0,1],
        [0,0,0,0], // loop the first half
        [1,0,0,0], 
        [0,1,1,1], 
        [0,0,1,0], 
        [1,0,0,1],
        [0,0,1,1], 
        [1,1,1,0],
        [0,1,0,1],
        [0,0,0,0],
    ];

    ledPatterns.forEach((pattern, index) => {
        setTimeout(displayLeds, index * cycleTime, pattern);
    })
}

const display541 = () => {
    sounds["541"].play();

    let cycleTime = 160;
    let ledPatterns = [
        [0,1,1,1], 
        [0,0,1,1], 
        [0,0,0,1], 
        [0,0,0,0],
        [0,0,0,1], 
        [0,0,1,1],
        [0,1,1,1],
        [0,0,1,1],
        [0,1,1,1], 
        [1,1,1,1], 
        [0,0,0,0], 
        [1,1,1,1],
        [0,1,1,1], 
        [0,0,1,1],
        [0,0,0,1],
        [0,0,0,0],
    ];

    ledPatterns.forEach((pattern, index) => {
        setTimeout(displayLeds, index * cycleTime, pattern);
    })
}

function getRandomInt(exclusiveMax = 10) {
  return Math.floor(Math.random() * exclusiveMax);
}

async function playMinigame912() {
    const displayLives = (lives) => {
        switch (lives) {
            case 4:
                displayLeds([1,1,1,1]);
                break;
            case 3:
                displayLeds([0,1,1,1]);
                break;
            case 2:
                displayLeds([0,0,1,1]);
                break;
            case 1:
                displayLeds([0,0,0,1]);
                break;
            case 0:
                displayLeds([0,0,0,0]);
                break;
            default:
                return;
        }
    }

    async function getUserAnswer(timeout = 2000) {
        return new Promise((resolve) => {
            // console.log(timeout, scores);
            let answered = false;

            const handleClick912 = (event) => {
                // because our number buttons has id=${number}
                const value = event.target.id;
                if (value >= 0 && value <= 9) { 
                    answered = true;
                    cleanup();
                    resolve(Number(value));
                } else {
                    cleanup();
                    resolve(-1);
                }
            };

            const cleanup = () => {
                clearTimeout(timer);
                numBtns.forEach(btn => btn.removeEventListener('click', handleClick912));
            }

            numBtns.forEach(btn => btn.addEventListener('click', handleClick912));
            const timer = setTimeout(() => {
                if (!answered) {
                    cleanup();
                    resolve(-1);
                }
            }, timeout);
        });
    }

    const determineTimeout = () => {
        if (scores > 15) return 1000;
        if (scores > 10) return 1250;
        if (scores > 5) return 1500;
        return 2000;
    }

    morpherState.playingMinigame912 = true;

    sounds["912"].play();
    
    let scores = 0;
    let lives = 4;
    displayLives(lives);
    
    await new Promise((resolve) => setTimeout(resolve, 2000));

    while (lives > 0) {
        // Call out a random number from 0-9
        const randomNumber = getRandomInt(10);
        annouceNumber(randomNumber);

        const answer = await getUserAnswer(timeout = determineTimeout());
        
        if (answer === randomNumber) {
            sounds["correct"].play();
            scores++;
        } else {
            lives--;
            displayLives(lives);
            sounds["incorrect_lostalife"].play();
        }

        // wait 1000ms before starting the next round
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // play sound and effect when the game ends
    sounds["end"].play();

    let cycleTime = 325;
    let ledPatterns = [
        [0,0,0,0],
        [1,1,1,1], 
        [0,0,0,0],
    ];
    ledPatterns.forEach((pattern, index) => {
        setTimeout(displayLeds, index * cycleTime, pattern);
    })
    
    // wait a bit
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // announce scores by digit
    let scoresList = scores.toString().split('').map(Number);
    for (const digit of scoresList) {
        annouceNumber(digit);
        await new Promise((resolve) => setTimeout(resolve, 850));
    }

    // clean up
    morpherState.playingMinigame912 = false; 
}

// Partial UI when the morpher is closed. Only AC and modeSwitch are clickable
const enablePartialUI = (isEnable) => {
    eqBtn.style.display = "none";
    ceBtn.style.display = "none";

    // Hidden, but clickable
    acBtn.style.display = ""
    acBtn.style.opacity = 0;
    prevExprs.style.opacity = 0;

    display.style.display = "none";

    for (let numBtn of numBtns) numBtn.style.display = "none";
    for (let opBtn of opBtns) opBtn.style.display = "none";
}

// Full UI when the morpher is open
const enableFullUI = (mode) => {
    if (mode === 'ranger') {
        eqBtn.style.display = "";
        ceBtn.style.display = "";

        acBtn.style.display = "none"; // not clickable

        display.style.display = "none"; // hidden, not clickable
        prevExprs.style.opacity = 0;    // hidden, clickable

        for (let numBtn of numBtns) numBtn.style.display = "";
        for (let opBtn of opBtns) opBtn.style.display = "none";
    } else if (mode === 'calculator') {
        eqBtn.style.display = "";
        ceBtn.style.display = "";

        acBtn.style.display = "";
        acBtn.style.opacity = 1;

        display.style.display = "";
        prevExprs.style.opacity = 1;

        for (let numBtn of numBtns) numBtn.style.display = "";
        for (let opBtn of opBtns) opBtn.style.display = "";
    }
}

// Close the morpher
prevExprs.addEventListener('click', () => {
    if (morpherState.isOpen) {
        closedMorpherImage.style.opacity = 1;
        openMorpherImage.style.opacity = 0;
        morpherState.isOpen = false;

        sounds["lid_close"].play();

        enablePartialUI();
    }
});

// Toggle between modes and update UI as needed
modeSwitchBtn.addEventListener('click', () => {
    morpherState.mode = (morpherState.mode == 'ranger') ? 'calculator' : 'ranger';
    disableCommunicating();
    
    if (morpherState.mode === 'ranger') {
        sounds["morpher_on"].play();
        blinkAllLeds();
        switchAtXImg.style.opacity = 0;
    } else if (morpherState.mode === 'calculator') {
        sounds["physical_switch"].play();
        switchAtXImg.style.opacity = 1;
    }

    if (morpherState.isOpen) enableFullUI(morpherState.mode);
})

