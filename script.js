let currentUser = JSON.parse(localStorage.getItem('zerdeli_user')) || null;
let registrationsList = JSON.parse(localStorage.getItem('zerdeli_registrations')) || [];

// Бастапқы іс-шаралар тізімі
let eventsList = JSON.parse(localStorage.getItem('zerdeli_events')) || [
    { id: 1, title: "Футболдан мектеп кубогы", date: "15 қазан, 15:00", desc: "Сыныптар арасындағы дәстүрлі тартысты футбол турнирі." },
    { id: 2, title: "IT Hackathon & Web Design", date: "20 қазан, 14:00", desc: "Өз жобаларыңды көрсетіп, веб-сайттар жасаудан жарысыңыз." },
    { id: 3, title: "Зияткерлік дебат турнирі", date: "25 қазан, 13:00", desc: "Өз көзқарасыңызды дәлелдеп, шешендік өнерден сыналатын сайыс." }
];

// Басты беттегі үздік оқушылар тізімі
let achievementsList = JSON.parse(localStorage.getItem('zerdeli_achievements')) || [
    { name: "Алихан", studentClass: "10А", desc: "Халықаралық олимпиада жүлдегері", avatar: "А" },
    { name: "Марғұлан", studentClass: "11Б", desc: "Республикалық спорт жарыстарының жеңімпазы", avatar: "М" },
    { name: "Айша", studentClass: "9В", desc: "Үздік ғылыми жоба авторы", avatar: "А" }
];

// -------------------------------- ДИСПЛЕЙ ЖӘНЕ АВТОРИЗАЦИЯ --------------------------------
if (currentUser) {
    applyUserSession();
}

function applyUserSession() {
    const profileHeader = document.getElementById('userProfileHeader');
    const authOverlay = document.getElementById('authOverlay');
    if (profileHeader) profileHeader.innerHTML = `${currentUser.avatar || '👨‍💻'} ${currentUser.name} (${currentUser.studentClass})`;
    if (authOverlay) authOverlay.style.display = 'none';

    // Профиль бетін толтыру
    const pAvatar = document.getElementById('profileAvatarDisplay');
    const pName = document.getElementById('profileNameDisplay');
    const pClass = document.getElementById('profileClassDisplay');
    const pEmail = document.getElementById('profileEmailDisplay');

    if (pAvatar) pAvatar.innerText = currentUser.avatar || '👨‍💻';
    if (pName) pName.innerText = currentUser.name;
    if (pClass) pClass.innerText = `Сыныбы: ${currentUser.studentClass}`;
    if (pEmail) pEmail.innerText = `Поштасы: ${currentUser.email}`;

    // Тек «Сапарбаев Медеу» болса ғана админ панельді көрсету
    const adminNavBtn = document.getElementById('adminNavBtn');
    if (adminNavBtn) {
        if (currentUser.name.trim().toLowerCase() === "сапарбаев медеу") {
            adminNavBtn.style.display = 'block';
        } else {
            adminNavBtn.style.display = 'none';
        }
    }
}

function handleAuth(event) {
    event.preventDefault();
    const name = document.getElementById('authName').value.trim();
    const studentClass = document.getElementById('authClass').value.trim();
    const email = document.getElementById('authEmail').value.trim();
    const avatarRadio = document.querySelector('input[name="avatar"]:checked');
    const avatar = avatarRadio ? avatarRadio.value : '👨‍💻';

    if (name && studentClass && email) {
        currentUser = { name, studentClass, email, avatar };
        localStorage.setItem('zerdeli_user', JSON.stringify(currentUser));
        applyUserSession();
        renderIdeas();
    }
}

function logoutUser() {
    localStorage.removeItem('zerdeli_user');
    currentUser = null;
    document.getElementById('authOverlay').style.display = 'flex';
    document.getElementById('adminNavBtn').style.display = 'none';
    document.getElementById('userProfileHeader').innerHTML = '';
}

// -------------------------------- НАВИГАЦИЯ --------------------------------
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active-page'));

        link.classList.add('active');
        const targetId = link.getAttribute('href').substring(1);
        const targetPage = document.getElementById(targetId);
        if (targetPage) targetPage.classList.add('active-page');

        if (targetId === 'admin') {
            renderAdminPanelData();
        }
    });
});

