// Initial transactions data from localStorage or empty array
let transactions = JSON.parse(localStorage.getItem('budgetTransactions')) || [];

// Selecting DOM elements
const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const incomeBalanceDisplay = document.getElementById('income-balance');
const expenseBalanceDisplay = document.getElementById('expense-balance');
const totalBalanceDisplay = document.getElementById('total-balance');
const incomeTransactionsList = document.getElementById('income-transactions');
const expenseTransactionsList = document.getElementById('expense-transactions');

// Function to calculate and update balance
function updateBalances() {
  // Calculate income total
  const incomeTotal = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  // Calculate expense total
  const expenseTotal = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  // Update income balance
  incomeBalanceDisplay.textContent = incomeTotal.toFixed(2);

  // Update expense balance
  expenseBalanceDisplay.textContent = expenseTotal.toFixed(2);

  // Calculate and update total balance
  const totalBalance = incomeTotal - expenseTotal;
  totalBalanceDisplay.textContent = totalBalance.toFixed(2);
}

// Function to render transactions for income
function renderIncomeTransactions() {
  incomeTransactionsList.innerHTML = ''; // Clear existing list

  transactions
    .filter(transaction => transaction.type === 'income')
    .forEach(transaction => {
      const li = createTransactionElement(transaction);
      incomeTransactionsList.appendChild(li);
    });
}

// Function to render transactions for expenses
function renderExpenseTransactions() {
  expenseTransactionsList.innerHTML = ''; // Clear existing list

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

// Function to handle adding income or expense
function addTransaction(type, amount, description) {
  const newTransaction = {
    id: transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1,
    userId: 1, // Assuming user ID 1 for simplicity
    type: type,
    amount: parseFloat(amount),
    description: description
  };

  transactions.push(newTransaction);
  updateBalances();

  // Update transactions list based on type
  if (type === 'income') {
    renderIncomeTransactions();
  } else if (type === 'expense') {
    renderExpenseTransactions();
  }

  saveTransactionsToLocalStorage();
}

// Function to handle deleting a transaction
function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateBalances();
  renderIncomeTransactions();
  renderExpenseTransactions();
  saveTransactionsToLocalStorage();
}

// Function to save transactions to localStorage
function saveTransactionsToLocalStorage() {
  localStorage.setItem('budgetTransactions', JSON.stringify(transactions));
}

// Event listeners for income form submission
incomeForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const amount = parseFloat(this['income-amount'].value);
  const description = this['income-description'].value.trim();

  if (amount && description) {
    addTransaction('income', amount, description);
    this.reset();
  } else {
    alert('Please enter both amount and description for income.');
  }
});

// Event listener for expense form submission
expenseForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const amount = parseFloat(this['expense-amount'].value);
  const description = this['expense-description'].value.trim();

  if (amount && description) {
    addTransaction('expense', amount, description);
    this.reset();
  } else {
    alert('Please enter both amount and description for expense.');
  }
});

// Initial render of transactions