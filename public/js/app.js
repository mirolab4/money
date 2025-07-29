// public/js/app.js

// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Firebase Configuration - (This is your specific project configuration)
const firebaseConfig = {
  apiKey: "AIzaSyC-pZm-mV7fvfMFVEqOq1s5vnoVHQ4Olc4",
  authDomain: "money-969a6.firebaseapp.com",
  projectId: "money-969a6",
  storageBucket: "money-969a6.firebaseastorage.app",
  messagingSenderId: "51946916024",
  appId: "1:51946916024:web:e50cb67494fe5305f14c4d"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================================
// 1. Define DOM Elements
// ==========================================================
// Authentication Section Elements
const authSection = document.getElementById('auth-section');
const authForm = document.getElementById('auth-form');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const authErrorMessage = document.getElementById('auth-error-message');
const guestModeBtn = document.getElementById('guest-mode-btn');

// Header Navigation Buttons
const authNavBtn = document.getElementById('auth-btn');
const dashboardNav = document.getElementById('dashboard-nav');
const transactionsNav = document.getElementById('transactions-nav');
const categoriesSourcesNav = document.getElementById('categories-sources-nav');
const budgetsNav = document.getElementById('budgets-nav');
const goalsNav = document.getElementById('goals-nav');
const assetsLiabilitiesNav = document.getElementById('assets-liabilities-nav');
const reportsNav = document.getElementById('reports-nav');
const settingsNav = document.getElementById('settings-nav');
const logoutBtn = document.getElementById('logout-btn');

// Content Sections (All pages)
const allPages = document.querySelectorAll('.page');

// Dashboard Section Elements
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const currentBalanceEl = document.getElementById('current-balance');
const latestTransactionsTableBody = document.querySelector('#latest-transactions-table tbody');

// Transactions Section Elements
const transactionForm = document.getElementById('transaction-form');
const transactionTypeSelect = document.getElementById('transaction-type');
const transactionAmountInput = document.getElementById('transaction-amount');
const transactionCurrencyInput = document.getElementById('transaction-currency');
const categoryGroup = document.getElementById('category-group');
const transactionCategorySelect = document.getElementById('transaction-category');
const incomeSourceGroup = document.getElementById('income-source-group');
const transactionIncomeSourceSelect = document.getElementById('transaction-income-source');
const transactionDateInput = document.getElementById('transaction-date');
const transactionDescriptionTextarea = document.getElementById('transaction-description');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const transactionErrorMessage = document.getElementById('transaction-error-message');
const transactionSuccessMessage = document.getElementById('transaction-success-message');

const allTransactionsTableBody = document.querySelector('#all-transactions-table tbody');
const filterTypeSelect = document.getElementById('filter-type');
const sortBySelect = document.getElementById('sort-by');
const searchTransactionsInput = document.getElementById('search-transactions');

// Categories & Income Sources Section Elements
const categorySourceForm = document.getElementById('category-source-form');
const itemTypeSelect = document.getElementById('item-type');
const itemNameInput = document.getElementById('item-name');
const addItemBtn = document.getElementById('add-item-btn');
const categorySourceMessage = document.getElementById('category-source-message');

const expenseCategoriesTableBody = document.querySelector('#expense-categories-table tbody');
const incomeSourcesTableBody = document.querySelector('#income-sources-table tbody');

// Budgets Section Elements
const budgetForm = document.getElementById('budget-form');
const budgetCategorySelect = document.getElementById('budget-category');
const budgetAmountInput = document.getElementById('budget-amount');
const budgetMonthInput = document.getElementById('budget-month');
const addBudgetBtn = document.getElementById('add-budget-btn');
const budgetMessage = document.getElementById('budget-message');
const allBudgetsTableBody = document.querySelector('#all-budgets-table tbody');

// Goals Section Elements
const goalForm = document.getElementById('goal-form');
const goalNameInput = document.getElementById('goal-name');
const goalTargetAmountInput = document.getElementById('goal-target-amount');
const goalSavedAmountInput = document.getElementById('goal-saved-amount');
const goalDeadlineInput = document.getElementById('goal-deadline');
const addGoalBtn = document.getElementById('add-goal-btn');
const goalMessage = document.getElementById('goal-message');
const allGoalsTableBody = document.querySelector('#all-goals-table tbody');

// Assets and Liabilities Section Elements
const totalAssetsEl = document.getElementById('total-assets');
const totalLiabilitiesEl = document.getElementById('total-liabilities');
const netWorthEl = document.getElementById('net-worth');

const assetLiabilityForm = document.getElementById('asset-liability-form');
const itemTypeALSelect = document.getElementById('item-type-al');
const itemNameALInput = document.getElementById('item-name-al');
const itemValueALInput = document.getElementById('item-value-al');
const addItemALBtn = document.getElementById('add-item-al-btn');
const assetLiabilityMessage = document.getElementById('asset-liability-message');

const assetsTableBody = document.querySelector('#assets-table tbody');
const liabilitiesTableBody = document.querySelector('#liabilities-table tbody');

// Reports Section Elements
const reportTimeframeSelect = document.getElementById('report-timeframe');
const generateReportsBtn = document.getElementById('generate-reports-btn');
const reportMessage = document.getElementById('report-message');

const expenseCategoryChartCanvas = document.getElementById('expenseCategoryChart');
const incomeVsExpenseChartCanvas = document.getElementById('incomeVsExpenseChart');
const budgetTrackingChartCanvas = document.getElementById('budgetTrackingChart');

const expenseChartMessage = document.getElementById('expense-chart-message');
const incomeExpenseChartMessage = document.getElementById('income-expense-chart-message');
const budgetChartMessage = document.getElementById('budget-chart-message');

let expenseCategoryChartInstance = null; // To store Chart.js instance
let incomeVsExpenseChartInstance = null;
let budgetTrackingChartInstance = null;


// ==========================================================
// 2. UI Utility Functions
// ==========================================================

// Function to show a specific page and hide others
const showPage = (pageId) => {
    allPages.forEach(page => {
        page.style.display = 'none'; // Hide all pages
    });
    document.getElementById(pageId).style.display = 'block'; // Show the requested page
};

// Function to update navigation buttons based on authentication state
const updateNavForAuthState = (user) => {
    if (user) { // User is logged in
        authNavBtn.style.display = 'none';
        dashboardNav.style.display = 'inline-block';
        transactionsNav.style.display = 'inline-block';
        categoriesSourcesNav.style.display = 'inline-block';
        budgetsNav.style.display = 'inline-block';
        goalsNav.style.display = 'inline-block';
        assetsLiabilitiesNav.style.display = 'inline-block';
        reportsNav.style.display = 'inline-block';
        settingsNav.style.display = 'inline-block';
        logoutBtn.style.display = 'inline-block';
        showPage('dashboard-section'); // Automatically show dashboard
    } else { // User is logged out
        authNavBtn.style.display = 'inline-block';
        dashboardNav.style.display = 'none';
        transactionsNav.style.display = 'none';
        categoriesSourcesNav.style.display = 'none';
        budgetsNav.style.display = 'none';
        goalsNav.style.display = 'none';
        assetsLiabilitiesNav.style.display = 'none';
        reportsNav.style.display = 'none';
        settingsNav.style.display = 'none';
        logoutBtn.style.display = 'none';
        showPage('auth-section'); // Show authentication page
    }
};

// Function to display success/error messages for transaction form
const displayTransactionMessage = (message, isError = false) => {
    const targetElement = isError ? transactionErrorMessage : transactionSuccessMessage;
    const otherElement = isError ? transactionSuccessMessage : transactionErrorMessage;

    targetElement.textContent = message;
    targetElement.style.display = 'block';
    otherElement.style.display = 'none';

    setTimeout(() => {
        targetElement.textContent = '';
        targetElement.style.display = 'none';
    }, 5000); // Hide message after 5 seconds
};

// Function to toggle category/income source fields based on transaction type
const toggleCategoryIncomeSourceFields = () => {
    if (transactionTypeSelect.value === 'expense') {
        categoryGroup.style.display = 'block';
        incomeSourceGroup.style.display = 'none';
        transactionCategorySelect.setAttribute('required', 'true');
        transactionIncomeSourceSelect.removeAttribute('required');
    } else { // income
        categoryGroup.style.display = 'none';
        incomeSourceGroup.style.display = 'block';
        transactionCategorySelect.removeAttribute('required');
        transactionIncomeSourceSelect.setAttribute('required', 'true');
    }
};

// Function to display success/error messages for category/source form
const displayCategorySourceMessage = (message, isError = false) => {
    categorySourceMessage.textContent = message;
    categorySourceMessage.className = isError ? 'error-message' : 'success-message';
    categorySourceMessage.style.display = 'block';

    setTimeout(() => {
        categorySourceMessage.textContent = '';
        categorySourceMessage.style.display = 'none';
    }, 5000); // Hide message after 5 seconds
};

// Function to display success/error messages for budget form
const displayBudgetMessage = (message, isError = false) => {
    budgetMessage.textContent = message;
    budgetMessage.className = isError ? 'error-message' : 'success-message';
    budgetMessage.style.display = 'block';

    setTimeout(() => {
        budgetMessage.textContent = '';
        budgetMessage.style.display = 'none';
    }, 5000);
};

// Function to display success/error messages for goal form
const displayGoalMessage = (message, isError = false) => {
    goalMessage.textContent = message;
    goalMessage.className = isError ? 'error-message' : 'success-message';
    goalMessage.style.display = 'block';

    setTimeout(() => {
        goalMessage.textContent = '';
        goalMessage.style.display = 'none';
    }, 5000);
};

// Function to display success/error messages for asset/liability form
const displayAssetLiabilityMessage = (message, isError = false) => {
    assetLiabilityMessage.textContent = message;
    assetLiabilityMessage.className = isError ? 'error-message' : 'success-message';
    assetLiabilityMessage.style.display = 'block';

    setTimeout(() => {
        assetLiabilityMessage.textContent = '';
        assetLiabilityMessage.style.display = 'none';
    }, 5000);
};

// Function to display success/error messages for reports section
const displayReportMessage = (message, isError = false) => {
    reportMessage.textContent = message;
    reportMessage.className = isError ? 'error-message' : 'success-message';
    reportMessage.style.display = 'block';

    setTimeout(() => {
        reportMessage.textContent = '';
        reportMessage.style.display = 'none';
    }, 5000);
};


// ==========================================================
// 3. Authentication Functions
// ==========================================================

// Handle user login
const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    const email = authEmail.value;
    const password = authPassword.value;
    authErrorMessage.textContent = ''; // Clear previous error messages

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Firebase onAuthStateChanged will handle UI update
        authEmail.value = ''; // Clear input fields
        authPassword.value = '';
    } catch (error) {
        let message = "حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني وكلمة المرور.";
        if (error.code === 'auth/invalid-email') {
            message = "صيغة البريد الإلكتروني غير صحيحة.";
        } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        } else if (error.code === 'auth/too-many-requests') {
            message = "تم حظر هذا الحساب مؤقتًا بسبب كثرة محاولات تسجيل الدخول الفاشلة. حاول مرة أخرى لاحقًا.";
        }
        authErrorMessage.textContent = message;
        console.error("Login Error:", error.message);
    }
};

