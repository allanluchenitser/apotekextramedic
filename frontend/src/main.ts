import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import './style.css'
import App from './App.vue'

import ApotekView from './views/ApotekView.vue';
import PracticeView from './views/PracticeView.vue';
import ThreeView from './views/threeview/ThreeView.vue';
import OrthoView from './views/orthoview/OrthoView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/apotek' },
    { path: '/apotek', component: ApotekView },
    { path: '/practice', component: PracticeView },
    { path: '/three', component: ThreeView },
    { path: '/ortho', component: OrthoView },
  ]
})

const app = createApp(App)
app.use(router);

app.mount('#app');
