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
          <option value="">🎵 Elige una canción</option>
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
        
       <!-- Lecciones -->
        <div class="col-10 col-md-3 fade-in">
           <div class="card shadow-lg p-4 rounded-4 card-float card-lessons">
              <div class="icon-bounce mb-3">
               <i class="bi bi-book display-1"></i>
              </div>
             <h3 class="fw-bold">Lecciones</h3>
            <p class="text-muted">Aprende paso a paso</p>
            <button class= "btn btn-danger w-100 rounded-pill fw-bold btn-hover" @click="goToLessons">
             <i class="bi bi-play-circle-fill me-2"></i> Entrar
            </button>
          </div>
        </div>

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
      username: "Gustavo",
      isMusicPlaying: false,
      selectedSong: "",
      songs: {
        happy: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "baby-shark": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        twinkle: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        wheels: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
      }
    };
  },

  computed: {
    currentSongUrl() {
      return this.songs[this.selectedSong] || "";
    }
  },

  methods: {
    /* Navegar a lecciones */
    goToLessons() {
      this.$router.push("/lecciones");
    },

    /* Toast dinámico */
    showToast(message, type = "warning") {
      const toastContainer = document.querySelector(".toast-container");

      const toastHTML = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
          <div class="d-flex">
            <div class="toast-body">
              <i class="bi bi-${
                type === "warning"
                  ? "exclamation-triangle"
                  : type === "success"
                  ? "check-circle"
                  : "x-circle"
              }-fill me-2"></i>
              ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      `;

      toastContainer.insertAdjacentHTML("beforeend", toastHTML);
      const toastElement = toastContainer.lastElementChild;
      const toast = new Toast(toastElement, { delay: 3000 });
      toast.show();

      toastElement.addEventListener("hidden.bs.toast", () => {
        toastElement.remove();
      });
    },

    /* Cerrar sesión */
    async handleLogout() {
      try {
        const auth = getAuth();
        await signOut(auth);

        this.showToast("¡Sesión cerrada exitosamente!", "success");

        setTimeout(() => {
          this.$router.push("/login");
        }, 1000);
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        this.showToast("Error al cerrar sesión", "danger");
      }
    },

    /* Música Play/Pause */
    toggleMusic() {
      const audio = this.$refs.bgMusic;

      if (!this.selectedSong) {
        this.showToast("¡Primero elige una canción!", "warning");
        return;
      }

      audio.volume = 0.4;

      if (this.isMusicPlaying) {
        audio.pause();
        this.showToast("Música pausada", "info");
      } else {
        audio.play();
        this.showToast("¡Música reproduciendo!", "success");
      }

      this.isMusicPlaying = !this.isMusicPlaying;
    },

    /* Cambiar canción */
    changeSong() {
      const audio = this.$refs.bgMusic;

      if (this.isMusicPlaying) {
        audio.load();
        audio.play();
        this.showToast("Canción cambiada", "success");
      }
    },

    /* Animación de partículas */
    particleStyle() {
      return {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 10}s`
      };
    }
  }
};
</script>

<style src="../assets/styles/home.css"></style>
