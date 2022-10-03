import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignInAndUpView from "../views/SignInAndUpView.vue";
import NewPageView from "../views/NewPageView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/SignIn",
    name: "SignIn",
    component: SignInAndUpView,
  },
  {
    path: "/NewPage",
    name: "NewPage",
    component: NewPageView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
