import Vue from "vue";
import Vuex from "vuex";
import { getTodos, addTodo, deleteTodo, updateTodo, openDB } from './indexedDB';

Vue.use(Vuex);

let id = 0; // To keep track of next unique id

export default new Vuex.Store({
  state: {
    todos: [],
  },

  mutations: {
 
    /**
     * Adds a new todo to the state. The `todo` argument should include the
     * `id`, `todo`, `desc`, `dueDate`, and `completed` fields.
     * @param {Object} state - The Vuex state object
     * @param {Object} todo - The todo item to add
     */
    ADD_TODO(state, todo) {
      state.todos.push(todo);
    },

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
        id = Math.max(...todos.map(t => t.id)) + 1;
      }
    },

    DELETE_TODO(state, idToDelete) {
      state.todos = state.todos.filter(todo => todo.id !== idToDelete);
    },

    TOGGLE_TODO(state, idToToggle) {
      const todo = state.todos.find(todo => todo.id === idToToggle);
      if (todo) {
        todo.completed = !todo.completed;
      }
    }
  },

  actions: {
    // Initialize Vuex state from IndexedDB
      async initTodo({ commit }) {
      await openDB();
      const todos = await getTodos();
      commit('SET_TODOS', todos);
    },

    // Add todo both to IndexedDB and Vuex
 async addAsync({ commit }, payload) {
  const todoObj = {
    id: id++,           // generate or assign ID here
    todo: payload.todo, // string of todo text
    desc: payload.desc,
    dueDate: payload.dueDate,
    completed: false
  };
  await addTodo(todoObj);
  commit('ADD_TODO', todoObj);
},


    // Delete todo from both IndexedDB and Vuex
    async deleteTodoAsync({ commit }, idToDelete) {
      await deleteTodo(idToDelete);
      commit('DELETE_TODO', idToDelete);
    },

    // Toggle todo completion and update IndexedDB and Vuex
    async toggleTodoAsync({ commit, state }, idToToggle) {
      const todo = state.todos.find(t => t.id === idToToggle);
      if (!todo) return;
      const updatedTodo = { ...todo, completed: !todo.completed };
      await updateTodo(updatedTodo);
      commit('TOGGLE_TODO', idToToggle);
    }
  },

  getters: {
    doneTodos(state) {
      return state.todos.filter(todo => todo.completed);
    },

    pendingTodos(state) {
      return state.todos.filter(todo => !todo.completed);
    }
  }
});
