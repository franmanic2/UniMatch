<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs, query, where } from 'firebase/firestore'; // where might be used later for filtering
import { db } from '@/firebase/config';
import UserCard from '@/shared/components/UserCard.vue';
import { userStore } from '@/modules/auth/store/userStore';

const users = ref([]);
const loading = ref(true);

const fetchUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    users.value = querySnapshot.docs
      .map(doc => doc.data())
      .filter(u => u.uid !== userStore.user?.uid); // Don't show self
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="dashboard container">
    <h1>All Students</h1>
    
    <div v-if="loading" class="loading">Loading matches...</div>
    
    <div v-else-if="users.length === 0" class="empty">
      No other students found yet. Invite your friends!
    </div>

    <div v-else class="users-grid">
      <UserCard 
        v-for="(user, index) in users" 
        :key="user.uid" 
        :user="user"
        class="animate-slide-up"
        :style="{ animationDelay: `${index * 100}ms` }"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: white;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  justify-items: center;
}

.loading, .empty {
  text-align: center;
  color: var(--color-text-muted);
  margin-top: 3rem;
  font-size: 1.2rem;
}
</style>
