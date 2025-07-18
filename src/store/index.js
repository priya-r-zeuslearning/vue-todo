import Vue from "vue";
import Vuex from "vuex";
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  openDB,
  addGroup,
  getGroups
} from "./indexedDB";

Vue.use(Vuex);

let id = 0; // To keep track of next unique id
let groupID = 0;
export default new Vuex.Store({
  state: {
    todos: [],
    groups: [],
  },

  mutations: {
    /**
     * Sets the todos in the Vuex state and updates the next unique id.
     * Assigns the provided array of todos to the state.
     * Updates the `id` to be one greater than the current maximum id in the array.
     *
     * @param {Object} state - The Vuex state object
     * @param {Array} todos - An array of todo objects to set in the state
     */

    SET_TODOS(state, todos) {
      state.todos = todos;

      if (todos.length > 0) {
        id = Math.max(...todos.map((t) => t.id)) + 1;
      }
    },
    // SET_GROUPS(state, groups) {
    //   state.groups = groups;

    SET_GROUPS(state, groups) {
      state.groups = groups;
      if (groups.length > 0) {
        groupID = Math.max(...groups.map((g) => g.id)) + 1;
      }
    },
    // },
    ADD_GROUP(state, group) {
      state.groups.push(group);
      if (state.groups.length > 0) {
        groupID = Math.max(...state.groups.map((g) => g.id)) + 1;
      }
    },

    DELETE_TODO(state, idToDelete) {
      state.todos = state.todos.filter((todo) => todo.id !== idToDelete);
    },

    TOGGLE_TODO(state, idToToggle) {
      const todo = state.todos.find((todo) => todo.id === idToToggle);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },

  actions: {
    // Initialize Vuex state from IndexedDB
    async initTodo({ commit }, retries = 3) {
      for (let i = 0; i < retries; i++) {
        try {
          await openDB();
          break;
        } catch (error) {
          console.log("Attempt", i + 1, "to open IndexedDB database");
          if(i === retries - 1) {
            console.error("Error opening IndexedDB database:", error);
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
      const todos = await getTodos();
      //temporaily
      
      commit("SET_TODOS", todos);
      commit("SET_GROUPS", await getGroups());
    },

    // Add todo both to IndexedDB and Vuex
    async addAsync({ commit }, payload) {
      const todoObj = {
        id: id++, // generate or assign ID here
        todo: payload.todo, // string of todo text
        desc: payload.desc,
        dueDate: payload.dueDate,
        groupID: payload.groupId,
        completed: false,
      };
   
      await addTodo(todoObj);
      console.log(todoObj);
      const todos = await getTodos();
      commit("SET_TODOS", todos);
    },
    async addGroupAsync({ commit }, newGroup) {
      const group = {
        id: groupID++,
        name: newGroup.groupName,
        color: newGroup.groupColor
      };
      console.log(group);
      await openDB();
      await addGroup(group);
      const groups = await getGroups();
      commit("SET_GROUPS", groups);
    },

    // Delete todo from both IndexedDB and Vuex
    async deleteTodoAsync({ commit }, idToDelete) {
      await deleteTodo(idToDelete);
      commit("DELETE_TODO", idToDelete);
    },

    // Toggle todo completion and update IndexedDB and Vuex
    async toggleTodoAsync({ commit, state }, idToToggle) {
      const todo = state.todos.find((t) => t.id === idToToggle);
      if (!todo) return;
      const updatedTodo = { ...todo, completed: !todo.completed };
      await updateTodo(updatedTodo);
      commit("TOGGLE_TODO", idToToggle);
    },
  },

  getters: {
    doneTodos(state) {
      return state.todos.filter((todo) => todo.completed);
    },

    pendingTodos(state) {
      return state.todos.filter((todo) => !todo.completed);
    },
  },
});
