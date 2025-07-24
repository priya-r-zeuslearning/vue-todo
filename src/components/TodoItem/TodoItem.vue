<template>
  <li :class="{ completed: todo.completed }" class="todo-item">
    <input
      type="checkbox"
      :checked="todo.completed"
      @change="$emit('toggle-todo', todo.id)"
      class="todo-checkbox"
      aria-label="Mark todo complete"
    />

    <div class="todo-details">
      <span class="todo-text">{{ todo.todo }}</span>
      <span class="todo-desc">Description: {{ todo.desc }}</span>
      <span class="due-date">Due: {{ todo.dueDate }}</span>
      <span :class="{ high: todo.priority === 1, medium: todo.priority === 2, low: todo.priority === 3 , none: todo.priority === ''}" class="task-priority"> {{ todo.priority === 1 ? 'High' : todo.priority === 2 ? 'Medium' : todo.priority === 3 ? 'Low' : ' '}}</span>
    </div>

    <div class="buttons">
      <button class="edit-btn" v-if="!todo.completed" @click="$store.dispatch('startEditing', todo); $store.dispatch('showFormAction')">
    <img src="@/assets/image.png" alt="Edit" height="20px" width="20px">
    </button>
  <button class="delete-btn" @click="$emit('delete-todo', todo.id)" aria-label="Delete todo">
      ✕
    </button>
    
    </div>
  

  </li>
</template>

<script src="./TodoItem.js">

</script>

<style scoped src="./TodoItem.css">

</style>