function goToRegisterTab(eventName) {
    navLinks.forEach(l => l.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active-page'));

    document.querySelector('a[href="#register"]').classList.add('active');
    document.getElementById('register').classList.add('active-page');

    document.getElementById('selectedEvent').value = eventName;
}

// -------------------------------- ІС-ШАРАЛАР ЖӘНЕ ТІРКЕЛУ --------------------------------
function renderEvents() {
    const container = document.getElementById('eventsContainer');
    const selectBox = document.getElementById('selectedEvent');
    if (!container || !selectBox) return;

    container.innerHTML = '';
    selectBox.innerHTML = '<option value="">Іс-шараны таңдаңыз...</option>';

    eventsList.forEach(event => {
        // Іс-шаралар карточкасы
        const card = document.createElement('div');
        card.className = 'event-card-modern';
        card.innerHTML = `
            <div>
                <h3>${event.title}</h3>
                <p class="event-date">Күні: ${event.date}</p>
                <p class="event-desc">${event.desc}</p>
            </div>
            <button class="event-go-btn" onclick="goToRegisterTab('${event.title}')">Қатысуға жазылу</button>
        `;
        container.appendChild(card);

        // Селект тізіміне қосу
        const opt = document.createElement('option');
        opt.value = event.title;
        opt.textContent = event.title;
        selectBox.appendChild(opt);
    });

    localStorage.setItem('zerdeli_events', JSON.stringify(eventsList));
}

function submitEventRegistration(event) {
    event.preventDefault();
    const eventName = document.getElementById('selectedEvent').value;
    const studentInfo = document.getElementById('regStudentInfo').value;
    const reason = document.getElementById('regReason').value;

    if (eventName && studentInfo && reason) {
        registrationsList.push({ eventName, studentInfo, reason, date: new Date().toLocaleDateString() });
        localStorage.setItem('zerdeli_registrations', JSON.stringify(registrationsList));

        const botToken = '8826954071:AAFHy5uqdmv1wO9tv57ACRQHTc7GoRPZjmc';
        const chatId = '7315159490';
        const message = `🔔 ЖАҢА ТІРКЕЛУ!\n\n📌 Шара: ${eventName}\n👤 Оқушы: ${studentInfo}\n💡 Себебі: ${reason}\n📧 Пошта: ${currentUser ? currentUser.email : 'Көрсетілмеген'}`;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message })
        }).catch(err => console.log('Telegram қатесі:', err));

        const successBox = document.getElementById('regSuccess');
        if (successBox) successBox.style.display = 'block';
        document.getElementById('eventRegForm').reset();

        setTimeout(() => {
            if (successBox) successBox.style.display = 'none';
        }, 4000);
    }
}

// -------------------------------- БАСТЫ БЕТ ҮЗДІКТЕРІ --------------------------------
function renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    achievementsList.forEach(item => {
        const div = document.createElement('div');
        div.className = 'achieve-card';
        div.innerHTML = `
            <div class="achieve-avatar">${item.avatar || item.name.charAt(0)}</div>
            <h3>${item.name}</h3>
            <p class="achieve-class">${item.studentClass}</p>
            <p class="achieve-desc">${item.desc}</p>
        `;
        grid.appendChild(div);
    });
    localStorage.setItem('zerdeli_achievements', JSON.stringify(achievementsList));
}

// -------------------------------- ЧАТ ЖӘНЕ ПІКІРЛЕР --------------------------------
let ideasList = JSON.parse(localStorage.getItem('zerdeli_ideas')) || [
    {
        author: "Алихан (10А)",
        avatar: "👨‍💻",
        text: "Мектеп асханасындағы үзіліс кезіндегі кезектерді азайту үшін қосымша касса қойсақ жақсы болар еді.",
        likes: 5,
        dislikes: 0,
        userVoted: null
    }
];

function renderIdeas() {
    const container = document.getElementById('ideasContainer');
    if (!container) return;
    container.innerHTML = '';

    ideasList.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'idea-item';
        div.innerHTML = `
            <div class="idea-header">
                <span>${item.avatar || '👨‍💻'} ${item.author}</span>
                <span>Жаңа</span>
            </div>
            <div class="idea-text">${item.text}</div>
            <div class="idea-actions">
                <button class="action-btn" onclick="voteIdea(${index}, 'like')">👍 Лайк (${item.likes})</button>
                <button class="action-btn" onclick="voteIdea(${index}, 'dislike')">👎 Дизлайк (${item.dislikes})</button>
            </div>
        `;
        container.appendChild(div);
    });

    localStorage.setItem('zerdeli_ideas', JSON.stringify(ideasList));
}

function submitIdea(event) {
    event.preventDefault();
    const ideaTextEl = document.getElementById('ideaText');
    const text = ideaTextEl ? ideaTextEl.value : '';

    if (text && currentUser) {
        ideasList.unshift({
            author: `${currentUser.name} (${currentUser.studentClass})`,
            avatar: currentUser.avatar || '👨‍💻',
            text: text,
            likes: 0,
            dislikes: 0,
            userVoted: null
        });
        if (ideaTextEl) ideaTextEl.value = '';
        renderIdeas();
    }
}

function voteIdea(index, type) {
    const item = ideasList[index];
    if (!item) return;
    
    if (item.userVoted === type) return;

    if (item.userVoted === 'like') item.likes--;
    if (item.userVoted === 'dislike') item.dislikes--;

    if (type === 'like') {
        item.likes++;
        item.userVoted = 'like';
    } else if (type === 'dislike') {
        item.dislikes++;
        item.userVoted = 'dislike';
    }

    renderIdeas();
}

