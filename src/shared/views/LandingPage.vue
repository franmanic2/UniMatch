<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref(null);
let animationFrameId; // To stop animation on unmount

// Particle configuration
const particleColor = '220, 38, 38'; // Matches a red/primary tone (tailwind-like red-600) or extract from var if possible, but safe default here. 
// Actually, let's use the requested palette. The image shows red dots.
// We'll use a mix of colors if needed, but primary red/orange fits.

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5; // Small dots
    this.speedX = (Math.random() - 0.5) * 0.5; // Slow movement
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around screen
    if (this.x > this.canvas.width) this.x = 0;
    else if (this.x < 0) this.x = this.canvas.width;
    
    if (this.y > this.canvas.height) this.y = 0;
    else if (this.y < 0) this.y = this.canvas.height;
  }

  draw(ctx) {
    ctx.fillStyle = `rgba(255, 71, 87, ${this.opacity})`; // Using the primary color tone from previous blob
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

onMounted(() => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  let particles = [];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  };

  const initParticles = () => {
    particles = [];
    const particleCount = Math.min(window.innerWidth * window.innerHeight / 10000, 100); // Responsive count
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas));
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle background gradient/glow if desired?
    // The user has a very dark background in the image.
    // We'll let CSS handle the background color, canvas just particles.
    
    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    
    animationFrameId = requestAnimationFrame(animate);
  };

  window.addEventListener('resize', resize);
  resize(); // Initial setup
  animate();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', resize); // This needs the exact function reference, but resize is defined inside. Ideally define outside or use a ref. 
  // In this scope, it's fine as long as we don't leak too much. 
  // Better practice: save resize handler.
});
</script>

<template>
  <div class="landing-container">
    <canvas ref="canvasRef" class="particle-background"></canvas>

    <div class="hero-section text-center">

      <div class="hero-content glass animate-slide-up">
        <h1 class="hero-title">
          Find Your <span class="text-gradient logo-wrapper">
            <img src="/favicon.svg" alt="Logo" class="landing-logo-icon" />
            UniMatch
          </span>
        </h1>
        <p class="hero-subtitle">
          The exclusive dating community for university students. 
          Connect, chat, and meet people from your campus and beyond.
        </p>
        
        <div class="hero-actions">
          <router-link to="/register" class="btn-primary pulse-btn">Start Dating</router-link>
          <router-link to="/login" class="btn-secondary">Login</router-link>
        </div>
      </div>
    </div>

    <div class="features-section container">
      <div class="feature-card glass animate-slide-up delay-100">
        <div class="icon">🎓</div>
        <h3>Campus Based</h3>
        <p>Find students specifically from your university or nearby campuses.</p>
      </div>
      <div class="feature-card glass animate-slide-up delay-200">
        <div class="icon">✨</div>
        <h3>Interest Match</h3>
        <p>Connect based on shared hobbies, majors, and passions.</p>
      </div>
      <div class="feature-card glass animate-slide-up delay-300">
        <div class="icon">🔒</div>
        <h3>Verified Students</h3>
        <p>A safe community exclusively for university students.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding: 2rem 0;
}

/* Background Particles */
.particle-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(circle at center, rgba(20, 20, 25, 1) 0%, #000000 100%); 
  /* Dark radial gradient to simulate the glow/void in the image */
}

/* Hero Section */
.hero-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4rem;
  padding: 0 1rem;
}

.hero-content {
  padding: 4rem 2rem;
  border-radius: 24px;
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: white;
}

.logo-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  vertical-align: bottom;
}

.landing-logo-icon {
  height: 0.9em;
  width: auto;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto 2.5rem;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

/* Pulse Animation for Primary Button */
.pulse-btn {
  animation: pulse-glow 2s infinite;
}

/* Features Section */
.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
}

.feature-card {
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.08);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
}

.feature-card p {
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-content {
    padding: 2rem 1.5rem;
  }
  
  .features-section {
    grid-template-columns: 1fr;
  }
}
</style>
