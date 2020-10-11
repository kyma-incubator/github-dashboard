import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from './store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: defineAsyncComponent(() => import('./views/Home.vue')),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: defineAsyncComponent(() => import('./views/Profile.vue')),
      meta: { requiresAuth: true },
    },    
    {
      path: '/team',
      name: 'Team',
      component: defineAsyncComponent(() => import('./views/Team.vue')),
      meta: { requiresAuth: true },
    },        
    {
      path: '/externals',
      name: 'ExternalContributors',
      component: defineAsyncComponent(() => import('./views/ExternalContributors.vue')),
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'About',
      component: defineAsyncComponent(() => import('./views/PageA.vue')),
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'Login',
      component: defineAsyncComponent(() => import('./views/Login.vue')),
      meta: { requiresAuth: false, layout: "empty" },
    },
    {
      path: '/logout',
      name: 'Logout',
      meta: { requiresAuth: true },
      beforeEnter: async (to, from) => {
        store.dispatch('logout');
        return { name: 'Login' };
      },      
    },    
    {
      path: '/:pathMatch(.*)',
      name: '404',
      component: defineAsyncComponent(() => import('./views/404.vue')),
      meta: { requiresAuth: false },
    },
  ],
});
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  if (to.name !== 'Login' && to.meta.requiresAuth && !isAuthenticated)
    next({ name: 'Login' });
  else next();
});
export default router;
