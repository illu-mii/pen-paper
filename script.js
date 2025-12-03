// --- SUM INPUTS ---
function sumInputs(selector) {
    return [...document.querySelectorAll(selector)]
        .map(input => parseFloat(input.value) || 0)
        .reduce((a, b) => a + b, 0);
}

let warned90 = false;
let warnedOver100 = false;

// --- MANUAL TOTAL ---
function manualTotal(section) {
    const total = sumInputs(`.${section}-input`);
    document.getElementById(`${section}-total`).textContent = total.toFixed(2);
}

// --- UPDATE SUMMARY ---
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

// --- ALERTS / WARNINGS ---
function showBanner(msg, level='info') {
    let banner = document.getElementById('budget-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'budget-banner';
        banner.style.position = 'fixed';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.top = '10px';
        banner.style.padding = '10px 18px';
        banner.style.borderRadius = '6px';
        banner.style.zIndex = 9999;
        banner.style.fontWeight = '700';
        banner.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        document.body.appendChild(banner);
    }

    banner.textContent = msg;
    if(level === 'warn') { banner.style.background='#ffd966'; banner.style.color='#333'; }
    else if(level==='alert') { banner.style.background='#ff6b6b'; banner.style.color='#fff'; }
    else { banner.style.background='#90ee90'; banner.style.color='#063'; }

    clearTimeout(banner._timeout);
    banner._timeout = setTimeout(()=>banner.remove(),5000);
}

function checkBudgetWarning() {
    const totalExpenses = parseFloat(document.getElementById('expenses-total').textContent) || 0;
    const income = parseFloat(document.getElementById('income-total').textContent) || 0;

    if(income <= 0) return;

    // 90% warning
    if(totalExpenses >= income*0.9 && totalExpenses <= income && !warned90){
        showBanner('Warning: Expenses are at least 90% of income!', 'warn');
        warned90 = true;
    } else warned90 = false;

    // Over 100% alert
    if(totalExpenses > income && !warnedOver100){
        showBanner('Alert: Expenses have exceeded income!', 'alert');
        warnedOver100 = true;
    } else warnedOver100 = false;
}

// --- CLEAR ALL ---
function clearAll() {
    document.querySelectorAll('input[type="number"]').forEach(input=>input.value=0);
    ['income','savings','debt','expenses'].forEach(section=>document.getElementById(`${section}-total`).textContent='0');
    ['summary-income','summary-savings','summary-debt','summary-expenses','summary-remaining'].forEach(id=>document.getElementById(id).textContent='0');
    warned90=false; warnedOver100=false;
    localStorage.removeItem('budgetData');
    updateSummary();
}

// --- SAVE / LOAD ---
function saveData() {
    const data = {inputs:{}, totals:{}};
    document.querySelectorAll('input[type="number"]').forEach(input=>{
        data.inputs[input.name||input.className+Math.random()]=input.value;
    });
    ['income','savings','debt','expenses'].forEach(section=>{
        const totalCell=document.getElementById(`${section}-total`);
        if(totalCell) data.totals[section]=totalCell.textContent;
    });
    localStorage.setItem('budgetData', JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem('budgetData');
    if(!saved) return;
    const data=JSON.parse(saved);
    let i=0;
    document.querySelectorAll('input[type="number"]').forEach(input=>{
        const keys=Object.keys(data.inputs);
        if(keys[i]) input.value=data.inputs[keys[i]];
        i++;
    });
    Object.keys(data.totals).forEach(section=>{
        const totalCell=document.getElementById(`${section}-total`);
        if(totalCell) totalCell.textContent=data.totals[section];
    });
    updateEverything();
}

// --- HANDLE INPUT CHANGE ---
function handleChange(){
    ['income','expenses','savings','debt'].forEach(section=>manualTotal(section));
    updateSummary();
    saveData();
    checkBudgetWarning();
}

// --- UPDATE EVERYTHING ---
function updateEverything(){
    ['income','expenses','savings','debt'].forEach(section=>manualTotal(section));
    updateSummary();
    saveData();
    checkBudgetWarning();
}

// --- ATTACH LISTENERS ---
document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('input[type="number"]').forEach(input=>input.addEventListener('input', handleChange));
    loadData();
});
