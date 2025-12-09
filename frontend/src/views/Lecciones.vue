<template>

    <!-- 🔙 Botón Volver -->
    <button class="btn-back" @click="goBack">
      <i class="bi bi-arrow-left"></i>
    </button> 

  <div class="container text-center py-5">
    <h1 class="fw-bold" style="color:#a62681">📘 Lecciones</h1>
    <p class="mt-3">Selecciona una lección para comenzar</p>

    <div class="row g-2 justify-content-center">
        <div class="col-10 col-md-4 col-lg-3 mb-4" v-for="l in lessons" :key="l.id">        <div class="p-4 lesson-card">
          <h4 class="fw-bold">{{ l.title }}</h4>
          <button class="btn btn-primary mt-3" @click="openLesson(l.id)">Entrar</button>
          
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
        { id: 1, title: "Vocales" },
        { id: 2, title: "Consonantes" },
        { id: 3, title: "Sílabas" },
      ],
    };
  },

  methods: {
  goBack() {
    this.$router.back()
  }, 

  openLesson(id) {
    if (id === 1) {
      this.$router.push("/lecciones/vocales");
    } else if (id === 2) {
      this.$router.push("/lecciones/consonantes");
    } else if (id === 3) {
      this.$router.push("/lecciones/silabas");
    }
  }
  
}

};
</script>

<style src="../assets/styles/lecciones.css"></style>

