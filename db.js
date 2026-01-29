// معالجة قاعدة البيانات IndexedDB

// اسم قاعدة البيانات
const DB_NAME = 'PixelArtDB';
const DB_VERSION = 1;

// أسماء الجداول
const STORES = {
    DESIGN_REQUESTS: 'design_requests',
    HIRING_REQUESTS: 'hiring_requests',
    SETTINGS: 'settings',
    DESIGNS: 'designs'
};

let db;

// تهيئة قاعدة البيانات
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = function(event) {
            console.error('فشل فتح قاعدة البيانات:', event.target.error);
            reject(event.target.error);
        };
        
        request.onsuccess = function(event) {
            db = event.target.result;
            console.log('تم فتح قاعدة البيانات بنجاح');
            resolve(db);
        };
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            
            // إنشاء جدول طلبات التصميم
            if (!db.objectStoreNames.contains(STORES.DESIGN_REQUESTS)) {
                const designStore = db.createObjectStore(STORES.DESIGN_REQUESTS, { keyPath: 'id', autoIncrement: true });
                designStore.createIndex('date', 'date', { unique: false });
                designStore.createIndex('status', 'status', { unique: false });
            }
            
            // إنشاء جدول طلبات التوظيف
            if (!db.objectStoreNames.contains(STORES.HIRING_REQUESTS)) {
                const hiringStore = db.createObjectStore(STORES.HIRING_REQUESTS, { keyPath: 'id', autoIncrement: true });
                hiringStore.createIndex('date', 'date', { unique: false });
                hiringStore.createIndex('status', 'status', { unique: false });
            }
            
            // إنشاء جدول الإعدادات
            if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
                const settingsStore = db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
            }
            
            // إنشاء جدول التصاميم
            if (!db.objectStoreNames.contains(STORES.DESIGNS)) {
                const designsStore = db.createObjectStore(STORES.DESIGNS, { keyPath: 'id', autoIncrement: true });
                designsStore.createIndex('category', 'category', { unique: false });
            }
            
            console.log('تم إنشاء هياكل قاعدة البيانات');
        };
    });
}

// حفظ طلب تصميم
function saveDesignRequest(request) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.DESIGN_REQUESTS], 'readwrite');
        const store = transaction.objectStore(STORES.DESIGN_REQUESTS);
        const requestDB = store.add(request);
        
        requestDB.onsuccess = function() {
            console.log('تم حفظ طلب التصميم:', request);
            resolve(requestDB.result);
        };
        
        requestDB.onerror = function(event) {
            console.error('فشل حفظ طلب التصميم:', event.target.error);
            reject(event.target.error);
        };
    });
}

// حفظ طلب توظيف
function saveHiringRequest(request) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.HIRING_REQUESTS], 'readwrite');
        const store = transaction.objectStore(STORES.HIRING_REQUESTS);
        const requestDB = store.add(request);
        
        requestDB.onsuccess = function() {
            console.log('تم حفظ طلب التوظيف:', request);
            resolve(requestDB.result);
        };
        
        requestDB.onerror = function(event) {
            console.error('فشل حفظ طلب التوظيف:', event.target.error);
            reject(event.target.error);
        };
    });
}

// جلب جميع طلبات التصميم
function getAllDesignRequests() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.DESIGN_REQUESTS], 'readonly');
        const store = transaction.objectStore(STORES.DESIGN_REQUESTS);
        const request = store.getAll();
        
        request.onsuccess = function() {
            resolve(request.result);
        };
        
        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// جلب جميع طلبات التوظيف
function getAllHiringRequests() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.HIRING_REQUESTS], 'readonly');
        const store = transaction.objectStore(STORES.HIRING_REQUESTS);
        const request = store.getAll();
        
        request.onsuccess = function() {
            resolve(request.result);
        };
        
        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// حذف جميع طلبات التصميم
function clearDesignRequests() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.DESIGN_REQUESTS], 'readwrite');
        const store = transaction.objectStore(STORES.DESIGN_REQUESTS);
        const request = store.clear();
        
        request.onsuccess = function() {
            console.log('تم حذف جميع طلبات التصميم');
            showNotification('إدارة التخزين', 'تم حذف جميع طلبات التصميم');
            loadStorageStats();
            resolve();
        };
        
        request.onerror = function(event) {
            console.error('فشل حذف طلبات التصميم:', event.target.error);
            reject(event.target.error);
        };
    });
}

