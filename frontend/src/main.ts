import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import './style.css'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/apotek' },
    { path: '/apotek', component: () => import('./views/ApotekView.vue') },
    { path: '/practice', component: () => import('./views/PracticeView.vue') },
    { path: '/three', component: () => import('./views/threeview/ThreeView.vue') },
    { path: '/ortho', component: () => import('./views/orthoview/OrthoView.vue') },
    { path: '/physics', component: () => import('./views/libraryviews/PhysicsView.vue') }
  ]
})

const app = createApp(App)
app.use(router);

app.mount('#app');
