// ============================================
// تهيئة AOS (Animations)
// ============================================
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
});

// ============================================
// شريط التنقل (Navbar)
// ============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// ===== البحث الداخلي =====

// إخفاء النتائج عند النقر خارجها
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-bar')) {
        document.getElementById('searchResults').style.display = 'none';
    }
});

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});


// ============================================
// عدادات الأرقام (Counters)
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        let animated = false;
        
        const updateCounter = () => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                return;
            }
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    updateCounter();
                }
            });
        });
        
        observer.observe(counter);
    });
}

animateCounters();

// ============================================
// Before/After (سحب المؤشر)
// ============================================
const slider = document.getElementById('baSlider');
const beforeAfter = document.getElementById('beforeAfter');

if (slider && beforeAfter) {
    let isDragging = false;
    
    slider.addEventListener('mousedown', () => {
        isDragging = true;
    });
    
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = beforeAfter.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.min(Math.max(x / rect.width, 0), 1);
        const beforeImg = beforeAfter.querySelector('.ba-before');
        if (beforeImg) {
            beforeImg.style.clipPath = `inset(0 ${(1 - percent) * 100}% 0 0)`;
        }
        slider.style.left = (percent * 100) + '%';
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const rect = beforeAfter.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const percent = Math.min(Math.max(x / rect.width, 0), 1);
        const beforeImg = beforeAfter.querySelector('.ba-before');
        if (beforeImg) {
            beforeImg.style.clipPath = `inset(0 ${(1 - percent) * 100}% 0 0)`;
        }
        slider.style.left = (percent * 100) + '%';
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// ============================================
// Swiper (شهادات العملاء)
// ============================================
new Swiper('#testimonialsSlider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});

// ============================================
// الأسئلة الشائعة (FAQ)
// ============================================
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const toggle = item.querySelector('.faq-toggle');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
        });
        
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ============================================
// زر العودة للأعلى (Back to Top)
// ============================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// نموذج التواصل (Contact Form)
// ============================================
document.getElementById('contactForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('?action=contact', {
            method: 'POST',
            body: formData,
        });
        
        const result = await response.json();
        
        if (result.success) {
            this.reset();
            showNotification('تم إرسال طلبك بنجاح، سنتواصل معك قريباً', 'success');
        } else {
            showNotification(result.message || 'حدث خطأ، حاول مرة أخرى', 'error');
        }
    } catch (error) {
        showNotification('حدث خطأ في الاتصال، حاول مرة أخرى', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// ============================================
// نموذج الحاسبة (Calculator)
// ============================================
document.getElementById('calculatorForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('?action=quote', {
            method: 'POST',
            body: formData,
        });
        
        const result = await response.json();
        
        if (result.success) {
            this.reset();
            showNotification('تم استلام طلبك، سنرسل لك عرض السعر خلال ٢٤ ساعة', 'success');
        } else {
            showNotification(result.message || 'حدث خطأ، حاول مرة أخرى', 'error');
        }
    } catch (error) {
        showNotification('حدث خطأ في الاتصال، حاول مرة أخرى', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// ============================================
// إشعارات (Notification)
// ============================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// ============================================
// التمرير السلس للروابط الداخلية
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// التحكم في عرض جميع أنواع الزجاج
// ============================================

let isAllTypesVisible = false;

/**
 * دالة عرض/إخفاء جميع الأنواع
 */
function toggleAllTypes() {
    const fullGrid = document.getElementById('typesFullGrid');
    const viewAllBtn = document.getElementById('viewAllTypes');
    
    if (!fullGrid) return;
    
    isAllTypesVisible = !isAllTypesVisible;
    
    if (isAllTypesVisible) {
        // إظهار القسم الكامل
        fullGrid.style.display = 'block';
        fullGrid.style.animation = 'fadeSlideIn 0.6s ease';
        viewAllBtn.innerHTML = `
            <i class="fas fa-times"></i>
            إخفاء الأنواع
        `;
        viewAllBtn.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
        
        // تمرير إلى القسم بعد الظهور
        setTimeout(() => {
            fullGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    } else {
        // إخفاء القسم الكامل
        fullGrid.style.display = 'none';
        viewAllBtn.innerHTML = `
            <i class="fas fa-th-list"></i>
            عرض جميع الأنواع
            <span class="types-count">(6)</span>
        `;
        viewAllBtn.style.background = 'linear-gradient(135deg, var(--secondary), #0098B8)';
    }
}

/**
 * دالة عرض تفاصيل نوع معين
 * @param {string} typeId - معرف النوع (clear, frosted, railing, reflective, colored, security)
 */
function showTypeDetail(typeId) {
    // تعريف الأنواع مع المعرفات
    const typeMap = {
        'clear': 'type-clear',
        'frosted': 'type-frosted',
        'railing': 'type-railing',
        'reflective': 'type-reflective',
        'colored': 'type-colored',
        'security': 'type-security'
    };
    
    // إذا كان القسم الكامل مخفياً، أظهره
    if (!isAllTypesVisible) {
        toggleAllTypes();
    }
    
    // بعد ظهور القسم، انتقل إلى النوع المطلوب
    setTimeout(() => {
        const targetId = typeMap[typeId];
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        // إزالة أي تمييز سابق من جميع العناصر
        document.querySelectorAll('.type-full-item').forEach(item => {
            item.style.border = 'none';
            item.style.boxShadow = 'var(--shadow)';
            item.style.transform = 'scale(1)';
        });
        
        // تمرير سلس إلى العنصر المطلوب
        targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
        });
        
        // إضافة تأثير تمييز قوي
        targetElement.style.border = '4px solid var(--secondary)';
        targetElement.style.boxShadow = '0 20px 60px rgba(0, 180, 216, 0.4)';
        targetElement.style.transform = 'scale(1.02)';
        targetElement.style.transition = 'all 0.5s ease';
        
        // إزالة التمييز بعد 3 ثواني
        setTimeout(() => {
            targetElement.style.border = 'none';
            targetElement.style.boxShadow = 'var(--shadow)';
            targetElement.style.transform = 'scale(1)';
        }, 3000);
        
        console.log(`✅ تم التمرير إلى: ${targetId}`);
        
    }, 800);
}

/**
 * دالة إغلاق القسم الكامل
 */
function closeTypes() {
    const fullGrid = document.getElementById('typesFullGrid');
    const viewAllBtn = document.getElementById('viewAllTypes');
    
    if (!fullGrid) return;
    
    fullGrid.style.display = 'none';
    isAllTypesVisible = false;
    viewAllBtn.innerHTML = `
        <i class="fas fa-th-list"></i>
        عرض جميع الأنواع
        <span class="types-count">(6)</span>
    `;
    viewAllBtn.style.background = 'linear-gradient(135deg, var(--secondary), #0098B8)';
    
    // تمرير إلى بداية القسم
    const section = document.querySelector('.glass-types');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * تفعيل جميع الأزرار بعد تحميل الصفحة
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ تم تحميل قسم أنواع الزجاج');
    
    // ====== تأكد من وجود الأزرار ======
    const viewAllBtn = document.getElementById('viewAllTypes');
    if (viewAllBtn) {
        console.log('✅ زر عرض الجميع موجود');
    }
    
    // ====== تأكد من وجود أزرار التفاصيل ======
    const detailBtns = document.querySelectorAll('.type-detail-btn');
    console.log(`✅ تم العثور على ${detailBtns.length} زر تفاصيل`);
    
    // ====== إضافة مستمعين لأزرار التفاصيل (إضافة أمان) ======
    detailBtns.forEach(btn => {
        // التأكد من أن onclick يعمل
        const onclickAttr = btn.getAttribute('onclick');
        if (!onclickAttr) {
            console.warn('⚠️ زر بدون onclick:', btn);
        }
    });
});

console.log('✅ جميع أزرار أنواع الزجاج جاهزة للعمل!');

// ============================================
// تفعيل الروابط في شريط التنقل حسب الموقع
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});