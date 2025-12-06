<template>
  <div class="home-bg py-5 text-center">

    <!-- Toast Container -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
      <div ref="musicToast" class="toast align-items-center text-white bg-warning border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi bi-music-note-beamed me-2"></i>
            ¡Primero elige una canción!
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>

    <!-- Partículas flotantes -->
    <div class="particles">
      <i class="particle bi bi-star-fill" v-for="n in 10" :key="'star'+n" :style="particleStyle(n)"></i>
      <i class="particle bi bi-trophy-fill" v-for="n in 10" :key="'trophy'+n" :style="particleStyle(n+10)"></i>
    </div>

    <!-- Nubes decorativas -->
    <div class="clouds">
      <div class="cloud cloud1">
        <i class="bi bi-cloud-fill"></i>
      </div>
      <div class="cloud cloud2">
        <i class="bi bi-cloud-fill"></i>
      </div>
      <div class="cloud cloud3">
        <i class="bi bi-cloud-fill"></i>
      </div>
    </div>

    <!-- Control de música con selector -->
    <div class="music-controls">
      <button @click="toggleMusic" class="music-btn btn btn-light rounded-circle shadow">
        <i :class="isMusicPlaying ? 'bi bi-volume-up-fill' : 'bi bi-volume-mute-fill'"></i>
      </button>
      <select v-model="selectedSong" @change="changeSong" class="song-selector form-select shadow-sm">
        <option value="">
          <i class="bi bi-music-note-beamed"></i> Elige una canción
        </option>
        <option value="happy">🎉 Happy - Pharrell Williams</option>
        <option value="baby-shark">🦈 Baby Shark</option>
        <option value="twinkle">⭐ Twinkle Twinkle Little Star</option>
        <option value="wheels">🚌 The Wheels on the Bus</option>
      </select>
    </div>

    <!-- Título animado -->
    <h1 class="fw-bold mb-5 title-animate text-white">
      <i class="bi bi-balloon-heart-fill me-2"></i>
      ¡Bienvenid@ {{ username }}!
      <i class="bi bi-balloon-heart-fill ms-2"></i>
    </h1>

    <div class="container">

      <div class="row g-4 justify-content-center">

        <!-- Juegos -->
        <div class="col-10 col-md-3 fade-in">
          <div class="card shadow-lg p-4 rounded-4 card-float card-games">
            <div class="icon-bounce mb-3">
              <i class="bi bi-controller display-1" style="color:#ff8c00;"></i>
            </div>
            <h3 class="fw-bold" style="color:#ff8c00;">Juegos</h3>
            <p class="text-muted">Diviértete aprendiendo</p>
            <button class="btn btn-warning w-100 rounded-pill fw-bold btn-hover">
              <i class="bi bi-play-circle-fill me-2"></i> Entrar
            </button>
          </div>
        </div>

        <!-- Actividades -->
        <div class="col-10 col-md-3 fade-in-delay-1">
          <div class="card shadow-lg p-4 rounded-4 card-float card-activities">
            <div class="icon-bounce mb-3" style="animation-delay: 0.2s;">
              <i class="bi bi-palette-fill display-1" style="color:#2e8b57;"></i>
            </div>
            <h3 class="fw-bold" style="color:#2e8b57;">Actividades</h3>
            <p class="text-muted">Colorea, une y aprende</p>
            <button class="btn btn-success w-100 rounded-pill fw-bold btn-hover">
              <i class="bi bi-brush-fill me-2"></i> Entrar
            </button>
          </div>
        </div>

        <!-- Niveles -->
        <div class="col-10 col-md-3 fade-in-delay-2">
          <div class="card shadow-lg p-4 rounded-4 card-float card-levels">
            <div class="icon-bounce mb-3" style="animation-delay: 0.4s;">
              <i class="bi bi-star-fill display-1" style="color:#6a5acd;"></i>
            </div>
            <h3 class="fw-bold" style="color:#6a5acd;">Niveles</h3>
            <p class="text-muted">Sube de nivel jugando</p>
            <button class="btn btn-primary w-100 rounded-pill fw-bold btn-hover">
              <i class="bi bi-graph-up-arrow me-2"></i> Ver niveles
            </button>
          </div>
        </div>

      </div>

      <!-- Cerrar sesión -->
      <button 
        @click="handleLogout" 
        class="btn btn-danger mt-5 px-5 py-3 fw-bold rounded-pill fade-in-delay-3 btn-logout shadow-lg logout-animate"
      >
        <i class="bi bi-box-arrow-right me-2"></i> Cerrar sesión
      </button>

    </div>

    <!-- Audio de fondo -->
    <audio ref="bgMusic" loop>
      <source :src="currentSongUrl" type="audio/mpeg">
    </audio>

  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import { Toast } from "bootstrap";