// Handle new user registration
const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page reload
    const email = authEmail.value;
    const password = authPassword.value;
    authErrorMessage.textContent = ''; // Clear previous error messages

    if (password.length < 6) {
        authErrorMessage.textContent = "يجب أن تكون كلمة المرور 6 أحرف على الأقل.";
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Firebase onAuthStateChanged will handle UI update
        // Add default income sources and expense categories for the new user
        await addDoc(collection(db, `users/${userCredential.user.uid}/incomeSources`), {
            name: "راتب",
            isDefault: true
        });
        await addDoc(collection(db, `users/${userCredential.user.uid}/incomeSources`), {
            name: "عمل حر",
            isDefault: true
        });
        await addDoc(collection(db, `users/${userCredential.user.uid}/incomeSources`), {
            name: "استثمارات",
            isDefault: true
        });

        // Default expense categories
        await addDoc(collection(db, `users/${userCredential.user.uid}/expenseCategories`), {
            name: "طعام وشراب",
            isDefault: true
        });
        await addDoc(collection(db, `users/${userCredential.user.uid}/expenseCategories`), {
            name: "مواصلات",
            isDefault: true
        });
        await addDoc(collection(db, `users/${userCredential.user.uid}/expenseCategories`), {
            name: "فواتير",
            isDefault: true
        });
        await addDoc(collection(db, `users/${userCredential.user.uid}/expenseCategories`), {
            name: "تسوق",
            isDefault: true
        });
        await addDoc(collection(db, `users/${userCredential.user.uid}/expenseCategories`), {
            name: "ترفيه",
            isDefault: true
        });
        await addDoc(collection(db, `users/${userCredential.user.uid}/expenseCategories`), {
            name: "صحة",
            isDefault: true
        });
        await addDoc(collection(db, `users/${userCredential.user.uid}/expenseCategories`), {
            name: "تعليم",
            isDefault: true
        });
        await addDoc(collection(db, `users/${userCredential.user.uid}/expenseCategories`), {
            name: "متنوعة",
            isDefault: true
        });

        authEmail.value = ''; // Clear input fields
        authPassword.value = '';
        authErrorMessage.textContent = "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول."; // Success message
    } catch (error) {
        let message = "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.";
        if (error.code === 'auth/email-already-in-use') {
            message = "البريد الإلكتروني هذا مستخدم بالفعل.";
        } else if (error.code === 'auth/invalid-email') {
            message = "صيغة البريد الإلكتروني غير صحيحة.";
        } else if (error.code === 'auth/weak-password') {
            message = "كلمة المرور ضعيفة جدًا. يرجى استخدام 6 أحرف على الأقل.";
        }
        authErrorMessage.textContent = message;
        console.error("Register Error:", error.message);
    }
};

// Handle user logout
const handleLogout = async () => {
    try {
        await signOut(auth);
        // Firebase onAuthStateChanged will handle UI update
    } catch (error) {
        console.error("Logout Error:", error.message);
    }
};

// ==========================================================
// 4. Guest Mode
// ==========================================================
const enterGuestMode = () => {
    // We'll use a fixed guest user ID to access demo data
    // Note: In a real app, guest data should be read-only or reset after each session
    const guestUserId = "guest_user_demo"; // Fixed user ID for guest mode
    // No change in Firebase authentication state, we just change the UI
    updateNavForAuthState({ uid: guestUserId, isGuest: true }); // Pass a dummy user object
    authErrorMessage.textContent = "أنت الآن في وضع الضيف. لن يتم حفظ بياناتك.";
    // You can call a function here to load static demo data for guest mode
    // loadGuestDashboardData(); // Will be created later if needed
};


// ==========================================================
// 5. Data Fetching & Rendering Functions
// ==========================================================

// Function to fetch latest transactions (income and expense) from Firestore
const getLatestTransactions = async (userId) => {
    try {
        const transactionsRef = collection(db, `users/${userId}/transactions`);
        const q = query(transactionsRef, orderBy('date', 'desc'), limit(5)); // Fetch latest 5 transactions
        const querySnapshot = await getDocs(q);
        const transactions = [];
        querySnapshot.forEach((doc) => {
            transactions.push({ id: doc.id, ...doc.data() });
        });
        return transactions;
    } catch (error) {
        console.error("Error fetching latest transactions:", error);
        return [];
    }
};

// Function to fetch all transactions (income and expense) for calculations
const getAllTransactions = async (userId) => {
    try {
        const transactionsRef = collection(db, `users/${userId}/transactions`);
        const querySnapshot = await getDocs(transactionsRef);
        const transactions = [];
        querySnapshot.forEach((doc) => {
            transactions.push({ id: doc.id, ...doc.data() });
        });
        return transactions;
    } catch (error) {
        console.error("Error fetching all transactions:", error);
        return [];
    }
};

// Function to render latest transactions in the dashboard table
const renderLatestTransactions = (transactions) => {
    latestTransactionsTableBody.innerHTML = ''; // Clear current content
    if (transactions.length === 0) {
        latestTransactionsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">لا توجد معاملات لعرضها.</td></tr>';
        return;
    }

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const transactionType = transaction.type === 'income' ? 'إيراد' : 'مصروف';
        const incomeSource = transaction.type === 'income' ? (transaction.incomeSource || 'غير محدد') : '---';

        row.innerHTML = `
            <td>${transactionType}</td>
            <td>${transaction.amount ? transaction.amount.toFixed(2) : '0.00'}</td>
            <td>${transaction.currency || 'JOD'}</td>
            <td>${transaction.category || 'غير مصنفة'}</td>
            <td>${incomeSource}</td>
            <td>${transaction.date ? new Date(transaction.date).toLocaleDateString('ar-EG') : 'غير محدد'}</td>
            <td>${transaction.description || 'لا يوجد وصف'}</td>
        `;
        latestTransactionsTableBody.appendChild(row);
    });
};

