import { reactive } from 'vue';
import { auth } from '@/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

let resolveAuth;
const authInitPromise = new Promise(resolve => {
  resolveAuth = resolve;
});

export const userStore = reactive({
  user: null,
  loading: true,
  
  initialize() {
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      this.loading = false;
      if (resolveAuth) {
        resolveAuth();
        resolveAuth = null; // Ensure executed once
      }
    });
  },

  async waitForAuth() {
    if (!this.loading) return;
    await authInitPromise;
  },

  async logout() {
    await signOut(auth);
    this.user = null;
  }
});
