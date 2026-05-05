const API_KEY = 'Your-trell-api-key';

let TOKEN = null;
let currentBoard = null;
let currentTheme = localStorage.getItem("trello_sidebar_theme") || "light";
const STORAGE_KEY = "selected_board";
const THEME_KEY = "trello_sidebar_theme";

const style = document.createElement("style");
style.textContent = `
    .tsb-sidebar,
    .tsb-sidebar * {
        box-sizing: border-box;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .tsb-sidebar {
        --tsb-bg: #f8fafc;
        --tsb-surface: rgba(255, 255, 255, 0.9);
        --tsb-surface-strong: #ffffff;
        --tsb-text: #172033;
        --tsb-muted: #657084;
        --tsb-border: rgba(117, 131, 152, 0.18);
        --tsb-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
        --tsb-card-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
        --tsb-accent: #2563eb;
        --tsb-accent-2: #14b8a6;
        --tsb-success: #22c55e;
        --tsb-soft: #eef4ff;
        position: fixed;
        top: 14px;
        right: 14px;
        width: min(380px, calc(100vw - 28px));
        height: calc(100vh - 28px);
        z-index: 999999;
        transform: translateX(calc(100% + 28px));
        transition: transform 280ms cubic-bezier(.2,.8,.2,1), box-shadow 200ms ease;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: var(--tsb-text);
        background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(145deg, var(--tsb-surface-strong), var(--tsb-bg));
        border: 1px solid var(--tsb-border);
        border-radius: 28px;
        box-shadow: var(--tsb-shadow);
        backdrop-filter: blur(18px);
    }

    .tsb-sidebar[data-open="true"] {
        transform: translateX(0);
    }

    .tsb-sidebar[data-theme="dark"] {
        --tsb-bg: #0e1421;
        --tsb-surface: rgba(22, 31, 48, 0.88);
        --tsb-surface-strong: #121a2a;
        --tsb-text: #ecf3ff;
        --tsb-muted: #9aa8bf;
        --tsb-border: rgba(148, 163, 184, 0.18);
        --tsb-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
        --tsb-card-shadow: 0 18px 42px rgba(0, 0, 0, 0.24);
        --tsb-accent: #60a5fa;
        --tsb-accent-2: #2dd4bf;
        --tsb-soft: rgba(96, 165, 250, 0.12);
        background:
            radial-gradient(circle at top left, rgba(45, 212, 191, 0.16), transparent 34%),
            linear-gradient(145deg, var(--tsb-surface-strong), var(--tsb-bg));
    }

    .tsb-content {
        flex: 1;
        overflow: auto;
        padding: 18px;
        scrollbar-width: thin;
    }

    .tsb-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 18px;
    }

    .tsb-title-wrap {
        min-width: 0;
        flex: 1;
    }

    .tsb-kicker {
        margin-bottom: 2px;
        color: var(--tsb-muted);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
    }

    .tsb-title {
        overflow: hidden;
        color: var(--tsb-text);
        font-size: 19px;
        font-weight: 800;
        line-height: 1.2;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .tsb-icon-btn,
    .tsb-theme-btn,
    .tsb-logout,
    .tsb-primary {
        appearance: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--tsb-border);
        border-radius: 14px;
        color: var(--tsb-text);
        background: var(--tsb-surface);
        cursor: pointer;
        line-height: 1;
        text-align: center;
        transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease;
    }

    .tsb-icon-btn,
    .tsb-theme-btn {
        width: 38px;
        height: 38px;
        flex: 0 0 auto;
    }

    .tsb-icon-btn:hover,
    .tsb-theme-btn:hover,
    .tsb-logout:hover,
    .tsb-primary:hover,
    .tsb-board:hover,
    .tsb-card:hover {
        transform: translateY(-1px);
        box-shadow: var(--tsb-card-shadow);
    }

    .tsb-logout {
        height: 38px;
        padding: 0 12px;
        gap: 7px;
        color: var(--tsb-muted);
        font-size: 12px;
        font-weight: 800;
    }

    .tsb-primary {
        width: 100%;
        height: 46px;
        gap: 9px;
        border-color: transparent;
        border-radius: 16px;
        color: #fff;
        background: linear-gradient(135deg, #2563eb, #14b8a6);
        box-shadow: 0 16px 34px rgba(37, 99, 235, 0.24);
        font-size: 14px;
        font-weight: 800;
    }

    .tsb-connect {
        display: grid;
        min-height: 78vh;
        place-items: center;
    }

    .tsb-connect-panel {
        width: 100%;
        padding: 22px;
        border: 1px solid var(--tsb-border);
        border-radius: 24px;
        background: var(--tsb-surface);
        box-shadow: var(--tsb-card-shadow);
    }

    .tsb-connect-icon {
        display: grid;
        width: 58px;
        height: 58px;
        margin-bottom: 14px;
        place-items: center;
        border-radius: 18px;
        color: #fff;
        background: linear-gradient(135deg, #2563eb, #14b8a6);
        box-shadow: 0 18px 38px rgba(20, 184, 166, 0.24);
    }

    .tsb-connect-title {
        margin-bottom: 6px;
        color: var(--tsb-text);
        font-size: 20px;
        font-weight: 850;
    }

    .tsb-connect-copy {
        margin-bottom: 18px;
        color: var(--tsb-muted);
        font-size: 13px;
        line-height: 1.5;
    }

    .tsb-board-grid {
        display: grid;
        gap: 10px;
    }

    .tsb-board {
        appearance: none;
        position: relative;
        display: grid;
        grid-template-columns: 46px minmax(0, 1fr) 26px;
        gap: 12px;
        align-items: center;
        min-height: 74px;
        padding: 13px;
        overflow: hidden;
        border: 1px solid var(--tsb-border);
        border-radius: 20px;
        background: var(--tsb-surface);
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
        cursor: pointer;
        text-align: left;
        transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
    }

    .tsb-board::before {
        content: "";
        position: absolute;
        inset: 0 auto 0 0;
        width: 5px;
        background: var(--board-color);
    }

    .tsb-board[data-selected="true"] {
        border-color: color-mix(in srgb, var(--board-color), transparent 42%);
        background:
            linear-gradient(90deg, color-mix(in srgb, var(--board-color), transparent 88%), transparent),
            var(--tsb-surface);
    }

    .tsb-board-icon {
        display: grid;
        width: 46px;
        height: 46px;
        place-items: center;
        border-radius: 16px;
        color: #fff;
        background: var(--board-color);
        box-shadow: 0 12px 28px color-mix(in srgb, var(--board-color), transparent 62%);
    }

    .tsb-board-name {
        overflow: hidden;
        color: var(--tsb-text);
        font-size: 14px;
        font-weight: 850;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .tsb-board-meta {
        margin-top: 4px;
        color: var(--tsb-muted);
        font-size: 12px;
        font-weight: 650;
    }

    .tsb-section {
        margin-bottom: 18px;
    }

    .tsb-list-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 2px 8px;
    }

    .tsb-list-title {
        color: var(--tsb-muted);
        font-size: 12px;
        font-weight: 850;
        letter-spacing: .06em;
        text-transform: uppercase;
    }

    .tsb-count {
        min-width: 24px;
        padding: 3px 8px;
        border-radius: 999px;
        color: var(--tsb-muted);
        background: var(--tsb-soft);
        font-size: 11px;
        font-weight: 850;
        text-align: center;
    }

    .tsb-card-list {
        display: grid;
        gap: 8px;
    }

    .tsb-card {
        appearance: none;
        position: relative;
        display: flex;
        align-items: center;
        gap: 11px;
        width: 100%;
        min-height: 54px;
        padding: 12px;
        border: 1px solid var(--tsb-border);
        border-radius: 18px;
        color: var(--tsb-text);
        background: var(--tsb-surface);
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
        cursor: pointer;
        text-align: left;
        transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease, background 160ms ease;
    }

    .tsb-card[data-done="true"] {
        opacity: .72;
        background:
            linear-gradient(90deg, rgba(34, 197, 94, 0.12), transparent),
            var(--tsb-surface);
    }

    .tsb-card-text {
        min-width: 0;
        flex: 1;
        overflow-wrap: anywhere;
        color: var(--tsb-text);
        font-size: 13px;
        font-weight: 700;
        line-height: 1.35;
        transition: color 160ms ease;
    }

    .tsb-card[data-done="true"] .tsb-card-text {
        color: var(--tsb-muted);
        text-decoration: line-through;
    }

    .tsb-check {
        position: relative;
        display: grid;
        width: 22px;
        height: 22px;
        flex: 0 0 auto;
        place-items: center;
        border: 2px solid color-mix(in srgb, var(--tsb-muted), transparent 42%);
        border-radius: 8px;
        color: #fff;
        background: transparent;
        transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
    }

    .tsb-check svg {
        width: 14px;
        height: 14px;
        opacity: 0;
        stroke-dasharray: 18;
        stroke-dashoffset: 18;
    }

    .tsb-card[data-done="true"] .tsb-check {
        border-color: var(--tsb-success);
        background: var(--tsb-success);
    }

    .tsb-card[data-done="true"] .tsb-check svg {
        animation: tsb-check-draw 420ms cubic-bezier(.2,.8,.2,1) forwards;
    }

    .tsb-card[data-pop="true"] .tsb-check {
        animation: tsb-pop 420ms cubic-bezier(.2,.8,.2,1);
    }

    .tsb-empty,
    .tsb-loading {
        padding: 16px;
        border: 1px dashed var(--tsb-border);
        border-radius: 18px;
        color: var(--tsb-muted);
        background: color-mix(in srgb, var(--tsb-surface), transparent 18%);
        font-size: 13px;
        line-height: 1.45;
    }

    .tsb-fab {
        appearance: none;
        position: fixed;
        right: 22px;
        bottom: 22px;
        display: grid;
        width: 58px;
        height: 58px;
        z-index: 999999;
        place-items: center;
        border: 0;
        border-radius: 50%;
        color: #fff;
        background: linear-gradient(135deg, #2563eb, #14b8a6);
        box-shadow: 0 18px 40px rgba(37, 99, 235, 0.34);
        cursor: pointer;
        transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .tsb-fab:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 22px 50px rgba(20, 184, 166, 0.34);
    }

    .tsb-fab svg,
    .tsb-icon-btn svg,
    .tsb-theme-btn svg,
    .tsb-logout svg,
    .tsb-primary svg {
        width: 18px;
        height: 18px;
        pointer-events: none;
    }

    @keyframes tsb-check-draw {
        0% {
            opacity: 0;
            stroke-dashoffset: 18;
        }
        100% {
            opacity: 1;
            stroke-dashoffset: 0;
        }
    }

    @keyframes tsb-pop {
        0% { transform: scale(.82); }
        52% { transform: scale(1.18); }
        100% { transform: scale(1); }
    }

    @media (max-width: 460px) {
        .tsb-sidebar {
            top: 8px;
            right: 8px;
            width: calc(100vw - 16px);
            height: calc(100vh - 16px);
            border-radius: 22px;
        }
    }
`;
document.documentElement.appendChild(style);

