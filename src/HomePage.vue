<template>
  <div id="app">
    <h1>Todo List</h1>

    <div class="add-btns">
       <AddTodo />
    <AddGroup/>
    </div>
   

    <div class="stats">
      <p>Total Tasks: <strong>{{ todos.length }}</strong></p>
      <p>Completed: <strong>{{ doneTodos.length }}</strong></p>
      <p>Pending: <strong>{{ pendingTodos.length }}</strong></p>
    </div>

  

    <TodoList />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import AddTodo from "./components/AddTodo/AddTodo.vue";
import TodoList from "./components/TodoList/TodoList.vue"
import AddGroup from "./components/AddGroup/AddGroup.vue";

export default {
  name: "HomePage",
  components: {
    AddTodo,
    TodoList,
    AddGroup
  },
  computed: {
    ...mapState(["todos",]),
    ...mapGetters(["doneTodos", "pendingTodos", ]),
  },
};
</script>

<style scoped>
#app {
  max-width: 100vw;
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
  margin-bottom: 5px;
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
.add-btns{
  display: flex;
  gap: 10px;
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
