class StorageService {
    constructor() {
        this.dbName = 'EssentialSpaceDB';
        this.dbVersion = 3; 
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error("Database error: " + event.target.errorCode);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("notes")) {
                    const objectStore = db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
                    objectStore.createIndex("type", "type", { unique: false });
                    objectStore.createIndex("timestamp", "timestamp", { unique: false });
                }
            };
        });
    }

    async addNote(note) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["notes"], "readwrite");
            const objectStore = transaction.objectStore("notes");
            const request = objectStore.add(note);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllNotes(filterTag = null) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["notes"], "readonly");
            const objectStore = transaction.objectStore("notes");
            const request = objectStore.getAll();

            request.onsuccess = (event) => {
                let notes = event.target.result;
                if (filterTag) {
                    notes = notes.filter(note => note.tags && note.tags.includes(filterTag));
                }
                notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                // Pin logic
                const pinned = notes.filter(n => n.isPinned);
                const unpinned = notes.filter(n => !n.isPinned);
                resolve([...pinned, ...unpinned]);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async deleteNote(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["notes"], "readwrite");
            const objectStore = transaction.objectStore("notes");
            const request = objectStore.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async togglePin(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["notes"], "readwrite");
            const objectStore = transaction.objectStore("notes");
            const request = objectStore.get(id);

            request.onsuccess = (event) => {
                const note = event.target.result;
                note.isPinned = !note.isPinned;
                objectStore.put(note);
                resolve(note.isPinned);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async updateNote(note) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["notes"], "readwrite");
            const objectStore = transaction.objectStore("notes");
            const request = objectStore.put(note);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getUpcomingEvents() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["notes"], "readonly");
            const objectStore = transaction.objectStore("notes");
            const request = objectStore.getAll();

            request.onsuccess = (event) => {
                const notes = event.target.result;
                const now = new Date();
                const events = notes.filter(n => n.type === '[EVENT]' && n.eventDate && new Date(n.eventDate) > now);
                events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
                resolve(events);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getRecentMedia() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["notes"], "readonly");
            const objectStore = transaction.objectStore("notes");
            const request = objectStore.getAll();

            request.onsuccess = (event) => {
                const notes = event.target.result;
                const media = notes.filter(n => n.imageData);
                media.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                resolve(media[0] || null);
            };
            request.onerror = () => reject(request.target.error);
        });
    }

    async getUniqueTags() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["notes"], "readonly");
            const objectStore = transaction.objectStore("notes");
            const request = objectStore.getAll();

            request.onsuccess = (event) => {
                const notes = event.target.result;
                const tags = new Set();
                notes.forEach(note => {
                    if (note.tags && Array.isArray(note.tags)) {
                        note.tags.forEach(tag => tags.add(tag));
                    }
                });
                resolve(Array.from(tags).sort());
            };
            request.onerror = () => reject(request.target.error);
        });
    }
}

const db = new StorageService();