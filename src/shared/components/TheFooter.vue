<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isLanding = computed(() => route.path === '/');
</script>

<template>
  <footer class="footer" :class="{ 'landing-footer': isLanding }">
    <div class="container">
      <p>&copy; {{ new Date().getFullYear() }} UniMatch. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  padding: 2rem 0;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.landing-footer {
  background-color: #000000;
  /* Ensure it matches the bottom of the landing page particle background */
}
</style>
