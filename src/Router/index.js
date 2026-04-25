import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/Pages/Home.vue'
import Craps from '@/Pages/Craps.vue'
import Baccarat from '@/Pages/Baccarat.vue'
import Roulette from '@/Pages/Roulette.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home, meta: { depth: 0 } },
    { path: '/craps', component: Craps, meta: { depth: 1 } },
    { path: '/baccarat', component: Baccarat, meta: { depth: 1 } },
    { path: '/roulette', component: Roulette, meta: { depth: 1 } },
  ]
})

router.beforeEach((to) => {
  if (to.path === '/roulette') return '/'
})

export default router
