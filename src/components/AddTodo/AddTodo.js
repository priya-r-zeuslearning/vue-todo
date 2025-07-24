import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      localTodo: this.$store.state.editingTodo || this.getDefaultTodo(),
    };
  },
  watch: {
    "$store.state.editingTodo"(newVal) {
      this.localTodo = newVal ? { ...newVal } : this.getDefaultTodo();
    },
  },
  computed: {
    ...mapState(["showForm"]),
    isEditing() {
      return !!this.$store.state.editingTodo?.id;
    },
  },
  methods: {
    ...mapActions(["toggleForm", "hideForm", "showFormAction"]),

    getDefaultTodo() {
      return {
        todo: "",
        desc: "",
        dueDate: "",
        priority: 3,
        groupId: null,
      };
    },
    openAddForm() {
      this.$store.commit("CLEAR_EDITING");
      this.localTodo = this.getDefaultTodo(); // reset local todo here
      this.showFormAction();
    },
    async submitTodo() {
      if (this.isEditing) {
        await this.$store.dispatch("editTodoAsync", this.localTodo);
      } else {
        await this.$store.dispatch("addAsync", this.localTodo);
      }
      this.cancelForm();
    },
    cancelForm() {
      this.hideForm();
      this.$store.commit("CLEAR_EDITING");
      this.localTodo = this.getDefaultTodo(); // reset local todo here as well
    },
  },
};