// =====================
// ICONS
// =====================
const icons = {
    panel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"></rect><path d="M9 4v16"></path><path d="M13 9h4"></path><path d="M13 13h4"></path></svg>',
    board: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"></rect><path d="M8 8h3"></path><path d="M8 12h8"></path><path d="M8 16h5"></path></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path><path d="M21 19V5"></path></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M6.34 17.66l-1.41 1.41"></path><path d="M19.07 4.93l-1.41 1.41"></path></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.7 15.3A8.5 8.5 0 0 1 8.7 3.3a7 7 0 1 0 12 12Z"></path></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.2 4L19 7"></path></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2Z"></path><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"></path></svg>'
};

// =====================
// ROOT UI
// =====================
const sidebar = document.createElement('div');
sidebar.className = "tsb-sidebar";
sidebar.dataset.theme = currentTheme;
sidebar.dataset.open = "false";

const content = document.createElement('div');
content.className = "tsb-content";

sidebar.appendChild(content);
document.body.appendChild(sidebar);

const fab = document.createElement('button');
fab.className = "tsb-fab";
fab.type = "button";
fab.title = "Open Trello sidebar";
fab.innerHTML = icons.panel;

let isOpen = false;

fab.onclick = () => {
    isOpen = !isOpen;
    sidebar.dataset.open = String(isOpen);
    fab.title = isOpen ? "Close Trello sidebar" : "Open Trello sidebar";
};

