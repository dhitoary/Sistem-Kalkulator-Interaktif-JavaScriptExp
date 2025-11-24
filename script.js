let currentInput = '0';
let previousInput = '';
let operator = null;
let memory = 0;
let history = [];

const mainDisplay = document.getElementById('mainDisplay');
const historyDisplay = document.getElementById('historyDisplay');
const historyList = document.getElementById('historyList');

function updateDisplay() {
    mainDisplay.value = currentInput;
    if (operator !== null) {
        historyDisplay.textContent = `${previousInput} ${operator}`;
    } else {
        historyDisplay.textContent = '';
    }
}

function appendNumber(number) {
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendDecimal() {
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function setOperator(op) {
    if (currentInput === '') return;
    
    if (previousInput !== '') {
        calculateResult();
    }
    
    operator = op;
    previousInput = currentInput;
    currentInput = '';
    updateDisplay();
}

function calculateResult() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert("Error: Tidak bisa membagi dengan nol");
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    addToHistory(`${previousInput} ${operator} ${currentInput} = ${result}`);

    currentInput = result.toString();
    operator = null;
    previousInput = '';
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

function deleteDigit() {
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function memoryPlus() {
    memory += parseFloat(currentInput) || 0;
}

function memoryMinus() {
    memory -= parseFloat(currentInput) || 0;
}

function memoryRecall() {
    currentInput = memory.toString();
    updateDisplay();
}

function memoryClear() {
    memory = 0;
}

function addToHistory(entry) {
    history.unshift(entry);
    if (history.length > 5) {
        history.pop();
    }
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<li class="empty-msg">Belum ada perhitungan</li>';
        return;
    }
    
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.onclick = () => {
            const parts = item.split('=');
            currentInput = parts[1].trim();
            updateDisplay();
        };
        historyList.appendChild(li);
    });
}

function clearHistory() {
    history = [];
    renderHistory();
}

document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        setOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Backspace') {
        deleteDigit();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});