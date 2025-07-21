<template>
  <div id="list">

    <!-- <button class="toggle-btn" @click="toggleAll">{{ showCompleted ? "Hide Completed" : "Show Completed" }}</button> -->
  <ul>
  <li v-for="group in groups" :key="group.id" class="group-section" :style="{ backgroundColor: group.color+`20` }">
    <div class="group-header">
       <h3 :style="{ color: group.color, }" @click="toggleGroup(group.id)">{{ group.name }} </h3>
    <button class="delete-group-btn" @click="deleteGroup(group.id)">Delete Group</button>
    </div>
   
    <div v-if="showGroup.includes(group.id)">

  
    <TodoItem
   
      v-for="todo in todos.filter((t) => t.groupId === group.id) "
      :key="todo.id"
      :todo="todo"
      @toggle-todo="toggleTodo"
      @delete-todo="deleteItem"
    />
      </div>
  </li>
  <li class="group-section">
    <div class="group-header">
    
    <h3>Ungroupped Tasks</h3></div>
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
import {  mapGetters, mapState } from "vuex";
import TodoItem from "./TodoItem.vue";

export default {
  components: {
    TodoItem,
  },
  data() {
    return {
      showCompleted: false,
      showGroup: []
    };
  },
 computed: {
   ...mapState(["todos", "groups"]),
   ...mapGetters(["pendingTodos", "doneTodos"]),
  visibleTodos() {
    return this.showCompleted
      ? this.todos.filter((todo) => todo.completed)
      : this.todos.filter((todo) => !todo.completed);
  }
  // groupedTodos() {
  //   // Build a group -> todos map
  //   const grouped = {};
  //   for (const group of this.groups) {
  //     grouped[group.id] = {
  //       ...group,
  //       todos: [],
  //     };
  //   }

  //   for (const todo of this.todos) {
  //     if (this.showCompleted && !todo.completed) continue;
  //     if (!this.showCompleted && todo.completed) continue;

  //     if (grouped[todo.groupId]) {
  //       grouped[todo.groupId].todos.push(todo);
  //     }
  //   }

  //   return Object.values(grouped).filter(g => g.todos.length > 0);
  // }
},

  methods: {
    toggleTodo(id) {
      this.$store.dispatch("toggleTodoAsync", id);
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
    toggleGroup(id) {
      if(this.showGroup.includes(id)){
        this.showGroup = this.showGroup.filter(g => g !== id);
        return
      }
      this.showGroup = [...this.showGroup, id];
    }
  
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
.group-header{
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items:center ;
}
.group-header h3{
  margin: 0;

  text-transform: uppercase;
}
.group-section{
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
  height: 700px;
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
