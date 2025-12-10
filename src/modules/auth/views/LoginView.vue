<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { notificationStore } from '@/shared/stores/notificationStore';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    
    // Set toast for after reload
    notificationStore.setPendingNotification('¡Bienvenido de nuevo! 🎉');
    
    // Use window.location instead of router.push to ensure clean state
    window.location.href = '/dashboard';
  } catch (err) {
    error.value = err.message;
    loading.value = false;
    notificationStore.showNotification('Error al iniciar sesión: ' + err.message, 'error');
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="card glass auth-card">
      <h2>Login to UniMatch</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required placeholder="student@university.edu" />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" required placeholder="••••••••" />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="btn-primary full-width" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <div class="auth-footer">
        <p>Don't have an account? <router-link to="/register">Register</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.full-width {
  width: 100%;
  margin-top: 1rem;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.auth-footer a {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
