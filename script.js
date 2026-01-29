// التطبيق الرئيسي لبيكسل آرت
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة التطبيق
    initApp();
    
    // تهيئة قاعدة البيانات
    initDB();
    
    // تهيئة منزلق الإعلانات
    initAdsSlider();
    
    // تهيئة التنقل بين الصفحات
    initNavigation();
    
    // تهيئة النماذج
    initForms();
    
    // تحميل البيانات
    loadDesigns();
    loadStorageStats();
});

// تهيئة التطبيق
function initApp() {
    console.log('تطبيق بيكسل آرت جاهز للعمل!');
    
    // التحقق من وضع التصميم الداكن
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkMode = localStorage.getItem('darkMode') === 'true';
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    });
    
    // التحكم في الإشعارات
    const notificationsToggle = document.getElementById('notificationsToggle');
    const notificationsEnabled = localStorage.getItem('notifications') !== 'false';
    
    notificationsToggle.checked = notificationsEnabled;
    
    notificationsToggle.addEventListener('change', function() {
        localStorage.setItem('notifications', this.checked);
        showNotification('إعدادات الإشعارات', `تم ${this.checked ? 'تفعيل' : 'تعطيل'} الإشعارات`);
    });
    
    // تغيير لون التطبيق
    const colorOptions = document.querySelectorAll('.color-option[data-color]');
    const savedColor = localStorage.getItem('appColor') || '#0a9396';
    
    colorOptions.forEach(option => {
        if (option.dataset.color === savedColor) {
            option.classList.add('selected');
        }
        
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            const color = this.dataset.color;
            localStorage.setItem('appColor', color);
            document.documentElement.style.setProperty('--primary-color', color);
            
            // تحديث التدرج اللوني
            const primaryDark = darkenColor(color, 20);
            document.documentElement.style.setProperty('--primary-dark', primaryDark);
            
            showNotification('لون التطبيق', 'تم تغيير لون التطبيق بنجاح');
        });
    });
    
    // إدارة التخزين
    document.getElementById('storageSettings').addEventListener('click', function() {
        showStorageDialog();
    });
    
    document.getElementById('clearDesignsBtn').addEventListener('click', function() {
        clearDesignRequests();
    });
    
    document.getElementById('clearHiringBtn').addEventListener('click', function() {
        clearHiringRequests();
    });
    
    document.getElementById('closeStorageBtn').addEventListener('click', function() {
        closeDialog('storageDialog');
    });
    
    // حول التطبيق
    document.getElementById('aboutApp').addEventListener('click', function() {
        showSuccessDialog('تطبيق بيكسل آرت', 'إصدار التطبيق: 1.0.0<br>تم التطوير بواسطة فريق بيكسل آرت');
    });
    
    // مسح البيانات
    document.getElementById('clearData').addEventListener('click', function() {
        if (confirm('هل أنت متأكد من رغبتك في حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
            clearAllData();
        }
    });
    
    // تسجيل الخروج
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('هل تريد تسجيل الخروج من التطبيق؟')) {
            localStorage.removeItem('userLoggedIn');
            showSuccessDialog('تسجيل الخروج', 'تم تسجيل الخروج بنجاح. سيتم إعادة تحميل التطبيق.');
            
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    });
}