// -------------------------------- АДМИН ПАНЕЛЬ ФУНКЦИЯЛАРЫ (ТЕК МЕДЕҮ ҮШІН) --------------------------------
function renderAdminPanelData() {
    // 1. Үздік оқушыларды өшіру тізімі
    const adminAchieve = document.getElementById('adminAchievementsList');
    if (adminAchieve) {
        adminAchieve.innerHTML = '';
        achievementsList.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'admin-item';
            div.innerHTML = `
                <div><strong>${item.name}</strong> (${item.studentClass}) — ${item.desc}</div>
                <button class="delete-btn" onclick="deleteAchievement(${index})">Өшіру</button>
            `;
            adminAchieve.appendChild(div);
        });
    }

    // 2. Іс-шараларды өшіру тізімі
    const adminEvents = document.getElementById('adminEventsList');
    if (adminEvents) {
        adminEvents.innerHTML = '';
        eventsList.forEach((ev, index) => {
            const div = document.createElement('div');
            div.className = 'admin-item';
            div.innerHTML = `
                <div><strong>${ev.title}</strong> (${ev.date})</div>
                <button class="delete-btn" onclick="deleteEvent(${index})">Өшіру</button>
            `;
            adminEvents.appendChild(div);
        });
    }

    // 3. Тіркелгендер тізімі
    const regContainer = document.getElementById('adminRegistrationsList');
    if (regContainer) {
        regContainer.innerHTML = '';
        if (registrationsList.length === 0) {
            regContainer.innerHTML = '<p style="color: #666;">Әзірге тіркелгендер жоқ.</p>';
        } else {
            registrationsList.forEach((reg, index) => {
                const div = document.createElement('div');
                div.className = 'admin-item';
                div.innerHTML = `
                    <div>
                        <strong>${reg.studentInfo}</strong> — <span style="color: #2e7d32;">${reg.eventName}</span><br>
                        <small style="color: #555;">Себебі: ${reg.reason}</small>
                    </div>
                    <button class="delete-btn" onclick="deleteRegistration(${index})">Өшіру</button>
                `;
                regContainer.appendChild(div);
            });
        }
    }

    // 4. Чат пікірлерін өшіру
    const adminIdeas = document.getElementById('adminIdeasContainer');
    if (adminIdeas) {
        adminIdeas.innerHTML = '';
        ideasList.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'admin-item';
            div.innerHTML = `
                <div>
                    <strong>${item.author}</strong><br>
                    <span style="color: #444;">${item.text}</span>
                </div>
                <button class="delete-btn" onclick="deleteIdea(${index})">Өшіру</button>
            `;
            adminIdeas.appendChild(div);
        });
    }
}

// Админ жаңа іс-шара қосуы
function addNewEvent(event) {
    event.preventDefault();
    const title = document.getElementById('newEventTitle').value.trim();
    const date = document.getElementById('newEventDate').value.trim();
    const desc = document.getElementById('newEventDesc').value.trim();

    if (title && date && desc) {
        eventsList.push({ id: Date.now(), title, date, desc });
        renderEvents();
        renderAdminPanelData();
        document.getElementById('newEventTitle').value = '';
        document.getElementById('newEventDate').value = '';
        document.getElementById('newEventDesc').value = '';
        alert('Іс-шара сәтті қосылды!');
    }
}

function deleteEvent(index) {
    eventsList.splice(index, 1);
    renderEvents();
    renderAdminPanelData();
}

// Админ үздік оқушы қосуы
function addNewAchievement(event) {
    event.preventDefault();
    const name = document.getElementById('newAchieveName').value.trim();
    const studentClass = document.getElementById('newAchieveClass').value.trim();
    const desc = document.getElementById('newAchieveDesc').value.trim();

    if (name && studentClass && desc) {
        achievementsList.push({ name, studentClass, desc, avatar: name.charAt(0) });
        renderAchievements();
        renderAdminPanelData();
        document.getElementById('newAchieveName').value = '';
        document.getElementById('newAchieveClass').value = '';
        document.getElementById('newAchieveDesc').value = '';
        alert('Үздік оқушы сәтті қосылды!');
    }
}

function deleteAchievement(index) {
    achievementsList.splice(index, 1);
    renderAchievements();
    renderAdminPanelData();
}

function deleteRegistration(index) {
    registrationsList.splice(index, 1);
    localStorage.setItem('zerdeli_registrations', JSON.stringify(registrationsList));
    renderAdminPanelData();
}

function deleteIdea(index) {
    ideasList.splice(index, 1);
    renderIdeas();
    renderAdminPanelData();
}

// Бастапқы инициализация
renderEvents();
renderAchievements();
renderIdeas();