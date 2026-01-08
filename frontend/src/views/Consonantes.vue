<template>
  <!-- 🔙 Botón Volver -->
  <button class="btn-back" @click="goBack">
    <i class="bi bi-arrow-left"></i>
  </button>

  <div class="letter-scene">

    <!-- Título -->
    <h2 class="title">⭐ Haz clic en cada consonante ⭐</h2>

    <!-- Decoraciones -->
    <img src="" class="decor plane" />
    <img src="" class="decor child" />

    <!-- Consonantes -->
    <div class="letter b" @click="speak('B')">B</div>
    <div class="letter c" @click="speak('C')">C</div>
    <div class="letter d" @click="speak('D')">D</div>
    <div class="letter f" @click="speak('F')">F</div>
    <div class="letter g" @click="speak('G')">G</div>

    <div class="letter h" @click="speak('H')">H</div>
    <div class="letter j" @click="speak('J')">J</div>
    <div class="letter k" @click="speak('K')">K</div>
    <div class="letter l" @click="speak('L')">L</div>
    <div class="letter m" @click="speak('M')">M</div>

    <div class="letter n" @click="speak('N')">N</div>
    <div class="letter ñ" @click="speak('Ñ')">Ñ</div>
    <div class="letter p" @click="speak('P')">P</div>
    <div class="letter q" @click="speak('Q')">Q</div>
    <div class="letter r" @click="speak('R')">R</div>
    <div class="letter s" @click="speak('S')">S</div>

    <div class="letter t" @click="speak('T')">T</div>
    <div class="letter v" @click="speak('V')">V</div>
    <div class="letter w" @click="speak('W')">W</div>
    <div class="letter x" @click="speak('X')">X</div>
    <div class="letter y" @click="speak('Y')">Y</div>
    <div class="letter z" @click="speak('Z')">Z</div>
  
  </div>
</template>

<script>
export default {
  mounted() {
    // Obliga a Chrome a cargar las voces
    window.speechSynthesis.onvoiceschanged = () => {};
  },

  methods: {
    speak(text) {
      const speech = new SpeechSynthesisUtterance(text);

      // Obtiene las voces disponibles
      const voices = window.speechSynthesis.getVoices();

      // Busca una voz española REAL
      const spanishVoice = voices.find(
        v => v.lang && v.lang.toLowerCase().startsWith('es')
      );

      // Si existe una voz en español, úsala
      if (spanishVoice) {
        speech.voice = spanishVoice;
      }

      speech.lang = 'es-ES';
      speech.rate = 0.9; // Más natural para niños

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);
    },

    goBack() {
      this.$router.back();
    }
  }
}
</script>

<style src="@/assets/styles/consonantes.css"></style>
