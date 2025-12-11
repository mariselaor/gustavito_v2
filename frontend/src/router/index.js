import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Lecciones from '../views/Lecciones.vue'
import Vocales from '../views/Vocales.vue'



const routes = [
  { path: '/', redirect: '/login' }, 
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/home', name: 'Home', component: Home },
  { path: '/lecciones', name: 'Lecciones', component: Lecciones },
  { path: '/lecciones/vocales', name: 'Vocales', component: Vocales }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
