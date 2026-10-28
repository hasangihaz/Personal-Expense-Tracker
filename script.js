
const transactionForm =
    document.getElementById("transactionForm");

const typeInput =
    document.getElementById("type");

const descriptionInput =
    document.getElementById("description");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const clearButton =
    document.getElementById("clearButton");

const filterInput =
    document.getElementById("filter");

const searchInput =
    document.getElementById("searchInput");

const transactionTableBody =
    document.getElementById("transactionTableBody");

const noTransactions =
    document.getElementById("noTransactions");

const totalIncome =
    document.getElementById("totalIncome");

const totalExpenses =
    document.getElementById("totalExpenses");

const currentBalance =
    document.getElementById("currentBalance");


/*LOAD TRANSACTIONS FROM LOCAL STORAGE */

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


/*ADD TRANSACTION */

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /* GET INPUT VALUES */

        const type =
            typeInput.value;

        const description =
            descriptionInput.value.trim();

        const amount =
            parseFloat(amountInput.value);

        const category =
            categoryInput.value;

        const date =
            dateInput.value;


        /*FORM VALIDATION */

        if (type === "") {

            alert("Please select a transaction type.");

            return;
        }


        if (description === "") {

            alert("Please enter a description.");

            return;
        }


        if (isNaN(amount) || amount <= 0) {

            alert("Please enter an amount greater than zero.");

            return;
        }


        if (category === "") {

            alert("Please select a category.");

            return;
        }


        if (date === "") {

            alert("Please select a date.");

            return;
        }


        /*CREATE TRANSACTION */

        const transaction = {

            id: Date.now(),

            type: type,

            description: description,

            amount: amount,

            category: category,

            date: date

        };


        /*ADD TRANSACTION TO ARRAY */

        transactions.push(transaction);


        /*SAVE TO LOCAL STORAGE */

        saveTransactions();


        /* SUCCESS ALERT AFTER ADDING TRANSACTION */

        alert("Transaction added successfully.");


        /*CLEAR FORM */

        transactionForm.reset();


        /*  UPDATE PAGE */

        displayTransactions();

        calculateTotals();

    }
);


/*SAVE TRANSACTIONS */

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


/* 
   DISPLAY TRANSACTIONS */

function displayTransactions() {

    /* Clear old table */

    transactionTableBody.innerHTML = "";


    /* GET FILTER */

    const selectedFilter =
        filterInput.value;


    /*GET SEARCH TEXT*/

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    /* FILTER TRANSACTIONS */

    const filteredTransactions =
        transactions.filter(function (transaction) {


            /* Type filter */

            const matchesType =
                selectedFilter === "All" ||
                transaction.type === selectedFilter;


            /* Search */

            const matchesSearch =
                transaction.description
                    .toLowerCase()
                    .includes(searchText)

                ||

                transaction.category
                    .toLowerCase()
                    .includes(searchText);


            return matchesType && matchesSearch;

        });


    /*NO TRANSACTIONS MESSAGE */

    if (filteredTransactions.length === 0) {

        noTransactions.style.display =
            "block";

    } else {

        noTransactions.style.display =
            "none";

    }


    /* ADD ROWS TO TABLE */

    filteredTransactions.forEach(
        function (transaction) {


            const row =
                document.createElement("tr");


            /*FORMAT DATE */

            const formattedDate =
                formatDate(transaction.date);


            /*FORMAT AMOUNT */

            const formattedAmount =
                "LKR " +
                transaction.amount.toLocaleString(
                    "en-LK",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );


            /* =================================
               CREATE TABLE ROW
            ================================= */

            row.innerHTML = `

                <td>
                    ${formattedDate}
                </td>

                <td>
                    ${escapeHTML(transaction.description)}
                </td>

                <td class="${transaction.type.toLowerCase()}">
                    ${transaction.type}
                </td>

                <td>
                    ${escapeHTML(transaction.category)}
                </td>

                <td>
                    ${formattedAmount}
                </td>

                <td>

                    <button
                        class="delete-button"
                        onclick="deleteTransaction(${transaction.id})"
                    >
                        Delete
                    </button>

                </td>

            `;


            transactionTableBody.appendChild(row);

        }
    );

}


/* =================================
   FORMAT DATE
================================= */

function formatDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString("en-GB");

}


/* =================================
   DELETE TRANSACTION
================================= */

function deleteTransaction(id) {


    /* =================================
       CONFIRM DELETE
    ================================= */

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) {

        return;

    }


    /* =================================
       REMOVE TRANSACTION
    ================================= */

    transactions =
        transactions.filter(
            function (transaction) {

                return transaction.id !== id;

            }
        );


    /* =================================
       SAVE UPDATED DATA
    ================================= */

    saveTransactions();


    /* =================================
       UPDATE PAGE
    ================================= */

    displayTransactions();

    calculateTotals();


    /* =================================
       DELETE SUCCESS ALERT
    ================================= */

    alert("Transaction deleted successfully.");

}


/* =================================
   CALCULATE TOTALS
================================= */

function calculateTotals() {

    let income = 0;

    let expenses = 0;


    /* =================================
       CALCULATE INCOME AND EXPENSES
    ================================= */

    transactions.forEach(
        function (transaction) {


            if (transaction.type === "Income") {

                income += transaction.amount;

            }


            if (transaction.type === "Expense") {

                expenses += transaction.amount;

            }

        }
    );


    /* =================================
       CALCULATE BALANCE
    ================================= */

    const balance =
        income - expenses;


    /* =================================
       DISPLAY INCOME
    ================================= */

    totalIncome.textContent =
        "LKR " +
        income.toLocaleString(
            "en-LK",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );


    /* =================================
       DISPLAY EXPENSES
    ================================= */

    totalExpenses.textContent =
        "LKR " +
        expenses.toLocaleString(
            "en-LK",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );


    /* =================================
       DISPLAY BALANCE
    ================================= */

    currentBalance.textContent =
        "LKR " +
        balance.toLocaleString(
            "en-LK",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/* =================================
   CLEAR FORM
================================= */

clearButton.addEventListener(
    "click",
    function () {

        transactionForm.reset();

    }
);


/* =================================
   FILTER TRANSACTIONS
================================= */

filterInput.addEventListener(
    "change",
    function () {

        displayTransactions();

    }
);


/* =================================
   SEARCH TRANSACTIONS
================================= */

searchInput.addEventListener(
    "input",
    function () {

        displayTransactions();

    }
);


/* =================================
   ESCAPE HTML
================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =================================
   INITIAL LOAD
================================= */

displayTransactions();

calculateTotals();