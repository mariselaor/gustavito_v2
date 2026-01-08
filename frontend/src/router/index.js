import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Lecciones from '../views/Lecciones.vue'
import Vocales from '../views/Vocales.vue'
import Consonantes from '../views/Consonantes.vue'
import Silabas from '../views/Silabas.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: Home },
  { path: '/lecciones', name: 'lecciones', component: Lecciones },
  { path: '/lecciones/vocales', name: 'vocales', component: Vocales },
  { path: '/lecciones/consonantes', name: 'consonantes', component: Consonantes },
  { path: '/lecciones/silabas', name: 'silabas', component: Silabas }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
