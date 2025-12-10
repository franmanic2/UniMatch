<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { userStore } from '@/modules/auth/store/userStore';

const loading = ref(true);
const saving = ref(false);
const message = ref('');
const showLogoutConfirm = ref(false);
const router = useRouter();

const form = ref({
  nombre: '',
  edad: '',
  carrera: '',
  sede: '',
  altura: '',
  gustos: '',
  descripcion: '',
  instagram: '',
  genero: '',
  fotos: []
});

const newFiles = ref([]);
const newPreviewUrls = ref([]);

const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const totalPhotos = form.value.fotos.length + newFiles.value.length + files.length;

    if (totalPhotos > 3) {
        alert("Máximo 3 fotos permitidas en total.");
        event.target.value = "";
        return;
    }

    newFiles.value = [...newFiles.value, ...files];
    const urls = files.map(file => URL.createObjectURL(file));
    newPreviewUrls.value = [...newPreviewUrls.value, ...urls];
    
    // Reset input to allow selecting same file again if needed (though we handle appending)
    event.target.value = "";
};

const deleteExistingPhoto = async (photo, index) => {
    if(!confirm("¿Estás seguro de eliminar esta foto?")) return;

    try {
        // Remove from form state
        form.value.fotos.splice(index, 1);
        // Note: For Base64 strings stored in Firestore, we just update the array on 'Save'.
        // No explicit storage delete call needed.
    } catch (e) {
        console.error("Error deleting photo", e);
    }
};

const removeNewPhoto = (index) => {
    newFiles.value.splice(index, 1);
    newPreviewUrls.value.splice(index, 1);
};

const loadProfile = async () => {
    if (!userStore.user) return;
    try {
        const docRef = doc(db, 'users', userStore.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            form.value = {
                ...data,
                gustos: data.gustos // string
            };
        }
    } catch (e) {
        console.error("Error loading profile", e);
    } finally {
        loading.value = false;
    }
};

import { notificationStore } from '@/shared/stores/notificationStore'; // Add import

// ...

const handleUpdate = async () => {
    saving.value = true;
    try {
        const docRef = doc(db, 'users', userStore.user.uid);
        
        // 1. Process new photos to Base64
        const newPhotoBase64s = [];
        if (newFiles.value.length > 0) {
             const readFilesPromises = newFiles.value.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = (e) => reject(e);
                    reader.readAsDataURL(file);
                });
            });
            const results = await Promise.all(readFilesPromises);
            newPhotoBase64s.push(...results);
        }

        // 2. Update Firestore
        // Combine existing kept photos + new base64 photos
        const updatedFotos = [...form.value.fotos, ...newPhotoBase64s];

        await updateDoc(docRef, {
            ...form.value,
            edad: parseInt(form.value.edad),
            fotos: updatedFotos
        });
        
        // Update local form state
        form.value.fotos = updatedFotos;
        newFiles.value = [];
        newPreviewUrls.value = [];

        notificationStore.showNotification('¡Perfil actualizado correctamente! ✅', 'success');
    } catch (err) {
        notificationStore.showNotification('Error al actualizar: ' + err.message, 'error');
    } finally {
        saving.value = false;
    }
};

const confirmLogout = () => {
    showLogoutConfirm.value = true;
};

const handleLogout = async () => {
    try {
        await userStore.logout();
        router.push('/');
    } catch (e) {
        console.error("Logout failed", e);
    }
};

onMounted(() => {
    // Wait for auth to be ready if refreshing page
    if (userStore.user) {
        loadProfile();
    } else {
        // Watch for store change if checking auth
        const unwatch = userStore.$subscribe(() => {
             if (userStore.user) {
                 loadProfile();
                 unwatch(); // simple hack for now, proper way is route guard or watch effect
             }
        });
        // Also try immediately just in case
        setTimeout(() => { if(!loading.value && !form.value.nombre && userStore.user) loadProfile() }, 1000);
    }
});
</script>

