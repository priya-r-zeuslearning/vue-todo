
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// import HomePage from "./HomePage.vue";
// import LoginPage from "./components/Login/LoginPage.vue";
export default new VueRouter({
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("./HomePage.vue"),
        },
        {
            path: "/login",
            component: () => import("./components/Login/LoginPage.vue"),
        },
    ],
});