document.body.appendChild(fab);

// =====================
// HELPERS
// =====================
function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem(THEME_KEY, theme);
    sidebar.dataset.theme = theme;
}

function createThemeButton() {
    const button = document.createElement("button");
    button.className = "tsb-theme-btn";
    button.type = "button";
    button.title = currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    button.innerHTML = currentTheme === "dark" ? icons.sun : icons.moon;
    button.onclick = () => {
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        button.title = nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";
        button.innerHTML = nextTheme === "dark" ? icons.sun : icons.moon;
    };
    return button;
}

function createHeader(kicker, titleText, options = {}) {
    const header = document.createElement("div");
    header.className = "tsb-header";

    if (options.back) {
        const back = document.createElement("button");
        back.className = "tsb-icon-btn";
        back.type = "button";
        back.title = "Back to boards";
        back.innerHTML = icons.arrowLeft;
        back.onclick = options.back;
        header.appendChild(back);
    }

    const titleWrap = document.createElement("div");
    titleWrap.className = "tsb-title-wrap";

    const kickerEl = document.createElement("div");
    kickerEl.className = "tsb-kicker";
    kickerEl.innerText = kicker;

    const title = document.createElement("div");
    title.className = "tsb-title";
    title.innerText = titleText;

    titleWrap.appendChild(kickerEl);
    titleWrap.appendChild(title);
    header.appendChild(titleWrap);
    header.appendChild(createThemeButton());

    if (options.logout !== false && TOKEN) {
        header.appendChild(createLogoutBtn());
    }

    return header;
}

