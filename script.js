document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PRELOADER & DATE ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }, 800);
    }
    
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- 2. GESTION THÈME (Mémorisation) ---
    const themeBtns = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    htmlElement.setAttribute('data-theme', savedTheme);
    updateIcons(savedTheme);

    function updateIcons(theme) {
        const iconClass = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        themeBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) icon.className = iconClass;
        });
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const current = htmlElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcons(newTheme);
        });
    });

    // --- 3. ANIMATIONS REVEAL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionnel : arrêter d'observer une fois visible
                // observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- 4. LECTEUR VIDÉO (PLAY/PAUSE) ---
    const playBtn = document.querySelector('.play-btn');
    const video = document.querySelector('.video-feature video');

    if (playBtn && video) {
        const toggleVideo = () => {
            if (video.paused) { 
                video.play(); 
                playBtn.style.opacity = '0'; 
                playBtn.style.pointerEvents = 'none'; 
            } else { 
                video.pause(); 
                playBtn.style.opacity = '1'; 
                playBtn.style.pointerEvents = 'all'; 
            }
        };
        playBtn.addEventListener('click', toggleVideo);
        video.addEventListener('click', toggleVideo);
        video.addEventListener('ended', () => {
            playBtn.style.opacity = '1';
            playBtn.style.pointerEvents = 'all';
        });
    }

    // --- 5. SCROLL ET MENU ACTIF ---
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section, div[id]');
        const navLi = document.querySelectorAll('.mobile-bottom-nav .nav-item');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').includes(current)) {
                li.classList.add('active');
            }
        });
    });
});

/* =========================================
   LOGIQUE SPECIFIQUE (PAGES INTERNES)
========================================= */

// Changement d'onglet (Inscription / Admin)
window.switchTab = function(tabName, btn) {
    if(btn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    const memberContent = document.getElementById('member-content');
    const adminContent = document.getElementById('admin-content');

    if (tabName === 'member') {
        if(memberContent) { memberContent.style.display = 'block'; setTimeout(() => memberContent.style.opacity = 1, 10); }
        if(adminContent) { adminContent.style.display = 'none'; adminContent.style.opacity = 0; }
    } else {
        if(memberContent) { memberContent.style.display = 'none'; memberContent.style.opacity = 0; }
        if(adminContent) { adminContent.style.display = 'block'; setTimeout(() => adminContent.style.opacity = 1, 10); }
    }
}

// Simulation Formulaire
const form = document.getElementById('inscriptionForm');
if(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.querySelector('#member-content .btn-submit');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Traitement...';
        btn.style.opacity = "0.8";
        
        setTimeout(() => {
            document.getElementById('form-ui').style.display = 'none';
            document.getElementById('success-ui').style.display = 'block';
            btn.innerHTML = originalText;
        }, 1500);
    });
}

// Vérification Admin (Mot de passe simple)
window.checkAdmin = function() {
    const input = document.getElementById('adminPass');
    const error = document.getElementById('errorMsg');
    
    // Mot de passe fictif : "admin"
    if (input.value === "admin") {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } else {
        error.style.display = 'block';
        input.style.borderColor = '#ef4444';
        setTimeout(() => { input.style.borderColor = 'var(--border)'; }, 2000);
    }
}