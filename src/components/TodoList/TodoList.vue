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
            v-for="todo in filteredTodosByGroup[group.id]"
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

<script src="./TodoList.js">

</script>



<style scoped src="./TodoList.css">

</style>
