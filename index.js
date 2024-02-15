const display = document.querySelector('#display');

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

let num1,
    num2,
    operator;

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

const ceBtn = document.querySelector('.ce-button');
ceBtn.addEventListener('click', () => {
    display.textContent = '';
});