function colorFromString(value = "") {
    const palette = ["#2563eb", "#14b8a6", "#8b5cf6", "#f97316", "#ef4444", "#06b6d4", "#84cc16", "#db2777"];
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
}

function getBoardColor(board) {
    const color = board?.prefs?.backgroundColor;
    return color && color !== "null" ? color : colorFromString(board?.id || board?.name);
}

function setCardDone(cardEl, checkbox, done, animate = false) {
    cardEl.dataset.done = String(done);
    checkbox.setAttribute("aria-checked", String(done));

    if (animate && done) {
        cardEl.dataset.pop = "true";
        window.setTimeout(() => {
            delete cardEl.dataset.pop;
        }, 450);
    }
}

function showLoading(message = "Loading your Trello workspace...") {
    content.innerHTML = "";
    const loading = document.createElement("div");
    loading.className = "tsb-loading";
    loading.innerText = message;
    content.appendChild(loading);
}

// =====================
// LOGOUT
// =====================
function logout() {
    chrome.storage.local.remove(["trello_token"], () => {
        TOKEN = null;
        currentBoard = null;
        localStorage.removeItem(STORAGE_KEY);
        showConnectUI();
    });
}

function createLogoutBtn() {
    const button = document.createElement("button");
    button.className = "tsb-logout";
    button.type = "button";
    button.title = "Logout";
    button.innerHTML = `${icons.logout}<span>Logout</span>`;
    button.onclick = logout;
    return button;
}

// =====================
// AUTH
// =====================
function connectTrello() {
    chrome.runtime.sendMessage(
        { type: "AUTH", apiKey: API_KEY },
        (response) => {
            if (response && response.success) {
                location.reload();
            } else {
                console.error("Auth failed");
            }
        }
    );
}

