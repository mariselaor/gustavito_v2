<template>
  <!-- 🔙 Botón Volver -->
  <button class="btn-back" @click="goBack">
    <i class="bi bi-arrow-left"></i>
  </button>

  <div class="vowel-scene">

    <!-- Título -->
    <h2 class="title">⭐ Haz clic en cada vocal ⭐</h2>

    <!-- Decoraciones -->
    <img src="" class="decor plane" />
    <img src="" class="decor child" />

    <!-- Vocales -->
    <div class="vowel a" @click="speak('A')">A</div>
    <div class="vowel e" @click="speak('E')">E</div>
    <div class="vowel i" @click="speak('I')">I</div>
    <div class="vowel o" @click="speak('O')">O</div>
    <div class="vowel u" @click="speak('U')">U</div>

    <!-- Dibujos centrales -->
    <img src="" class="center-img bear" />
    <img src="" class="center-img cloud" />
    <img src="" class="center-img grapes" />

    <!-- Estrella -->
    <img src="" class="center-img star" />
    
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

<style src="@/assets/styles/vocales.css"></style>
