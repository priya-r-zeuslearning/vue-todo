<template>
  <div class="todo-container">
    <button @click="toggleForm" class="open-btn">+ Add Todo</button>

    <!-- Modal Overlay -->
    <div v-if="showForm" class="modal-overlay" @click.self="hideForm">
      <form class="todo-form" @submit.prevent="submitTodo">
        <h2>{{ isEditing ? 'Edit Todo' : 'Add New Todo' }}</h2>

        <div class="form-group">
          <label for="todo-name">Name:</label>
          <input
            id="todo-name"
            type="text"
            placeholder="Enter todo"
            v-model="todo.todo"
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
            v-model="todo.desc"
            autocomplete="off"
          />
        </div>

        <div class="form-group">
          <label for="due-date">Due Date:</label>
          <input
            id="due-date"
            type="date"
            v-model="todo.dueDate"
            required
          />
        </div>

        <div class="form-group">
          <label for="groups">Group</label>
          <select id="groups" v-model="todo.groupId">
            <option :value="null" disabled>-- Select Group --</option>
            <option
              v-for="group in $store.state.groups"
              :key="group.id"
              :value="Number(group.id)"
            >
              {{ group.name }}
            </option>
          </select>
        </div>
          <div class="priority" v-if="todo.groupId!=null">
          <label for="priority">Priority:</label>
          <button @click="todo.priority = 'High'" :class="{ active: todo.priority === 'High' }">High</button>
          <button @click="todo.priority = 'Medium'" :class="{ active: todo.priority === 'Medium' }">Medium</button>
          <button @click="todo.priority = 'Low'" :class="{ active: todo.priority === 'Low' }">Low</button>
        </div>

        <button type="submit" class="btn-submit">
          {{ isEditing ? 'Update Todo' : 'Add Todo' }}
        </button>
        <button type="button" class="btn-cancel" @click="cancelForm">
          Cancel
        </button>
      </form>
    </div>
  </div>
</template>


<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(["showForm"]),
    todo: {
      get() {
        return this.$store.state.editingTodo || this.getDefaultTodo();
      },
      set(val) {
        this.$store.commit("START_EDITING", val);
      }
    },
    isEditing() {
      return !!this.$store.state.editingTodo?.id;
    }
  },
  methods: {
    ...mapActions(["toggleForm", "hideForm", "showFormAction"]),

    getDefaultTodo() {
      return {
        todo: '',
        desc: '',
        dueDate: '',
        priority: '',
        groupId: null
      };
    },

    submitTodo() {
      if (this.isEditing) {
        this.$store.dispatch("editTodoAsync", this.todo);
      } else {
    
        this.$store.dispatch("addAsync", this.todo); // make a copy
       
      }
      this.cancelForm();
    },

    cancelForm() {
      this.hideForm(); 
      this.$store.commit("CLEAR_EDITING");
    }
  }
};




</script>

<style scoped>
.todo-container {
  display: flex;
  justify-content: center;
  margin: 40px 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.open-btn {
  padding: 12px 20px;
  font-size: 16px;
  background-color: #4A90E2;
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
