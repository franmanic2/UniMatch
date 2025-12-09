import { createRouter, createWebHistory } from 'vue-router';
import { userStore } from '@/modules/auth/store/userStore';
import LandingPage from '@/shared/views/LandingPage.vue';
import LoginView from '@/modules/auth/views/LoginView.vue';
import RegisterView from '@/modules/auth/views/RegisterView.vue';
import DashboardView from '@/modules/dashboard/views/DashboardView.vue';
import SearchView from '@/modules/search/views/SearchView.vue';
import ProfileView from '@/modules/profile/views/ProfileView.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  // Wait for auth to initialize
  await userStore.waitForAuth();

  const currentUser = userStore.user;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  if (requiresAuth && !currentUser) {
    next('/login');
  } else if (requiresGuest && currentUser) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
