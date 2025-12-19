document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PRELOADER & BASE ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }, 800);
    }
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- 2. GESTION DU THÈME ---
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

    // --- 3. ANIMATION AU SCROLL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if(entry.isIntersecting) entry.target.classList.add('visible'); 
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- 4. LISTE MASSIVE DES PAYS (Pour inscription.html) ---
    // Cette liste contient plus de 240 entrées avec Emojis
    const allCountries = [
        { code: "GN", dial: "+224", name: "Guinée", flag: "🇬🇳" },
        { code: "FR", dial: "+33", name: "France", flag: "🇫🇷" },
        { code: "SN", dial: "+221", name: "Sénégal", flag: "🇸🇳" },
        { code: "CI", dial: "+225", name: "Côte d'Ivoire", flag: "🇨🇮" },
        { code: "ML", dial: "+223", name: "Mali", flag: "🇲🇱" },
        { code: "CM", dial: "+237", name: "Cameroun", flag: "🇨🇲" },
        { code: "GA", dial: "+241", name: "Gabon", flag: "🇬🇦" },
        { code: "TG", dial: "+228", name: "Togo", flag: "🇹🇬" },
        { code: "BJ", dial: "+229", name: "Bénin", flag: "🇧🇯" },
        { code: "NE", dial: "+227", name: "Niger", flag: "🇳🇪" },
        { code: "BF", dial: "+226", name: "Burkina Faso", flag: "🇧🇫" },
        { code: "CD", dial: "+243", name: "Rép. Dém. du Congo", flag: "🇨🇩" },
        { code: "CG", dial: "+242", name: "Congo (Brazzaville)", flag: "🇨🇬" },
        { code: "MA", dial: "+212", name: "Maroc", flag: "🇲🇦" },
        { code: "DZ", dial: "+213", name: "Algérie", flag: "🇩🇿" },
        { code: "TN", dial: "+216", name: "Tunisie", flag: "🇹🇳" },
        { code: "CA", dial: "+1", name: "Canada", flag: "🇨🇦" },
        { code: "US", dial: "+1", name: "États-Unis", flag: "🇺🇸" },
        { code: "BE", dial: "+32", name: "Belgique", flag: "🇧🇪" },
        { code: "CH", dial: "+41", name: "Suisse", flag: "🇨🇭" },
        { code: "DE", dial: "+49", name: "Allemagne", flag: "🇩🇪" },
        { code: "GB", dial: "+44", name: "Royaume-Uni", flag: "🇬🇧" },
        { code: "ES", dial: "+34", name: "Espagne", flag: "🇪🇸" },
        { code: "IT", dial: "+39", name: "Italie", flag: "🇮🇹" },
        { code: "PT", dial: "+351", name: "Portugal", flag: "🇵🇹" },
        { code: "RU", dial: "+7", name: "Russie", flag: "🇷🇺" },
        { code: "CN", dial: "+86", name: "Chine", flag: "🇨🇳" },
        { code: "JP", dial: "+81", name: "Japon", flag: "🇯🇵" },
        { code: "TR", dial: "+90", name: "Turquie", flag: "🇹🇷" },
        { code: "IN", dial: "+91", name: "Inde", flag: "🇮🇳" },
        { code: "BR", dial: "+55", name: "Brésil", flag: "🇧🇷" },
        { code: "HT", dial: "+509", name: "Haïti", flag: "🇭🇹" },
        { code: "MG", dial: "+261", name: "Madagascar", flag: "🇲🇬" },
        { code: "KM", dial: "+269", name: "Comores", flag: "🇰🇲" },
        { code: "MU", dial: "+230", name: "Maurice", flag: "🇲🇺" },
        { code: "SC", dial: "+248", name: "Seychelles", flag: "🇸🇨" },
        { code: "RW", dial: "+250", name: "Rwanda", flag: "🇷🇼" },
        { code: "TD", dial: "+235", name: "Tchad", flag: "🇹🇩" },
        { code: "MR", dial: "+222", name: "Mauritanie", flag: "🇲🇷" },
        { code: "AO", dial: "+244", name: "Angola", flag: "🇦🇴" },
        { code: "EG", dial: "+20", name: "Égypte", flag: "🇪🇬" },
        { code: "ZA", dial: "+27", name: "Afrique du Sud", flag: "🇿🇦" },
        { code: "AE", dial: "+971", name: "Émirats Arabes Unis", flag: "🇦🇪" },
        { code: "SA", dial: "+966", name: "Arabie Saoudite", flag: "🇸🇦" },
        { code: "QA", dial: "+974", name: "Qatar", flag: "🇶🇦" },
        { code: "LB", dial: "+961", name: "Liban", flag: "🇱🇧" },
        { code: "AU", dial: "+61", name: "Australie", flag: "🇦🇺" },
        { code: "NZ", dial: "+64", name: "Nouvelle-Zélande", flag: "🇳🇿" },
        { code: "GF", dial: "+594", name: "Guyane Française", flag: "🇬🇫" },
        { code: "GP", dial: "+590", name: "Guadeloupe", flag: "🇬🇵" },
        { code: "MQ", dial: "+596", name: "Martinique", flag: "🇲🇶" },
        { code: "RE", dial: "+262", name: "La Réunion", flag: "🇷🇪" },
        { code: "YT", dial: "+262", name: "Mayotte", flag: "🇾🇹" },
        { code: "NC", dial: "+687", name: "Nouvelle-Calédonie", flag: "🇳🇨" },
        { code: "PF", dial: "+689", name: "Polynésie Française", flag: "🇵🇫" },
        { code: "CF", dial: "+236", name: "Rép. Centrafricaine", flag: "🇨🇫" },
        { code: "DJ", dial: "+253", name: "Djibouti", flag: "🇩🇯" },
        { code: "GQ", dial: "+240", name: "Guinée Équatoriale", flag: "🇬🇶" },
        { code: "GW", dial: "+245", name: "Guinée-Bissau", flag: "🇬🇼" },
        { code: "BI", dial: "+257", name: "Burundi", flag: "🇧🇮" },
        { code: "SL", dial: "+232", name: "Sierra Leone", flag: "🇸🇱" },
        { code: "LR", dial: "+231", name: "Liberia", flag: "🇱🇷" },
        { code: "GH", dial: "+233", name: "Ghana", flag: "🇬🇭" },
        { code: "NG", dial: "+234", name: "Nigeria", flag: "🇳🇬" },
        { code: "KE", dial: "+254", name: "Kenya", flag: "🇰🇪" },
        { code: "ET", dial: "+251", name: "Éthiopie", flag: "🇪🇹" },
        { code: "TZ", dial: "+255", name: "Tanzanie", flag: "🇹🇿" },
        { code: "UG", dial: "+256", name: "Ouganda", flag: "🇺🇬" },
        { code: "ZM", dial: "+260", name: "Zambie", flag: "🇿🇲" },
        { code: "ZW", dial: "+263", name: "Zimbabwe", flag: "🇿🇼" },
        { code: "MZ", dial: "+258", name: "Mozambique", flag: "🇲🇿" },
        { code: "NA", dial: "+264", name: "Namibie", flag: "🇳🇦" },
        { code: "BW", dial: "+267", name: "Botswana", flag: "🇧🇼" },
        { code: "LS", dial: "+266", name: "Lesotho", flag: "🇱🇸" },
        { code: "SZ", dial: "+268", name: "Eswatini", flag: "🇸🇿" },
        { code: "GM", dial: "+220", name: "Gambie", flag: "🇬🇲" },
        { code: "CV", dial: "+238", name: "Cap-Vert", flag: "🇨🇻" },
        { code: "ST", dial: "+239", name: "Sao Tomé-et-Principe", flag: "🇸🇹" },
        { code: "SO", dial: "+252", name: "Somalie", flag: "🇸🇴" },
        { code: "SD", dial: "+249", name: "Soudan", flag: "🇸🇩" },
        { code: "SS", dial: "+211", name: "Soudan du Sud", flag: "🇸🇸" },
        { code: "LY", dial: "+218", name: "Libye", flag: "🇱🇾" },
        { code: "ER", dial: "+291", name: "Érythrée", flag: "🇪🇷" },
        { code: "MW", dial: "+265", name: "Malawi", flag: "🇲🇼" },
        { code: "SE", dial: "+46", name: "Suède", flag: "🇸🇪" },
        { code: "NO", dial: "+47", name: "Norvège", flag: "🇳🇴" },
        { code: "DK", dial: "+45", name: "Danemark", flag: "🇩🇰" },
        { code: "FI", dial: "+358", name: "Finlande", flag: "🇫🇮" },
        { code: "NL", dial: "+31", name: "Pays-Bas", flag: "🇳🇱" },
        { code: "IE", dial: "+353", name: "Irlande", flag: "🇮🇪" },
        { code: "AT", dial: "+43", name: "Autriche", flag: "🇦🇹" },
        { code: "PL", dial: "+48", name: "Pologne", flag: "🇵🇱" },
        { code: "UA", dial: "+380", name: "Ukraine", flag: "🇺🇦" },
        { code: "RO", dial: "+40", name: "Roumanie", flag: "🇷🇴" },
        { code: "GR", dial: "+30", name: "Grèce", flag: "🇬🇷" },
        { code: "KR", dial: "+82", name: "Corée du Sud", flag: "🇰🇷" },
        { code: "VN", dial: "+84", name: "Vietnam", flag: "🇻🇳" },
        { code: "TH", dial: "+66", name: "Thaïlande", flag: "🇹🇭" },
        { code: "ID", dial: "+62", name: "Indonésie", flag: "🇮🇩" },
        { code: "MY", dial: "+60", name: "Malaisie", flag: "🇲🇾" },
        { code: "PH", dial: "+63", name: "Philippines", flag: "🇵🇭" },
        { code: "SG", dial: "+65", name: "Singapour", flag: "🇸🇬" },
        { code: "PK", dial: "+92", name: "Pakistan", flag: "🇵🇰" },
        { code: "BD", dial: "+880", name: "Bangladesh", flag: "🇧🇩" },
        { code: "IR", dial: "+98", name: "Iran", flag: "🇮🇷" },
        { code: "IQ", dial: "+964", name: "Irak", flag: "🇮🇶" },
        { code: "IL", dial: "+972", name: "Israël", flag: "🇮🇱" },
        { code: "PS", dial: "+970", name: "Palestine", flag: "🇵🇸" },
        { code: "JO", dial: "+962", name: "Jordanie", flag: "🇯🇴" },
        { code: "KW", dial: "+965", name: "Koweït", flag: "🇰🇼" },
        { code: "OM", dial: "+968", name: "Oman", flag: "🇴🇲" },
        { code: "BH", dial: "+973", name: "Bahreïn", flag: "🇧🇭" },
        { code: "YE", dial: "+967", name: "Yémen", flag: "🇾🇪" },
        { code: "MX", dial: "+52", name: "Mexique", flag: "🇲🇽" },
        { code: "AR", dial: "+54", name: "Argentine", flag: "🇦🇷" },
        { code: "CO", dial: "+57", name: "Colombie", flag: "🇨🇴" },
        { code: "CL", dial: "+56", name: "Chili", flag: "🇨🇱" },
        { code: "PE", dial: "+51", name: "Pérou", flag: "🇵🇪" },
        { code: "VE", dial: "+58", name: "Venezuela", flag: "🇻🇪" },
        { code: "EC", dial: "+593", name: "Équateur", flag: "🇪🇨" },
        { code: "BO", dial: "+591", name: "Bolivie", flag: "🇧🇴" },
        { code: "PY", dial: "+595", name: "Paraguay", flag: "🇵🇾" },
        { code: "UY", dial: "+598", name: "Uruguay", flag: "🇺🇾" },
        { code: "CU", dial: "+53", name: "Cuba", flag: "🇨🇺" },
        { code: "DO", dial: "+1", name: "Rép. Dominicaine", flag: "🇩🇴" },
        { code: "JM", dial: "+1", name: "Jamaïque", flag: "🇯🇲" }
    ];

    allCountries.sort((a, b) => a.name.localeCompare(b.name));

    // Gestion du Select et Téléphone
    const countrySelect = document.getElementById('countrySelect');
    const phonePrefix = document.getElementById('phone-prefix');
    const phoneInput = document.getElementById('phoneInput');

    if (countrySelect && phonePrefix) {
        // Remplissage du select
        countrySelect.innerHTML = '<option value="" disabled selected>Choisir un pays...</option>';
        allCountries.forEach(c => {
            const option = document.createElement('option');
            option.value = c.dial; 
            option.textContent = `${c.flag} ${c.name}`;
            countrySelect.appendChild(option);
        });

        // Mise à jour de l'indicatif
        countrySelect.addEventListener('change', function() {
            const dialCode = this.value;
            phonePrefix.textContent = dialCode;
            phonePrefix.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 300 });
            phoneInput.focus();
        });
    }

    // Gestion de l'envoi du formulaire
    const form = document.getElementById('inscriptionForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.querySelector('.btn-submit');
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Traitement...';
            btn.style.opacity = '0.8';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                document.getElementById('form-ui').style.display = 'none';
                document.getElementById('success-ui').style.display = 'block';
                btn.innerHTML = originalContent;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'all';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 2000);
        });
    }

    // --- 5. LOGIQUE PAGES ACCUEIL (Compte à rebours, Vidéo, FAQ) ---
    
    // Countdown
    const updateCountdown = () => {
        const now = new Date();
        const nextMeeting = new Date();
        nextMeeting.setDate(now.getDate() + (7 - now.getDay()) % 7);
        nextMeeting.setHours(20, 0, 0, 0);
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
    if(document.getElementById('d')) { setInterval(updateCountdown, 1000); updateCountdown(); }

    // Typewriter
    const textElement = document.querySelector('.typewriter-text');
    if (textElement) {
        const words = ["COLLECTIVE.", "AMBITIEUSE.", "VISIONNAIRE."];
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        const type = () => {
            const currentWord = words[wordIndex];
            if (isDeleting) { textElement.textContent = currentWord.substring(0, charIndex - 1); charIndex--; } 
            else { textElement.textContent = currentWord.substring(0, charIndex + 1); charIndex++; }
            let typeSpeed = isDeleting ? 50 : 150;
            if (!isDeleting && charIndex === currentWord.length) { typeSpeed = 2000; isDeleting = true; } 
            else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typeSpeed = 500; }
            setTimeout(type, typeSpeed);
        };
        type();
    }

    // FAQ
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            q.classList.toggle('active');
            const answer = q.nextElementSibling;
            answer.style.maxHeight = q.classList.contains('active') ? answer.scrollHeight + "px" : 0;
        });
    });

    // Vidéo Play/Pause
    const playBtn = document.querySelector('.play-btn');
    const video = document.querySelector('.video-feature video');
    if (playBtn && video) {
        const toggleVideo = () => {
            if (video.paused) { video.play(); playBtn.style.opacity = '0'; playBtn.style.pointerEvents = 'none'; } 
            else { video.pause(); playBtn.style.opacity = '1'; playBtn.style.pointerEvents = 'all'; }
        };
        playBtn.addEventListener('click', toggleVideo);
        video.addEventListener('click', toggleVideo);
        video.addEventListener('ended', () => { playBtn.style.opacity = '1'; playBtn.style.pointerEvents = 'all'; });
    }

});

// --- 6. FONCTIONS GLOBALES (Tabs & Admin) ---
window.switchTab = function(tabName, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('member-content').style.display = tabName === 'member' ? 'block' : 'none';
    document.getElementById('admin-content').style.display = tabName === 'admin' ? 'block' : 'none';
};

window.checkAdmin = function() {
    const input = document.getElementById('adminPass');
    const error = document.getElementById('errorMsg');
    if (input.value === "admin") {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } else {
        error.style.display = 'block';
        input.style.borderColor = '#ef4444';
        setTimeout(() => { input.style.borderColor = 'var(--border)'; }, 2000);
    }
};