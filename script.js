
function updateTotals(){
    function sumInputs(selector){
        return [...document.querySelectorAll(selector)]
            .map(input => parseFloat(input.value) || 0)
            .reduce((a,b) => a + b, 0)
    }


const expenses = sumInputs('.expenses-input');
const income = sumInputs('.income-input');
const savings = sumInputs('.savings-input');
const debt = sumInputs('.debt-input');

document.getElementById('expenses-total').textContent = expenses.toFixed(2);
document.getElementById('income-total').textContent = income.toFixed(2);
document.getElementById('savings-total').textContent = savings.toFixed(2);
document.getElementById('debt-total').textContent = debt.toFixed(2);

document.getElementById('summary-income').textContent = income.toFixed(2);
document.getElementById('summary-expenses').textContent = expenses.toFixed(2);
document.getElementById('summary-savings').textContent = savings.toFixed(2);
document.getElementById('summary-debt').textContent = debt.toFixed(2);

const remaining = income - (expenses + savings + debt);
document.getElementById('summary-remaining').textContent = remaining.toFixed(2);
}

function addRow(section){
    console.log("addRow called for:", section)
    const table = document.getElementById(`${section}-table`);
    console.log("table found:", table);

    const newRow = document.createElement('tr');
    const nameCell = document.createElement('td');
    const valueCell = document.createElement('td');

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'New item';
    labelInput.className = 'label-input';

    const numberInput = document.createElement('input');
    numberInput.type = 'number';
    numberInput.className = `${section}-input`;
    numberInput.value = '0';
    numberInput.addEventListener('input', updateTotals);

    nameCell.appendChild(labelInput);
    valueCell.appendChild(numberInput);
    newRow.appendChild(nameCell);
    newRow.appendChild(valueCell);

    const tbody = table.tBodies[0];
    const totalRow = tbody.querySelector('.total');
    tbody.insertBefore(newRow, totalRow);

    updateTotals();
}

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', updateTotals);
});
updateTotals();