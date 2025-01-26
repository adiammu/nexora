let expenses = [];
let totalAmount = 0;
let expenseChartInstance;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const addCategoryBtn = document.getElementById('add-category-btn');
const newCategoryInput = document.getElementById('new-category-input');
const expenseChart = document.getElementById('expense-chart');

addCategoryBtn.addEventListener('click', () => {
    const newCategory = newCategoryInput.value.trim();
    if (newCategory) {
        const option = document.createElement('option');
        option.value = newCategory;
        option.textContent = newCategory;
        categorySelect.appendChild(option);
        newCategoryInput.value = '';
    }
});

addBtn.addEventListener('click', () => {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (!category || isNaN(amount) || amount <= 0 || !date) {
        alert('Please fill out all fields correctly.');
        return;
    }

    const expense = { category, amount, date };
    expenses.push(expense);
    totalAmount += amount;

    updateExpenseTable();
    updateExpenseChart();
});

function updateExpenseTable() {
    expensesTableBody.innerHTML = '';
    totalAmount = 0;

    expenses.forEach((expense, index) => {
        totalAmount += expense.amount;

        const row = expensesTableBody.insertRow();
        row.insertCell(0).textContent = expense.category;
        row.insertCell(1).textContent = expense.amount;
        row.insertCell(2).textContent = expense.date;

        const deleteCell = row.insertCell(3);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            expenses.splice(index, 1);
            updateExpenseTable();
            updateExpenseChart();
        });
        deleteCell.appendChild(deleteBtn);
    });

    totalAmountCell.textContent = totalAmount;
}

function updateExpenseChart() {
    const categoryTotals = expenses.reduce((totals, expense) => {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
        return totals;
    }, {});

    const data = {
        labels: Object.keys(categoryTotals),
        datasets: [{
            data: Object.values(categoryTotals),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }],
    };

    if (expenseChartInstance) {
        expenseChartInstance.data = data;
        expenseChartInstance.update();
    } else {
        expenseChartInstance = new Chart(expenseChart, {
            type: 'pie',
            data,
        });
    }
}

// Initial chart update
updateExpenseChart();
