const display = document.querySelector('#display');
const ceBtn = document.querySelector('.ce-button');
const numBtns = document.querySelectorAll('.number-button');
const opBtns = document.querySelectorAll('.operator-button');

let num1,
    num2,
    operator;

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
    if (n2 === 0) return "lma0: it's undefined when dividing by zero";
    return +n1 / n2;
}

function operate(operator, num1, num2) {
    switch (operator) {
        case "+":
            add(num1, num2);
            break;
        case "-":
            subtract(num1, num2);
            break;
        case "*":
            multiply(num1, num2);
            break;
        case "/":
            divide(num1, num2);
            break;
        default:
            console.log(`operate(): ${operator} is undefined.`);
    }
}

ceBtn.addEventListener('click', () => {
    display.textContent = '';
});

numBtns.forEach((numBtn) => {
    numBtn.addEventListener('click', () => {
        console.log(`clicked ${numBtn.textContent} `);
    });
});

opBtns.forEach((opBtn) => {
    opBtn.addEventListener('click', () => {
        console.log(`clicked ${opBtn.textContent} `);
    });
});