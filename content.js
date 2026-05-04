const API_KEY = '';
const TOKEN = '';

let currentBoard = null;
let view = "boards";
const STORAGE_KEY = "selected_board";

// =====================
// ROOT UI
// =====================
const sidebar = document.createElement('div');
sidebar.style.position = 'fixed';
sidebar.style.top = '0';
sidebar.style.right = '0';
sidebar.style.width = '340px';
sidebar.style.height = '100vh';
sidebar.style.background = '#fff';
sidebar.style.boxShadow = '0 0 20px rgba(0,0,0,0.08)';
sidebar.style.zIndex = '999999';
sidebar.style.transform = 'translateX(100%)';
sidebar.style.transition = 'transform 0.25s ease';
sidebar.style.display = 'flex';
sidebar.style.flexDirection = 'column';
sidebar.style.fontFamily = 'system-ui, sans-serif';

const content = document.createElement('div');
content.style.flex = '1';
content.style.overflow = 'auto';
content.style.padding = '14px';

sidebar.appendChild(content);
document.body.appendChild(sidebar);

// =====================
// TOGGLE BUTTON
// =====================
const btn = document.createElement('button');
btn.innerText = '☰';
btn.style.position = 'fixed';
btn.style.right = '16px';
btn.style.bottom = '20px';
btn.style.width = '52px';
btn.style.height = '52px';
btn.style.borderRadius = '50%';
btn.style.border = 'none';
btn.style.background = '#111';
btn.style.color = '#fff';
btn.style.cursor = 'pointer';
btn.style.zIndex = '999999';

let isOpen = false;

btn.onclick = () => {
  isOpen = !isOpen;
  sidebar.style.transform = isOpen ? 'translateX(0)' : 'translateX(100%)';
};

document.body.appendChild(btn);

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
// TOGGLE CHECK (OPTIMISTIC UI)
// =====================
async function toggleCardDone(card, el, checkbox) {
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

    const newState = item.state !== "complete";

    // Optimistic UI
    el.style.textDecoration = newState ? "line-through" : "none";
    el.style.opacity = newState ? "0.4" : "1";
    checkbox.style.background = newState ? "#111" : "transparent";

    await fetch(
      `https://api.trello.com/1/cards/${card.id}/checkItem/${item.id}?state=${newState ? "complete" : "incomplete"}&key=${API_KEY}&token=${TOKEN}`,
      { method: "PUT" }
    );

  } catch (e) {
    console.error("toggle failed", e);
  }
}

// =====================
// BOARDS VIEW
// =====================
function renderBoards(boards) {
  view = "boards";
  currentBoard = null;

  content.innerHTML = '';

  const container = document.createElement('div');

  const title = document.createElement('div');
  title.innerText = "Boards";
  title.style.fontWeight = "600";
  title.style.marginBottom = "10px";

  container.appendChild(title);

  const saved = localStorage.getItem(STORAGE_KEY);

  boards.forEach(board => {
    const el = document.createElement('div');

    el.innerText = board.name;
    el.style.padding = '10px';
    el.style.marginBottom = '6px';
    el.style.borderRadius = '10px';
    el.style.cursor = 'pointer';
    el.style.background = board.id === saved ? '#eef3ff' : '#f7f7f7';

    el.onclick = () => {
      localStorage.setItem(STORAGE_KEY, board.id);
      loadBoard(board);
    };

    container.appendChild(el);
  });

  content.appendChild(container);
}

// =====================
// LOAD BOARD
// =====================
async function loadBoard(board) {
  view = "board";
  currentBoard = board;

  content.innerHTML = 'Loading...';

  const [lists, cards] = await Promise.all([
    getLists(board.id),
    getCards(board.id)
  ]);

  renderBoard(lists, cards);
}

// =====================
// RENDER BOARD
// =====================
function renderBoard(lists, cards) {
  content.innerHTML = '';

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.gap = '10px';
  header.style.marginBottom = '14px';

  const back = document.createElement('div');
  back.innerText = '←';
  back.style.cursor = 'pointer';
  back.style.fontSize = '18px';

  back.onclick = () => {
    localStorage.removeItem(STORAGE_KEY);
    loadBoards();
  };

  const title = document.createElement('div');
  title.innerText = currentBoard.name;
  title.style.fontWeight = '600';

  header.appendChild(back);
  header.appendChild(title);

  content.appendChild(header);

  lists.forEach(list => {
    const section = document.createElement('div');
    section.style.marginBottom = '16px';

    const listTitle = document.createElement('div');
    listTitle.innerText = list.name;
    listTitle.style.fontWeight = '600';
    listTitle.style.fontSize = '13px';
    listTitle.style.marginBottom = '8px';

    section.appendChild(listTitle);

    cards
      .filter(c => c.idList === list.id)
      .forEach(async card => {
        const el = document.createElement('div');

        el.style.padding = '10px';
        el.style.border = '1px solid #eee';
        el.style.borderRadius = '10px';
        el.style.marginBottom = '6px';
        el.style.cursor = 'pointer';
        el.style.background = '#fff';
        el.style.fontSize = '13px';
        el.style.transition = 'all 0.2s ease';

        // checkbox
        const checkbox = document.createElement('div');
        checkbox.style.width = '14px';
        checkbox.style.height = '14px';
        checkbox.style.border = '1px solid #ccc';
        checkbox.style.borderRadius = '4px';

        // layout
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '8px';

        const text = document.createElement('span');
        text.innerText = card.name;

        row.appendChild(checkbox);
        row.appendChild(text);
        el.appendChild(row);

        // detect state
        const checklists = await getCardChecklists(card.id);
        if (checklists.length && checklists[0].checkItems?.length) {
          const state = checklists[0].checkItems[0].state === "complete";
          if (state) {
            el.style.textDecoration = 'line-through';
            el.style.opacity = '0.4';
            checkbox.style.background = "#111";
          }
        }

        el.onmouseenter = () => {
          el.style.transform = 'translateY(-1px)';
          el.style.boxShadow = '0 4px 10px rgba(0,0,0,0.06)';
        };

        el.onmouseleave = () => {
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = 'none';
        };

        el.onclick = () => toggleCardDone(card, el, checkbox);

        section.appendChild(el);
      });

    content.appendChild(section);
  });
}

// =====================
// INIT
// =====================
async function loadBoards() {
  const boards = await getBoards();
  renderBoards(boards);
}

loadBoards();