// تهيئة منزلق الإعلانات
function initAdsSlider() {
    const sliderContainer = document.getElementById('sliderContainer');
    const sliderDots = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // صور الإعلانات (يمكن استبدالها بصور حقيقية)
    const ads = [
        {
            id: 1,
            title: "تصميم هوية بصرية متكاملة",
            desc: "أنشئ هوية مميزة لعلامتك التجارية",
            color: "#0a9396"
        },
        {
            id: 2,
            title: "تصاميم وسائل التواصل الاجتماعي",
            desc: "اجذب جمهورك بتصاميم احترافية",
            color: "#005f73"
        },
        {
            id: 3,
            title: "تصميم شعار إحترافي",
            desc: "شعار يعبر عن هوية علامتك التجارية",
            color: "#ee9b00"
        },
        {
            id: 4,
            title: "تصاميم مواد مطبوعة",
            desc: "بروشورات، كروت عمل، ومنشورات",
            color: "#9b2226"
        },
        {
            id: 5,
            title: "دورات تصميم جرافيكي",
            desc: "طور مهاراتك مع دوراتنا المتخصصة",
            color: "#94d2bd"
        },
        {
            id: 6,
            title: "تصاميم واجهات مواقع وتطبيقات",
            desc: "واجهات جذابة وسهلة الاستخدام",
            color: "#0a9396"
        },
        {
            id: 7,
            title: "تصميم أغلفة كتب ومجلات",
            desc: "أغلفة تجذب القراء وتعبر عن المحتوى",
            color: "#005f73"
        },
        {
            id: 8,
            title: "تصميم إنفوجرافيك",
            desc: "حول البيانات إلى رسومات مبسطة وجذابة",
            color: "#ee9b00"
        },
        {
            id: 9,
            title: "تصاميم إعلانية",
            desc: "إعلانات مبدعة تجذب العملاء",
            color: "#9b2226"
        },
        {
            id: 10,
            title: "باقات تصميم شهرية",
            desc: "احصل على تصاميم مستمرة بأسعار مميزة",
            color: "#94d2bd"
        }
    ];
    
    let currentSlide = 0;
    const totalSlides = ads.length;
    
    // إنشاء شرائح الإعلانات
    ads.forEach((ad, index) => {
        // إنشاء الشريحة
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.style.backgroundColor = ad.color;
        
        const content = document.createElement('div');
        content.className = 'slide-content';
        
        const title = document.createElement('h3');
        title.className = 'slide-title';
        title.textContent = ad.title;
        
        const desc = document.createElement('p');
        desc.className = 'slide-desc';
        desc.textContent = ad.desc;
        
        content.appendChild(title);
        content.appendChild(desc);
        slide.appendChild(content);
        sliderContainer.appendChild(slide);
        
        // إنشاء نقاط التنقل
        const dot = document.createElement('div');
        dot.className = 'slider-dot';
        if (index === 0) dot.classList.add('active');
        dot.dataset.index = index;
        
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        
        sliderDots.appendChild(dot);
    });
    
    // وظائف التنقل
    function goToSlide(index) {
        currentSlide = index;
        sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // تحديث النقاط النشطة
        document.querySelectorAll('.slider-dot').forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    }
    
    // إضافة أحداث الأزرار
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // التشغيل التلقائي للمنزلق
    let slideInterval = setInterval(nextSlide, 5000);
    
    // إيقاف التشغيل التلقائي عند التمرير فوق المنزلق
    const slider = document.querySelector('.ads-slider');
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // دعم اللمس للمنزلق
    let startX = 0;
    let endX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        
        if (startX - endX > 50) {
            nextSlide();
        } else if (endX - startX > 50) {
            prevSlide();
        }
        
        slideInterval = setInterval(nextSlide, 5000);
    });
}

