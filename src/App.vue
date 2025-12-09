<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import TheHeader from '@/shared/components/TheHeader.vue';
import TheFooter from '@/shared/components/TheFooter.vue';
import { userStore } from '@/modules/auth/store/userStore';

const isAuthenticated = computed(() => !!userStore.user);

onMounted(() => {
  userStore.initialize();
});
</script>

<template>
  <div class="app-layout">
    <TheHeader />
    <main class="main-content" :class="{ 'with-header': isAuthenticated }">
      <router-view :key="$route.fullPath" />
    </main>
    
    <!-- Loading Overlay -->
    <div v-if="userStore.loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
    
    <TheFooter />
  </div>
</template>

<style>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}
.main-content {
  flex: 1;
}

.main-content.with-header {
  padding-top: 60px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-bg);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
