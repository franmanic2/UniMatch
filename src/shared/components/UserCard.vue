<script setup>
import { ref } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const currentPhotoIndex = ref(0);

const getProfileImage = (user) => {
  if (user.fotos && user.fotos.length > 0) {
    return user.fotos[currentPhotoIndex.value];
  }
  return `https://ui-avatars.com/api/?name=${user.nombre}&background=random&size=256`;
};

const nextPhoto = (e) => {
    e.stopPropagation();
    if (props.user.fotos && props.user.fotos.length > 1) {
        currentPhotoIndex.value = (currentPhotoIndex.value + 1) % props.user.fotos.length;
    }
};

const prevPhoto = (e) => {
    e.stopPropagation();
    if (props.user.fotos && props.user.fotos.length > 1) {
        currentPhotoIndex.value = (currentPhotoIndex.value - 1 + props.user.fotos.length) % props.user.fotos.length;
    }
};

const getBadgeClass = (sede) => {
    if (!sede) return '';
    const s = sede.toLowerCase();

    // ULima - Naranja
    if (s.includes('ulima')) return 'orange';

    // Pacifico - Celeste
    if (s.includes('pacífico') || s.includes('pacifico')) return 'celeste';

    // ISIL - Celeste
    if (s.includes('isil')) return 'celeste';

    // Cientifica (Todas las sedes) - Azul
    if (s.includes('cientifica') || s.includes('científica')) return 'blue';

    // USIL - Azul
    if (s.includes('usil')) return 'blue';

    // PUCP - Azul
    if (s.includes('pucp')) return 'blue';

    // UTP - Rojo
    if (s.includes('utp')) return 'red';

    // UPC (Todas las sedes) - Default (se queda del color que esta)
    return ''; 
};

</script>

<template>
  <div class="user-card animate-fade-in">
    <div class="image-container">
      <transition name="fade" mode="out-in">
        <img 
          :key="currentPhotoIndex"
          :src="getProfileImage(user)" 
          :alt="user.nombre" 
          loading="lazy" 
        />
      </transition>
      
      <div v-if="user.fotos && user.fotos.length > 1" class="photo-controls">
          <button class="nav-btn prev" @click="prevPhoto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <span class="photo-counter">{{ currentPhotoIndex + 1 }}/{{ user.fotos.length }}</span>
          
          <button class="nav-btn next" @click="nextPhoto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
      </div>
    </div>
    
    <div class="card-content">
      <div class="header">
        <h2>{{ user.nombre }}, {{ user.edad }}</h2>
        <p class="major">{{ user.carrera }}</p>
      </div>

      <div class="badge-container">
        <span class="badge campus" :class="getBadgeClass(user.sede)">{{ user.sede }}</span>
      </div>

      <div class="details">
        <div class="detail-row">
          <span class="label">Altura:</span>
          <span class="value">{{ user.altura }}</span>
        </div>
        <div class="detail-row">
           <span class="label">Gustos:</span>
           <span class="value">{{ user.gustos }}</span>
        </div>
      </div>

      <div class="description">
        "{{ user.descripcion }}"
      </div>

      <a v-if="user.instagram" :href="`https://instagram.com/${user.instagram.replace('@', '')}`" target="_blank" class="btn-instagram">
        <i class="icon-instagram"></i> Instagram
      </a>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  background-color: var(--color-surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  border-color: rgba(255, 255, 255, 0.15);
}

.image-container {
  height: 280px;
  width: 100%;
  background-color: #2c2c35;
  position: relative;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.photo-controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    /* Gradient only at top for counter visibility */
    background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 25%);
    transition: opacity 0.3s ease;
}

.nav-btn {
    pointer-events: auto;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: 1px solid rgba(255,255,255,0.2);
    width: 32px; /* Smaller, circular */
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.2s ease;
    opacity: 0; /* Hidden by default */
}

/* Position buttons */
.nav-btn.prev { left: 10px; }
.nav-btn.next { right: 10px; }

/* Show on hover */
.image-container:hover .nav-btn {
    opacity: 1; /* Make visible when hovering the image */
}

.nav-btn:hover {
    background: rgba(255, 71, 87, 0.9); /* Primary color on hover */
    transform: translateY(-50%) scale(1.1);
    border-color: transparent;
    opacity: 1;
}

.nav-btn svg {
  width: 18px;
  height: 18px;
}

.photo-counter {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    pointer-events: auto;
}

.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: white;
}

.major {
  font-size: 0.85rem;
  color: var(--color-primary);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.badge-container {
  margin-bottom: 1rem;
}

.badge.campus {
  background: rgba(255, 71, 87, 0.15);
  color: var(--color-primary);
  border: 1px solid rgba(255, 71, 87, 0.3);
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.details {
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.detail-row {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
}

.label {
  color: var(--color-text-muted);
  font-weight: 600;
  margin-right: 0.5rem;
  min-width: 60px;
}

.value {
  color: white;
  flex: 1;
}

.description {
  font-style: italic;
  color: #d1d5db;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.btn-instagram {
  background: var(--gradient-instagram);
  color: white;
  text-align: center;
  padding: 0.8rem;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}


.btn-instagram:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 39, 67, 0.4);
}

/* University Colors */
.badge.campus.orange {
  background: rgba(255, 152, 0, 0.15);
  color: #ff9800;
  border-color: rgba(255, 152, 0, 0.3);
}

.badge.campus.celeste {
  background: rgba(0, 229, 255, 0.15);
  color: #00e5ff;
  border-color: rgba(0, 229, 255, 0.3);
}

.badge.campus.blue {
  background: rgba(41, 121, 255, 0.15);
  color: #2979ff;
  border-color: rgba(41, 121, 255, 0.3);
}

.badge.campus.red {
  background: rgba(255, 23, 68, 0.15);
  color: #ff1744;
  border-color: rgba(255, 23, 68, 0.3);
}
</style>
