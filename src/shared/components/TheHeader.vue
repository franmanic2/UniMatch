<script setup>
import { computed } from 'vue';
import { userStore } from '@/modules/auth/store/userStore';

const isAuthenticated = computed(() => !!userStore.user);
</script>

<template>
  <header v-if="isAuthenticated" class="header glass">
    <div class="container header-content">
      <div class="logo">
        <img src="/favicon.svg" alt="UniMatch Logo" class="logo-icon" />
        UniMatch
      </div>
      <nav>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/search">Search</router-link>
        <router-link to="/profile">Profile</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(15, 15, 19, 0.8);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.logo {
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  height: 28px;
  width: 28px;
}

nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

nav a {
  color: var(--color-text-muted);
  font-weight: 500;
  transition: color 0.2s;
}

nav a:hover, nav a.router-link-active {
  color: white;
}

</style>
