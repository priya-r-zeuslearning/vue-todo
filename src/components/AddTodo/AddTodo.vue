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

<script src="./AddTodo.js">

</script>

<style scoped src="./AddTodo.css">

</style>
