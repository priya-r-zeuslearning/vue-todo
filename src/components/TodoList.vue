<template>
  <div id="list">
    <!-- <button class="toggle-btn" @click="toggleAll">{{ showCompleted ? "Hide Completed" : "Show Completed" }}</button> -->
    <ul>
      <li
        v-for="group in groups"
        :key="group.id"
        class="group-section"
        :style="{ backgroundColor: group.color + `20` }"
      >
        <div class="group-header">
          <h3 :style="{ color: group.color }" @click="toggleGroup(group.id)">
            {{ group.name }} ▼
          </h3>
          <h2 v-if="showGroup.includes(group.id)">
            <label :for="'sort-' + group.id" style="margin-right: 8px"
              >Sort by</label
            >
            <select
              :id="'sort-' + group.id"
              @change="sortTodos(group.id)"
              v-model="sortOrders[group.id]"
            >
              <option disabled value="">Select</option>
              <option value="name">Due Date</option>
              <option value="priority-desc">Low → High</option>
              <option value="priority">High → Low</option>
            </select>
          </h2>
          <!-- <button class="delete-group-btn" @click="deleteGroup(group.id)">Delete Group</button> -->
        </div>

        <div v-if="showGroup.includes(group.id)">
          <TodoItem
            v-for="todo in groupTodos[group.id] ||
            todos.filter((t) => t.groupId === group.id)"
            :key="todo.id"
            :todo="todo"
            @toggle-todo="toggleTodo"
            @delete-todo="deleteItem"
          />
        </div>
      </li>
      <li class="group-section">
        <div class="group-header">
          <h3>Ungroupped Tasks</h3>
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
// import { sort } from "core-js/core/array";

export default {
  components: {
    TodoItem,
  },
  data() {
    return {
      showCompleted: false,
      showGroup: [],
      sortOrders: {},
    };
  },
  computed: {
    ...mapState(["todos", "groups", "groupTodos"]),
    ...mapGetters(["pendingTodos", "doneTodos"]),
    visibleTodos() {
      return this.showCompleted
        ? this.todos.filter((todo) => todo.completed)
        : this.todos.filter((todo) => !todo.completed);
    },
  },

  methods: {
    toggleTodo(id) {
      //becuase this update the plain todo list not the grouped one
      this.$store.dispatch("toggleTodoAsync", id).then(() => {
        const todo = this.todos.find((t) => t.id === id);
        if (todo && todo.groupId != null) {
          this.sortTodos(todo.groupId); //refetch and re-sort the list
        }
      });
    },

    deleteItem(id) {
      this.$store.dispatch("deleteTodoAsync", id);
    },
    deleteGroup(id) {
      this.$store.dispatch("deleteGroupAsync", id);
    },
    toggleAll() {
      this.showCompleted = !this.showCompleted;
    },
    sortTodos(groupId) {
      const sortOrder = this.sortOrders[groupId];
      let sortByfunction = "id";
      let directionfunction = "prev";

      if (sortOrder === "name") sortByfunction = "dueDate";
      else if (sortOrder === "priority") {
        sortByfunction = "priority";
        directionfunction = "next";
      } else if (sortOrder === "priority-desc") {
        sortByfunction = "priority-desc";
        directionfunction = "prev";
      }
      this.$store.commit("SET_SORT_ORDER", { groupId, sortByfunction });

      console.log(this.sortOrders);
      this.$store.dispatch("FetchGroupTodos", {
        groupId,
        sortBy: sortByfunction,
        direction: directionfunction,
      });
    },
    toggleGroup(id) {
      if (this.showGroup.includes(id)) {
        this.showGroup = this.showGroup.filter((g) => g !== id);
        return;
      }
      this.showGroup = [...this.showGroup, id];
    },
  },
};
</script>

<style scoped>
#list {
  width: 80%;
  /* min-height: 100vh; */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 10px;
  /* background: #f4f6fb; */
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.group-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.group-header h3 {
  margin: 0;
  cursor: pointer;
  text-transform: uppercase;
}
.group-header h3:hover {
  border-bottom: 2px solid #872bff;
}
h2{
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;;
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

.toggle-btn:hover {
  background-color: #357abd;
}

ul {
  width: 80%;
  max-width: 90vw;
  height: 500px;
  background-color: #fff;
  overflow-y: scroll;
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
