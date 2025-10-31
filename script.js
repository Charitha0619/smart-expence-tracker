// script.js

// --- Elements ---
const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmountEl = document.getElementById("total-amount");
const totalEntriesEl = document.getElementById("total-entries");
const averageAmountEl = document.getElementById("average-amount");

let expenses = []; // Store expenses

// --- Chart.js Setup ---
const ctx = document.getElementById("categoryChart").getContext("2d");
const categoryChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: ["Food", "Transport", "Shopping", "Electric Bills", "Hospital Bills", "Education", "Other"],
        datasets: [{
            label: "Expense Amount",
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: ["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF","#FF9F40","#8BC34A"]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// --- Update Summary ---
function updateSummary() {
    const total = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const avg = expenses.length ? total / expenses.length : 0;

    totalAmountEl.textContent = `₹${total.toFixed(2)}`;
    totalEntriesEl.textContent = expenses.length;
    averageAmountEl.textContent = `₹${avg.toFixed(2)}`;
}

// --- Update Category Chart ---
function updateChart() {
    const categories = categoryChart.data.labels;
    categoryChart.data.datasets[0].data = categories.map(cat => {
        return expenses
            .filter(exp => exp.category === cat)
            .reduce((acc, exp) => acc + exp.amount, 0);
    });
    categoryChart.update();
}

// --- Render Expense List ---
function renderExpenses() {
    if (expenses.length === 0) {
        expenseList.innerHTML = `
        <div class="empty-state">
          <div class="chart-icon-box">
            <div class="bar bar-green"></div>
            <div class="bar bar-red"></div>
            <div class="bar bar-blue"></div>
          </div>
          <p><strong>No expenses yet</strong></p>
          <p>Start tracking by adding your first expense above</p>
        </div>`;
        return;
    }

    expenseList.innerHTML = ""; // Clear
    expenses.forEach((exp, index) => {
        const item = document.createElement("div");
        item.classList.add("expense-item");
        item.innerHTML = `
            <div class="description">${exp.description}</div>
            <div class="amount-value">₹${exp.amount.toFixed(2)}</div>
            <div class="category">${exp.category}</div>
            <div class="date">${exp.date}</div>
            <div class="mood">${exp.mood || ""}</div>
            <div class="delete-btn-cell">
              <button class="delete-btn" onclick="deleteExpense(${index})">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>`;
        expenseList.appendChild(item);
    });
}

// --- Delete Expense ---
function deleteExpense(index) {
    expenses.splice(index, 1);
    renderExpenses();
    updateSummary();
    updateChart();
}

// --- Handle Form Submit ---
expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newExpense = {
        description: document.getElementById("description").value.trim(),
        amount: parseFloat(document.getElementById("amount").value),
        date: document.getElementById("date").value,
        category: document.getElementById("category").value,
        mood: document.getElementById("mood").value
    };

    expenses.push(newExpense);

    // Reset form
    expenseForm.reset();

    renderExpenses();
    updateSummary();
    updateChart();
});

// --- Initial Render ---
renderExpenses();
updateSummary();
updateChart();
