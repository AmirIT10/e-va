// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('#preloader');
    if (preloader) {
        preloader.classList.add('fadeOut');
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }
});

const container = document.getElementById('card-container');

if (container) {
    // گرفتن عرض کارت (با حاشیه)
    const card = container.querySelector('.col-lg-3') || container.querySelector('.col-10');
    
    if (card) {
        const cardStyle = getComputedStyle(card);
        const cardMargin = parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
        const cardWidth = card.offsetWidth + cardMargin;
        
        // تشخیص جهت زبان سایت
        const isRTL = document.documentElement.dir === 'rtl' || 
                      document.body.dir === 'rtl' || 
                      getComputedStyle(document.body).direction === 'rtl';

        let direction = isRTL ? 1 : -1;
        const delay = 3000;
        let autoScrollInterval = null;

        // تابع برای بررسی اندازه صفحه
        const checkScreenSize = () => {
            return window.innerWidth < 992; // lg breakpoint
        };

        // تابع برای شروع اسکرول
        const startScroll = () => {
            if (checkScreenSize() && !autoScrollInterval) {
                autoScrollInterval = setInterval(() => {
                    const currentScroll = container.scrollLeft;
                    const maxScroll = container.scrollWidth - container.clientWidth;
                    
                    if (isRTL) {
                        // در حالت RTL
                        if (currentScroll <= 0) {
                            direction = -1;
                        } else if (currentScroll >= maxScroll) {
                            direction = 1;
                        }
                    } else {
                        // در حالت LTR
                        if (currentScroll >= maxScroll) {
                            direction = 1;
                        } else if (currentScroll <= 0) {
                            direction = -1;
                        }
                    }

                    container.scrollBy({ 
                        left: direction * cardWidth, 
                        behavior: 'smooth' 
                    });
                }, delay);
            }
        };

        // تابع برای توقف اسکرول
        const stopScroll = () => {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        };

        // شروع اسکرول در صورت مناسب بودن سایز صفحه
        if (checkScreenSize()) {
            startScroll();
        }

        // توقف اسکرول با هاور موس
        container.addEventListener('mouseenter', stopScroll);

        // شروع مجدد اسکرول با خروج موس (فقط در صورت مناسب بودن سایز صفحه)
        container.addEventListener('mouseleave', () => {
            if (checkScreenSize()) {
                startScroll();
            }
        });

        // بررسی تغییر سایز صفحه
        window.addEventListener('resize', () => {
            if (checkScreenSize()) {
                startScroll();
            } else {
                stopScroll();
                // ریست کردن اسکرول به ابتدا
                container.scrollTo({ left: 0, behavior: 'smooth' });
            }
        });
    }
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Mobile Toggle
document.addEventListener('DOMContentLoaded', () => {
    // Check if navbar elements exist
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');
    
    if (navbarToggler && navbarCollapse) {
        try {
            // Initialize Bootstrap collapse
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            
            // Toggle navbar when toggler is clicked
            navbarToggler.addEventListener('click', () => {
                bsCollapse.toggle();
            });
            
            // Close navbar when links are clicked
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (navbarCollapse.classList.contains('show') && window.innerWidth < 992) {
                        bsCollapse.hide();
                    }
                });
            });
            
            // Close navbar when clicking outside
            document.addEventListener('click', (e) => {
                if (navbarCollapse.classList.contains('show') && 
                    !navbarCollapse.contains(e.target) && 
                    !navbarToggler.contains(e.target) &&
                    window.innerWidth < 992) {
                    bsCollapse.hide();
                }
            });
        } catch (error) {
            console.error('Error initializing navbar:', error);
        }
    }
});

// Initialize Swiper for testimonials
const testimonialsSwiper = new Swiper('.testimonials-slider', {
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    breakpoints: {
        576: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        },
        992: {
            slidesPerView: 3
        }
    }
});

// Counter Animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const counter = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target.toLocaleString('fa-IR');
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current).toLocaleString('fa-IR');
        }
    }, 16);
}

// Start counter animation when element is in viewport
const counterElements = document.querySelectorAll('.counter');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
});

counterElements.forEach(counter => {
    observer.observe(counter);
});

// Form Validation
const forms = document.querySelectorAll('.needs-validation');
forms.forEach(form => {
    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    });
});

// Back to Top Button
const backToTop = document.querySelector('#back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Image Lazy Loading
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Dark Mode Toggle
const darkModeToggle = document.querySelector('#dark-mode-toggle');
if (darkModeToggle) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

// Custom Persian Number Formatter
function toPersianNumbers(number) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return number.toString().replace(/[0-9]/g, w => persianNumbers[w]);
}

// Format all numbers in the document
document.querySelectorAll('.persian-number').forEach(element => {
    const number = element.textContent;
    element.textContent = toPersianNumbers(number);
}); 