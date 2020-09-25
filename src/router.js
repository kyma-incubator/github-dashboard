import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from './store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: defineAsyncComponent(() => import('./components/Home.vue')),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'About',
      component: defineAsyncComponent(() => import('./components/PageA.vue')),
      props: true,
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'Login',
      component: defineAsyncComponent(() => import('./components/Login.vue')),
      props: true,
      meta: { requiresAuth: false },
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
      path: '/authorize',
      name: 'Authorize',
      meta: { requiresAuth: false },
      beforeEnter: async (to, from) => {
        if (to.query.code) {
          try {
            await store.dispatch('continueOAuth', to.query.code);
            return { name: 'Home' };
          } catch (error) {
            return { name: 'Login' };
          }
        } else {
          return { name: 'Home' };
        }
      },
    },
    {
      path: '/:pathMatch(.*)',
      name: '404',
      component: defineAsyncComponent(() => import('./components/404.vue')),
      props: true,
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
