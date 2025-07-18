<template>
  <div id="app">
    <h1>Todo List</h1>

    <AddTodo />

    <div class="stats">
      <p>Total Tasks: <strong>{{ todos.length }}</strong></p>
      <p>Completed: <strong>{{ doneTodos.length }}</strong></p>
      <p>Pending: <strong>{{ pendingTodos.length }}</strong></p>
    </div>

    <p v-if="todos.length === 0" class="no-todos-msg">
      There are no todos
    </p>

    <TodoList />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import AddTodo from "./components/AddTodo.vue";
import TodoList from "./components/TodoList.vue";

export default {
  name: "App",
  components: {
    AddTodo,
    TodoList,
  },
  computed: {
    ...mapState(["todos"]),
    ...mapGetters(["doneTodos", "pendingTodos"]),
  },
};
</script>

<style scoped>
#app {
  max-width: 500px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333;
}

h1 {
  font-weight: 700;
  margin-bottom: 10px;
  color: #4a90e2;
  user-select: none;
}

.stats {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  font-size: 16px;
  color: #555;
}

.stats p {
  margin: 0;
  user-select: none;
}

.stats strong {
  color: #222;
  font-weight: 600;
}

.no-todos-msg {
  margin: 20px 0;
  font-style: italic;
  color: #999;
  user-select: none;
}

@media (max-width: 500px) {
  #app {
    margin: 20px 10px;
  }
  .stats {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
