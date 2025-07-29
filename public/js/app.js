// public/js/app.js

// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Firebase Configuration - (تم تعديل هذا الجزء ليناسب الإعدادات الخاصة بك)
const firebaseConfig = {
  apiKey: "AIzaSyC-pZm-mV7fvfMFVEqOq1s5vnoVHQ4Olc4",
  authDomain: "money-969a6.firebaseapp.com",
  projectId: "money-969a6",
  storageBucket: "money-969a6.firebasestorage.app",
  messagingSenderId: "51946916024",
  appId: "1:51946916024:web:e50cb67494fe5305f14c4d"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================================
// 1. تعريف العناصر (DOM Elements)
// ==========================================================
const authSection = document.getElementById('auth-section');
const authForm = document.getElementById('auth-form');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const authErrorMessage = document.getElementById('auth-error-message');
const guestModeBtn = document.getElementById('guest-mode-btn');

// أزرار التنقل (Header Navigation Buttons)
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

// أقسام المحتوى (Content Sections)
const allPages = document.querySelectorAll('.page'); // يحدد جميع الأقسام التي تحتوي على الكلاس 'page'

// عناصر لوحة التحكم
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const currentBalanceEl = document.getElementById('current-balance');
const latestTransactionsTableBody = document.querySelector('#latest-transactions-table tbody');


// ==========================================================
// 2. وظائف واجهة المستخدم (UI Functions)
// ==========================================================

// وظيفة لعرض قسم معين وإخفاء البقية
const showPage = (pageId) => {
    allPages.forEach(page => {
        page.style.display = 'none'; // إخفاء جميع الصفحات
    });
    document.getElementById(pageId).style.display = 'block'; // عرض الصفحة المطلوبة
};

// وظيفة لتحديث أزرار التنقل بناءً على حالة المصادقة
const updateNavForAuthState = (user) => {
    if (user) { // المستخدم مسجل دخول
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
        showPage('dashboard-section'); // عرض لوحة التحكم تلقائيًا
    } else { // المستخدم غير مسجل دخول
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
        showPage('auth-section'); // عرض صفحة المصادقة
    }
};

// ==========================================================
// 3. وظائف المصادقة (Authentication Functions)
// ==========================================================

// معالجة تسجيل الدخول
const handleLogin = async (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    const email = authEmail.value;
    const password = authPassword.value;
    authErrorMessage.textContent = ''; // مسح أي رسائل خطأ سابقة

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Firebase onAuthStateChanged سيقوم بالتعامل مع تحديث الواجهة
        authEmail.value = ''; // مسح حقول الإدخال
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

// معالجة إنشاء حساب جديد
const handleRegister = async (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    const email = authEmail.value;
    const password = authPassword.value;
    authErrorMessage.textContent = ''; // مسح أي رسائل خطأ سابقة

    if (password.length < 6) {
        authErrorMessage.textContent = "يجب أن تكون كلمة المرور 6 أحرف على الأقل.";
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Firebase onAuthStateChanged سيقوم بالتعامل مع تحديث الواجهة
        // يمكننا هنا إضافة بيانات المستخدم الأولية إلى Firestore
        // مصادر الدخل الافتراضية
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

        // فئات المصاريف الافتراضية
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

        authEmail.value = ''; // مسح حقول الإدخال
        authPassword.value = '';
        authErrorMessage.textContent = "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول."; // رسالة تأكيد للمستخدم
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

// معالجة تسجيل الخروج
const handleLogout = async () => {
    try {
        await signOut(auth);
        // Firebase onAuthStateChanged سيقوم بالتعامل مع تحديث الواجهة
    } catch (error) {
        console.error("Logout Error:", error.message);
    }
};

// ==========================================================
// 4. وضع الضيف (Guest Mode) - لا يتطلب تسجيل دخول حقيقي
// ==========================================================
const enterGuestMode = () => {
    // سنستخدم معرف مستخدم ثابت لوضع الضيف للوصول إلى بيانات تجريبية
    // ملاحظة: في تطبيق حقيقي، يجب أن تكون بيانات الضيف للقراءة فقط
    // أو تتم إعادة تعيينها بعد كل جلسة
    const guestUserId = "guest_user_demo"; // معرف مستخدم ثابت
    // لا يوجد تغيير في حالة المصادقة في Firebase، بل نغير الواجهة فقط
    updateNavForAuthState({ uid: guestUserId, isGuest: true }); // نمرر كائن مستخدم وهمي
    authErrorMessage.textContent = "أنت الآن في وضع الضيف. لن يتم حفظ بياناتك.";
    // هنا يمكنك استدعاء وظيفة لتحميل بيانات تجريبية لوضع الضيف
    // loadGuestDashboardData(); // ستنشئ هذه الوظيفة لاحقا
};


// ==========================================================
// 5. وظائف جلب وعرض البيانات (Data Fetching & Rendering)
// ==========================================================

// وظيفة لجلب أحدث المعاملات (الإيرادات والمصاريف) من Firestore
const getLatestTransactions = async (userId) => {
    try {
        const transactionsRef = collection(db, `users/${userId}/transactions`);
        const q = query(transactionsRef, orderBy('date', 'desc'), limit(5)); // جلب أحدث 5 معاملات
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

// وظيفة لجلب جميع الإيرادات والمصاريف لحساب الإجماليات
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

// وظيفة لعرض أحدث المعاملات في الجدول
const renderLatestTransactions = (transactions) => {
    latestTransactionsTableBody.innerHTML = ''; // مسح المحتوى الحالي
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

// وظيفة لحساب وعرض الإجماليات في بطاقات الملخص
const calculateAndRenderSummary = (transactions) => {
    let totalIncome = 0;
    let totalExpense = 0;

    // بما أننا لا نتعامل مع تحويل العملات، سنفترض عملة واحدة الآن (JOD افتراضياً)
    // لاحقاً يمكننا إضافة منطق للتعامل مع عملات متعددة بعرضها منفصلة أو تحويلها تقديرياً
    transactions.forEach(transaction => {
        // إذا كان هناك عملات متعددة، يمكنك تعديل هذا هنا لفلترة أو جمع حسب العملة
        // حالياً نفترض جميع المعاملات بنفس العملة الافتراضية
        if (transaction.type === 'income') {
            totalIncome += transaction.amount || 0;
        } else if (transaction.type === 'expense') {
            totalExpense += transaction.amount || 0;
        }
    });

    const currentBalance = totalIncome - totalExpense;

    totalIncomeEl.textContent = `${totalIncome.toFixed(2)} JOD`; // نفترض JOD كعملة افتراضية
    totalExpenseEl.textContent = `${totalExpense.toFixed(2)} JOD`;
    currentBalanceEl.textContent = `${currentBalance.toFixed(2)} JOD`;

    // تغيير لون الرصيد بناءً على القيمة
    if (currentBalance < 0) {
        currentBalanceEl.style.color = '#dc3545'; // أحمر
    } else {
        currentBalanceEl.style.color = '#007bff'; // أزرق (نفس اللون الافتراضي)
    }
};

// وظيفة رئيسية لتحميل بيانات لوحة التحكم
const loadDashboardData = async (userId) => {
    if (!userId || userId === "guest_user_demo") {
        // في وضع الضيف أو بدون مستخدم، لا نجلب بيانات حقيقية
        // يمكن هنا تحميل بيانات تجريبية ثابتة لوضع الضيف
        totalIncomeEl.textContent = '0.00 JOD';
        totalExpenseEl.textContent = '0.00 JOD';
        currentBalanceEl.textContent = '0.00 JOD';
        latestTransactionsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">لا توجد بيانات متاحة في وضع الضيف أو بدون تسجيل دخول.</td></tr>';
        return;
    }

    // جلب أحدث 5 معاملات للعرض المباشر
    const latest = await getLatestTransactions(userId);
    renderLatestTransactions(latest);

    // جلب جميع المعاملات لحساب الإجماليات
    const all = await getAllTransactions(userId);
    calculateAndRenderSummary(all);
};

// ==========================================================
// 6. إدارة حالة المصادقة (Auth State Listener)
// ==========================================================
// هذه الوظيفة تعمل تلقائيًا عند تغيير حالة المصادقة (تسجيل دخول/خروج)
onAuthStateChanged(auth, (user) => {
    updateNavForAuthState(user); // تحديث الواجهة بناءً على المستخدم
    if (user) {
        console.log("User logged in:", user.uid);
        loadDashboardData(user.uid); // الآن نستدعي وظيفة تحميل بيانات لوحة التحكم
    } else {
        console.log("User logged out or not logged in.");
        loadDashboardData(null); // مسح البيانات عند تسجيل الخروج أو عدم وجود مستخدم
    }
});

// ==========================================================
// 7. إضافة مستمعي الأحداث (Event Listeners)
// ==========================================================

// لنموذج المصادقة (تسجيل الدخول / إنشاء حساب)
// عند الضغط على زر "تسجيل الدخول" أو إرسال النموذج (افتراضيًا Submit للزر الأول)
loginBtn.addEventListener('click', handleLogin);
authForm.addEventListener('submit', handleLogin);

// عند الضغط على زر "إنشاء حساب جديد"
registerBtn.addEventListener('click', handleRegister);

// عند الضغط على زر "تسجيل الخروج"
logoutBtn.addEventListener('click', handleLogout);

// عند الضغط على زر وضع الضيف
guestModeBtn.addEventListener('click', enterGuestMode);

// أزرار التنقل لعرض الأقسام المناسبة (حالياً تعرض رسالة بسيطة)
dashboardNav.addEventListener('click', () => {
    showPage('dashboard-section');
    if (auth.currentUser) {
        loadDashboardData(auth.currentUser.uid);
    } else if (document.getElementById('auth-error-message').textContent.includes("وضع الضيف")) {
        loadDashboardData("guest_user_demo"); // لإظهار بيانات الضيف إذا كان في وضع الضيف
    } else {
        loadDashboardData(null);
    }
});
transactionsNav.addEventListener('click', () => showPage('transactions-section'));
categoriesSourcesNav.addEventListener('click', () => showPage('categories-sources-section'));
budgetsNav.addEventListener('click', () => showPage('budgets-section'));
goalsNav.addEventListener('click', () => showPage('goals-section'));
assetsLiabilitiesNav.addEventListener('click', () => showPage('assets-liabilities-section'));
reportsNav.addEventListener('click', () => showPage('reports-section'));
settingsNav.addEventListener('click', () => showPage('settings-section'));
authNavBtn.addEventListener('click', () => showPage('auth-section')); // زر تسجيل الدخول/التسجيل يعود لصفحة المصادقة
