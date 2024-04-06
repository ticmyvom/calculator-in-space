const display = document.querySelector('#display');
const prevExprs = document.querySelector('#prev-exprs');
const ceBtn = document.querySelector('.ce-button');
const acBtn = document.querySelector('.ac-button')
const numBtns = document.querySelectorAll('.number-button');
const opBtns = document.querySelectorAll('.operator-button');
const eqBtn = document.querySelector('.equal-button');
const musicToggleBtn = document.querySelector('#music-on-off');
const backgroundAudio = document.querySelector('.background-music audio');

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
    // console.log('operating', num1, operator, num2);
    switch (operator) {
        case "+":
            return add(num1, num2);
        case "-":
            return subtract(num1, num2);
        case "*":
            return multiply(num1, num2);
        case "/":
            return divide(num1, num2);
        case ".":
            return 'Decimal is not supported in this version.'
        default:
            return (`${operator} is undefined.`);
        }
}

ceBtn.addEventListener('click', () => {
    setCalculatorState(calcState.init);
    display.textContent = '';
});

acBtn.addEventListener('click', () => {
    setCalculatorState(calcState.init);
    display.textContent = '';
    prevExprs.textContent = '';
});

function updateDisplay(content) {
    display.textContent += content;
}

numBtns.forEach((numBtn) => {
    numBtn.addEventListener('click', () => {
        // console.log(getCalculatorState());
        // console.log(`clicked ${numBtn.textContent} `);

        if (getCalculatorState() === calcState.op){
            setCalculatorState(calcState.num2);
            updateDisplay(numBtn.textContent);
            return;
        }

        if  (getCalculatorState() === calcState.init){
            if (+numBtn.textContent === 0) {
                // since we won't evaluate 01 + 2
                // ignore if 0 is pressed in the beginning
                return;
            }
            else {
                setCalculatorState(calcState.num1);
            }
        }
        updateDisplay(numBtn.textContent);
    });
});

opBtns.forEach((opBtn) => {
    opBtn.addEventListener('click', () => {
        // console.log(getCalculatorState());
        let currentOperator = opBtn.textContent;

        // in the beginning, only allow the operator - to be clicked
        if (getCalculatorState() === calcState.init && currentOperator === '-'){
            setCalculatorState(calcState.num1);
            updateDisplay(currentOperator);
            return;
        }

        if (getCalculatorState() === calcState.num1){
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

eqBtn.addEventListener('click', calculate);

// TODO: round off numbers if they're too long. Do it after determine the size of the calculator during CSS
// TODO: - Fix: when calculating, if the first character is 0, remove it

function calculate() {
    if (getCalculatorState() === calcState.init ||
        getCalculatorState() === calcState.op){
        return; // do nothing if = is pressed without any input
    }
    
    let input = display.textContent;
    let expression = display.textContent;
    input = input.replace(/\s+/g, '');
    // console.log('before parsing: ', input);
    
    let num1,
        num2,
        operator;

    num1 = parseInt(input)
    input = input.replace(String(num1), '');
    // console.log(input);
    operator = input[0];
    num2 = parseInt(input.substring(1));

    let result = operate(operator, num1, num2);
    display.textContent = result;
    setCalculatorState(calcState.num1);
    // console.log(num1, operator, num2, '=', result);

    const expressionDiv = document.createElement("div");
    expression = expression.concat("=", result.toString());
    expressionDiv.textContent = expression;
    prevExprs.appendChild(expressionDiv);
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
            document.getElementById("ce").click();
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
        case '/':
        case '*':
            document.getElementById(key).click();
            break;
        case '=':
            document.getElementById(key).click();
            break;
        default:
            break;
    }
    return false;
}

document.addEventListener('keydown', getKeyboardSupport);

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
    backgroundAudio.src = 'sound/Power Rangers in Space Instrumental Theme.mp3';
    backgroundAudio.pause();
    backgroundAudio.load();
    backgroundAudio.play();
}