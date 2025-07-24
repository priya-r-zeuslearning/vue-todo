
export default {
  data() {
    return {
      groupName: '',
      groupColor: '',
      isShowForm: false
    };
  },
  methods: {
    addGroup() {
      if (this.groupName.trim() === "" || this.groupColor.trim() === "") return;
      console.log(this.groupName, this.groupColor);
      this.$store.dispatch('addGroupAsync', { groupName: this.groupName, groupColor: this.groupColor });
      console.log("Group added");
      this.groupName = "";
      this.groupColor = "";
      this.isShowForm = false;
      },
      hideForm() {
        this.isShowForm = false;
      },
      showForm() {
        this.isShowForm = true;
      }
  },
};
