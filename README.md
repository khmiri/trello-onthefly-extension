
# 🚀 Trello On The Fly Sidebar Chrome Extension

A modern Chrome extension that brings your **Trello workspace directly into any website** as a clean, interactive sidebar.

Stop switching tabs. Your tasks are always one click away.

---

## ✨ Features

- 📋 View all Trello boards
- 🗂️ Browse lists inside each board
- 🧩 View cards grouped by list (proper organization)
- ✅ Mark tasks as completed (syncs with Trello checklists)
- 🔄 Remember last selected board automatically
- ⚡ Fast floating sidebar injected into any webpage
- 🔐 OAuth login (each user connects their own Trello account)
- 🧼 Clean, minimal, modern UI

---

## 🧠 How it works

This extension connects to the Trello API and dynamically renders your workspace inside a sidebar injected into the current page.

It uses:
````
- Boards API → `/members/me/boards`
- Lists API → `/boards/{id}/lists`
- Cards API → `/boards/{id}/cards`
- Checklists API → `/cards/{id}/checklists`
````

All data stays synced with your real Trello account.

---

## 🖥️ UI Overview
````
- Click the floating **☰ button** to open sidebar
- Select a board
- View tasks grouped by lists
- Click a task to mark it as completed

---
````
## 🚀 Installation (Developer Mode)

1. Clone this repository:

````
git clone https://github.com/your-username/trello-sidebar-extension.git
````

2. Open Chrome:

```
chrome://extensions/
```

3. Enable **Developer Mode**

4. Click **Load unpacked**

5. Select the project folder

---

## 🔐 Authentication

* Uses Trello OAuth flow
* No manual token copy-paste required
* Token stored securely in `chrome.storage.local`
* Each user logs in with their own Trello account

---

## 🛠️ Tech Stack

* Vanilla JavaScript
* Chrome Extensions API
* Trello REST API
* Dynamic DOM Injection UI

---

## 📌 Why this project exists

Built to improve productivity by:

* Reducing context switching
* Keeping tasks visible while working
* Making Trello accessible everywhere
* Exploring real-world Chrome extension architecture

---

## ⚠️ Important Notes

* API key is required from Trello Developer Portal
* No user data is stored externally
* All requests are made directly to Trello API
* Each user must authenticate individually

---

## 🚀 Future Improvements

* Drag & drop task ordering
* Inline editing of cards
* Keyboard shortcuts
* Dark/light mode toggle
* Multi-board quick switcher
* Notifications for due tasks

---

## 👨‍💻 Author

Built by a developer focused on **clean , fast workflows, and real-world productivity tools**.

---

## 📄 License

MIT License — free to use and modify.


