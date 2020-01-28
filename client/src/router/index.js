import Vue from 'vue';
import VueRouter from 'vue-router';
import EnterBill from '../views/EnterBill.vue';
import BillsView from '../views/BillsView.vue';
import LoginForm from '../views/LoginForm.vue';
import RegisterForm from '../views/RegisterForm.vue';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/unos-racuna',
    name: 'enter-bill',
    component: EnterBill,
    beforeEnter: (to, from, next) => {
      if (!store.getters.isUserLoggedIn) next('/prijava');
      else next();
    },
  },
  {
    path: '/moji-racuni',
    name: 'user-bills',
    component: BillsView,
    beforeEnter: (to, from, next) => {
      if (!store.getters.isUserLoggedIn) next('/prijava');
      else next();
    },
  },
  {
    path: '/prijava',
    name: 'login-form',
    component: LoginForm,
  },
  {
    path: '/registracija',
    name: 'register-form',
    component: RegisterForm,
  },
  {
    path: '*',
    name: 'home',
    redirect: '/unos-racuna',
  },
];

const router = new VueRouter({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
