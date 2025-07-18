import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
  created() {
    try {
      this.$store.dispatch('initTodo');
      console.log("All Done");
    } catch (error) {
      console.log(error);
    }
 
  }
}).$mount('#app')
