<template>
  <div class="lessons-bg min-vh-100 position-relative">

    <!-- Partículas decorativas -->
    <div class="particles">
      <i class="particle bi bi-book-fill" v-for="n in 8" :key="'book'+n" :style="particleStyle(n)"></i>
      <i class="particle bi bi-pencil-fill" v-for="n in 8" :key="'pencil'+n" :style="particleStyle(n+8)"></i>
    </div>

    <!-- Botón Volver -->
    <button class="btn-back shadow-lg" @click="goBack">
      <i class="bi bi-arrow-left"></i>
    </button> 

    <div class="container text-center py-5">
      
      <!-- Título con animación -->
      <div class="title-container mb-4 animate-slide-down">
        <div class="icon-header mb-3">
          <i class="bi bi-journal-bookmark-fill display-1 text-primary"></i>
        </div>
        <h1 class="fw-bold title-text mb-2">
          Lecciones
        </h1>
        <p class="subtitle">Selecciona una lección para comenzar tu aventura</p>
      </div>

      <!-- Grid de lecciones -->
      <div class="row g-4 justify-content-center mt-5">
        <div 
          class="col-10 col-md-6 col-lg-4" 
          v-for="(l, index) in lessons" 
          :key="l.id"
        >
          <div 
            class="lesson-card shadow-lg p-4 h-100" 
            :class="'fade-in-delay-' + index"
            @click="openLesson(l.id)"
          >
            <!-- Icono -->
            <div class="icon-circle mb-3" :style="{ background: l.color }">
              <i :class="l.icon + ' fs-1'"></i>
            </div>

            <!-- Título -->
            <h4 class="fw-bold mb-3" :style="{ color: l.colorDark }">
              {{ l.title }}
            </h4>

            <!-- Descripción -->
            <p class="text-muted mb-4">{{ l.description }}</p>

            <!-- Botón -->
            <button 
              class="btn btn-lg w-100 rounded-pill fw-bold btn-lesson shadow"
              :style="{ 
                background: `linear-gradient(135deg, ${l.colorDark}, ${l.color})`,
                border: 'none'
              }"
            >
              <i class="bi bi-play-circle-fill me-2"></i>
              Comenzar
            </button>
          </div>
        </div>
      </div>

      
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lessons: [
        { 
          id: 1, 
          title: "Vocales",
          description: "Aprende las 5 vocales jugando",
          icon: "bi bi-type",
          color: "#ffd93d",
          colorDark: "#f39c12"
        },
        { 
          id: 2, 
          title: "Consonantes",
          description: "Descubre las consonantes",
          icon: "bi bi-alphabet",
          color: "#6bcf7f",
          colorDark: "#27ae60"
        },
        { 
          id: 3, 
          title: "Sílabas",
          description: "Forma sílabas y palabras",
          icon: "bi bi-chat-square-text",
          color: "#a29bfe",
          colorDark: "#6c5ce7"
        },
      ],
    };
  },

  methods: {
    goBack() {
      this.$router.back();
    }, 

    openLesson(id) {
      if (id === 1) {
        this.$router.push("/lecciones/vocales");
      } else if (id === 2) {
        this.$router.push("/lecciones/consonantes");
      } else if (id === 3) {
        this.$router.push("/lecciones/silabas");
      }
    },

    particleStyle(n) {
      return {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${8 + Math.random() * 8}s`
      };
    }
  }
};
</script>

<style src="../assets/styles/lecciones.css"></style>