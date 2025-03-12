let db;

function getDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
        } else {
            const request = indexedDB.open("NotesDB", 1);
            request.onupgradeneeded = function (event) {
                let upgradeDB = event.target.result;
                if (!upgradeDB.objectStoreNames.contains("notes")) {
                    upgradeDB.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
                }
            };
            request.onsuccess = (event) => {
                db = event.target.result;
                resolve(db);
                loadNotes();
            };
            request.onerror = (event) => reject(event.target.error);
        }
    });
}

const noteCreation = document.querySelector("#noteCreation");
const addNote = document.querySelector("#addNote");
const closeNote = document.querySelector("#closeNote");
const submitNote = document.querySelector("#submitNote");
const userInput = document.querySelector("#userInput");
const noteContainer = document.querySelector(".noteContainer");
const overlay = document.querySelector(".overlay");

document.addEventListener("DOMContentLoaded", () => {
    noteCreation.style.display = "none";
    overlay.style.display = "none";
    
});

addNote.addEventListener("click", () => {
    noteCreation.style.display = "flex";
    overlay.style.display = "block";
    userInput.value = "";
    userInput.dataset.editId = "";
});

closeNote.addEventListener("click", () => {
    noteCreation.style.display = "none";
    overlay.style.display = "none";
});

submitNote.addEventListener("click", async () => {
    const text = userInput.value.trim();
    if (!text) return;

    const editId = userInput.dataset.editId;
    if (editId) {
        await updateNote(Number(editId), text);
    } else {
        await saveNote(text);
    }
    noteCreation.style.display = "none";
    overlay.style.display = "none";
});

async function saveNote(text) {
    const db = await getDB();
    const transaction = db.transaction(["notes"], "readwrite");
    const store = transaction.objectStore("notes");
    store.add({ text });

    transaction.oncomplete = loadNotes;
}

async function loadNotes() {
    const db = await getDB();
    const transaction = db.transaction(["notes"], "readonly");
    const store = transaction.objectStore("notes");
    const request = store.getAll();

    request.onsuccess = function () {
        document.querySelectorAll(".noteItem").forEach(el => el.remove());

        request.result.forEach(note => {
            let noteDiv = document.createElement("div");
            noteDiv.classList.add("noteItem");

            let shortText = note.text.length > 20 ? note.text.substring(0, 20) + "..." : note.text;
            noteDiv.textContent = shortText;
            noteDiv.dataset.id = note.id;
            noteDiv.dataset.fullText = note.text;

            noteDiv.addEventListener("click", () => {
                userInput.value = note.text;
                userInput.dataset.editId = note.id;
                noteCreation.style.display = "flex";
                overlay.style.display = "block";
            });

            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑";
            deleteBtn.classList.add("deleteBtn");
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteNote(note.id);
            };

            noteDiv.appendChild(deleteBtn);
            noteContainer.appendChild(noteDiv);
        });
    };
}

async function updateNote(id, text) {
    const db = await getDB();
    const transaction = db.transaction(["notes"], "readwrite");
    const store = transaction.objectStore("notes");
    store.put({ id, text });

    transaction.oncomplete = loadNotes;
}

async function deleteNote(id) {
    const db = await getDB();
    const transaction = db.transaction(["notes"], "readwrite");
    const store = transaction.objectStore("notes");

    store.delete(id).onsuccess = loadNotes;
}

getDB();