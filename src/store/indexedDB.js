let db;

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("TodoDB", 7); // bump version if needed

    request.onerror = () => {
      reject(new Error("Error opening IndexedDB database"));
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      console.log("Successfully opened IndexedDB database");
      resolve();
    };

    request.onupgradeneeded = (e) => {
      db = e.target.result;

      // Create "todos" store if not already present
      if (!db.objectStoreNames.contains("todos")) {
        const todoStore = db.createObjectStore("todos", { keyPath: "id" });
        todoStore.createIndex("idIndex", "id", { unique: true });
        todoStore.createIndex("groupIdIndex", "groupId", { unique: false });
      } else {
        const todoStore = request.transaction.objectStore("todos");
        if (!todoStore.indexNames.contains("groupIdIndex")) {
          todoStore.createIndex("groupIdIndex", "groupId", { unique: false });
        }
      }

      // Create "groups" store if not already present
      if (!db.objectStoreNames.contains("groups")) {
        const groupStore = db.createObjectStore("groups", { keyPath: "id" });
        groupStore.createIndex("idIndex", "id", { unique: true }); // Optional index
        console.log("Created 'groups' object store");
      }
    };
  });
}

export function addGroup(group) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("groups", "readwrite");
    const store = tx.objectStore("groups");
    console.log(group, "FROM IndexedDB");
    const request = store.add(group);
    request.onsuccess = () => {
      console.log("Group added to IndexedDB");
      resolve(group); // resolve with the full group object
    };
    request.onerror = (event) => {
      console.error(event.target.error);
      reject(new Error("Error adding group to IndexedDB"));
    };
  });
}
export function getGroups() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("groups", "readonly");
    const store = tx.objectStore("groups");
    const index = store.index("idIndex");
    const cursorRequest = index.openCursor(null, "prev");
    const groups = [];
    cursorRequest.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        groups.push(cursor.value);
        cursor.continue();
      } else {
        console.log("Groups retrieved from IndexedDB");
        resolve(groups);
      }
    };
    cursorRequest.onerror = () => {
      reject(new Error("Error retrieving groups from IndexedDB"));
    };
  });
}
export function addTodo(todoObj) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");
    const request = store.add(todoObj);
    request.onsuccess = () => {
      console.log("Todo added to IndexedDB");
      resolve(todoObj); // resolve with the full todo object
    };
    request.onerror = () => {
      reject(new Error("Error adding todo to IndexedDB"));
    };
  });
}
export function getTodo(id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("todos", "readonly");
    const store = tx.objectStore("todos");
    const request = store.get(id);
    request.onsuccess = () => {
      console.log("Todo retrieved from IndexedDB");
      resolve(request.result);
    };
    request.onerror = () => {
      reject(new Error("Error retrieving todo from IndexedDB"));
    };
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
    };
    cursorRequest.onerror = () => {
      reject(new Error("Error retrieving todos from IndexedDB"));
    };
  });
}
export function deleteGroup(id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("groups", "readwrite");
    const store = tx.objectStore("groups");
    const request = store.delete(id);
    request.onerror = () => {
      reject(new Error("Error deleting group from IndexedDB"));
    };
    request.onsuccess = () => {
      console.log("Group deleted from IndexedDB");
      resolve("Deleted Group");
    };
  });
}
export function getTodosbyGroupSorted(
  groupId,
  sortBy = "id",
  direction = "prev"
) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("todos", "readonly");
    const store = tx.objectStore("todos");

    const index = store.index("groupIdIndex");
    const range = IDBKeyRange.only(groupId);
    const request = index.openCursor(range, direction);

    const todos = [];

    request.onsuccess = (e) => {
      const cursor = e.target.result;

   
      if (cursor) {
        todos.push(cursor.value);
        cursor.continue();
      } else {
      
        if (sortBy === "priority") {
          todos.sort((a, b) => a.priority - b.priority);
        } else if (sortBy === "priority-desc") {
          todos.sort((a, b) => b.priority - a.priority);
        } else if (sortBy === "dueDate") {
          todos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        } else if (sortBy === "dueDate-desc") {
          todos.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        }
        resolve(todos);
      }
    };

    request.onerror = () => reject(new Error("Error retrieving sorted todos"));
  });
}

export function deleteTodo(id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");
    const request = store.delete(id);
    request.onerror = () => {
      reject(new Error("Error deleting todo from IndexedDB"));
    };
    request.onsuccess = () => {
      console.log("Todo deleted from IndexedDB");
      resolve("Deleted Todo");
    };
  });
}
export function updateTodo(id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");
    const request = store.put(id);
    request.onerror = () => {
      reject(new Error("Error updating todo from IndexedDB"));
    };
    request.onsuccess = () => {
      console.log("Todo updated from IndexedDB");
      resolve("Updated Todo");
    };
  });
}