// تهيئة التنقل بين الصفحات
function initNavigation() {
    const bottomNavItems = document.querySelectorAll('.nav-item');
    const actionCards = document.querySelectorAll('.action-card');
    const backButtons = document.querySelectorAll('.back-btn');
    const pageOverlay = document.getElementById('pageOverlay');
    const pages = {
        home: document.getElementById('mainContent'),
        design: document.getElementById('designPage'),
        hiring: document.getElementById('hiringPage'),
        settings: document.getElementById('settingsPage')
    };
    
    // فتح صفحة
    function openPage(pageId) {
        // إخفاء جميع الصفحات
        Object.values(pages).forEach(page => {
            if (page) {
                page.classList.remove('active');
            }
        });
        
        // إخفاء المحتوى الرئيسي
        pages.home.style.display = 'none';
        
        // إظهار صفحة الهدف
        if (pages[pageId]) {
            pages[pageId].classList.add('active');
            pages[pageId].style.display = 'block';
        }
        
        // إظهار طبقة التغطية
        pageOverlay.style.display = 'block';
        
        // تحديث شريط التنقل السفلي
        bottomNavItems.forEach(item => {
            if (item.dataset.page === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // إغلاق جميع الصفحات والعودة للرئيسية
    function closeAllPages() {
        Object.values(pages).forEach(page => {
            if (page) {
                page.classList.remove('active');
                page.style.display = 'none';
            }
        });
        
        // إظهار المحتوى الرئيسي
        pages.home.style.display = 'block';
        
        // إخفاء طبقة التغطية
        pageOverlay.style.display = 'none';
        
        // تحديث شريط التنقل السفلي
        bottomNavItems.forEach(item => {
            if (item.dataset.page === 'home') {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // أحداث التنقل في الشريط السفلي
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.dataset.page;
            
            if (pageId === 'home') {
                closeAllPages();
            } else {
                openPage(pageId);
            }
        });
    });
    
    // أحداث الأزرار في بطاقات الإجراءات السريعة
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.dataset.action;
            
            if (action === 'design') {
                openPage('design');
            } else if (action === 'hiring') {
                openPage('hiring');
            } else if (action === 'portfolio') {
                showSuccessDialog('معرض الأعمال', 'سيتم فتح معرض الأعمال قريباً. هذه الميزة قيد التطوير.');
            } else if (action === 'courses') {
                showSuccessDialog('الدورات التدريبية', 'سيتم فتح قسم الدورات التدريبية قريباً. هذه الميزة قيد التطوير.');
            }
        });
    });
    
    // أحداث أزرار العودة
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllPages();
        });
    });
    
    // حدث طبقة التغطية
    pageOverlay.addEventListener('click', closeAllPages);
    
    // تهيئة القائمة الأولى
    closeAllPages();
}

