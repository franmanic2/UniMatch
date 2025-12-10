<script setup>
import { notificationStore } from '@/shared/stores/notificationStore';

const hide = () => {
    notificationStore.hideNotification();
};
</script>

<template>
  <transition name="toast-slide">
    <div v-if="notificationStore.state.show" class="toast-wrapper">
      <div 
        class="toast-content" 
        :class="notificationStore.state.type"
      >
        <div class="icon-box">
             <!-- Success Icon -->
            <svg v-if="notificationStore.state.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
             <!-- Error Icon -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
        
        <span class="message">{{ notificationStore.state.message }}</span>
        
        <button class="close-btn" @click="hide">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.toast-wrapper {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  pointer-events: none; /* Allow clicking through wrapper */
}

.toast-content {
  pointer-events: auto;
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 300px;
  max-width: 400px;
  gap: 12px;
  color: white;
  font-weight: 600;
}

.toast-content.success {
  background-color: #10b981; /* Emerald 500 */
}

.toast-content.error {
  background-color: #ef4444; /* Red 500 */
}

.icon-box {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message {
  flex: 1;
  font-size: 0.95rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-btn:hover {
  color: white;
}

/* Animations */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
