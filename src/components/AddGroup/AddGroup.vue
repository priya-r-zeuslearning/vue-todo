<template>
  <div class="todo-container">
    <button @click="showForm" class="open-btn">+ New Group</button>

    <!-- Modal Overlay -->
    <div v-if="isShowForm" class="modal-overlay" @click.self="hideForm">
      <form class="todo-form" @submit.prevent="addGroup">
        <h2>Add New Group</h2>

        <div class="form-group">
          <label for="todo-name">Name:</label>
          <input id="group-name" type="text" placeholder="Enter Group Name" v-model="groupName" tabindex="1" required
            autocomplete="off" />
        </div>
        <div class="form-group">
          <label for="group-color">Color:</label>
          <input type="color" id="group-color" v-model="groupColor" tabindex="2" required autocomplete="off">

        </div>
        <button type="submit" class="btn-submit" tabindex="4">Add Group</button>
        <button type="button" class="btn-cancel" @click="hideForm">Cancel</button>
      </form>
    </div>
  </div>
</template>


<script src="./AddGroup.js"></script>

<style scoped  src="./AddGroup.css">

</style>