// حذف جميع طلبات التوظيف
function clearHiringRequests() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORES.HIRING_REQUESTS], 'readwrite');
        const store = transaction.objectStore(STORES.HIRING_REQUESTS);
        const request = store.clear();
        
        request.onsuccess = function() {
            console.log('تم حذف جميع طلبات التوظيف');
            showNotification('إدارة التخزين', 'تم حذف جميع طلبات التوظيف');
            loadStorageStats();
            resolve();
        };
        
        request.onerror = function(event) {
            console.error('فشل حذف طلبات التوظيف:', event.target.error);
            reject(event.target.error);
        };
    });
}

// حساب حجم قاعدة البيانات
function calculateDatabaseSize() {
    return new Promise((resolve, reject) => {
        let totalSize = 0;
        
        const transaction = db.transaction([STORES.DESIGN_REQUESTS, STORES.HIRING_REQUESTS], 'readonly');
        
        // حساب حجم طلبات التصميم
        const designStore = transaction.objectStore(STORES.DESIGN_REQUESTS);
        const designRequest = designStore.getAll();
        
        designRequest.onsuccess = function() {
            designRequest.result.forEach(request => {
                totalSize += JSON.stringify(request).length;
            });
            
            // حساب حجم طلبات التوظيف
            const hiringStore = transaction.objectStore(STORES.HIRING_REQUESTS);
            const hiringRequest = hiringStore.getAll();
            
            hiringRequest.onsuccess = function() {
                hiringRequest.result.forEach(request => {
                    totalSize += JSON.stringify(request).length;
                });
                
                // تحويل البايتات إلى كيلوبايت
                const sizeInKB = (totalSize / 1024).toFixed(2);
                resolve(sizeInKB);
            };
        };
        
        designRequest.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// تحميل إحصائيات التخزين
function loadStorageStats() {
    Promise.all([
        getAllDesignRequests(),
        getAllHiringRequests(),
        calculateDatabaseSize()
    ]).then(([designRequests, hiringRequests, totalSize]) => {
        document.getElementById('designRequestsCount').textContent = designRequests.length;
        document.getElementById('hiringRequestsCount').textContent = hiringRequests.length;
        document.getElementById('totalStorage').textContent = totalSize + ' KB';
    }).catch(error => {
        console.error('فشل تحميل إحصائيات التخزين:', error);
    });
}

// مسح جميع البيانات
function clearAllData() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([
            STORES.DESIGN_REQUESTS, 
            STORES.HIRING_REQUESTS,
            STORES.DESIGNS
        ], 'readwrite');
        
        let completed = 0;
        const totalStores = 3;
        
        function checkCompletion() {
            completed++;
            if (completed === totalStores) {
                console.log('تم حذف جميع البيانات');
                showNotification('مسح البيانات', 'تم حذف جميع البيانات بنجاح');
                loadStorageStats();
                resolve();
            }
        }
        
        // حذف طلبات التصميم
        const designStore = transaction.objectStore(STORES.DESIGN_REQUESTS);
        const designClear = designStore.clear();
        
        designClear.onsuccess = function() {
            checkCompletion();
        };
        
        designClear.onerror = function(event) {
            console.error('فشل حذف طلبات التصميم:', event.target.error);
            checkCompletion();
        };
        
        // حذف طلبات التوظيف
        const hiringStore = transaction.objectStore(STORES.HIRING_REQUESTS);
        const hiringClear = hiringStore.clear();
        
        hiringClear.onsuccess = function() {
            checkCompletion();
        };
        
        hiringClear.onerror = function(event) {
            console.error('فشل حذف طلبات التوظيف:', event.target.error);
            checkCompletion();
        };
        
        // حذف التصاميم
        const designsStore = transaction.objectStore(STORES.DESIGNS);
        const designsClear = designsStore.clear();
        
        designsClear.onsuccess = function() {
            checkCompletion();
        };
        
        designsClear.onerror = function(event) {
            console.error('فشل حذف التصاميم:', event.target.error);
            checkCompletion();
        };
    });
}
