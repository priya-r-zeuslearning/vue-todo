import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
  created() {
    try {
      this.$store.dispatch('initDatabase');
  
      this.$store.dispatch('loadSortOrders');
      console.log("All Done");
    } catch (error) {
      console.log(error);
    }
 
  }
}).$mount('#app')