function showConnectUI() {
    content.innerHTML = "";
    content.appendChild(createHeader("Trello Sidebar", "Stay in flow", { logout: false }));

    const wrapper = document.createElement("div");
    wrapper.className = "tsb-connect";

    const panel = document.createElement("div");
    panel.className = "tsb-connect-panel";

    const icon = document.createElement("div");
    icon.className = "tsb-connect-icon";
    icon.innerHTML = icons.spark;

    const title = document.createElement("div");
    title.className = "tsb-connect-title";
    title.innerText = "Connect Trello";

    const copy = document.createElement("div");
    copy.className = "tsb-connect-copy";
    copy.innerText = "Bring your boards into a calm, polished sidebar built for quick scanning and satisfying task checkoffs.";

    const button = document.createElement("button");
    button.className = "tsb-primary";
    button.type = "button";
    button.innerHTML = `${icons.board}<span>Connect Trello</span>`;
    button.onclick = connectTrello;

    panel.appendChild(icon);
    panel.appendChild(title);
    panel.appendChild(copy);
    panel.appendChild(button);
    wrapper.appendChild(panel);
    content.appendChild(wrapper);
}

// =====================
// API
// =====================
async function getBoards() {
    const res = await fetch(`https://api.trello.com/1/members/me/boards?key=${API_KEY}&token=${TOKEN}`);
    return res.json();
}

async function getLists(boardId) {
    const res = await fetch(`https://api.trello.com/1/boards/${boardId}/lists?key=${API_KEY}&token=${TOKEN}`);
    return res.json();
}

async function getCards(boardId) {
    const res = await fetch(`https://api.trello.com/1/boards/${boardId}/cards?key=${API_KEY}&token=${TOKEN}`);
    return res.json();
}

async function getCardChecklists(cardId) {
    const res = await fetch(
        `https://api.trello.com/1/cards/${cardId}/checklists?key=${API_KEY}&token=${TOKEN}`
    );
    return res.json();
}

// =====================
// TOGGLE DONE
// =====================
async function toggleCardDone(card, cardEl, checkbox) {
    const previousState = cardEl.dataset.done === "true";
    const nextState = !previousState;
    setCardDone(cardEl, checkbox, nextState, true);

    try {
        const checklists = await getCardChecklists(card.id);

        let checklist;

        if (!checklists.length) {
            const created = await fetch(
                `https://api.trello.com/1/cards/${card.id}/checklists?name=Tasks&key=${API_KEY}&token=${TOKEN}`,
                { method: "POST" }
            );
            checklist = await created.json();
        } else {
            checklist = checklists[0];
        }

        let item;

        if (!checklist.checkItems?.length) {
            const createdItem = await fetch(
                `https://api.trello.com/1/checklists/${checklist.id}/checkItems?name=${encodeURIComponent(card.name)}&key=${API_KEY}&token=${TOKEN}`,
                { method: "POST" }
            );
            item = await createdItem.json();
        } else {
            item = checklist.checkItems[0];
        }

        await fetch(
            `https://api.trello.com/1/cards/${card.id}/checkItem/${item.id}?state=${nextState ? "complete" : "incomplete"}&key=${API_KEY}&token=${TOKEN}`,
            { method: "PUT" }
        );
    } catch (error) {
        console.error("Could not update Trello card state", error);
        setCardDone(cardEl, checkbox, previousState);
    }
}

