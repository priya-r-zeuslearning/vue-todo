<template>
  <div id="list">
    <ul>
      <li
        v-for="group in groups"
        :key="group.id"
        class="group-section"
        :style="{ backgroundColor: group.color + `20` }"
      >
        <div class="group-header">
          <h3
            :style="{ '--group-color': group.color }"
            @click="toggleGroup(group.id)"
          >
            {{ group.name }}
            <div v-if="showGroup.includes(group.id)">▲</div>
            <div v-if="!showGroup.includes(group.id)">▼</div>
          </h3>

          <div class="sort-filter">
            <h2 v-if="showGroup.includes(group.id)">
              <label :for="'sort-' + group.id" style="margin-right: 8px"
                >Sort by</label
              >
              <select
                :id="'sort-' + group.id"
                @change="sortTodos(group.id, sortOrders[group.id])"
                v-model="sortOrders[group.id]"
              >
                <option disabled value="">Select</option>
                <option value="dueDate">Due Date</option>
                <option value="priority-desc">Low → High</option>
                <option value="priority">High → Low</option>
              </select>
            </h2>

            <button
              v-if="showGroup.includes(group.id)"
              @click="openFilterForm(group.id)"
            >
              Filter
            </button>

            <button
              type="button"
              class="btn-cancel"
              @click="clearFilter(group.id)"
              v-if="filterForms[group.id] && isFilterApplied(group.id)"
            >
              X
            </button>
          </div>
        </div>

        <!-- Filter Modal -->
        <div
          class="modal-overlay"
          v-if="filterFormShow && activeFilterGroup === group.id"
          @click.self="closeFilterForm"
        >
          <form
            class="todo-form"
            @submit.prevent="applyFilter(activeFilterGroup)"
          >
            <div class="form-group">
              <label for="due-date">Due Date:</label>
              <input
                id="due-date"
                type="date"
                placeholder="Enter due date"
                v-model="filterForms[activeFilterGroup].dueDate"
                autocomplete="off"
              />
            </div>

            <div class="form-group">
              <label for="priority">Priority:</label>
              <select id="priority" v-model="filterForms[activeFilterGroup].priority">
                <option disabled value="">Select</option>
                <option value="1">High</option>
                <option value="2">Medium</option>
                <option value="3">Low</option>
              </select>
            </div>

            <div class="form-group">
              <label for="status">Status:</label>
              <select id="status" v-model="filterForms[activeFilterGroup].status">
                <option disabled value="">Select</option>
                <option value="1">Completed</option>
                <option value="2">In Progress</option>
              </select>
            </div>

            <div class="filter-btn">
              <button type="submit" class="btn-submit">Filter</button>
            </div>
          </form>
        </div>

        <!-- Todos List -->
        <div v-if="showGroup.includes(group.id)">
          <TodoItem
            v-for="todo in groupTodos[group.id] || todos.filter((t) => t.groupId === group.id)"
            :key="todo.id"
            :todo="todo"
            @toggle-todo="toggleTodo"
            @delete-todo="deleteItem"
          />
        </div>
      </li>

      <!-- Ungrouped tasks -->
      <li class="group-section">
        <div class="group-header">
          <h3>Ungrouped Tasks</h3>
        </div>
        <TodoItem
          v-for="todo in todos.filter((t) => t.groupId === null)"
          :key="todo.id"
          :todo="todo"
          @toggle-todo="toggleTodo"
          @delete-todo="deleteItem"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import TodoItem from "./TodoItem.vue";

