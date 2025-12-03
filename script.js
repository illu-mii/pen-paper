
function sumInputs(selector) {
    return [...document.querySelectorAll(selector)]
        .map(input => parseFloat(input.value) || 0)
        .reduce((a, b) => a + b, 0);
}

let warned90 = false;
let warnedOver100 = false;

// Lock a value and visually mark it
function addToTotal(button, section) {
    const row = button.closest('tr');
    const inputElement = row.querySelector('input');
    const value = parseFloat(inputElement.value) || 0;

    if (value === 0) return; 

    const totalCell = document.getElementById(`${section}-total`);
    const currentTotal = parseFloat(totalCell.textContent) || 0;
    const newTotal = currentTotal + value;
    totalCell.textContent = newTotal.toFixed(2);

    inputElement.value = 0;
    updateSummary();

    checkBudgetWarning(section);
}


function manualTotal(section) {
    const total = sumInputs(`.${section}-input`);
    document.getElementById(`${section}-total`).textContent = total.toFixed(2);
    updateSummary();
}

// Update summary section
function updateSummary() {
    const income = parseFloat(document.getElementById('income-total').textContent) || 0;
    const savings = parseFloat(document.getElementById('savings-total').textContent) || 0;
    const debt = parseFloat(document.getElementById('debt-total').textContent) || 0;
    const expenses = parseFloat(document.getElementById('expenses-total').textContent) || 0;

    document.getElementById('summary-income').textContent = income.toFixed(2);
    document.getElementById('summary-savings').textContent = savings.toFixed(2);
    document.getElementById('summary-debt').textContent = debt.toFixed(2);
    document.getElementById('summary-expenses').textContent = expenses.toFixed(2);

    const remaining = income - expenses - savings - debt;
    document.getElementById('summary-remaining').textContent = remaining.toFixed(2);
}

// Add a new row to a section table
function addRow(section) {
    const table = document.getElementById(`${section}-table`); // FIXED
    const tbody = table.tBodies[0];
    const totalRow = tbody.querySelector('.total');

    const newRow = document.createElement('tr');

    const nameCell = document.createElement('td');
    const valueCell = document.createElement('td');

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'New item';
    labelInput.className = "label-input";

    const numberInput = document.createElement('input');
    numberInput.type = 'number';
    numberInput.value = "0";
    numberInput.className = `${section}-input`;



    nameCell.appendChild(labelInput);
    valueCell.appendChild(numberInput);
    

    newRow.appendChild(nameCell);
    newRow.appendChild(valueCell);
   

    tbody.insertBefore(newRow, totalRow);
    attachInputListeners();
    updateSummary();
}

// Budget warnings
function checkBudgetWarning() {

    const totalExpenses = parseFloat(document.getElementById('expenses-total').textContent) || 0;
    const income = parseFloat(document.getElementById('income-total').textContent) || 0;

    if (income <= 0) return;

    if (totalExpenses >= income * 0.9 && totalExpenses <= income ) {
        if (!warned90) {
            alert('Warning: Expenses are at least 90% of income!');
            warned90 = true;
        }
    } else {
        warned90 = false;
    }   

    if (totalExpenses > income) {
        if (!warnedOver100) {
            alert('Alert: Expenses have exceeded income!');
            warnedOver100 = true;
        }
    } else {
        warnedOver100 = false;
    }
}

function clearAll() {
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = 0);
    ['income', 'savings', 'debt', 'expenses'].forEach(section => {
        const totalCell = document.getElementById(`${section}-total`);
        if (totalCell) totalCell.textContent = '0';
    });
   ['summary-income', 'summary-savings', 'summary-debt', 'summary-expenses', 'summary-remaining'].forEach(id => {
        document.getElementById(id).textContent = '0';
    });
}

document.addEventListener("input", () => {
    manualTotal('income');
    manualTotal('expenses');
    manualTotal('savings');
    manualTotal('debt');

    updateSummary();
    checkBudgetWarning();
});