// =====================
// BOARDS VIEW
// =====================
function renderBoards(boards) {
    currentBoard = null;
    content.innerHTML = "";

    content.appendChild(createHeader("Workspace", "Your boards"));

    const grid = document.createElement("div");
    grid.className = "tsb-board-grid";

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!boards.length) {
        const empty = document.createElement("div");
        empty.className = "tsb-empty";
        empty.innerText = "No boards found for this Trello account.";
        content.appendChild(empty);
        return;
    }

    boards.forEach(board => {
        const boardEl = document.createElement("button");
        boardEl.className = "tsb-board";
        boardEl.type = "button";
        boardEl.dataset.selected = String(board.id === saved);
        boardEl.style.setProperty("--board-color", getBoardColor(board));

        const icon = document.createElement("div");
        icon.className = "tsb-board-icon";
        icon.innerHTML = icons.board;

        const textWrap = document.createElement("div");

        const name = document.createElement("div");
        name.className = "tsb-board-name";
        name.innerText = board.name;

        const meta = document.createElement("div");
        meta.className = "tsb-board-meta";
        meta.innerText = board.closed ? "Closed board" : board.id === saved ? "Selected board" : "Open board";

        textWrap.appendChild(name);
        textWrap.appendChild(meta);

        const arrow = document.createElement("div");
        arrow.innerHTML = icons.arrowRight;

        boardEl.appendChild(icon);
        boardEl.appendChild(textWrap);
        boardEl.appendChild(arrow);

        boardEl.onclick = () => {
            localStorage.setItem(STORAGE_KEY, board.id);
            loadBoard(board);
        };

        grid.appendChild(boardEl);
    });

    content.appendChild(grid);
}

// =====================
// LOAD BOARD
// =====================
async function loadBoard(board) {
    currentBoard = board;
    showLoading("Loading board cards...");

    const [lists, cards] = await Promise.all([
        getLists(board.id),
        getCards(board.id)
    ]);

    renderBoard(lists, cards);
}

// =====================
// BOARD VIEW
// =====================
function renderBoard(lists, cards) {
    content.innerHTML = "";

    content.appendChild(createHeader("Board", currentBoard.name, {
        back: () => {
            localStorage.removeItem(STORAGE_KEY);
            loadBoards();
        }
    }));

    lists.forEach(list => {
        const listCards = cards.filter(c => c.idList === list.id);
        const section = document.createElement("section");
        section.className = "tsb-section";

        const listHeader = document.createElement("div");
        listHeader.className = "tsb-list-header";

        const listTitle = document.createElement("div");
        listTitle.className = "tsb-list-title";
        listTitle.innerText = list.name;

        const count = document.createElement("div");
        count.className = "tsb-count";
        count.innerText = String(listCards.length);

        listHeader.appendChild(listTitle);
        listHeader.appendChild(count);
        section.appendChild(listHeader);

        if (!listCards.length) {
            const empty = document.createElement("div");
            empty.className = "tsb-empty";
            empty.innerText = "No cards in this list.";
            section.appendChild(empty);
            content.appendChild(section);
            return;
        }

        const cardList = document.createElement("div");
        cardList.className = "tsb-card-list";

        listCards.forEach(async card => {
            const cardEl = document.createElement("button");
            cardEl.className = "tsb-card";
            cardEl.type = "button";
            cardEl.dataset.done = "false";

            const checkbox = document.createElement("span");
            checkbox.className = "tsb-check";
            checkbox.setAttribute("role", "checkbox");
            checkbox.setAttribute("aria-checked", "false");
            checkbox.innerHTML = icons.check;

            const text = document.createElement("span");
            text.className = "tsb-card-text";
            text.innerText = card.name;

            cardEl.appendChild(checkbox);
            cardEl.appendChild(text);

            cardEl.onclick = () => toggleCardDone(card, cardEl, checkbox);

            cardList.appendChild(cardEl);

            const checklists = await getCardChecklists(card.id);
            if (checklists.length && checklists[0].checkItems?.length) {
                const state = checklists[0].checkItems[0].state === "complete";
                setCardDone(cardEl, checkbox, state);
            }
        });

        section.appendChild(cardList);
        content.appendChild(section);
    });
}

// =====================
// INIT
// =====================
function init() {
    if (!TOKEN) showConnectUI();
    else loadBoards();
}

async function loadBoards() {
    showLoading("Loading boards...");
    const boards = await getBoards();
    renderBoards(boards);
}

// TOKEN LOAD
chrome.storage.local.get(["trello_token"], (res) => {
    TOKEN = res.trello_token;
    init();
});
