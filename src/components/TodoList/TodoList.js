import { mapGetters, mapState } from "vuex";
import TodoItem from "../TodoItem/TodoItem.vue";

export default {
  components: {
    TodoItem,
  },

  data() {
    return {
      showCompleted: false,
      showGroup: [],
      sortOrders: {},
      filterForms: {}, // Holds filters per group
      activeFilterGroup: null, // Which group filter modal is open
      filterFormShow: false,
    };
  },

  computed: {
    ...mapState([
      "todos",
      "groups",
      "groupTodos",
      "sortOrders:storeSortOrders"
    ]),
    ...mapGetters(["pendingTodos", "doneTodos"]),
    filteredTodosByGroup() {

      const result = {};
      this.groups.forEach(group => {
        let groupTodos = this.groupTodos[group.id] || [];
        const filter = this.filterForms[group.id];
        if (filter && (filter.dueDate || filter.priority || filter.status)) {
          groupTodos = groupTodos.filter(todo => {
            const dueMatch = filter.dueDate ? todo.dueDate === filter.dueDate : true;
            const priorityMatch = filter.priority ? String(todo.priority) === String(filter.priority) : true;
            const statusMatch =
              filter.status === "1"
                ? todo.completed === true
                : filter.status === "2"
                ? todo.completed === false
                : true;
            return dueMatch && priorityMatch && statusMatch;
          });
        }
        result[group.id] = groupTodos;
      });
      return result;
    },
  },

  watch: {
    storeSortOrders: {
      handler(newOrders) {
        this.sortOrders = { ...newOrders };
      },
      immediate: true,
      deep: true,
    },
  },

methods: {
  toggleGroup(id) {
    if (this.showGroup.includes(id)) {
      this.showGroup = this.showGroup.filter((g) => g !== id);
    } else {
      this.showGroup.push(id);
    }
  },

  toggleTodo(id) {
    this.$store.dispatch("toggleTodoAsync", id);
  },

    deleteItem(id) {
        const confirmation = confirm("Are you sure you want to delete this todo?");
        if (!confirmation) return;
    this.$store.dispatch("deleteTodoAsync", id);
  },

  openFilterForm(groupId) {
    this.activeFilterGroup = groupId;
    this.filterFormShow = true;

    if (!this.filterForms[groupId]) {
      this.$set(this.filterForms, groupId, {
        dueDate: "",
        priority: "",
        status: "",
      });
    }
  },

  closeFilterForm() {
    this.filterFormShow = false;
    this.activeFilterGroup = null;
  },

  applyFilter() {
    this.filterFormShow = false;
  },

  clearFilter(groupId) {
    this.$set(this.filterForms, groupId, {
      dueDate: "",
      priority: "",
      status: "",
    });
    this.$delete(this.sortOrders, groupId);
    this.filterFormShow = false;
  },

  isFilterApplied(groupId) {
    const filter = this.filterForms[groupId];
    return filter && (filter.dueDate || filter.priority || filter.status);
  },

  sortTodos(groupId, sortKey) {
    const selected = sortKey || this.sortOrders[groupId];
    let sortBy = selected;
    let direction = "prev";
    if (selected === "priority") {
      direction = "next";
    } else if (selected === "priority-desc") {
      direction = "prev";
    } else if (selected === "dueDate") {
      direction = "prev";
    }
    this.$store.dispatch("setSortOrder", {
      groupId,
      sortBy,
      direction
    });
  },

  getSortedTodos(todos, selected) {
    let sorted = [...todos];

    if (selected === "dueDate") {
      sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (selected === "priority") {
      sorted.sort((a, b) => b.priority - a.priority); // High → Low
    } else if (selected === "priority-desc") {
      sorted.sort((a, b) => a.priority - b.priority); // Low → High
    }

    return sorted;
  },
}

};