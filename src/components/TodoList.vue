<template>
  <div id="list">


    <ul>
      <TodoItem
        v-for="todo in visibleTodos"
        :key="todo.id"
        :todo="todo"
        @toggle-todo="toggleTodo"
        @delete-todo="deleteItem"
      />
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
    };
  },
  computed: {
    ...mapState(["todos"]),
    ...mapGetters(["doneTodos"]),
    visibleTodos() {
      return this.showCompleted ? this.doneTodos : this.todos;
    },
  },
  methods: {
    toggleTodo(id) {
      this.$store.dispatch("toggleTodoAsync", id);
    },
    deleteItem(id) {
      this.$store.dispatch("deleteTodoAsync", id);
    },
    toggleAll() {
      this.showCompleted = !this.showCompleted;
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
  background: #f4f6fb;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
  height: 400px;
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
