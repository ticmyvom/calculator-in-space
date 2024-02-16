const display = document.querySelector('#display');
const ceBtn = document.querySelector('.ce-button');
const numBtns = document.querySelectorAll('.number-button');
const opBtns = document.querySelectorAll('.operator-button');
const eqBtn = document.querySelector('.equal-button');

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
            console.log(typeof operator);
            return add(num1, num2);
        case "-":
            return subtract(num1, num2);
        case "*":
            return multiply(num1, num2);
        case "/":
            return divide(num1, num2);
        default:
            // console.log(`operate(): ${operator} is undefined.`);
            return (`${operator} is undefined.`);
        }
}

ceBtn.addEventListener('click', () => {
    display.textContent = '';
});

function updateDisplay(content) {
    display.textContent += content;
}

numBtns.forEach((numBtn) => {
    numBtn.addEventListener('click', () => {
        // console.log(`clicked ${numBtn.textContent} `);
        updateDisplay(numBtn.textContent);
    });
});

opBtns.forEach((opBtn) => {
    opBtn.addEventListener('click', () => {
        // console.log(`clicked ${opBtn.textContent} `);
        updateDisplay(opBtn.textContent);
    });
});

// 6. Make the calculator work!
eqBtn.addEventListener('click', calculate);

function calculate() {
    /**
     * TODO: enforce button pressed so that the input is valid
     * invalid input looks like this `123+-*555++++11----11`
     * valid input looks like this `num op num`
     * 
     * +6 + 5 doesn't work => Don't let user press + for num1
     * 06+5 doesn't work => Don't let user press 0 for num1
     * 
     */
    
    
    let input = display.textContent;
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
    // console.log(num1, operator, num2, '=', result);
}