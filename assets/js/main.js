// ============================================================ //
// الماسة للزجاج - ملف الجافا سكريبت الرئيسي                    //
// ============================================================ //

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================================ //
    // 1. تهيئة AOS (Animations)                                    //
    // ============================================================ //
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
        });
    }

    // ============================================================ //
    // 2. شريط التنقل (Navbar)                                      //
    // ============================================================ //
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // ============================================================ //
    // 3. عدادات الأرقام (Counters)                                 //
    // ============================================================ //
    function animateCounters() {
        var counters = document.querySelectorAll('.stat-number[data-count]');

        counters.forEach(function(counter) {
            var target = parseInt(counter.getAttribute('data-count'), 10);
            var current = 0;
            var animated = false;

            function updateCounter() {
                current += Math.ceil(target / 40);
                if (current >= target) {
                    counter.textContent = target;
                    return;
                }
                counter.textContent = current;
                requestAnimationFrame(updateCounter);
            }

            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
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

    // ============================================================ //
    // 4. Before/After (سحب المؤشر)                                 //
    // ============================================================ //
    var slider = document.getElementById('baSlider');
    var beforeAfter = document.getElementById('beforeAfter');

    if (slider && beforeAfter) {
        var isDragging = false;
        var beforeImg = beforeAfter.querySelector('.ba-before');

        function updateSlider(x) {
            var rect = beforeAfter.getBoundingClientRect();
            var percent = Math.min(Math.max((x - rect.left) / rect.width, 0), 1);
            if (beforeImg) {
                beforeImg.style.clipPath = 'inset(0 ' + ((1 - percent) * 100) + '% 0 0)';
            }
            slider.style.left = (percent * 100) + '%';
        }

        slider.addEventListener('mousedown', function(e) {
            isDragging = true;
            e.preventDefault();
        });

        slider.addEventListener('touchstart', function(e) {
            isDragging = true;
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                updateSlider(e.clientX);
            }
        });

        document.addEventListener('touchmove', function(e) {
            if (isDragging) {
                updateSlider(e.touches[0].clientX);
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        document.addEventListener('touchend', function() {
            isDragging = false;
        });
    }

    // ============================================================ //
    // 5. زر العودة للأعلى (Back to Top)                           //
    // ============================================================ //
    var backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', function() {
            backToTop.style.display = window.scrollY > 500 ? 'flex' : 'none';
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================================ //
    // 6. التمرير السلس للروابط الداخلية                           //
    // ============================================================ //
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') {
                return;
            }

            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                var offsetTop = targetElement.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================================ //
    // 7. تفعيل الروابط في شريط التنقل حسب الموقع                  //
    // ============================================================ //
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-menu a');

    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', function() {
            var current = '';
            sections.forEach(function(section) {
                var sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ============================================================ //
    // 8. التحكم في عرض جميع أنواع الزجاج                          //
    // ============================================================ //
    var isAllTypesVisible = false;

    window.toggleAllTypes = function() {
        var fullGrid = document.getElementById('typesFullGrid');
        var viewAllBtn = document.getElementById('viewAllTypes');

        if (!fullGrid || !viewAllBtn) {
            return;
        }

        isAllTypesVisible = !isAllTypesVisible;

        if (isAllTypesVisible) {
            fullGrid.style.display = 'block';
            fullGrid.style.animation = 'fadeSlideIn 0.6s ease';
            viewAllBtn.innerHTML = '<i class="fas fa-times"></i> إخفاء الأنواع';
            viewAllBtn.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';

            setTimeout(function() {
                fullGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        } else {
            fullGrid.style.display = 'none';
            viewAllBtn.innerHTML = '<i class="fas fa-th-list"></i> عرض جميع الأنواع <span class="types-count">+</span>';
            viewAllBtn.style.background = 'linear-gradient(135deg, var(--secondary), #0098B8)';
        }
    };

    window.closeTypes = function() {
        var fullGrid = document.getElementById('typesFullGrid');
        var viewAllBtn = document.getElementById('viewAllTypes');

        if (!fullGrid || !viewAllBtn) {
            return;
        }

        fullGrid.style.display = 'none';
        isAllTypesVisible = false;
        viewAllBtn.innerHTML = '<i class="fas fa-th-list"></i> عرض جميع الأنواع <span class="types-count">+</span>';
        viewAllBtn.style.background = 'linear-gradient(135deg, var(--secondary), #0098B8)';

        var section = document.querySelector('.glass-types');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    window.showTypeDetail = function(typeId) {
        var typeMap = {
            'clear': 'type-clear',
            'frosted': 'type-frosted',
            'railing': 'type-railing',
            'reflective': 'type-reflective',
            'colored': 'type-colored',
            'security': 'type-security'
        };

        if (!isAllTypesVisible) {
            toggleAllTypes();
        }

        setTimeout(function() {
            var targetId = typeMap[typeId];
            if (!targetId) {
                return;
            }

            var targetElement = document.getElementById(targetId);
            if (!targetElement) {
                return;
            }

            document.querySelectorAll('.type-full-item').forEach(function(item) {
                item.style.border = 'none';
                item.style.boxShadow = 'var(--shadow)';
                item.style.transform = 'scale(1)';
            });

            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            targetElement.style.border = '4px solid var(--secondary)';
            targetElement.style.boxShadow = '0 20px 60px rgba(0, 180, 216, 0.4)';
            targetElement.style.transform = 'scale(1.02)';
            targetElement.style.transition = 'all 0.5s ease';

            setTimeout(function() {
                targetElement.style.border = 'none';
                targetElement.style.boxShadow = 'var(--shadow)';
                targetElement.style.transform = 'scale(1)';
            }, 3000);

        }, 800);
    };

    console.log('✅ تم تحميل موقع الماسة للزجاج بنجاح');

});