/* =========================================
   CONFIG: INSCRIPTION FORM
========================================= */
const PASSWORD_ADMIN = "VED2025"; 
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw0oWTb44pWjXMhmjEYKqRmz4FAbBb668KfBcuOyXxxYrQtn_DMArFW0Bc_Dd5j6BzHwg/exec"; 
const LINK_SHEET = "https://docs.google.com/spreadsheets/d/16IGtpQPgmt3tVbMfkIt-4if2llRsE9EA0nd_ySvUxrQ/preview?rm=minimal";

/* =========================================
   GESTION DU THÈME (DARK/LIGHT)
========================================= */
const themeBtn = document.getElementById('theme-toggle');
const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const iconClass = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    // Mise à jour de toutes les icônes de thème trouvées
    const icons = document.querySelectorAll('#theme-toggle i, #mobile-theme-toggle i');
    icons.forEach(icon => icon.className = iconClass);
}

const toggleTheme = () => setTheme(htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

if(themeBtn) themeBtn.addEventListener('click', toggleTheme);
if(mobileThemeBtn) mobileThemeBtn.addEventListener('click', (e) => { e.preventDefault(); toggleTheme(); });

/* =========================================
   PAGE: ACCUEIL (INDEX) LOGIC
========================================= */
// 1. Preloader & Year
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if(preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
    }
    const yearSpan = document.getElementById('year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    // Inscription Tabs Initial Position
    const activeBtn = document.querySelector('.tab-btn.active');
    if(activeBtn) movePill(activeBtn);
});

// 2. Scroll Logic (Header & BackToTop)
const scrollTopBtn = document.getElementById('scrollTop');
const header = document.querySelector('header');

if (header) {
    window.addEventListener('scroll', () => {
        let currentScroll = window.scrollY;
        
        // Scroll Top Button
        if(scrollTopBtn) scrollTopBtn.classList.toggle('show', currentScroll > 500);
        
        // Header Blur Effect
        header.classList.toggle('scrolled', currentScroll > 50);

        // Mobile Nav Active State (Scroll Spy)
        const sections = document.querySelectorAll('section, div[id]');
        const navLi = document.querySelectorAll('.mobile-bottom-nav .nav-item');
        
        let currentSection = '';
        sections.forEach(section => {
            if (window.scrollY >= (section.offsetTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        navLi.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href') && li.getAttribute('href').includes(currentSection)) {
                li.classList.add('active');
            }
        });
    });
}

// 3. Animations Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 4. Video Player
const playBtn = document.querySelector('.play-btn');
const video = document.querySelector('.video-feature video');

if(playBtn && video) {
    const toggleVideo = () => {
        if(video.paused) { 
            video.play(); playBtn.style.opacity = '0'; playBtn.style.pointerEvents = 'none';
        } else { 
            video.pause(); playBtn.style.opacity = '1'; playBtn.style.pointerEvents = 'all';
        }
    };
    playBtn.addEventListener('click', toggleVideo);
    video.addEventListener('click', toggleVideo);
    video.addEventListener('ended', () => {
        playBtn.style.opacity = '1'; playBtn.style.pointerEvents = 'all'; video.load();
    });
}

/* =========================================
   PAGE: INSCRIPTION LOGIC
========================================= */
// 1. Gestion des Onglets (Tabs)
function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    movePill(btn);

    document.querySelectorAll('.content-box').forEach(box => box.classList.remove('active'));
    
    setTimeout(() => {
        if (tabId === 'member') {
            const memberContent = document.getElementById('member-content');
            if(memberContent) memberContent.classList.add('active');
        } else {
            const adminContent = document.getElementById('admin-content');
            if(adminContent) adminContent.classList.add('active');
        }
    }, 100);
}

function movePill(btn) {
    const pill = document.getElementById('tab-pill');
    if(pill) {
        pill.style.width = btn.offsetWidth + "px";
        pill.style.left = btn.offsetLeft + "px";
    }
}

// 2. Gestion du Formulaire (Envoi Google Sheets)
const form = document.forms['submit-to-google-sheet'];

if(form) {
    form.addEventListener('submit', e => {
        e.preventDefault();

        // Validation Téléphone
        const phoneInput = document.getElementById('phoneInput');
        const phoneError = document.getElementById('phoneError');
        const phoneValue = phoneInput.value.trim();

        if (!phoneValue.startsWith('+') || phoneValue.length < 8) {
            phoneError.style.display = 'block';
            phoneInput.style.borderColor = '#ef4444';
            // Petite animation shake
            phoneInput.animate([
                { transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, 
                { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }
            ], { duration: 300 });
            return;
        } else {
            phoneError.style.display = 'none';
            phoneInput.style.borderColor = 'var(--border)';
        }

        // Animation UI (Chargement)
        const btn = document.querySelector('.btn-submit');
        const spinner = btn.querySelector('.loading-spinner');
        const text = btn.querySelector('.btn-text');
        const formUi = document.getElementById('form-ui');
        const successUi = document.getElementById('success-ui');

        text.style.display = 'none';
        spinner.style.display = 'block';
        btn.style.opacity = '0.7';
        btn.style.pointerEvents = 'none';

        // Envoi
        fetch(SCRIPT_URL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                formUi.style.display = 'none';
                successUi.style.display = 'block';
                form.reset();
                // Reset UI
                text.style.display = 'block';
                spinner.style.display = 'none';
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'all';
            })
            .catch(error => {
                console.error('Error!', error.message);
                // On affiche succès quand même (parfois erreur CORS Google Script fausse)
                formUi.style.display = 'none';
                successUi.style.display = 'block';
                text.style.display = 'block';
                spinner.style.display = 'none';
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'all';
            });
    });
}

// 3. Admin Login
function checkAdmin() {
    const input = document.getElementById('adminPass');
    const error = document.getElementById('errorMsg');
    
    if (input.value === PASSWORD_ADMIN) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        const frame = document.getElementById('sheetFrame');
        if(frame) frame.src = LINK_SHEET;
    } else {
        error.style.display = 'block';
        input.style.borderColor = '#ef4444';
        setTimeout(() => { input.style.borderColor = 'var(--border)'; }, 2000);
    }
}

function handleEnter(e) {
    if(e.key === 'Enter') checkAdmin();
}