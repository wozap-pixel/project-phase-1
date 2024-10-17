// Set the API URL for your JSON Server
const apiUrl = 'http://localhost:3000/budgetTransactions';

// Initial transactions data from localStorage or empty array
let transactions = [];

// Selecting DOM elements
const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const incomeBalanceDisplay = document.getElementById('income-balance');
const expenseBalanceDisplay = document.getElementById('expense-balance');
const totalBalanceDisplay = document.getElementById('total-balance');
const incomeTransactionsList = document.getElementById('income-transactions');
const expenseTransactionsList = document.getElementById('expense-transactions');

// Function to fetch all transactions
function fetchTransactions() {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      transactions = data;
      updateBalances();
      renderIncomeTransactions();
      renderExpenseTransactions();
    })
    .catch(error => console.error('Error fetching transactions:', error));
}

// Function to update and display balances
function updateBalances() {
  const incomeTotal = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  
  const expenseTotal = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  incomeBalanceDisplay.textContent = incomeTotal.toFixed(2);
  expenseBalanceDisplay.textContent = expenseTotal.toFixed(2);
  totalBalanceDisplay.textContent = (incomeTotal - expenseTotal).toFixed(2);
}

// Function to render income transactions
function renderIncomeTransactions() {
  incomeTransactionsList.innerHTML = '';
  transactions
    .filter(transaction => transaction.type === 'income')
    .forEach(transaction => {
      const li = createTransactionElement(transaction);
      incomeTransactionsList.appendChild(li);
    });
}

// Function to render expense transactions
function renderExpenseTransactions() {
  expenseTransactionsList.innerHTML = '';
  transactions
    .filter(transaction => transaction.type === 'expense')
    .forEach(transaction => {
      const li = createTransactionElement(transaction);
      expenseTransactionsList.appendChild(li);
    });
}

// Function to create a transaction list item element
function createTransactionElement(transaction) {
  const li = document.createElement('li');
  li.classList.add('px-4', 'py-2', 'flex', 'justify-between', 'items-center');

  const description = document.createElement('span');
  description.textContent = transaction.description;

  const amount = document.createElement('span');
  amount.textContent = transaction.amount.toFixed(2);
  amount.classList.add(transaction.type === 'income' ? 'text-green-600' : 'text-red-600');

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('bg-red-500', 'text-white', 'py-1', 'px-3', 'rounded-md', 'hover:bg-red-600', 'transition', 'duration-200');
  deleteButton.addEventListener('click', () => deleteTransaction(transaction.id));

  li.appendChild(description);
  li.appendChild(amount);
  li.appendChild(deleteButton);

  return li;
}

// Function to add a transaction
function addTransaction(type, amount, description) {
  const newTransaction = {
    type: type,
    amount: parseFloat(amount),
    description: description
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTransaction)
  })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(addedTransaction => {
      transactions.push(addedTransaction);
      updateBalances();
      if (type === 'income') {
        renderIncomeTransactions();
      } else {
        renderExpenseTransactions();
      }
    })
    .catch(error => console.error('Error adding transaction:', error));
}

// Function to delete a transaction
function deleteTransaction(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      transactions = transactions.filter(transaction => transaction.id !== id);
      updateBalances();
      renderIncomeTransactions();
      renderExpenseTransactions();
    })
    .catch(error => console.error('Error deleting transaction:', error));
}

// Event listener for income form submission
incomeForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const amount = parseFloat(this['income-amount'].value);
  const description = this['income-description'].value.trim();

  if (amount > 0 && description) {
    addTransaction('income', amount, description);
    this.reset();
  } else {
    alert('Please enter a valid amount and description for income.');
  }
});

// Event listener for expense form submission
expenseForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const amount = parseFloat(this['expense-amount'].value);
  const description = this['expense-description'].value.trim();

  if (amount > 0 && description) {
    addTransaction('expense', amount, description);
    this.reset();
  } else {
    alert('Please enter a valid amount and description for expense.');
  }
});

// Fetch initial transactions when the page loads
fetchTransactions();
