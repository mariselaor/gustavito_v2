<template>
  <div class="match-container">

    <!-- Botón Volver -->
    <button class="btn-back" @click="goBack">
      <i class="bi bi-arrow-left"></i>
    </button>

    <!-- Contenedor con letras / imágenes / líneas -->
    <div ref="area" class="match-area">

      <!-- SVG para las líneas -->
      <svg class="lines-svg">
        <line v-for="(line, i) in drawnLines"
              :key="i"
              :x1="line.x1"
              :y1="line.y1"
              :x2="line.x2"
              :y2="line.y2"
              stroke="black"
              stroke-width="4"
              stroke-linecap="round" />
      </svg>

      <!-- Letras -->
      <div class="grid-letters">
        <div
          v-for="(item, i) in letters"
          :key="i"
          class="letter-card"
          @click="selectLetter(i)"
          :class="{ selected: selectedLetter === i }"
          :ref="el => letterRefs[i] = el"
        >
          {{ item.label }}
        </div>
      </div>

      <!-- Imágenes -->
      <div class="grid-images">
        <div
          v-for="(img, i) in images"
          :key="i"
          class="image-card"
          @click="selectImage(i)"
          :ref="el => imageRefs[i] = el"
        >
          <img :src="img.src" class="icon" />
        </div>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      letters: [
        { label: "A", match: 0 },
        { label: "E", match: 1 },
        { label: "I", match: 2 },
        { label: "O", match: 3 },
        { label: "U", match: 4 },
      ],

      images: [
        { src: "/src/assets/img/abeja.png" },
        { src: "/src/assets/img/estrella.png" },
        { src: "/src/assets/img/iguana.png" },
        { src: "/src/assets/img/oso.png" },
        { src: "/src/assets/img/uva.png" },
      ],

      selectedLetter: null,
      drawnLines: [],
      letterRefs: [],
      imageRefs: [],
    };
  },

  methods: {
    selectLetter(index) {
      this.selectedLetter = index;
    },

    selectImage(index) {
      if (this.selectedLetter === null) return;

      const correct = this.letters[this.selectedLetter].match === index;

      const area = this.$refs.area.getBoundingClientRect();
      const letterEl = this.letterRefs[this.selectedLetter].getBoundingClientRect();
      const imgEl = this.imageRefs[index].getBoundingClientRect();

      this.drawnLines.push({
        x1: letterEl.left - area.left + letterEl.width / 2,
        y1: letterEl.top - area.top + letterEl.height / 2,
        x2: imgEl.left - area.left + imgEl.width / 2,
        y2: imgEl.top - area.top + imgEl.height / 2,
      });

      this.selectedLetter = null;
    },

    goBack() {
      this.$router.back();
    }
  }
};
</script>



<style src="../assets/styles/consonantes.css"></style>


