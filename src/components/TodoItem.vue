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

<script>
export default {
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
  padding: 12px 16px;
  margin: 8px 0;
  border-left: 4px solid #4a90e2;
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background-color 0.25s ease;
}
.completed {
  border-left: 4px solid #458f00da;
}
.todo-item:hover {
  background-color: #f0f4ff;
}
.buttons{
  display: flex;
  gap: 10px;
}
.task-priority{
  font-size: 12px;

  border-radius: 6px;
  padding: 5px;
  width: 50px;
  font-weight: bold;
  text-align: center;

}
.task-priority .none{
  display: none;
}
.task-priority.high{
  background-color: #f8d7da;
  color: #721c24;
}
.task-priority.medium{
  background-color: #fff3cd;
  color: #856404;
}
.task-priority.low{
  background-color: #d4edda;
  color: #0f5132;
}
.todo-checkbox {
  width: 20px;
  height: 20px;
  margin-right: 15px;
  cursor: pointer;
  accent-color: #027912;
}
.edit-btn{
background-color: #87dcf1;
  border: none;
  border-radius: 6px;
  color: white;
  width: 30px;
  height: 30px;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  user-select: none;
}
.todo-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-wrap: break-word;
}

.todo-text {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  text-transform: capitalize;
}

.todo-desc,
.due-date {
  font-size: 14px;
  color: #666;
}

.delete-btn {
  background-color: #ff4848;
  border: none;
  border-radius: 6px;
  color: white;
  width: 30px;
  height: 30px;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  user-select: none;
}

.delete-btn:hover {
  background-color: #d93636;
}

.completed .todo-text {
  text-decoration: line-through;
  color: #999;
}

.completed .todo-desc,
.completed .due-date {
  color: #aaa;
}

@media (max-width: 500px) {
  .todo-item {
    max-width: 100%;
    flex-wrap: wrap;
    gap: 8px;
  }
  .todo-details {
    flex-basis: 100%;
  }
}
</style>