export default {
  components: {
    TodoItem,
  },

  data() {
    return {
      showCompleted: false,
      showGroup: [],
      sortOrders: {},
      filterForms: {}, // Holds filters per group
      activeFilterGroup: null, // Which group filter modal is open
      filterFormShow: false,
    };
  },

  computed: {
    ...mapState([
      "todos",
      "groups",
      "groupTodos",
      "sortOrders:storeSortOrders",
    ]),
    ...mapGetters(["pendingTodos", "doneTodos"]),
  },

  watch: {
    // Keep local sortOrders in sync with store
    storeSortOrders: {
      handler(newOrders) {
        this.sortOrders = { ...newOrders };
      },
      immediate: true,
      deep: true,
    },
  },

methods: {
  toggleGroup(id) {
    if (this.showGroup.includes(id)) {
      this.showGroup = this.showGroup.filter((g) => g !== id);
    } else {
      this.showGroup.push(id);
    }
  },

  toggleTodo(id) {
    this.$store.dispatch("toggleTodoAsync", id);
  },

  deleteItem(id) {
    this.$store.dispatch("deleteTodoAsync", id);
  },

  openFilterForm(groupId) {
    this.activeFilterGroup = groupId;
    this.filterFormShow = true;

    if (!this.filterForms[groupId]) {
      this.$set(this.filterForms, groupId, {
        dueDate: "",
        priority: "",
        status: "",
      });
    }
  },

  closeFilterForm() {
    this.filterFormShow = false;
    this.activeFilterGroup = null;
  },

  applyFilter(groupId) {
    const { dueDate, priority, status } = this.filterForms[groupId];

    let filtered = this.todos.filter((todo) => {
      const sameGroup = todo.groupId === groupId;

      const dueMatch = dueDate ? todo.dueDate === dueDate : true;
      const priorityMatch = priority
        ? String(todo.priority) === String(priority)
        : true;
      const statusMatch =
        status === "1"
          ? todo.completed === true
          : status === "2"
          ? todo.completed === false
          : true;

      return sameGroup && dueMatch && priorityMatch && statusMatch;
    });

    // Sort the filtered list if a sort order exists
    const lastSort = this.sortOrders[groupId];
    if (lastSort) {
      filtered = this.getSortedTodos(filtered, lastSort);
    }

    this.groupTodos[groupId] = filtered;
    this.filterFormShow = false;
  },

  clearFilter(groupId) {
    this.$set(this.filterForms, groupId, {
      dueDate: "",
      priority: "",
      status: "",
    });

    let groupList = this.todos.filter((todo) => todo.groupId === groupId);

    // Sort if needed
    const lastSort = this.sortOrders[groupId];
    if (lastSort) {
      groupList = this.getSortedTodos(groupList, lastSort);
    }

    this.groupTodos[groupId] = groupList;
    this.filterFormShow = false;
  },

  isFilterApplied(groupId) {
    const filter = this.filterForms[groupId];
    return filter && (filter.dueDate || filter.priority || filter.status);
  },

  sortTodos(groupId, sortKey) {
    const selected = sortKey || this.sortOrders[groupId];

    let sortBy = "id";
    let direction = "prev";

    if (selected === "dueDate") {
      sortBy = "dueDate";
      direction = "prev";
    } else if (selected === "priority") {
      sortBy = "priority";
      direction = "next";
    } else if (selected === "priority-desc") {
      sortBy = "priority";
      direction = "prev";
    }

    // Save in store
    this.$store.dispatch("setSortOrder", {
      groupId,
      sortBy: sortBy,
      direction,
    });

    // Use current filtered list (if any) or all for that group
    let currentList = this.groupTodos[groupId]
      ? [...this.groupTodos[groupId]]
      : this.todos.filter((todo) => todo.groupId === groupId);

    const sorted = this.getSortedTodos(currentList, selected);
    this.groupTodos[groupId] = sorted;
  },

  getSortedTodos(todos, selected) {
    let sorted = [...todos];

    if (selected === "dueDate") {
      sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (selected === "priority") {
      sorted.sort((a, b) => a.priority - b.priority); // High → Low
    } else if (selected === "priority-desc") {
      sorted.sort((a, b) => b.priority - a.priority); // Low → High
    }

    return sorted;
  },
}

};
</script>



<style scoped>
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
/* Modal form */
.todo-form {
  background-color: #f9f9fb;
  border-radius: 14px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  padding: 30px 30px 20px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 450px;
  animation: popIn 0.25s ease-out;
}
.todo-form .filter-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.todo-form button {
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  width: 50%;
  font-weight: bold;
  background-color: #53c9ff;
  /* box-shadow: 0 12px 10px rgba(0, 0, 0, 0.2); */
  color: rgb(255, 255, 255);
}
.todo-form button:hover {
  background-color: #32b4f0;
}
.sort-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.sort-filter button {
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
}
.sort-filter button:hover {
  background-color: #f0f4ff;
}
#list {
  width: 80%;
  /* min-height: 100vh; */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  /* background: #f4f6fb; */
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.group-header {
  display: flex;
  justify-content: space-between;
  width: 100%;

  user-select: none;
  align-items: center;
}
.group-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  color: var(--group-color);
  text-transform: uppercase;
}
.group-header h3:hover {
  border-bottom: 2px solid var(--group-color);
}
h2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}
select {
  padding: 8px 22px 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

select:hover {
  border-color: #4a90e2;
}

select:focus {
  outline: none;
  border-color: #872bff;
  box-shadow: 0 0 0 3px rgba(135, 43, 255, 0.2);
}

.group-section {
  list-style-type: none;
  /* background-color: #e3f1ff; */
  padding: 10px 20px;
  border-radius: 5px;
}
.delete-group-btn {
  padding: 10px 10px;
  font-size: 12px;
  height: 35px;
  border: none;
  border-radius: 8px;
  background-color: #e24f4f;
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 5px 12px rgba(226, 74, 74, 0.4);
  transition: background-color 0.3s ease;
}

.toggle-btn {
  padding: 10px 24px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background-color: #4a90e2;
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 5px 12px rgba(74, 144, 226, 0.4);
  transition: background-color 0.3s ease;
}
.form-group {
  display: flex;
  gap: 10px;
  align-items: center;
}
.toggle-btn:hover {
  background-color: #357abd;
}

ul {
  width: 80%;
  max-width: 90vw;
  height: 550px;
  background-color: #fff;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: #bdc2c2 #f4f6fb;
  padding: 24px 20px;
  border-radius: 14px;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 400px) {
  ul {
    width: 100%;
    padding: 16px 12px;
  }
}
</style>
