
// DOM Elements Selection

const transactionForm = document.getElementById("transactionForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const transactionList = document.getElementById("transactionList");

const totalIncome = document.getElementById("totalIncome");
const totalExpenses = document.getElementById("totalExpenses");
const balance = document.getElementById("balance");

const submitButton = transactionForm.querySelector('button[type="submit"]');
const cancelButton = document.getElementById("cancelButton");


// Transactions Array

let transactions = [];

let editingTransactionId = null;


// Form Submission

transactionForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;

    if (title === "" || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter valid transaction details!");
        return;
    }

    if (editingTransactionId !== null) {

        const existingTransaction = transactions.find(function(item) {
            return item.id === editingTransactionId;
        });

        if (!existingTransaction) {
            alert("Transaction not found!");
            return;
        }

        existingTransaction.title = title;
        existingTransaction.amount = amount;
        existingTransaction.type = type;
        existingTransaction.category = category;

        editingTransactionId = null;

    } else {

        const transaction = {
            id: Date.now(),
            title: title,
            amount: amount,
            type: type,
            category: category,
            date: new Date().toISOString().split("T")[0]
        };

        transactions.push(transaction);

    }

    saveTransactions();

    renderTransactions();

    updateSummary();

    transactionForm.reset();

    submitButton.textContent = "Add Transaction";

    cancelButton.hidden = true;

});


// Cancel Editing

cancelButton.addEventListener("click", function() {

    editingTransactionId = null;

    transactionForm.reset();

    submitButton.textContent = "Add Transaction";

    cancelButton.hidden = true;

});


// Render Transactions

function renderTransactions() {

    transactionList.innerHTML = "";

    transactions.forEach(function(transaction) {

        const li = document.createElement("li");

        li.textContent = `${transaction.title} - Rs. ${transaction.amount} - ${transaction.type} - ${transaction.category}`;

        // Edit Button

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        li.appendChild(editButton);

        editButton.addEventListener("click", function() {

            editingTransactionId = transaction.id;

            titleInput.value = transaction.title;
            amountInput.value = transaction.amount;
            typeInput.value = transaction.type;
            categoryInput.value = transaction.category;

            submitButton.textContent = "Update Transaction";

            cancelButton.hidden = false;

        });


        // Delete Button

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            transactions = transactions.filter(function(item) {
                return item.id !== transaction.id;
            });

            // Reset editing if currently edited transaction is deleted

            if (editingTransactionId === transaction.id) {

                editingTransactionId = null;

                transactionForm.reset();

                submitButton.textContent = "Add Transaction";

                cancelButton.hidden = true;

            }

            saveTransactions();

            renderTransactions();

            updateSummary();

        });

        li.appendChild(deleteButton);

        transactionList.appendChild(li);

    });

}


// Update Summary

function updateSummary() {

    const income = transactions
        .filter(function(transaction) {
            return transaction.type === "income";
        })
        .reduce(function(sum, transaction) {
            return sum + transaction.amount;
        }, 0);

    const expenses = transactions
        .filter(function(transaction) {
            return transaction.type === "expense";
        })
        .reduce(function(sum, transaction) {
            return sum + transaction.amount;
        }, 0);

    const remainingBalance = income - expenses;

    totalIncome.textContent = `Rs. ${income}`;

    totalExpenses.textContent = `Rs. ${expenses}`;

    balance.textContent = `Rs. ${remainingBalance}`;

}


// Save Transactions

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// Load Transactions

function loadTransactions() {

    const savedData = localStorage.getItem("transactions");

    if (savedData !== null) {

        transactions = JSON.parse(savedData);

    }

}


// Initial Application Setup

loadTransactions();

renderTransactions();

updateSummary();