// تهيئة النماذج
function initForms() {
    // نموذج طلب التصميم
    const designForm = document.getElementById('designForm');
    const designBudget = document.getElementById('designBudget');
    const budgetValue = document.getElementById('budgetValue');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const colorOptions = document.querySelectorAll('.color-picker .color-option');
    
    // تحديث قيمة الميزانية
    designBudget.addEventListener('input', function() {
        budgetValue.textContent = this.value;
    });
    
    // اختيار اللون
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // إدارة رفع الملفات
    let uploadedFiles = [];
    
    fileInput.addEventListener('change', function() {
        const files = Array.from(this.files);
        uploadedFiles = [...uploadedFiles, ...files];
        updateFileList();
    });
    
    function updateFileList() {
        fileList.innerHTML = '';
        
        uploadedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileName = document.createElement('span');
            fileName.textContent = file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name;
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.style.background = 'none';
            removeBtn.style.border = 'none';
            removeBtn.style.color = 'var(--danger-color)';
            removeBtn.style.cursor = 'pointer';
            
            removeBtn.addEventListener('click', function() {
                uploadedFiles.splice(index, 1);
                updateFileList();
            });
            
            fileItem.appendChild(fileName);
            fileItem.appendChild(removeBtn);
            fileList.appendChild(fileItem);
        });
    }
    
    // إرسال نموذج طلب التصميم
    designForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const designType = document.getElementById('designType').value;
        const designDescription = document.getElementById('designDescription').value;
        const designDeadline = document.getElementById('designDeadline').value;
        const designBudgetValue = designBudget.value;
        
        if (!designType || !designDescription || !designDeadline) {
            alert('الرجاء ملء جميع الحقول المطلوبة');
            return;
        }
        
        // الحصول على اللون المختار
        const selectedColorOption = document.querySelector('.color-picker .color-option.selected');
        const selectedColor = selectedColorOption ? selectedColorOption.dataset.color : '';
        
        const designRequest = {
            id: Date.now(),
            type: designType,
            description: designDescription,
            deadline: designDeadline,
            budget: designBudgetValue,
            color: selectedColor,
            files: uploadedFiles.length,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        // حفظ الطلب في قاعدة البيانات
        saveDesignRequest(designRequest);
        
        // إظهار رسالة النجاح
        showSuccessDialog('طلب تصميم', 'تم إرسال طلب التصميم بنجاح. سيتم التواصل معك خلال 24 ساعة.');
        
        // إعادة تعيين النموذج
        designForm.reset();
        uploadedFiles = [];
        updateFileList();
        budgetValue.textContent = '1000';
        
        // العودة للصفحة الرئيسية بعد 3 ثواني
        setTimeout(() => {
            closeAllPages();
        }, 3000);
    });
    
    // نموذج طلب التوظيف
    const hiringForm = document.getElementById('hiringForm');
    const resumeInput = document.getElementById('resumeInput');
    const resumeFile = document.getElementById('resumeFile');
    
    let uploadedResume = null;
    
    resumeInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            uploadedResume = this.files[0];
            updateResumeDisplay();
        }
    });
    
    function updateResumeDisplay() {
        resumeFile.innerHTML = '';
        
        if (uploadedResume) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileName = document.createElement('span');
            fileName.textContent = uploadedResume.name.length > 25 ? uploadedResume.name.substring(0, 25) + '...' : uploadedResume.name;
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.style.background = 'none';
            removeBtn.style.border = 'none';
            removeBtn.style.color = 'var(--danger-color)';
            removeBtn.style.cursor = 'pointer';
            
            removeBtn.addEventListener('click', function() {
                uploadedResume = null;
                resumeInput.value = '';
                updateResumeDisplay();
            });
            
            fileItem.appendChild(fileName);
            fileItem.appendChild(removeBtn);
            resumeFile.appendChild(fileItem);
        }
    }
    
    // إرسال نموذج طلب التوظيف
    hiringForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const applicantName = document.getElementById('applicantName').value;
        const applicantEmail = document.getElementById('applicantEmail').value;
        const applicantPhone = document.getElementById('applicantPhone').value;
        const applicantPosition = document.getElementById('applicantPosition').value;
        const applicantExperience = document.getElementById('applicantExperience').value;
        const applicantPortfolio = document.getElementById('applicantPortfolio').value;
        const applicantMessage = document.getElementById('applicantMessage').value;
        
        if (!applicantName || !applicantEmail || !applicantPhone || !applicantPosition || !applicantExperience || !applicantMessage) {
            alert('الرجاء ملء جميع الحقول المطلوبة');
            return;
        }
        
        if (!uploadedResume) {
            alert('الرجاء رفع السيرة الذاتية');
            return;
        }
        
        const hiringRequest = {
            id: Date.now(),
            name: applicantName,
            email: applicantEmail,
            phone: applicantPhone,
            position: applicantPosition,
            experience: applicantExperience,
            portfolio: applicantPortfolio,
            message: applicantMessage,
            resume: uploadedResume.name,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        // حفظ الطلب في قاعدة البيانات
        saveHiringRequest(hiringRequest);
        
        // إظهار رسالة النجاح
        showSuccessDialog('طلب توظيف', 'تم إرسال طلب التوظيف بنجاح. سيتم مراجعة طلبك والاتصال بك في حال الموافقة المبدئية.');
        
        // إعادة تعيين النموذج
        hiringForm.reset();
        uploadedResume = null;
        updateResumeDisplay();
        
        // العودة للصفحة الرئيسية بعد 3 ثواني
        setTimeout(() => {
            closeAllPages();
        }, 3000);
    });
}

