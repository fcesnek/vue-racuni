import Vue from 'vue'
import VueRouter from 'vue-router'
import EnterBill from '../views/EnterBill.vue'
import LoginForm from '../views/LoginForm.vue'
import RegisterForm from '../views/RegisterForm.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/unos-racuna',
    name: 'enter-bill',
    component: EnterBill
  },
  {
    path: '/prijava',
    name: 'login-form',
    component: LoginForm
  },
  {
    path: '/registracija',
    name: 'register-form',
    component: RegisterForm
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