// Function to calculate and render totals in summary cards
const calculateAndRenderSummary = (transactions) => {
    let totalIncome = 0;
    let totalExpense = 0;

    // Since we are not dealing with currency conversion, we assume one currency for now (JOD by default)
    // Later, we can add logic to handle multiple currencies by displaying them separately or estimating conversion
    transactions.forEach(transaction => {
        // If there are multiple currencies, you can modify this here to filter or sum by currency
        // Currently, we assume all transactions are in the same default currency
        if (transaction.type === 'income') {
            totalIncome += transaction.amount || 0;
        } else if (transaction.type === 'expense') {
            totalExpense += transaction.amount || 0;
        }
    });

    const currentBalance = totalIncome - totalExpense;

    totalIncomeEl.textContent = `${totalIncome.toFixed(2)} JOD`; // Assume JOD as default currency
    totalExpenseEl.textContent = `${totalExpense.toFixed(2)} JOD`;
    currentBalanceEl.textContent = `${currentBalance.toFixed(2)} JOD`;

    // Change balance color based on value
    if (currentBalance < 0) {
        currentBalanceEl.style.color = '#dc3545'; // Red
    } else {
        currentBalanceEl.style.color = '#007bff'; // Blue (default color)
    }
};

// Main function to load dashboard data
const loadDashboardData = async (userId) => {
    if (!userId || userId === "guest_user_demo") {
        // For guest mode or no user, we don't fetch real data
        // Here you can load static demo data for guest mode
        totalIncomeEl.textContent = '0.00 JOD';
        totalExpenseEl.textContent = '0.00 JOD';
        currentBalanceEl.textContent = '0.00 JOD';
        latestTransactionsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">لا توجد بيانات متاحة في وضع الضيف أو بدون تسجيل دخول.</td></tr>';
        return;
    }

    // Fetch latest 5 transactions for direct display
    const latest = await getLatestTransactions(userId);
    renderLatestTransactions(latest);

    // Fetch all transactions for totals calculation
    const all = await getAllTransactions(userId);
    calculateAndRenderSummary(all);
};

// Function to fetch expense categories
const getExpenseCategories = async (userId) => {
    try {
        const categoriesRef = collection(db, `users/${userId}/expenseCategories`);
        const querySnapshot = await getDocs(categoriesRef);
        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() });
        });
        return categories;
    } catch (error) {
        console.error("Error fetching expense categories:", error);
        return [];
    }
};

// Function to fetch income sources
const getIncomeSources = async (userId) => {
    try {
        const sourcesRef = collection(db, `users/${userId}/incomeSources`);
        const querySnapshot = await getDocs(sourcesRef);
        const sources = [];
        querySnapshot.forEach((doc) => {
            sources.push({ id: doc.id, ...doc.data() });
        });
        return sources;
    } catch (error) {
        console.error("Error fetching income sources:", error);
        return [];
    }
};

// Function to populate category and income source dropdowns in the transaction form
const populateCategoryAndSourceSelects = async (userId) => {
    if (!userId || userId === "guest_user_demo") {
        transactionCategorySelect.innerHTML = '<option value="">لا يوجد فئات (وضع الضيف)</option>';
        transactionIncomeSourceSelect.innerHTML = '<option value="">لا يوجد مصادر (وضع الضيف)</option>';
        return;
    }

    const categories = await getExpenseCategories(userId);
    const sources = await getIncomeSources(userId);

    transactionCategorySelect.innerHTML = '<option value="">اختر فئة</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        transactionCategorySelect.appendChild(option);
    });

    transactionIncomeSourceSelect.innerHTML = '<option value="">اختر مصدر</option>';
    sources.forEach(src => {
        const option = document.createElement('option');
        option.value = src.name;
        option.textContent = src.name;
        transactionIncomeSourceSelect.appendChild(option);
    });
};

// Function to add a new transaction
const addTransaction = async (e) => {
    e.preventDefault();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
        displayTransactionMessage("يجب تسجيل الدخول لإضافة معاملة.", true);
        return;
    }
    if (userId === "guest_user_demo") {
        displayTransactionMessage("لا يمكن إضافة معاملات في وضع الضيف.", true);
        return;
    }

    const type = transactionTypeSelect.value;
    const amount = parseFloat(transactionAmountInput.value);
    const currency = transactionCurrencyInput.value.trim();
    const category = transactionCategorySelect.value;
    const incomeSource = transactionIncomeSourceSelect.value;
    const date = transactionDateInput.value;
    const description = transactionDescriptionTextarea.value.trim();

    if (isNaN(amount) || amount <= 0) {
        displayTransactionMessage("المبلغ غير صالح.", true);
        return;
    }
    if (!currency) {
        displayTransactionMessage("العملة مطلوبة.", true);
        return;
    }
    if (type === 'expense' && !category) {
        displayTransactionMessage("الفئة مطلوبة للمصاريف.", true);
        return;
    }
    if (type === 'income' && !incomeSource) {
        displayTransactionMessage("المصدر مطلوب للإيرادات.", true);
        return;
    }
    if (!date) {
        displayTransactionMessage("التاريخ مطلوب.", true);
        return;
    }

    try {
        const transactionData = {
            type,
            amount,
            currency,
            date: date, // Save date as ISO string for easy sorting and display
            description,
            createdAt: new Date().toISOString() // Creation timestamp
        };

        if (type === 'expense') {
            transactionData.category = category;
        } else {
            transactionData.incomeSource = incomeSource;
        }

        await addDoc(collection(db, `users/${userId}/transactions`), transactionData);
        displayTransactionMessage("تمت إضافة المعاملة بنجاح!");
        transactionForm.reset(); // Reset the form
        // Reload dashboard and transactions data to update UI
        loadDashboardData(userId);
        loadAllTransactions(userId);
        // Set default date to current date again after adding
        transactionDateInput.valueAsDate = new Date();
        toggleCategoryIncomeSourceFields(); // Reset category/source fields after reset
    } catch (error) {
        console.error("Error adding transaction:", error);
        displayTransactionMessage("فشل في إضافة المعاملة: " + error.message, true);
    }
};