// تحميل التصاميم المميزة
function loadDesigns() {
    const designsGrid = document.getElementById('designsGrid');
    
    // تصاميم وهمية (يمكن استبدالها ببيانات حقيقية من قاعدة البيانات)
    const designs = [
        {
            id: 1,
            title: "هوية بصرية لمطعم",
            category: "هوية بصرية",
            description: "تصميم هوية بصرية متكاملة لمطعم وجبات سريعة",
            color: "#0a9396"
        },
        {
            id: 2,
            title: "شعار شركة تقنية",
            category: "تصميم شعار",
            description: "شعار حديث يعبر عن الابتكار والتقنية",
            color: "#005f73"
        },
        {
            id: 3,
            title: "إعلان لوسائل التواصل",
            category: "تصاميم إعلانية",
            description: "تصميم إعلان جذاب لحملة ترويجية",
            color: "#ee9b00"
        },
        {
            id: 4,
            title: "غلاف كتاب",
            category: "تصميم أغلفة",
            description: "تصميم غلاف كتاب رواية حديثة",
            color: "#9b2226"
        },
        {
            id: 5,
            title: "إنفوجرافيك تعليمي",
            category: "إنفوجرافيك",
            description: "تحويل البيانات إلى رسوم بيانية مبسطة",
            color: "#94d2bd"
        },
        {
            id: 6,
            title: "واجهة تطبيق جوال",
            category: "تصميم واجهات",
            description: "تصميم واجهة مستخدم لتطبيق خدمة توصيل",
            color: "#0a9396"
        }
    ];
    
    designsGrid.innerHTML = '';
    
    designs.forEach(design => {
        const designCard = document.createElement('div');
        designCard.className = 'design-card';
        
        designCard.innerHTML = `
            <div class="design-image" style="background-color: ${design.color};"></div>
            <div class="design-info">
                <h3 class="design-title">${design.title}</h3>
                <div class="design-category">${design.category}</div>
                <p class="design-description">${design.description}</p>
            </div>
        `;
        
        designsGrid.appendChild(designCard);
    });
}

// إظهار حوار النجاح
function showSuccessDialog(title, message) {
    const dialogMessage = document.getElementById('dialogMessage');
    dialogMessage.innerHTML = message;
    
    const dialogTitle = document.querySelector('#successDialog .dialog-title');
    dialogTitle.textContent = title;
    
    openDialog('successDialog');
}

// إظهار حوار إدارة التخزين
function showStorageDialog() {
    loadStorageStats();
    openDialog('storageDialog');
}

// فتح الحوار
function openDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    const overlay = document.getElementById('dialogOverlay');
    
    dialog.style.display = 'block';
    overlay.style.display = 'block';
    
    // إغلاق الحوار عند النقر على زر الإغلاق
    const closeBtn = document.getElementById('dialogCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeDialog(dialogId);
        });
    }
}

// إغلاق الحوار
function closeDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    const overlay = document.getElementById('dialogOverlay');
    
    dialog.style.display = 'none';
    overlay.style.display = 'none';
}

// إظهار الإشعارات
function showNotification(title, message) {
    // يمكن تنفيذ إشعارات Toast هنا
    console.log(`إشعار: ${title} - ${message}`);
    
    // تنفيذ بسيط لإشعارات الـ Toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;
    
    // إضافة الأنماط بشكل ديناميكي
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.left = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = 'var(--primary-color)';
    toast.style.color = 'white';
    toast.style.padding = '15px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    toast.style.zIndex = '1500';
    toast.style.transform = 'translateY(-100px)';
    toast.style.transition = 'transform 0.3s ease';
    
    document.body.appendChild(toast);
    
    // إظهار الإشعار
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // إخفاء الإشعار بعد 3 ثواني
    setTimeout(() => {
        toast.style.transform = 'translateY(-100px)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// وظيفة مساعدة: تغميق اللون
function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return "#" + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

// دالة مساعدة لإغلاق جميع الصفحات
function closeAllPages() {
    const pageOverlay = document.getElementById('pageOverlay');
    const pages = document.querySelectorAll('.page-container');
    const mainContent = document.getElementById('mainContent');
    
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    mainContent.style.display = 'block';
    pageOverlay.style.display = 'none';
    
    // تحديث شريط التنقل السفلي
    const bottomNavItems = document.querySelectorAll('.nav-item');
    bottomNavItems.forEach(item => {
        if (item.dataset.page === 'home') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}