export default {
  data() {
    return {
      username: 'Gustavo',
      isMusicPlaying: false,
      selectedSong: '',
      songs: {
        happy: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        'baby-shark': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        twinkle: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        wheels: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
      }
    }
  },

  computed: {
    currentSongUrl() {
      return this.songs[this.selectedSong] || '';
    }
  },

  methods: {
    showToast(message, type = 'warning') {
      // Crear toast dinámicamente
      const toastContainer = document.querySelector('.toast-container');
      
      const toastHTML = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
          <div class="d-flex">
            <div class="toast-body">
              <i class="bi bi-${type === 'warning' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'x-circle'}-fill me-2"></i>
              ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      `;
      
      toastContainer.insertAdjacentHTML('beforeend', toastHTML);
      const toastElement = toastContainer.lastElementChild;
      const toast = new Toast(toastElement, { delay: 3000 });
      toast.show();
      
      // Eliminar del DOM después de ocultarse
      toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
      });
    },

    async handleLogout() {
      try {
        const auth = getAuth();
        await signOut(auth);

        this.showToast('¡Sesión cerrada exitosamente!', 'success');
        
        setTimeout(() => {
          this.$router.push("/login");
        }, 1000);

      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        this.showToast('Error al cerrar sesión', 'danger');
      }
    },

    toggleMusic() {
      const audio = this.$refs.bgMusic;

      if (!this.selectedSong) {
        this.showToast('¡Primero elige una canción!', 'warning');
        return;
      }

      audio.volume = 0.4;

      if (this.isMusicPlaying) {
        audio.pause();
        this.showToast('Música pausada', 'info');
      } else {
        audio.play();
        this.showToast('¡Música reproduciendo!', 'success');
      }

      this.isMusicPlaying = !this.isMusicPlaying;
    },

    changeSong() {
      const audio = this.$refs.bgMusic;

      if (this.isMusicPlaying) {
        audio.load();
        audio.play();
        this.showToast('Canción cambiada', 'success');
      }
    },

    particleStyle(n) {
      return {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 10}s`
      }
    }
  }
}
</script>

<style scoped>

/* Toast personalizado */
.toast {
  animation: slideInRight 0.4s ease-out;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border-radius: 15px !important;
  font-weight: 600;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Fondo degradado animado */
.home-bg {
  background: linear-gradient(-45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Partículas flotantes */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  font-size: 2rem;
  opacity: 0;
  animation: float-up 10s linear infinite;
  color: rgba(255, 255, 255, 0.6);
}

@keyframes float-up {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Nubes animadas */
.clouds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cloud {
  position: absolute;
  font-size: 4rem;
  opacity: 0.5;
  animation: cloud-drift 20s linear infinite;
  color: rgba(255, 255, 255, 0.8);
}

.cloud1 {
  top: 10%;
  animation-duration: 25s;
}

.cloud2 {
  top: 40%;
  animation-duration: 30s;
  animation-delay: 5s;
}

.cloud3 {
  top: 70%;
  animation-duration: 35s;
  animation-delay: 10s;
}

@keyframes cloud-drift {
  0% { transform: translateX(-10%); }
  100% { transform: translateX(110%); }
}

/* Controles de música */
.music-controls {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 10px;
  align-items: center;
}

.music-btn {
  width: 60px;
  height: 60px;
  font-size: 1.8rem;
  transition: all 0.3s ease;
  border: none;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.music-btn:hover {
  transform: scale(1.1) rotate(15deg);
}

.song-selector {
  width: 250px;
  border-radius: 25px;
  padding: 10px 20px;
  border: 2px solid #667eea;
  font-weight: 600;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.song-selector:hover {
  transform: scale(1.02);
  border-color: #764ba2;
}

.song-selector:focus {
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
}

/* Título animado */
.title-animate {
  animation: pop-in 0.8s cubic-bezier(0.48, -0.55, 0.265, 1.55);
  font-size: 3rem;
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.3);
}

@keyframes pop-in {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Tarjetas */
.card-games {
  background: linear-gradient(135deg, #ffefd5 0%, #ffe4b5 100%) !important;
  border: 3px solid #ff8c00;
}

.card-activities {
  background: linear-gradient(135deg, #e0ffe0 0%, #c7ffc7 100%) !important;
  border: 3px solid #2e8b57;
}

.card-levels {
  background: linear-gradient(135deg, #e6e6fa 0%, #d8d8ff 100%) !important;
  border: 3px solid #6a5acd;
}

/* Iconos con rebote */
.icon-bounce {
  display: inline-block;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Efecto flotante */
.card-float {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.card-float:hover {
  transform: translateY(-15px) scale(1.05);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
}

.card-float::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.5), transparent);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
}

.card-float:hover::before {
  opacity: 1;
  animation: shine 1.5s ease-in-out infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

/* Botones */
.btn-hover {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-hover::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-hover:hover::before {
  width: 300px;
  height: 300px;
}

.btn-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.btn-logout {
  transition: all 0.3s ease;
  background: linear-gradient(45deg, #ff6b6b, #ee5a6f);
  border: none;
}

.btn-logout:hover {
  transform: scale(1.1) rotate(-2deg);
  background: linear-gradient(45deg, #ee5a6f, #ff6b6b);
  box-shadow: 0 10px 30px rgba(255,107,107,0.5) !important;
}

/* Animaciones de entrada */
.fade-in {
  animation: fade-slide 0.8s ease-out;
}

.fade-in-delay-1 {
  animation: fade-slide 1s ease-out;
}

.fade-in-delay-2 {
  animation: fade-slide 1.2s ease-out;
}

.fade-in-delay-3 {
  animation: fade-slide 1.4s ease-out;
}

@keyframes fade-slide {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Animación de salida */
.logout-animate:active {
  animation: bounceExit 0.4s ease;
}

@keyframes bounceExit {
  0% { transform: scale(1); }
  30% { transform: scale(0.9); }
  60% { transform: scale(1.1); }
  100% { transform: scale(0.95); }
}

/* Responsive */
@media (max-width: 768px) {
  .title-animate {
    font-size: 2rem;
  }
  
  .icon-bounce {
    font-size: 2.5rem;
  }

  .music-controls {
    flex-direction: column;
    align-items: flex-end;
  }

  .song-selector {
    width: 200px;
    font-size: 0.85rem;
  }
}

</style>