<script setup>
import { ref, watch } from 'vue';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import UserCard from '@/shared/components/UserCard.vue';

const users = ref([]);
const filteredUsers = ref([]);
const loading = ref(false);
const searchTerm = ref('');

const fetchUsers = async () => {
    loading.value = true;
    try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        users.value = querySnapshot.docs.map(doc => doc.data());
        filteredUsers.value = users.value;
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    if (!searchTerm.value.trim()) {
        filteredUsers.value = users.value;
        return;
    }
    const term = searchTerm.value.toLowerCase();
    filteredUsers.value = users.value.filter(user => 
        user.sede?.toLowerCase().includes(term)
    );
};

// Initial load
fetchUsers();

</script>

<template>
  <div class="container search-page">
    <div class="search-header">
        <h1>Busca estudiantes por universidad</h1>
        <div class="search-bar glass">
            <input 
                type="text" 
                v-model="searchTerm" 
                @input="handleSearch" 
                placeholder="Busca estudiantes por universidad"
            />
        </div>
    </div>

    <div v-if="loading" class="loading">Buscando...</div>

    <div v-else class="results">
        <div v-if="filteredUsers.length === 0" class="empty">
            No estudiantes encontrados para esta universidad.
        </div>
        <div v-else class="users-grid">
            <UserCard 
              v-for="(user, index) in filteredUsers" 
              :key="user.uid" 
              :user="user"
              class="animate-slide-up"
              :style="{ animationDelay: `${index * 100}ms` }"
            />
        </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
    padding-top: 2rem;
    padding-bottom: 2rem;
}

.search-header {
    margin-bottom: 3rem;
    text-align: center;
}

.search-bar {
    max-width: 600px;
    margin: 1rem auto 0;
    padding: 0.5rem;
    border-radius: 12px;
}

.search-bar input {
    margin-bottom: 0;
    background: transparent;
    border: none;
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  justify-items: center;
}
</style>
