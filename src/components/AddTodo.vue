<template>
  <div class="todo-container">
    <button @click="showForm = true" class="open-btn">+ Add Todo</button>

    <!-- Modal Overlay -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <form class="todo-form" @submit.prevent="addTodo">
        <h2>Add New Todo</h2>

        <div class="form-group">
          <label for="todo-name">Name:</label>
          <input
            id="todo-name"
            type="text"
            placeholder="Enter todo"
            v-model="todo"
            tabindex="1"
            required
            autocomplete="off"
          />
        </div>

        <div class="form-group">
          <label for="todo-desc">Description:</label>
          <input
            id="todo-desc"
            type="text"
            placeholder="Enter description"
            v-model="todo_desc"
            tabindex="2"
            autocomplete="off"
          />
        </div>

        <div class="form-group">
          <label for="due-date">Due Date:</label>
          <input
            id="due-date"
            type="date"
            v-model="dueDate"
            tabindex="3"
            required
          />
        </div>

        <button type="submit" class="btn-submit" tabindex="4">Add Todo</button>
        <button type="button" class="btn-cancel" @click="showForm = false">Cancel</button>
      </form>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      todo: "",
      todo_desc: "",
      dueDate: "",
        completed: false,
      showForm: false
    };
  },
    methods: {
    addTodo() {
      if (this.todo.trim() === "") return;  //return if feild is empty
      this.$store.dispatch('addAsync', {
  todo: this.todo,
  desc: this.todo_desc,
  dueDate: this.dueDate,
  completed: false
});

      this.todo = "";
      this.todo_desc = "";
            this.dueDate = "";
      this.showForm = false;
    },
  },
};
</script>

<style scoped>
.todo-container {
  display: flex;
  justify-content: center;
  margin: 40px 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.open-btn {
  padding: 12px 20px;
  font-size: 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.open-btn:hover {
  background-color: #357abd;
}

/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal form */
.todo-form {
  background-color: #f9f9fb;
  border-radius: 14px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  padding: 30px 30px 20px;
  width: 90%;
  max-width: 450px;
  animation: popIn 0.25s ease-out;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.todo-form h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #555;
  font-size: 14px;
}

input[type="text"],
input[type="date"] {
  padding: 10px 14px;
  font-size: 15px;
  border: 1.8px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease;
  outline-offset: 2px;
}

input[type="text"]:focus,
input[type="date"]:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
  outline: none;
}

.btn-submit,
.btn-cancel {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 12px;
}

.btn-submit {
  background-color: #c44ae2;
  color: white;
}

.btn-submit:hover {
  background-color: #a23bc1;
}

.btn-cancel {
  background-color: #eee;
  color: #333;
}

.btn-cancel:hover {
  background-color: #ddd;
}

@media (max-width: 450px) {
  .todo-form {
    padding: 20px;
  }
}
</style>

