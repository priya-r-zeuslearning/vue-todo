<template>
  <div class="todo-container">
    <button @click="openAddForm" class="open-btn">+ Add Todo</button>

    <!-- Modal Overlay -->
    <div v-if="showForm" class="modal-overlay" @click.self="hideForm">
      <form class="todo-form" @submit.prevent="submitTodo">
        <h2>{{ isEditing ? "Edit Todo" : "Add New Todo" }}</h2>

        <div class="form-group">
          <label for="todo-name">Name:</label>
          <input
            id="todo-name"
            type="text"
            placeholder="Enter todo"
            v-model="localTodo.todo"
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
            v-model="localTodo.desc"
            autocomplete="off"
          />
        </div>

        <div class="form-group">
          <label for="due-date">Due Date:</label>
          <input
            id="due-date"
            type="date"
            min="2025-07-22"
            v-model="localTodo.dueDate"
            required
          />
        </div>

        <div class="form-group">
          <label for="groups">Group</label>
          <select id="groups" v-model="localTodo.groupId">
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
        <div class="priority" v-if="localTodo.groupId != null">
          <label for="priority">Priority:</label>
          <button
            type="button"
            @click.prevent="localTodo.priority = 1"
            :class="{ active: localTodo.priority === 1 }"
          >
            High
          </button>
          <button
            type="button"
            @click.prevent="localTodo.priority = 2"
            :class="{ active: localTodo.priority === 2 }"
          >
            Medium
          </button>
          <button
            type="button"
            @click.prevent="localTodo.priority = 3"
            :class="{ active: localTodo.priority === 3 }"
          >
            Low
          </button>
        </div>

        <button type="submit" class="btn-submit">
          {{ isEditing ? "Update Todo" : "Add Todo" }}
        </button>
        <button type="button" class="btn-cancel" @click="cancelForm">
          Cancel
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      localTodo: this.$store.state.editingTodo || this.getDefaultTodo(),
    };
  },
  watch: {
    "$store.state.editingTodo"(newVal) {
      this.localTodo = newVal ? { ...newVal } : this.getDefaultTodo();
    },
  },
  computed: {
    ...mapState(["showForm"]),
    isEditing() {
      return !!this.$store.state.editingTodo?.id;
    },
  },
  methods: {
    ...mapActions(["toggleForm", "hideForm", "showFormAction"]),

    getDefaultTodo() {
      return {
        todo: "",
        desc: "",
        dueDate: "",
        priority: '3',
        groupId: null,
      };
    },
    openAddForm() {
      this.$store.commit("CLEAR_EDITING");
      this.localTodo = this.getDefaultTodo(); // reset local todo here
      this.showFormAction();
    },
    async submitTodo() {
      if (this.isEditing) {
        await this.$store.dispatch("editTodoAsync", this.localTodo);
      } else {
        await this.$store.dispatch("addAsync", this.localTodo);
      }
      this.cancelForm();
    },
    cancelForm() {
      this.hideForm();
      this.$store.commit("CLEAR_EDITING");
      this.localTodo = this.getDefaultTodo(); // reset local todo here as well
    },
  },
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
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}
/* Styling for <select> dropdown */
select {
  padding: 10px 14px;
  font-size: 15px;
  border: 1.8px solid #ccc;
  border-radius: 8px;
  background-color: white;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  appearance: none; /* Remove default arrow styling in most browsers */
  outline: none;
}

select:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 8px rgba(74, 144, 226, 0.3);
}

/* Priority Button Container */
.priority {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
}

.priority label {
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
}

/* Priority buttons */
.priority button {
  padding: 10px 14px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  border: 1.5px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  background-color: #f2f2f2;
  color: #333;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.priority button:hover {
  background-color: #e4e4e4;
}

.priority button.active {
  background-color: #4a90e2;
  border-color: #357abd;
  color: white;
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
