
const transactionForm = document.getElementById("transactionForm");

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");

const transactionList = document.getElementById("transactionList");
const emptyMessage = document.getElementById("emptyMessage");

const totalIncomeElement = document.getElementById("totalIncome");
const totalExpensesElement = document.getElementById("totalExpenses");
const balanceElement = document.getElementById("balance");

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

// Load transactions from LocalStorage

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

let editingTransactionId = null;


// Save transactions to LocalStorage

function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


// Add or Update Transaction

transactionForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;

    if (title === "" || amount <= 0 || !Number.isFinite(amount)) {
        alert("Please enter a valid title and amount.");
        return;
    }

    if (editingTransactionId !== null) {

        // Update existing transaction

        transactions = transactions.map(function (transaction) {

            if (transaction.id === editingTransactionId) {

                return {
                    ...transaction,
                    title: title,
                    amount: amount,
                    type: type,
                    category: category
                };

            }

            return transaction;

        });

    } else {

        // Add new transaction

        const newTransaction = {
            id: Date.now(),
            title: title,
            amount: amount,
            type: type,
            category: category
        };

        transactions.push(newTransaction);

    }

    saveTransactions();

    resetForm();

    renderTransactions();

});


// Reset Form

function resetForm() {

    transactionForm.reset();

    editingTransactionId = null;

    submitButton.textContent = "Add Transaction";

    cancelButton.hidden = true;

}


// Cancel Edit

cancelButton.addEventListener("click", function () {

    resetForm();

});


// Edit Transaction

function editTransaction(id) {

    const transaction = transactions.find(function (item) {
        return item.id === id;
    });

    if (!transaction) {
        return;
    }

    titleInput.value = transaction.title;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;
    categoryInput.value = transaction.category;

    editingTransactionId = transaction.id;

    submitButton.textContent = "Update Transaction";

    cancelButton.hidden = false;

    titleInput.focus();

}


// Delete Transaction

function deleteTransaction(id) {

    transactions = transactions.filter(function (transaction) {
        return transaction.id !== id;
    });

    if (editingTransactionId === id) {
        resetForm();
    }

    saveTransactions();

    renderTransactions();

}


// Render Transactions

function renderTransactions() {

    transactionList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    const selectedType = typeFilter.value;

    const selectedCategory = categoryFilter.value;


    // Filter transactions

    const filteredTransactions = transactions.filter(function (transaction) {

        const matchesSearch = transaction.title
            .toLowerCase()
            .includes(searchText);

        const matchesType =
            selectedType === "all" ||
            transaction.type === selectedType;

        const matchesCategory =
            selectedCategory === "all" ||
            transaction.category === selectedCategory;

        return matchesSearch && matchesType && matchesCategory;

    });
    // Sort Transactions

if (sortFilter.value === "newest") {

    filteredTransactions.sort(function (a, b) {
        return b.id - a.id;
    });

} else if (sortFilter.value === "oldest") {

    filteredTransactions.sort(function (a, b) {
        return a.id - b.id;
    });

} else if (sortFilter.value === "highest") {

    filteredTransactions.sort(function (a, b) {
        return b.amount - a.amount;
    });

} else if (sortFilter.value === "lowest") {

    filteredTransactions.sort(function (a, b) {
        return a.amount - b.amount;
    });

}


    // Display transactions

    filteredTransactions.forEach(function (transaction) {

        const li = document.createElement("li");

        li.classList.add("transaction-item");

        li.classList.add(transaction.type);


        const transactionInfo = document.createElement("div");

        transactionInfo.classList.add("transaction-info");


        const titleElement = document.createElement("h3");

        titleElement.textContent = transaction.title;


        const categoryElement = document.createElement("p");

        categoryElement.textContent = transaction.category;


        const amountElement = document.createElement("p");

        const sign = transaction.type === "income" ? "+" : "-";

        amountElement.textContent =
            sign + " Rs. " + transaction.amount.toFixed(2);


        transactionInfo.append(
            titleElement,
            categoryElement,
            amountElement
        );


        // Edit Button

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {

            editTransaction(transaction.id);

        });


        // Delete Button

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {

            deleteTransaction(transaction.id);

        });


        li.append(
            transactionInfo,
            editButton,
            deleteButton
        );


        transactionList.appendChild(li);

    });


    // Empty Message

    emptyMessage.hidden = filteredTransactions.length > 0;


    // Update Summary

    updateSummary();

}


// Update Summary

function updateSummary() {

    let totalIncome = 0;

    let totalExpenses = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        } else {

            totalExpenses += transaction.amount;

        }

    });


    const balance = totalIncome - totalExpenses;


    totalIncomeElement.textContent =
        "Rs. " + totalIncome.toFixed(2);

    totalExpensesElement.textContent =
        "Rs. " + totalExpenses.toFixed(2);

    balanceElement.textContent =
        "Rs. " + balance.toFixed(2);

}


// Search Transactions

searchInput.addEventListener("input", function () {

    renderTransactions();

});


// Filter by Type

typeFilter.addEventListener("change", function () {

    renderTransactions();

});


// Filter by Category

categoryFilter.addEventListener("change", function () {

    renderTransactions();

});


// Initial Render

renderTransactions();
sortFilter.addEventListener("change", function () {
    renderTransactions();
});