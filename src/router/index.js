import { createRouter, createWebHashHistory } from 'vue-router'
import CenterAction from '../pages/CenterAction.vue'
import Test from '../pages/Test.vue'

const router = createRouter({
  history: createWebHashHistory(), // ← hash mode is essential for GitHub Pages
  routes: [
    { path: '/', component: CenterAction },
    { path: '/test', component: Test },
  ]
})

export default router
