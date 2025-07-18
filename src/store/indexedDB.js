let db;

export function openDB() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('TodoDB', 2);
        request.onerror = () => {
            reject(new Error('Error opening IndexedDB database'));
        } 
        request.onsuccess = (e) => {
            db = e.target.result;
            console.log("Successfully opened IndexedDB database");
            resolve();
        }
    request.onupgradeneeded = (e) => {
    db = e.target.result;
    const store = db.createObjectStore("todos", { keyPath: "id" });
    store.createIndex("idIndex", "id", { unique: true }); 
    console.log("Successfully created object store and index");
};

    })
}
export function addTodo(todoObj) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("todos", "readwrite");
        const store = tx.objectStore("todos");
        const request = store.add(todoObj);
        request.onsuccess = () => {
            console.log("Todo added to IndexedDB");
            resolve(todoObj);  // resolve with the full todo object
        }
        request.onerror = () => {
            reject(new Error('Error adding todo to IndexedDB'));
        }
    });
}

export function getTodos() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("todos", "readonly");
        const store = tx.objectStore("todos");
        const index = store.index("idIndex");
        const cursorRequest = index.openCursor(null, "prev");
        const todos = [];
        cursorRequest.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                todos.push(cursor.value);
                cursor.continue();
            } else {
                console.log("Todos retrieved from IndexedDB");
                resolve(todos);
            }
        }
        cursorRequest.onerror = () => {
            reject(new Error('Error retrieving todos from IndexedDB'));
        }
    })
}
export function deleteTodo(id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("todos", "readwrite");
        const store = tx.objectStore("todos");
        const request = store.delete(id);
        request.onerror = () => {
            reject(new Error('Error deleting todo from IndexedDB'));
        }
        request.onsuccess = () => {
            console.log("Todo deleted from IndexedDB");
            resolve("Deleted Todo");
        }
    })
}
export function updateTodo(id){
    return new Promise((resolve, reject) => {
        const tx = db.transaction("todos", "readwrite");
        const store = tx.objectStore("todos");
        const request = store.put(id);
        request.onerror = () => {
            reject(new Error('Error updating todo from IndexedDB'));
        }
        request.onsuccess = () => {
            console.log("Todo updated from IndexedDB");
            resolve("Updated Todo");
        }
    })
}