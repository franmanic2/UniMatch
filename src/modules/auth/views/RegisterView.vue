<script setup>
import { ref } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

const loading = ref(false);
const error = ref('');

const form = ref({
  email: '',
  password: '',
  nombre: '',
  edad: '',
  carrera: '',
  sede: '',
  altura: '',
  gustos: '',
  descripcion: '',
  instagram: '',
  genero: ''
});

const selectedFiles = ref([]);
const previewUrls = ref([]);

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 3) {
    alert("Puedes seleccionar un máximo de 3 imágenes.");
    event.target.value = ""; // Clear input
    return;
  }
  selectedFiles.value = files;
  
  // Create previews
  previewUrls.value = files.map(file => URL.createObjectURL(file));
};

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // 1. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password);
    const user = userCredential.user;

    // 2. Process Images to Base64
    const photoBase64s = [];
    if (selectedFiles.value.length > 0) {
      const readFilesPromises = selectedFiles.value.map(file => {
          return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target.result);
              reader.onerror = (e) => reject(e);
              reader.readAsDataURL(file);
          });
      });
      const results = await Promise.all(readFilesPromises);
      photoBase64s.push(...results);
    }

    // 3. Save Profile Data to Firestore
    // 2. Save Profile Data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: form.value.email,
      nombre: form.value.nombre,
      edad: parseInt(form.value.edad),
      carrera: form.value.carrera,
      sede: form.value.sede,
      altura: form.value.altura,
      gustos: form.value.gustos,
      descripcion: form.value.descripcion,
      instagram: form.value.instagram,
      genero: form.value.genero,
      fotos: photoBase64s,
      createdAt: new Date()
    });


    window.location.href = '/dashboard';
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="card glass auth-card">
      <h2>Create Profile</h2>
      <form @submit.prevent="handleRegister">
        
        <!-- Account Info -->
        <h3>Account</h3>
        <div class="grid-2">
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="form.email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" v-model="form.password" required />
          </div>
        </div>

        <!-- Personal Info -->
        <h3>Personal Details</h3>
        <div class="form-group">
          <label>Nombre Completo</label>
          <input type="text" v-model="form.nombre" required placeholder="" />
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Edad</label>
            <input type="number" v-model="form.edad" required placeholder="" />
          </div>
          <div class="form-group">
            <label>Altura (e.g. 1.70m)</label>
            <input type="text" v-model="form.altura" required placeholder="" />
          </div>
        </div>

        <!-- Academic Info -->
        <h3>Academic</h3>
        <div class="form-group">
          <label>Carrera</label>
          <input type="text" v-model="form.carrera" required placeholder="" />
        </div>
        <div class="grid-2">
           <div class="form-group">
            <label>Sede</label>
            <select v-model="form.sede" required>
                <option value="" disabled>Selecciona tu sede</option>
                <option value="UPC Sede Villa">UPC Sede Villa</option>
                <option value="UPC Sede Monterrico">UPC Sede Monterrico</option>
                <option value="UPC Sede San Isidro">UPC Sede San Isidro</option>
                <option value="UPC Sede San Miguel">UPC Sede San Miguel</option>
                <option value="ULima">ULima</option>
                <option value="Pacífico">Pacífico</option>
                <option value="Cientifica Sede Sur">Cientifica Sede Sur</option>
                <option value="Cientifica Sede Norte">Cientifica Sede Norte</option>
                <option value="USIL">USIL</option>
                <option value="ISIL">ISIL</option>
                <option value="PUCP">PUCP</option>
                <option value="UTP">UTP</option>
             </select>
          </div>
          <div class="form-group">
             <label>Genero</label>
             <select v-model="form.genero" required>
                <option value="" disabled>Selecciona tu genero</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
             </select>
          </div>
        </div>

        <!-- Social / Bio -->
        <h3>About You</h3>
        <div class="form-group">
          <label>Gustos</label>
          <input type="text" v-model="form.gustos" required placeholder="" />
        </div>

        <div class="form-group">
          <label>Descripcion</label>
          <textarea v-model="form.descripcion" rows="3" required placeholder=""></textarea>
        </div>

         <div class="form-group">
          <label>Instagram Handle</label>
          <input type="text" v-model="form.instagram" placeholder="@" />
        </div>

        <div class="form-group">
          <label>Fotos (Máximo 3)</label>
          <input type="file" multiple accept="image/*" @change="handleFileSelect" />
          <div class="image-previews" v-if="previewUrls.length">
            <img v-for="(url, index) in previewUrls" :key="index" :src="url" alt="Preview" class="preview-img" />
          </div>
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="btn-primary full-width" :disabled="loading">
          {{ loading ? 'Creating Profile...' : 'Register' }}
        </button>
      </form>
       <div class="auth-footer">
        <p>Already have an account? <router-link to="/login">Login</router-link></p>
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
  padding: 2rem 0;
}

.auth-card {
  width: 100%;
  max-width: 600px;
}

h2 {
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

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.auth-footer a {
  color: var(--color-primary);
  font-weight: 600;
}

.image-previews {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.preview-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.2);
}
</style>
