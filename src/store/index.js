import Vue from "vue";
import Vuex from "vuex";
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  openDB,
  addGroup,
  getGroups,
  deleteGroup,
  getTodosbyGroupSorted,
  saveSortOrders,
  getSortOrders,
} from "./indexedDB";

Vue.use(Vuex);

let id = 0;
let groupId = 0;

export default new Vuex.Store({
  state: {
    todos: [],
    groups: [],
    groupTodos: {},
    editingTodo: null,
    showForm: false,
    sortOrders: {},
  },

  mutations: {
    setGroupTodos(state, { groupId, todos }) {
      state.groupTodos = {
        ...state.groupTodos,
        [groupId]: todos,
      };
    },
    SET_SORT_ORDER(state, { groupId, sortBy, direction }) {
      state.sortOrders[groupId] = { sortBy, direction };
    },

    SET_TODOS(state, todos) {
      state.todos = todos;
      if (todos.length > 0) {
        id = Math.max(...todos.map((t) => t.id)) + 1;
      }
    },
    SET_GROUPS(state, groups) {
      state.groups = groups;
      if (groups.length > 0) {
        groupId = Math.max(...groups.map((g) => g.id)) + 1;
      }
    },
    SET_SHOW_FORM(state, value) {
      state.showForm = value;
    },
    TOGGLE_FORM(state) {
      state.showForm = !state.showForm;
    },
    START_EDITING(state, todo) {
      state.editingTodo = { ...todo };
    },
    CLEAR_EDITING(state) {
      state.editingTodo = null;
    },
    ADD_GROUP(state, group) {
      state.groups.push(group);
      if (state.groups.length > 0) {
        groupId = Math.max(...state.groups.map((g) => g.id)) + 1;
      }
    },
    DELETE_TODO(state, idToDelete) {
      state.todos = state.todos.filter((todo) => todo.id !== idToDelete);
    },
    DELETE_GROUP(state, idToDelete) {
      state.groups = state.groups.filter((group) => group.id !== idToDelete);
    },
    TOGGLE_TODO(state, idToToggle) {
      const todo = state.todos.find((todo) => todo.id === idToToggle);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },

  actions: {
    async deleteGroupAsync({ commit }, idToDelete) {
      await deleteGroup(idToDelete);
      commit("DELETE_GROUP", idToDelete);
    },
    startEditing({ commit, dispatch }, todo) {
      commit("START_EDITING", todo);
      dispatch("showFormAction");
    },
    clearEditing({ commit, dispatch }) {
      commit("CLEAR_EDITING");
      dispatch("hideForm");
    },
    toggleForm({ commit }) {
      commit("TOGGLE_FORM");
    },
    showFormAction({ commit }) {
      commit("SET_SHOW_FORM", true);
    },
    hideForm({ commit }) {
      commit("CLEAR_EDITING");
      commit("SET_SHOW_FORM", false);
    },

    async initTodo({ commit }, retries = 3) {
      for (let i = 0; i < retries; i++) {
        try {
          await openDB();
          break;
        } catch (error) {
          console.log("Attempt", i + 1, "to open IndexedDB");
          if (i === retries - 1) {
            console.error("Error opening IndexedDB:", error);
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
  
      const todos = await getTodos();
      const groups = await getGroups();
      commit("SET_TODOS", todos);
      commit("SET_GROUPS", groups);
    },

    async FetchGroupTodos({ commit }, { groupId, sortBy, direction }) {
      const todos = await getTodosbyGroupSorted(groupId, sortBy, direction);
      commit("setGroupTodos", { groupId, todos });
    },

    async refreshGroupTodos({ state, dispatch }, groupId) {
      const sortOrder = state.sortOrders[groupId] || {
        sortBy: "id",
        direction: "prev",
      };

      await dispatch("FetchGroupTodos", {
        groupId,
        sortBy: sortOrder.sortBy,
        direction: sortOrder.direction,
      });
    },

    async setSortOrder({ commit, dispatch }, { groupId, sortBy, direction }) {
      commit("SET_SORT_ORDER", { groupId, sortBy, direction });
      try {
        await saveSortOrders(groupId, sortBy, direction);
      } catch (error) {
        console.error("Error saving sort order to IndexedDB:", error);
      }
      dispatch("refreshGroupTodos", groupId);
    },
    async loadSortOrders({ commit }) {
      try {
        await openDB();
        const savedOrders = await getSortOrders();
        savedOrders.forEach(({ groupId, sortBy, direction }) => {
          commit("SET_SORT_ORDER", { groupId, sortBy, direction });
          this.dispatch("refreshGroupTodos", groupId);
        });
        console.log("Sort orders loaded from IndexedDB", savedOrders);
      } catch (error) {
        console.error("Error retrieving sort orders from IndexedDB:", error);
      }
    },
    async addAsync({ commit, dispatch }, payload) {
      const todoObj = {
        id: id++,
        todo: payload.todo,
        desc: payload.desc,
        dueDate: payload.dueDate,
        groupId: payload.groupId,
        priority: payload.priority,
        completed: false,
      };

      await addTodo(todoObj);
      const todos = await getTodos();
      commit("SET_TODOS", todos);

      if (todoObj.groupId != null) {
        await dispatch("refreshGroupTodos", todoObj.groupId);
      }

      commit("SET_SHOW_FORM", false);
      commit("CLEAR_EDITING");
    },

    async addGroupAsync({ commit }, newGroup) {
      const group = {
        id: groupId++,
        name: newGroup.groupName,
        color: newGroup.groupColor,
      };
      await openDB();
      await addGroup(group);
      const groups = await getGroups();
      commit("SET_GROUPS", groups);
    },

    async editTodoAsync({ commit, dispatch }, payload) {
      await updateTodo(payload);
      const todos = await getTodos();
      commit("SET_TODOS", todos);

      if (payload.groupId != null) {
        await dispatch("refreshGroupTodos", payload.groupId);
      }
    },

    async deleteTodoAsync({ commit, state, dispatch }, idToDelete) {
      const todoObj = state.todos.find((todo) => todo.id === idToDelete);
      if (!todoObj) return;

      await deleteTodo(idToDelete);
      commit("DELETE_TODO", idToDelete);

      if (todoObj.groupId != null) {
        await dispatch("refreshGroupTodos", todoObj.groupId);
      }
    },

    async toggleTodoAsync({ commit, state, dispatch }, idToToggle) {
      const todo = state.todos.find((t) => t.id === idToToggle);
      if (!todo) return;
      const updatedTodo = { ...todo, completed: !todo.completed };
      await updateTodo(updatedTodo);
      commit("TOGGLE_TODO", idToToggle);

      if (updatedTodo.groupId != null) {
        await dispatch("refreshGroupTodos", updatedTodo.groupId);
      }
    },
  },

  getters: {
    doneTodos(state) {
      return state.todos.filter((todo) => todo.completed);
    },
    pendingTodos(state) {
      return state.todos.filter((todo) => !todo.completed);
    },
    todosByGroup: (state) => (groupId) => {
      return state.todos.filter((todo) => todo.groupId === groupId);
    },
  },
});