<template>
  <div class="container profile-page">
    <div class="glass card profile-form-card">
        <h1>Edit Profile</h1>
        
        <div v-if="loading" class="loading">Loading profile...</div>

        <form v-else @submit.prevent="handleUpdate">
             <!-- Personal Info -->
            <h3>Personal Details</h3>
            <div class="form-group">
            <label>Nombre Completo</label>
            <input type="text" v-model="form.nombre" required />
            </div>

            <div class="grid-2">
            <div class="form-group">
                <label>Edad</label>
                <input type="number" v-model="form.edad" required />
            </div>
            <div class="form-group">
                <label>Altura</label>
                <input type="text" v-model="form.altura" required />
            </div>
            </div>

            <!-- Academic Info -->
            <h3>Academic</h3>
            <div class="form-group">
            <label>Carrera</label>
            <input type="text" v-model="form.carrera" required />
            </div>
            <div class="grid-2">
            <div class="form-group">
                <label>Sede</label>
                <input type="text" v-model="form.sede" required />
            </div>
            <div class="form-group">
             <label>Genero</label>
             <select v-model="form.genero" required>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
             </select>
            </div>
            </div>

            <!-- Social / Bio -->
            <h3>About You</h3>
            <div class="form-group">
            <label>Gustos</label>
            <input type="text" v-model="form.gustos" required />
            </div>

            <div class="form-group">
            <label>Descripcion</label>
            <textarea v-model="form.descripcion" rows="3" required></textarea>
            </div>

            <div class="form-group">
            <label>Instagram</label>
            <input type="text" v-model="form.instagram" />
            </div>

            <!-- Photos Management -->
            <h3>Tus Fotos</h3>
            <div class="form-group">
                <div class="current-photos">
                    <div v-for="(photo, index) in form.fotos" :key="index" class="photo-item">
                        <img :src="photo" alt="User Photo" />
                        <button type="button" class="delete-btn" @click="deleteExistingPhoto(photo, index)">×</button>
                    </div>
                     <!-- Pending New Photos -->
                    <div v-for="(url, index) in newPreviewUrls" :key="'new-'+index" class="photo-item new">
                        <img :src="url" alt="New Photo" />
                         <button type="button" class="delete-btn" @click="removeNewPhoto(index)">×</button>
                    </div>
                </div>
                
                <div v-if="(form.fotos.length + newFiles.length) < 3" class="upload-section">
                    <label class="upload-btn">
                        Subir Foto
                        <input type="file" accept="image/*" multiple @change="handleFileSelect" style="display: none;" />
                    </label>
                    <span class="info-text">{{ 3 - (form.fotos.length + newFiles.length) }} restantes</span>
                </div>
            </div>

            <p v-if="message" :class="{'success-msg': message.includes('success'), 'error-msg': message.includes('Error')}">{{ message }}</p>

            <button type="submit" class="btn-primary full-width" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>

            <button type="button" class="btn-logout-link" @click="confirmLogout">
                Log Out
            </button>
        </form>
    </div>

    <!-- Modal -->
    <div v-if="showLogoutConfirm" class="modal-overlay glass">
        <div class="modal card">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div class="modal-actions">
                <button class="btn-secondary" @click="showLogoutConfirm = false">Cancel</button>
                <button class="btn-primary btn-danger" @click="handleLogout">Log Out</button>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
    padding-top: 2rem;
    padding-bottom: 2rem;
    display: flex;
    justify-content: center;
}

.profile-form-card {
    width: 100%;
    max-width: 700px;
}

h1 {
    text-align: center;
    margin-bottom: 2rem;
}

h3 {
  font-size: 1rem;
  color: var(--color-primary);
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 0.5rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.full-width {
  width: 100%;
  margin-top: 2rem;
}

.success-msg {
    color: #2ed573;
    text-align: center;
    margin-bottom: 1rem;
}

 textarea {
  background: var(--color-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-family: inherit;
}

textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.current-photos {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
}

.photo-item {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid transparent;
}

.photo-item.new {
    border-color: var(--color-primary);
}

.photo-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.delete-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0,0,0,0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.delete-btn:hover {
    background: red;
}

.upload-btn {
    display: inline-block;
    background: rgba(255,255,255,0.1);
    border: 1px dashed rgba(255,255,255,0.4);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    color: white;
    transition: all 0.2s;
}

.upload-btn:hover {
    background: rgba(255,255,255,0.2);
    border-color: white;
}

.info-text {
    margin-left: 1rem;
    font-size: 0.85rem;
    color: var(--color-text-muted);
}


.btn-logout-link {
    display: block;
    width: 100%;
    margin-top: 1rem;
    background: transparent;
    border: 1px solid rgba(255, 71, 87, 0.5);
    color: #ff4757;
    padding: 0.75rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-logout-link:hover {
    background: rgba(255, 71, 87, 0.1);
    border-color: #ff4757;
    transform: translateY(-2px);
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    backdrop-filter: blur(5px);
}

.modal {
    max-width: 400px;
    width: 90%;
    text-align: center;
    background: #1e1e24; /* Should match var(--color-surface) but explicit here */
    border: 1px solid rgba(255,255,255,0.1);
}

.modal h3 {
    margin-top: 0;
    color: white;
    border: none;
}

.modal p {
    color: #ccc;
    margin-bottom: 2rem;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.btn-danger {
    background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
}
</style>
