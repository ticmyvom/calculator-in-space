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