// Function to fetch and render all transactions in the "All Transactions" table
const loadAllTransactions = async (userId) => {
    allTransactionsTableBody.innerHTML = ''; // Clear current content

    if (!userId || userId === "guest_user_demo") {
        allTransactionsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">لا توجد بيانات متاحة في وضع الضيف أو بدون تسجيل دخول.</td></tr>';
        return;
    }

    let transactions = await getAllTransactions(userId); // Use existing getAllTransactions function
    
    // Apply filters and sorting
    const filterType = filterTypeSelect.value;
    const sortBy = sortBySelect.value;
    const searchTerm = searchTransactionsInput.value.toLowerCase().trim();

    // Filter
    if (filterType !== 'all') {
        transactions = transactions.filter(t => t.type === filterType);
    }

    // Search
    if (searchTerm) {
        transactions = transactions.filter(t => 
            (t.description && t.description.toLowerCase().includes(searchTerm)) ||
            (t.category && t.category.toLowerCase().includes(searchTerm)) ||
            (t.incomeSource && t.incomeSource.toLowerCase().includes(searchTerm))
        );
    }

    // Sort
    transactions.sort((a, b) => {
        if (sortBy === 'date-desc') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'date-asc') {
            return new Date(a.date) - new Date(b.date);
        } else if (sortBy === 'amount-desc') {
            return (b.amount || 0) - (a.amount || 0);
        } else if (sortBy === 'amount-asc') {
            return (a.amount || 0) - (b.amount || 0);
        }
        return 0;
    });


    if (transactions.length === 0) {
        allTransactionsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">لا توجد معاملات لعرضها.</td></tr>';
        return;
    }

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const transactionType = transaction.type === 'income' ? 'إيراد' : 'مصروف';
        const categoryOrSource = transaction.type === 'income' ? (transaction.incomeSource || 'غير محدد') : (transaction.category || 'غير مصنفة');

        row.innerHTML = `
            <td>${transactionType}</td>
            <td>${transaction.amount ? transaction.amount.toFixed(2) : '0.00'}</td>
            <td>${transaction.currency || 'JOD'}</td>
            <td>${categoryOrSource}</td>
            <td>${transaction.date ? new Date(transaction.date).toLocaleDateString('ar-EG') : 'غير محدد'}</td>
            <td>${transaction.description || 'لا يوجد وصف'}</td>
            <td class="action-buttons">
                <button class="edit-btn" data-id="${transaction.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${transaction.id}"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        allTransactionsTableBody.appendChild(row);
    });

    // Add event listeners for delete and edit buttons after rows are created
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => handleDeleteTransaction(e.currentTarget.dataset.id));
    });
    // For edit functionality, you would add a similar listener:
    // document.querySelectorAll('.edit-btn').forEach(button => {
    //     button.addEventListener('click', (e) => handleEditTransaction(e.currentTarget.dataset.id));
    // });
    // Currently, `handleEditTransaction` function is not implemented
};

// Function to delete a transaction
const handleDeleteTransaction = async (transactionId) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId || userId === "guest_user_demo") {
        displayTransactionMessage("لا يمكن حذف معاملات في وضع الضيف أو بدون تسجيل دخول.", true);
        return;
    }

    if (confirm("هل أنت متأكد من حذف هذه المعاملة؟")) {
        try {
            await deleteDoc(doc(db, `users/${userId}/transactions`, transactionId));
            displayTransactionMessage("تم حذف المعاملة بنجاح!");
            loadDashboardData(userId); // Update dashboard
            loadAllTransactions(userId); // Update transactions list
        } catch (error) {
            console.error("Error deleting transaction:", error);
            displayTransactionMessage("فشل في حذف المعاملة: " + error.message, true);
        }
    }
};

// Function to render expense categories in their table
const renderExpenseCategories = (categories) => {
    expenseCategoriesTableBody.innerHTML = '';
    if (categories.length === 0) {
        expenseCategoriesTableBody.innerHTML = '<tr><td colspan="2" style="text-align: center;">لا توجد فئات مصاريف.</td></tr>';
        return;
    }
    categories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.name}</td>
            <td class="action-buttons">
                <button class="delete-category-btn" data-id="${category.id}"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        expenseCategoriesTableBody.appendChild(row);
    });
    document.querySelectorAll('.delete-category-btn').forEach(button => {
        button.addEventListener('click', (e) => handleDeleteCategory(e.currentTarget.dataset.id));
    });
};

// Function to render income sources in their table
const renderIncomeSources = (sources) => {
    incomeSourcesTableBody.innerHTML = '';
    if (sources.length === 0) {
        incomeSourcesTableBody.innerHTML = '<tr><td colspan="2" style="text-align: center;">لا توجد مصادر دخل.</td></tr>';
        return;
    }
    sources.forEach(source => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${source.name}</td>
            <td class="action-buttons">
                <button class="delete-source-btn" data-id="${source.id}"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        incomeSourcesTableBody.appendChild(row);
    });
    document.querySelectorAll('.delete-source-btn').forEach(button => {
        button.addEventListener('click', (e) => handleDeleteSource(e.currentTarget.dataset.id));
    });
};

// Main function to load and render categories and income sources
const loadCategoriesAndSources = async (userId) => {
    if (!userId || userId === "guest_user_demo") {
        renderExpenseCategories([]); // Render empty for guest mode
        renderIncomeSources([]);    // Render empty for guest mode
        return;
    }
    const categories = await getExpenseCategories(userId);
    const sources = await getIncomeSources(userId);
    renderExpenseCategories(categories);
    renderIncomeSources(sources);
};

// Function to add a new category or income source
const addCategoryOrSource = async (e) => {
    e.preventDefault();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
        displayCategorySourceMessage("يجب تسجيل الدخول لإضافة فئة/مصدر.", true);
        return;
    }
    if (userId === "guest_user_demo") {
        displayCategorySourceMessage("لا يمكن إضافة فئات/مصادر في وضع الضيف.", true);
        return;
    }

    const type = itemTypeSelect.value;
    const name = itemNameInput.value.trim();

    if (!name) {
        displayCategorySourceMessage("الاسم مطلوب.", true);
        return;
    }

    try {
        let collectionPath;
        if (type === 'expenseCategory') {
            collectionPath = `users/${userId}/expenseCategories`;
        } else { // incomeSource
            collectionPath = `users/${userId}/incomeSources`;
        }
        
        await addDoc(collection(db, collectionPath), { name: name });
        displayCategorySourceMessage("تمت الإضافة بنجاح!");
        categorySourceForm.reset();
        loadCategoriesAndSources(userId); // Reload tables
        populateCategoryAndSourceSelects(userId); // Update transaction form dropdowns
        loadAllTransactions(userId); // Update all transactions table
    } catch (error) {
        console.error("Error adding category/source:", error);
        displayCategorySourceMessage("فشل في الإضافة: " + error.message, true);
    }
};

// Function to delete an expense category
const handleDeleteCategory = async (categoryId) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId || userId === "guest_user_demo") {
        displayCategorySourceMessage("لا يمكن حذف فئات في وضع الضيف أو بدون تسجيل دخول.", true);
        return;
    }

    if (confirm("هل أنت متأكد من حذف هذه الفئة؟ سيتم حذف جميع المعاملات المرتبطة بها! (ميزة سيتم تطويرها لاحقاً، حالياً ستحذف الفئة فقط.)")) {
        try {
            // TODO: Implement logic to update/delete associated transactions
            await deleteDoc(doc(db, `users/${userId}/expenseCategories`, categoryId));
            displayCategorySourceMessage("تم حذف الفئة بنجاح!");
            loadCategoriesAndSources(userId); // Update tables
            populateCategoryAndSourceSelects(userId); // Update transaction form dropdowns
            loadAllTransactions(userId); // Update all transactions table
        } catch (error) {
            console.error("Error deleting category:", error);
            displayCategorySourceMessage("فشل في حذف الفئة: " + error.message, true);
        }
    }
};

// Function to delete an income source
const handleDeleteSource = async (sourceId) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId || userId === "guest_user_demo") {
        displayCategorySourceMessage("لا يمكن حذف مصادر في وضع الضيف أو بدون تسجيل دخول.", true);
        return;
    }

    if (confirm("هل أنت متأكد من حذف هذا المصدر؟ سيتم حذف جميع المعاملات المرتبطة به! (ميزة سيتم تطويرها لاحقاً، حالياً ستحذف المصدر فقط.)")) {
        try {
            // TODO: Implement logic to update/delete associated transactions
            await deleteDoc(doc(db, `users/${userId}/incomeSources`, sourceId));
            displayCategorySourceMessage("تم حذف المصدر بنجاح!");
            loadCategoriesAndSources(userId); // Update tables
            populateCategoryAndSourceSelects(userId); // Update transaction form dropdowns
            loadAllTransactions(userId); // Update all transactions table
        } catch (error) {
            console.error("Error deleting source:", error);
            displayCategorySourceMessage("فشل في حذف المصدر: " + error.message, true);
        }
    }
};

// Function to populate expense categories in the budget form dropdown
const populateBudgetCategorySelect = async (userId) => {
    if (!userId || userId === "guest_user_demo") {
        budgetCategorySelect.innerHTML = '<option value="">لا يوجد فئات (وضع الضيف)</option>';
        return;
    }
    const categories = await getExpenseCategories(userId); // Use the same function to fetch expense categories
    budgetCategorySelect.innerHTML = '<option value="">اختر فئة</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        budgetCategorySelect.appendChild(option);
    });
};

// Function to fetch budgets
const getBudgets = async (userId) => {
    try {
        const budgetsRef = collection(db, `users/${userId}/budgets`);
        const q = query(budgetsRef, orderBy('month', 'desc')); // Fetch latest budgets first
        const querySnapshot = await getDocs(q);
        const budgets = [];
        querySnapshot.forEach((doc) => {
            budgets.push({ id: doc.id, ...doc.data() });
        });
        return budgets;
    } catch (error) {
        console.error("Error fetching budgets:", error);
        return [];
    }
};

// Function to calculate spent amount for a specific category in a given month
const getSpentAmountForBudget = async (userId, categoryName, yearMonth) => {
    try {
        const [year, month] = yearMonth.split('-'); // month will be 01-12
        const transactionsRef = collection(db, `users/${userId}/transactions`);
        
        // Construct start and end dates for the month
        const startDate = `${year}-${month}-01`;
        // For accurate end date, determine last day of the month
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        const endDate = `${year}-${month}-${lastDay}`;


        // Fetch transactions for that category and month
        const q = query(
            transactionsRef,
            where('type', '==', 'expense'),
            where('category', '==', categoryName),
            where('date', '>=', startDate),
            where('date', '<=', endDate)
        );
        const querySnapshot = await getDocs(q);
        let spentAmount = 0;
        querySnapshot.forEach(doc => {
            spentAmount += doc.data().amount || 0;
        });
        return spentAmount;
    } catch (error) {
        console.error("Error calculating spent amount for budget:", error);
        return 0;
    }
};

// Function to render budgets in the table
const renderBudgets = async (userId, budgets) => {
    allBudgetsTableBody.innerHTML = '';
    if (budgets.length === 0) {
        allBudgetsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">لا توجد ميزانيات لعرضها.</td></tr>';
        return;
    }

    for (const budget of budgets) {
        const spentAmount = await getSpentAmountForBudget(userId, budget.category, budget.month);
        const remainingAmount = budget.targetAmount - spentAmount;
        const percentage = (spentAmount / budget.targetAmount) * 100;

        let progressBarClass = 'green';
        if (percentage >= 100) {
            progressBarClass = 'red';
        } else if (percentage >= 75) {
            progressBarClass = 'yellow';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${budget.category}</td>
            <td>${budget.targetAmount ? budget.targetAmount.toFixed(2) : '0.00'} JOD</td>
            <td>${spentAmount.toFixed(2)} JOD</td>
            <td style="color: ${remainingAmount < 0 ? '#dc3545' : ''};">${remainingAmount.toFixed(2)} JOD</td>
            <td>
                <div class="progress-bar-container">
                    <div class="progress-bar ${progressBarClass}" style="width: ${Math.min(100, percentage)}%;">
                        ${percentage.toFixed(0)}%
                    </div>
                </div>
            </td>
            <td>${budget.month}</td>
            <td class="action-buttons">
                <button class="delete-budget-btn" data-id="${budget.id}"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        allBudgetsTableBody.appendChild(row);
    }
    document.querySelectorAll('.delete-budget-btn').forEach(button => {
        button.addEventListener('click', (e) => handleDeleteBudget(e.currentTarget.dataset.id));
    });
};

// Main function to load and render budgets
const loadBudgets = async (userId) => {
    if (!userId || userId === "guest_user_demo") {
        allBudgetsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">لا توجد بيانات متاحة في وضع الضيف أو بدون تسجيل دخول.</td></tr>';
        return;
    }
    const budgets = await getBudgets(userId);
    await renderBudgets(userId, budgets);
};

// Function to add a new budget
const addBudget = async (e) => {
    e.preventDefault();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
        displayBudgetMessage("يجب تسجيل الدخول لإضافة ميزانية.", true);
        return;
    }
    if (userId === "guest_user_demo") {
        displayBudgetMessage("لا يمكن إضافة ميزانيات في وضع الضيف.", true);
        return;
    }

    const category = budgetCategorySelect.value;
    const targetAmount = parseFloat(budgetAmountInput.value);
    const month = budgetMonthInput.value; // Will be in YYYY-MM format

    if (!category) {
        displayBudgetMessage("الفئة مطلوبة.", true);
        return;
    }
    if (isNaN(targetAmount) || targetAmount <= 0) {
        displayBudgetMessage("المبلغ المستهدف غير صالح.", true);
        return;
    }
    if (!month) {
        displayBudgetMessage("الشهر والسنة مطلوبان.", true);
        return;
    }

    try {
        // Check if a budget for this category and month already exists
        const budgetsRef = collection(db, `users/${userId}/budgets`);
        const q = query(budgetsRef, where('category', '==', category), where('month', '==', month));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            displayBudgetMessage("يوجد بالفعل ميزانية لهذه الفئة في هذا الشهر.", true);
            return;
        }

        await addDoc(collection(db, `users/${userId}/budgets`), {
            category: category,
            targetAmount: targetAmount,
            month: month // Save in YYYY-MM format
        });
        displayBudgetMessage("تمت إضافة الميزانية بنجاح!");
        budgetForm.reset();
        loadBudgets(userId); // Reload budget table
        // Set default date to current month again after adding
        budgetMonthInput.valueAsDate = new Date(); // Resets to current month
    } catch (error) {
        console.error("Error adding budget:", error);
        displayBudgetMessage("فشل في إضافة الميزانية: " + error.message, true);
    }
};

// Function to delete a budget
const handleDeleteBudget = async (budgetId) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId || userId === "guest_user_demo") {
        displayBudgetMessage("لا يمكن حذف ميزانيات في وضع الضيف أو بدون تسجيل دخول.", true);
        return;
    }

    if (confirm("هل أنت متأكد من حذف هذه الميزانية؟")) {
        try {
            await deleteDoc(doc(db, `users/${userId}/budgets`, budgetId));
            displayBudgetMessage("تم حذف الميزانية بنجاح!");
            loadBudgets(userId); // Update budget table
        } catch (error) {
            console.error("Error deleting budget:", error);
            displayBudgetMessage("فشل في حذف الميزانية: " + error.message, true);
        }
    }
};


// Function to fetch financial goals
const getGoals = async (userId) => {
    try {
        const goalsRef = collection(db, `users/${userId}/goals`);
        const q = query(goalsRef, orderBy('name')); // Order goals alphabetically by name
        const querySnapshot = await getDocs(q);
        const goals = [];
        querySnapshot.forEach((doc) => {
            goals.push({ id: doc.id, ...doc.data() });
        });
        return goals;
    } catch (error) {
        console.error("Error fetching goals:", error);
        return [];
    }
};

// Function to render financial goals in the table
const renderGoals = (goals) => {
    allGoalsTableBody.innerHTML = '';
    if (goals.length === 0) {
        allGoalsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">لا توجد أهداف مالية لعرضها.</td></tr>';
        return;
    }

    goals.forEach(goal => {
        const remainingAmount = goal.targetAmount - (goal.savedAmount || 0);
        const percentage = ((goal.savedAmount || 0) / goal.targetAmount) * 100;

        let progressBarClass = 'red'; // Default to red (not started or far from goal)
        if (percentage >= 100) {
            progressBarClass = 'green'; // Goal achieved
        } else if (percentage >= 50) {
            progressBarClass = 'yellow'; // More than half achieved
        } else if (percentage > 0) {
            progressBarClass = 'yellow'; // Some progress made
        }


        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${goal.name}</td>
            <td>${goal.targetAmount ? goal.targetAmount.toFixed(2) : '0.00'} JOD</td>
            <td>${(goal.savedAmount || 0).toFixed(2)} JOD</td>
            <td style="color: ${remainingAmount <= 0 ? '#28a745' : ''};">${remainingAmount.toFixed(2)} JOD</td>
            <td>
                <div class="progress-bar-container">
                    <div class="progress-bar ${progressBarClass}" style="width: ${Math.min(100, percentage)}%;">
                        ${percentage.toFixed(0)}%
                    </div>
                </div>
            </td>
            <td>${goal.deadline ? new Date(goal.deadline).toLocaleDateString('ar-EG') : 'لا يوجد'}</td>
            <td class="action-buttons">
                <button class="edit-goal-btn" data-id="${goal.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-goal-btn" data-id="${goal.id}"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        allGoalsTableBody.appendChild(row);
    });
    // Add event listeners for delete and edit buttons after rows are created
    document.querySelectorAll('.delete-goal-btn').forEach(button => {
        button.addEventListener('click', (e) => handleDeleteGoal(e.currentTarget.dataset.id));
    });
    // For edit functionality, you would add a similar listener:
    // document.querySelectorAll('.edit-goal-btn').forEach(button => {
    //     button.addEventListener('click', (e) => handleEditGoal(e.currentTarget.dataset.id));
    // });
    // Currently, `handleEditGoal` function is not implemented
};

// Main function to load and render financial goals
const loadGoals = async (userId) => {
    if (!userId || userId === "guest_user_demo") {
        allGoalsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">لا توجد بيانات متاحة في وضع الضيف أو بدون تسجيل دخول.</td></tr>';
        return;
    }
    const goals = await getGoals(userId);
    renderGoals(goals);
};

// Function to add a new financial goal
const addGoal = async (e) => {
    e.preventDefault();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
        displayGoalMessage("يجب تسجيل الدخول لإضافة هدف.", true);
        return;
    }
    if (userId === "guest_user_demo") {
        displayGoalMessage("لا يمكن إضافة أهداف في وضع الضيف.", true);
        return;
    }

    const name = goalNameInput.value.trim();
    const targetAmount = parseFloat(goalTargetAmountInput.value);
    const savedAmount = parseFloat(goalSavedAmountInput.value) || 0; // Default to 0 if not entered
    const deadline = goalDeadlineInput.value; // YYYY-MM-DD

    if (!name) {
        displayGoalMessage("اسم الهدف مطلوب.", true);
        return;
    }
    if (isNaN(targetAmount) || targetAmount <= 0) {
        displayGoalMessage("المبلغ المستهدف غير صالح.", true);
        return;
    }
    if (isNaN(savedAmount) || savedAmount < 0) {
        displayGoalMessage("المبلغ المدخر حالياً غير صالح.", true);
        return;
    }
    if (savedAmount > targetAmount) {
        displayGoalMessage("المبلغ المدخر لا يمكن أن يكون أكبر من المبلغ المستهدف.", true);
        return;
    }

    try {
        await addDoc(collection(db, `users/${userId}/goals`), {
            name: name,
            targetAmount: targetAmount,
            savedAmount: savedAmount,
            deadline: deadline || null, // Save as null if no deadline
            createdAt: new Date().toISOString()
        });
        displayGoalMessage("تمت إضافة الهدف بنجاح!");
        goalForm.reset(); // Reset the form
        loadGoals(userId); // Reload goals table
        // Reset deadline input if needed, or leave it blank
        goalDeadlineInput.value = '';
    } catch (error) {
        console.error("Error adding goal:", error);
        displayGoalMessage("فشل في إضافة الهدف: " + error.message, true);
    }
};

// Function to delete a financial goal
const handleDeleteGoal = async (goalId) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId || userId === "guest_user_demo") {
        displayGoalMessage("لا يمكن حذف أهداف في وضع الضيف أو بدون تسجيل دخول.", true);
        return;
    }

    if (confirm("هل أنت متأكد من حذف هذا الهدف؟")) {
        try {
            await deleteDoc(doc(db, `users/${userId}/goals`, goalId));
            displayGoalMessage("تم حذف الهدف بنجاح!");
            loadGoals(userId); // Update goals table
        } catch (error) {
            console.error("Error deleting goal:", error);
            displayGoalMessage("فشل في حذف الهدف: " + error.message, true);
        }
    }
};


// Function to fetch all assets
const getAssets = async (userId) => {
    try {
        const assetsRef = collection(db, `users/${userId}/assets`);
        const querySnapshot = await getDocs(assetsRef);
        const assets = [];
        querySnapshot.forEach((doc) => {
            assets.push({ id: doc.id, ...doc.data() });
        });
        return assets;
    } catch (error) {
        console.error("Error fetching assets:", error);
        return [];
    }
};

// Function to fetch all liabilities
const getLiabilities = async (userId) => {
    try {
        const liabilitiesRef = collection(db, `users/${userId}/liabilities`);
        const querySnapshot = await getDocs(liabilitiesRef);
        const liabilities = [];
        querySnapshot.forEach((doc) => {
            liabilities.push({ id: doc.id, ...doc.data() });
        });
        return liabilities;
    } catch (error) {
        console.error("Error fetching liabilities:", error);
        return [];
    }
};

// Function to calculate and render total assets, total liabilities, and net worth
const calculateAndRenderNetWorth = (assets, liabilities) => {
    let totalAssets = 0;
    assets.forEach(asset => {
        totalAssets += asset.value || 0;
    });

    let totalLiabilities = 0;
    liabilities.forEach(liability => {
        totalLiabilities += liability.value || 0;
    });

    const netWorth = totalAssets - totalLiabilities;

    totalAssetsEl.textContent = `${totalAssets.toFixed(2)} JOD`;
    totalLiabilitiesEl.textContent = `${totalLiabilities.toFixed(2)} JOD`;
    netWorthEl.textContent = `${netWorth.toFixed(2)} JOD`;

    // Update net worth color
    if (netWorth < 0) {
        netWorthEl.classList.add('negative');
    } else {
        netWorthEl.classList.remove('negative');
    }
};

// Function to render assets in the assets table
const renderAssets = (assets) => {
    assetsTableBody.innerHTML = '';
    if (assets.length === 0) {
        assetsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">لا توجد أصول لعرضها.</td></tr>';
        return;
    }
    assets.forEach(asset => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${asset.name}</td>
            <td>${asset.value ? asset.value.toFixed(2) : '0.00'} JOD</td>
            <td>${asset.createdAt ? new Date(asset.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}</td>
            <td class="action-buttons">
                <button class="edit-asset-btn" data-id="${asset.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-asset-btn" data-id="${asset.id}"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        assetsTableBody.appendChild(row);
    });
    document.querySelectorAll('.delete-asset-btn').forEach(button => {
        button.addEventListener('click', (e) => handleDeleteAsset(e.currentTarget.dataset.id));
    });
    // For edit functionality, you would add a similar listener:
    // document.querySelectorAll('.edit-asset-btn').forEach(button => {
    //     button.addEventListener('click', (e) => handleEditAsset(e.currentTarget.dataset.id));
    // });
};

// Function to render liabilities in the liabilities table
const renderLiabilities = (liabilities) => {
    liabilitiesTableBody.innerHTML = '';
    if (liabilities.length === 0) {
        liabilitiesTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">لا توجد خصوم لعرضها.</td></tr>';
        return;
    }
    liabilities.forEach(liability => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${liability.name}</td>
            <td>${liability.value ? liability.value.toFixed(2) : '0.00'} JOD</td>
            <td>${liability.createdAt ? new Date(liability.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}</td>
            <td class="action-buttons">
                <button class="edit-liability-btn" data-id="${liability.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-liability-btn" data-id="${liability.id}"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        liabilitiesTableBody.appendChild(row);
    });
    document.querySelectorAll('.delete-liability-btn').forEach(button => {
        button.addEventListener('click', (e) => handleDeleteLiability(e.currentTarget.dataset.id));
    });
    // For edit functionality, you would add a similar listener:
    // document.querySelectorAll('.edit-liability-btn').forEach(button => {
    //     button.addEventListener('click', (e) => handleEditLiability(e.currentTarget.dataset.id));
    // });
};

// Main function to load and render assets and liabilities
const loadAssetsAndLiabilities = async (userId) => {
    if (!userId || userId === "guest_user_demo") {
        totalAssetsEl.textContent = '0.00 JOD';
        totalLiabilitiesEl.textContent = '0.00 JOD';
        netWorthEl.textContent = '0.00 JOD';
        netWorthEl.classList.remove('negative'); // Ensure default color
        renderAssets([]);
        renderLiabilities([]);
        return;
    }

    const assets = await getAssets(userId);
    const liabilities = await getLiabilities(userId);

    renderAssets(assets);
    renderLiabilities(liabilities);
    calculateAndRenderNetWorth(assets, liabilities);
};

// Function to add a new asset or liability
const addAssetOrLiability = async (e) => {
    e.preventDefault();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
        displayAssetLiabilityMessage("يجب تسجيل الدخول لإضافة أصل/خصم.", true);
        return;
    }
    if (userId === "guest_user_demo") {
        displayAssetLiabilityMessage("لا يمكن إضافة أصول/خصوم في وضع الضيف.", true);
        return;
    }

    const type = itemTypeALSelect.value;
    const name = itemNameALInput.value.trim();
    const value = parseFloat(itemValueALInput.value);

    if (!name) {
        displayAssetLiabilityMessage("الاسم/الوصف مطلوب.", true);
        return;
    }
    if (isNaN(value) || value < 0) {
        displayAssetLiabilityMessage("القيمة الحالية غير صالحة.", true);
        return;
    }

    try {
        let collectionPath;
        if (type === 'asset') {
            collectionPath = `users/${userId}/assets`;
        } else { // liability
            collectionPath = `users/${userId}/liabilities`;
        }
        
        await addDoc(collection(db, collectionPath), {
            name: name,
            value: value,
            createdAt: new Date().toISOString()
        });
        displayAssetLiabilityMessage("تمت الإضافة بنجاح!");
        assetLiabilityForm.reset();
        loadAssetsAndLiabilities(userId); // Reload tables and summary
    } catch (error) {
        console.error("Error adding asset/liability:", error);
        displayAssetLiabilityMessage("فشل في الإضافة: " + error.message, true);
    }
};

// Function to delete an asset
const handleDeleteAsset = async (assetId) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId || userId === "guest_user_demo") {
        displayAssetLiabilityMessage("لا يمكن حذف أصول في وضع الضيف أو بدون تسجيل دخول.", true);
        return;
    }

    if (confirm("هل أنت متأكد من حذف هذا الأصل؟")) {
        try {
            await deleteDoc(doc(db, `users/${userId}/assets`, assetId));
            displayAssetLiabilityMessage("تم حذف الأصل بنجاح!");
            loadAssetsAndLiabilities(userId); // Update tables and summary
        } catch (error) {
            console.error("Error deleting asset:", error);
            displayAssetLiabilityMessage("فشل في حذف الأصل: " + error.message, true);
        }
    }
};

// Function to delete a liability
const handleDeleteLiability = async (liabilityId) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId || userId === "guest_user_demo") {
        displayAssetLiabilityMessage("لا يمكن حذف خصوم في وضع الضيف أو بدون تسجيل دخول.", true);
        return;
    }

    if (confirm("هل أنت متأكد من حذف هذا الخصم؟")) {
        try {
            await deleteDoc(doc(db, `users/${userId}/liabilities`, liabilityId));
            displayAssetLiabilityMessage("تم حذف الخصم بنجاح!");
            loadAssetsAndLiabilities(userId); // Update tables and summary
        } catch (error) {
            console.error("Error deleting liability:", error);
            displayAssetLiabilityMessage("فشل في حذف الخصم: " + error.message, true);
        }
    }
};


// === New Functions for Reports ===

// Helper function to get date range based on timeframe
const getDateRange = (timeframe) => {
    const now = new Date();
    let startDate = null;
    let endDate = now;

    switch (timeframe) {
        case 'last_7_days':
            startDate = new Date();
            startDate.setDate(now.getDate() - 7);
            break;
        case 'last_30_days':
            startDate = new Date();
            startDate.setDate(now.getDate() - 30);
            break;
        case 'this_month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'last_month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month
            break;
        case 'this_year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        case 'last_year':
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            endDate = new Date(now.getFullYear() - 1, 11, 31);
            break;
        case 'all_time':
            startDate = null; // No start date filter
            break;
    }

    // Format dates to YYYY-MM-DD for comparison with Firestore string dates
    const format = (date) => date ? date.toISOString().split('T')[0] : null;

    return {
        startDate: format(startDate),
        endDate: format(endDate)
    };
};

// Function to fetch transactions for reports based on timeframe
const getTransactionsForReports = async (userId, timeframe) => {
    if (!userId || userId === "guest_user_demo") return [];

    const { startDate, endDate } = getDateRange(timeframe);
    let q;
    const transactionsRef = collection(db, `users/${userId}/transactions`);

    if (startDate && endDate) {
        q = query(
            transactionsRef,
            where('date', '>=', startDate),
            where('date', '<=', endDate),
            orderBy('date', 'asc') // Order by date for time-series charts
        );
    } else { // All time
        q = query(transactionsRef, orderBy('date', 'asc'));
    }

    try {
        const querySnapshot = await getDocs(q);
        const transactions = [];
        querySnapshot.forEach((doc) => {
            transactions.push({ id: doc.id, ...doc.data() });
        });
        return transactions;
    } catch (error) {
        console.error("Error fetching transactions for reports:", error);
        displayReportMessage("حدث خطأ أثناء جلب البيانات للتقارير.", true);
        return [];
    }
};

// Function to prepare data and render Expense Category Chart (Pie Chart)
const renderExpenseCategoryChart = (transactions) => {
    if (expenseCategoryChartInstance) {
        expenseCategoryChartInstance.destroy(); // Destroy previous chart instance
    }
    expenseChartMessage.textContent = ''; // Clear previous messages

    const expenseData = {};
    transactions.filter(t => t.type === 'expense').forEach(expense => {
        const category = expense.category || 'غير مصنفة';
        expenseData[category] = (expenseData[category] || 0) + expense.amount;
    });

    const labels = Object.keys(expenseData);
    const data = Object.values(expenseData);

    if (labels.length === 0) {
        expenseChartMessage.textContent = 'لا توجد بيانات مصروفات لعرضها في هذه الفترة.';
        expenseCategoryChartCanvas.style.display = 'none'; // Hide canvas
        return;
    }
    expenseCategoryChartCanvas.style.display = 'block'; // Show canvas

    expenseCategoryChartInstance = new Chart(expenseCategoryChartCanvas, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#00CD9B', '#6A5ACD', '#DC143C', '#20B2AA'
                ],
                hoverBackgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#00CD9B', '#6A5ACD', '#DC143C', '#20B2AA'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'ملخص المصروفات حسب الفئة'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'JOD' }).format(context.parsed);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
};

// Function to prepare data and render Income vs Expense Chart (Line Chart)
const renderIncomeVsExpenseChart = (transactions) => {
    if (incomeVsExpenseChartInstance) {
        incomeVsExpenseChartInstance.destroy(); // Destroy previous chart instance
    }
    incomeExpenseChartMessage.textContent = ''; // Clear previous messages

    const dates = {}; // { 'YYYY-MM-DD': { income: X, expense: Y } }
    transactions.forEach(t => {
        const date = t.date; // Date is already in YYYY-MM-DD
        if (!dates[date]) {
            dates[date] = { income: 0, expense: 0 };
        }
        if (t.type === 'income') {
            dates[date].income += t.amount;
        } else {
            dates[date].expense += t.amount;
        }
    });

    const sortedDates = Object.keys(dates).sort();
    const incomeData = sortedDates.map(date => dates[date].income);
    const expenseData = sortedDates.map(date => dates[date].expense);

    if (sortedDates.length === 0) {
        incomeExpenseChartMessage.textContent = 'لا توجد بيانات دخل أو مصروفات لعرضها في هذه الفترة.';
        incomeVsExpenseChartCanvas.style.display = 'none'; // Hide canvas
        return;
    }
    incomeVsExpenseChartCanvas.style.display = 'block'; // Show canvas

    incomeVsExpenseChartInstance = new Chart(incomeVsExpenseChartCanvas, {
        type: 'line',
        data: {
            labels: sortedDates, // Dates as labels
            datasets: [
                {
                    label: 'الدخل',
                    data: incomeData,
                    borderColor: '#28a745', // Green
                    backgroundColor: 'rgba(40, 167, 69, 0.2)',
                    fill: true,
                    tension: 0.1
                },
                {
                    label: 'المصروفات',
                    data: expenseData,
                    borderColor: '#dc3545', // Red
                    backgroundColor: 'rgba(220, 53, 69, 0.2)',
                    fill: true,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'الدخل مقابل المصروفات بمرور الوقت'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'JOD' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'category', // Use 'category' for date strings
                    title: {
                        display: true,
                        text: 'التاريخ'
                    },
                    ticks: {
                        // Display fewer ticks if too many dates
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'المبلغ (JOD)'
                    },
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'JOD' }).format(value);
                        }
                    }
                }
            }
        }
    });
};

// Function to fetch budgets and calculate spent amounts for budget tracking chart
const getBudgetTrackingData = async (userId, timeframe) => {
    if (!userId || userId === "guest_user_demo") return { labels: [], datasets: [] };

    const { startDate, endDate } = getDateRange(timeframe);
    let startMonth = null;
    let endMonth = null;

    if (startDate && endDate) {
        startMonth = startDate.substring(0, 7); // YYYY-MM
        endMonth = endDate.substring(0, 7);     // YYYY-MM
    } else { // All time, we will only consider active budgets or budgets with data
        // For "all time" budget tracking, it's more complex. We'll show budgets for the current or last month by default.
        // For simplicity, we'll fetch budgets from the last 12 months or current active ones.
        // This part might need further refinement for a true "all time" budget view.
        startMonth = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0'); // Current month
        endMonth = startMonth; // Just current month
    }
    
    const allBudgets = await getBudgets(userId); // Use existing function

    // Filter budgets relevant to the selected timeframe
    let filteredBudgets = allBudgets.filter(budget => {
        // If timeframe is 'all_time', we might show all, or limit to recent (e.g., current year)
        // For this example, we'll stick to a relevant monthly range.
        if (!startDate || !endDate) return true; // Show all if no date filter

        const budgetYearMonth = budget.month; // YYYY-MM
        return budgetYearMonth >= startMonth && budgetYearMonth <= endMonth;
    });

    // Ensure uniqueness for categories across months if multiple months are selected
    // For simplicity of this budget chart, we'll aggregate for each category,
    // and if a category has multiple budgets in the period, we'll sum them or take the latest.
    // Here, we take the latest budget for each category if multiples exist within the timeframe.
    const uniqueBudgets = {};
    filteredBudgets.forEach(budget => {
        if (!uniqueBudgets[budget.category] || uniqueBudgets[budget.category].month < budget.month) {
            uniqueBudgets[budget.category] = budget;
        }
    });
    filteredBudgets = Object.values(uniqueBudgets);


    const labels = []; // Budget categories
    const targetAmounts = [];
    const spentAmounts = [];
    const remainingAmounts = [];

    for (const budget of filteredBudgets) {
        const spent = await getSpentAmountForBudget(userId, budget.category, budget.month); // Requires month for accurate spent calculation
        labels.push(budget.category + ` (${budget.month})`); // Add month to label for clarity
        targetAmounts.push(budget.targetAmount);
        spentAmounts.push(spent);
        remainingAmounts.push(budget.targetAmount - spent);
    }

    return { labels, targetAmounts, spentAmounts, remainingAmounts };
};


// Function to render Budget Tracking Chart (Bar Chart)
const renderBudgetTrackingChart = async (userId, timeframe) => {
    if (budgetTrackingChartInstance) {
        budgetTrackingChartInstance.destroy(); // Destroy previous chart instance
    }
    budgetChartMessage.textContent = ''; // Clear previous messages

    const { labels, targetAmounts, spentAmounts } = await getBudgetTrackingData(userId, timeframe);

    if (labels.length === 0) {
        budgetChartMessage.textContent = 'لا توجد بيانات ميزانيات لعرضها في هذه الفترة.';
        budgetTrackingChartCanvas.style.display = 'none'; // Hide canvas
        return;
    }
    budgetTrackingChartCanvas.style.display = 'block'; // Show canvas

    budgetTrackingChartInstance = new Chart(budgetTrackingChartCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'المبلغ المستهدف',
                    data: targetAmounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'المبلغ المنفق',
                    data: spentAmounts,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'تتبع الميزانيات'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'JOD' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'الفئة (الشهر)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'المبلغ (JOD)'
                    },
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'JOD' }).format(value);
                        }
                    }
                }
            }
        }
    });
};

// Main function to load and render all reports
const loadReports = async (userId) => {
    if (!userId || userId === "guest_user_demo") {
        displayReportMessage("لا يمكن توليد تقارير في وضع الضيف أو بدون تسجيل دخول.", true);
        expenseChartMessage.textContent = 'لا تتوفر بيانات في وضع الضيف.';
        incomeExpenseChartMessage.textContent = 'لا تتوفر بيانات في وضع الضيف.';
        budgetChartMessage.textContent = 'لا تتوفر بيانات في وضع الضيف.';
        expenseCategoryChartCanvas.style.display = 'none';
        incomeVsExpenseChartCanvas.style.display = 'none';
        budgetTrackingChartCanvas.style.display = 'none';
        return;
    }

    displayReportMessage("جارٍ توليد التقارير...", false);
    const timeframe = reportTimeframeSelect.value;
    const transactions = await getTransactionsForReports(userId, timeframe);
    
    renderExpenseCategoryChart(transactions);
    renderIncomeVsExpenseChart(transactions);
    await renderBudgetTrackingChart(userId, timeframe); // Await because it fetches budget data

    displayReportMessage("تم توليد التقارير بنجاح!");
};


// ==========================================================
// 6. Authentication State Listener
// ==========================================================
// This function runs automatically when authentication state changes (login/logout)
onAuthStateChanged(auth, (user) => {
    updateNavForAuthState(user); // Update UI based on user state
    if (user) {
        console.log("User logged in:", user.uid);
        loadDashboardData(user.uid); // Load dashboard data
        populateCategoryAndSourceSelects(user.uid); // Load categories and income sources in transaction form
        loadAllTransactions(user.uid); // Load all transactions
        loadCategoriesAndSources(user.uid); // Load categories and income sources in their management page
        populateBudgetCategorySelect(user.uid); // Load categories in budget form
        loadBudgets(user.uid); // Load budgets
        loadGoals(user.uid); // Load financial goals
        loadAssetsAndLiabilities(user.uid); // Load assets and liabilities
        // Don't auto-load reports here, load them when the "Generate Reports" button is clicked
    } else {
        console.log("User logged out or not logged in.");
        loadDashboardData(null); // Clear dashboard data
        populateCategoryAndSourceSelects(null); // Clear categories and income sources in transaction form
        loadAllTransactions(null); // Clear transactions
        loadCategoriesAndSources(null); // Clear categories and income sources in their management page
        populateBudgetCategorySelect(null); // Clear categories in budget form
        loadBudgets(null); // Clear budgets
        loadGoals(null); // Clear financial goals
        loadAssetsAndLiabilities(null); // Clear assets and liabilities
        // Clear reports
        if (expenseCategoryChartInstance) expenseCategoryChartInstance.destroy();
        if (incomeVsExpenseChartInstance) incomeVsExpenseChartInstance.destroy();
        if (budgetTrackingChartInstance) budgetTrackingChartInstance.destroy();
        expenseChartMessage.textContent = 'لا تتوفر بيانات في وضع الضيف أو بدون تسجيل دخول.';
        incomeExpenseChartMessage.textContent = 'لا تتوفر بيانات في وضع الضيف.';
        budgetChartMessage.textContent = 'لا تتوفر بيانات في وضع الضيف.';
        expenseCategoryChartCanvas.style.display = 'none';
        incomeVsExpenseChartCanvas.style.display = 'none';
        budgetTrackingChartCanvas.style.display = 'none';
    }
});


// ==========================================================
// 7. Event Listeners
// ==========================================================

// Authentication form (login / register)
loginBtn.addEventListener('click', handleLogin);
authForm.addEventListener('submit', handleLogin);

registerBtn.addEventListener('click', handleRegister);
logoutBtn.addEventListener('click', handleLogout);
guestModeBtn.addEventListener('click', enterGuestMode);

// Navigation buttons to show appropriate sections
dashboardNav.addEventListener('click', () => {
    showPage('dashboard-section');
    if (auth.currentUser) {
        loadDashboardData(auth.currentUser.uid);
    } else if (document.getElementById('auth-error-message').textContent.includes("وضع الضيف")) {
        loadDashboardData("guest_user_demo"); // Show guest data if in guest mode
    } else {
        loadDashboardData(null);
    }
});

// New transaction form
transactionTypeSelect.addEventListener('change', toggleCategoryIncomeSourceFields);
transactionForm.addEventListener('submit', addTransaction);

// Filters, sort, and search in transactions table
filterTypeSelect.addEventListener('change', () => loadAllTransactions(auth.currentUser ? auth.currentUser.uid : "guest_user_demo"));
sortBySelect.addEventListener('change', () => loadAllTransactions(auth.currentUser ? auth.currentUser.uid : "guest_user_demo"));
searchTransactionsInput.addEventListener('input', () => loadAllTransactions(auth.currentUser ? auth.currentUser.uid : "guest_user_demo"));


// Transactions navigation button
transactionsNav.addEventListener('click', () => {
    showPage('transactions-section');
    const userId = auth.currentUser ? auth.currentUser.uid : "guest_user_demo";
    // Reload data when navigating to transactions page
    populateCategoryAndSourceSelects(userId);
    loadAllTransactions(userId);
    // Set default date to current date when showing the form
    transactionDateInput.valueAsDate = new Date();
    toggleCategoryIncomeSourceFields(); // Ensure category/source fields are correctly set
});

// Category and Income Source management form
categorySourceForm.addEventListener('submit', addCategoryOrSource);

// Categories & Income Sources navigation button
categoriesSourcesNav.addEventListener('click', () => {
    showPage('categories-sources-section');
    const userId = auth.currentUser ? auth.currentUser.uid : "guest_user_demo";
    loadCategoriesAndSources(userId); // Reload data when navigating to the page
});

// Budget management form
budgetForm.addEventListener('submit', addBudget);

// Budgets navigation button
budgetsNav.addEventListener('click', () => {
    showPage('budgets-section');
    const userId = auth.currentUser ? auth.currentUser.uid : "guest_user_demo";
    populateBudgetCategorySelect(userId); // Reload budget categories
    loadBudgets(userId); // Reload budgets
    // Set default month to current month when showing the form
    budgetMonthInput.valueAsDate = new Date();
});

// Goal management form
goalForm.addEventListener('submit', addGoal);

// Goals navigation button
goalsNav.addEventListener('click', () => {
    showPage('goals-section');
    const userId = auth.currentUser ? auth.currentUser.uid : "guest_user_demo";
    loadGoals(userId); // Reload goals
});

// Asset and Liability management form
assetLiabilityForm.addEventListener('submit', addAssetOrLiability);

// Assets & Liabilities navigation button
assetsLiabilitiesNav.addEventListener('click', () => {
    showPage('assets-liabilities-section');
    const userId = auth.currentUser ? auth.currentUser.uid : "guest_user_demo";
    loadAssetsAndLiabilities(userId); // Reload assets and liabilities
});

// Reports management
generateReportsBtn.addEventListener('click', () => {
    const userId = auth.currentUser ? auth.currentUser.uid : "guest_user_demo";
    loadReports(userId);
});

reportsNav.addEventListener('click', () => {
    showPage('reports-section');
    const userId = auth.currentUser ? auth.currentUser.uid : "guest_user_demo";
    loadReports(userId); // Load reports when navigating to the page
});


// Set default date for transaction form and budget month input on page load
document.addEventListener('DOMContentLoaded', () => {
    transactionDateInput.valueAsDate = new Date();
    budgetMonthInput.valueAsDate = new Date();
});
