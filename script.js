document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PRELOADER ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }, 800);
    }
    
    // Année dynamique
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

    // --- 5. TYPEWRITER EFFECT (Machine à écrire) ---
    const textElement = document.querySelector('.typewriter-text');
    if (textElement) {
        const words = ["COLLECTIVE.", "AMBITIEUSE.", "VISIONNAIRE."];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                textElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 150;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pause avant d'effacer
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- 6. COUNTDOWN (Prochain Dimanche 20h) ---
    const updateCountdown = () => {
        const now = new Date();
        const nextMeeting = new Date();
        
        // Trouver le prochain dimanche (0 = dimanche)
        nextMeeting.setDate(now.getDate() + (7 - now.getDay()) % 7);
        nextMeeting.setHours(20, 0, 0, 0);
        
        // Si c'est dimanche après 20h, passer à la semaine pro
        if(now > nextMeeting) nextMeeting.setDate(nextMeeting.getDate() + 7);

        const diff = nextMeeting - now;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);

        const dEl = document.getElementById('d');
        if(dEl) {
            dEl.innerText = d < 10 ? '0' + d : d;
            document.getElementById('h').innerText = h < 10 ? '0' + h : h;
            document.getElementById('m').innerText = m < 10 ? '0' + m : m;
            document.getElementById('s').innerText = s < 10 ? '0' + s : s;
        }
    };
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- 7. ANIMATION DES STATS ---
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;
    
    const animateStats = () => {
        if (hasAnimatedStats) return;
        const section = document.querySelector('.stats-section');
        if(!section) return;

        const triggerBottom = window.innerHeight / 5 * 4;
        const sectionTop = section.getBoundingClientRect().top;

        if(sectionTop < triggerBottom) {
            stats.forEach(stat => {
                const target = +stat.getAttribute('data-target');
                const increment = target / 50; 
                
                const updateCounter = () => {
                    const c = +stat.innerText;
                    if(c < target) {
                        stat.innerText = Math.ceil(c + increment);
                        setTimeout(updateCounter, 30);
                    } else {
                        stat.innerText = target + "+";
                    }
                };
                updateCounter();
            });
            hasAnimatedStats = true;
        }
    };
    window.addEventListener('scroll', animateStats);

    // --- 8. FAQ ACCORDION ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            q.classList.toggle('active');
            const answer = q.nextElementSibling;
            if (q.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });

    // --- 9. SCROLL ET MENU ACTIF ---
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

// Vérification Admin
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



/* =========================================
   LOGIQUE PAYS & TÉLÉPHONE (A AJOUTER)
========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // LISTE COMPLETE DES PAYS ET CODES
    const countries = [
        { name: "Guinée", code: "+224" },
        { name: "France", code: "+33" },
        { name: "Sénégal", code: "+221" },
        { name: "Côte d'Ivoire", code: "+225" },
        { name: "Mali", code: "+223" },
        { name: "Maroc", code: "+212" },
        { name: "Algérie", code: "+213" },
        { name: "Tunisie", code: "+216" },
        { name: "Canada", code: "+1" },
        { name: "États-Unis", code: "+1" },
        { name: "Belgique", code: "+32" },
        { name: "Suisse", code: "+41" },
        { name: "Allemagne", code: "+49" },
        { name: "Espagne", code: "+34" },
        { name: "Italie", code: "+39" },
        { name: "Royaume-Uni", code: "+44" },
        { name: "Chine", code: "+86" },
        { name: "Japon", code: "+81" },
        { name: "Russie", code: "+7" },
        { name: "Brésil", code: "+55" },
        { name: "Inde", code: "+91" },
        { name: "Turquie", code: "+90" },
        { name: "Gabon", code: "+241" },
        { name: "Cameroun", code: "+237" },
        { name: "Congo (RDC)", code: "+243" },
        { name: "Congo (Brazzaville)", code: "+242" },
        { name: "Togo", code: "+228" },
        { name: "Bénin", code: "+229" },
        { name: "Burkina Faso", code: "+226" },
        { name: "Niger", code: "+227" },
        { name: "Mauritanie", code: "+222" },
        { name: "Tchad", code: "+235" },
        { name: "Afrique du Sud", code: "+27" },
        { name: "Égypte", code: "+20" },
        { name: "Arabie Saoudite", code: "+966" },
        { name: "Émirats Arabes Unis", code: "+971" }
        // Tu peux ajouter d'autres pays ici si nécessaire
    ];

    // Trier les pays par ordre alphabétique
    countries.sort((a, b) => a.name.localeCompare(b.name));

    const countrySelect = document.getElementById('countrySelect');
    const phoneInput = document.getElementById('phoneInput');

    if (countrySelect && phoneInput) {
        // 1. Remplir le select
        countrySelect.innerHTML = '<option value="" disabled selected>Choisir un pays...</option>';
        countries.forEach(c => {
            const option = document.createElement('option');
            option.value = c.code;
            option.textContent = `${c.name} (${c.code})`;
            countrySelect.appendChild(option);
        });

        // 2. Quand on change de pays -> Mettre le code dans l'input téléphone
        countrySelect.addEventListener('change', function() {
            phoneInput.value = this.value + " "; // Ajoute le code + espace
            phoneInput.focus(); // Met le curseur dans la case
        });

        // 3. Empêcher l'utilisateur d'effacer le code pays
        phoneInput.addEventListener('input', function(e) {
            const currentCode = countrySelect.value;
            // Si l'utilisateur essaie d'effacer le code, on le remet
            if (currentCode && !this.value.startsWith(currentCode)) {
                // On laisse faire seulement si le champ est vide (reset)
                if(this.value.length < currentCode.length) {
                    // Optionnel : avertissement visuel
                }
            }
        });
    }

    // 4. VALIDATION AU CLICK DU BOUTON
    const form = document.getElementById('inscriptionForm');
    const errorMsg = document.getElementById('phone-error');

    if(form) {
        // Supprimer l'ancien event listener s'il existe (pour éviter les doublons)
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phoneVal = document.getElementById('phoneInput').value.trim();
            const countryCode = document.getElementById('countrySelect').value;
            const btn = document.querySelector('.btn-submit');

            // Vérification : Est-ce que le téléphone contient bien le code ?
            // Et est-ce qu'il y a des chiffres après le code ?
            if (!phoneVal.startsWith("+") || phoneVal === countryCode || phoneVal.length < (countryCode.length + 4)) {
                errorMsg.style.display = 'block';
                errorMsg.innerText = "Numéro invalide. Le code pays (" + countryCode + ") est requis.";
                document.getElementById('phoneInput').style.borderColor = '#ef4444';
                
                // Animation secousse
                document.getElementById('phoneInput').animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(10px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 300 });
                
                return; // On arrête tout, pas d'envoi
            }

            // Si tout est bon :
            errorMsg.style.display = 'none';
            document.getElementById('phoneInput').style.borderColor = 'var(--border)';

            // Simulation envoi
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Envoi...';
            btn.style.opacity = "0.8";
            
            setTimeout(() => {
                document.getElementById('form-ui').style.display = 'none';
                document.getElementById('success-ui').style.display = 'block';
                btn.innerHTML = originalText;
            }, 1500);
        });
    }
});