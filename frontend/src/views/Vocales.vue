<template>
  <!-- 🔙 Botón Volver -->
  <button class="btn-back" @click="goBack">
    <i class="bi bi-arrow-left"></i>
  </button> 

  <div class="lesson-bg text-center p-4">
    <h1 class="fw-bold text-white mb-4"> Las Vocales</h1>

    <!-- Grid de tarjetas -->
    <div class="vowel-grid">
      <div class="vowel-card new-card" v-for="v in vowels" :key="v.letter">

        <!-- Letra -->
        <div class="letter-circle">
          {{ v.letter }}
        </div>

        <!-- Imagen -->
        <img :src="v.image" class="vowel-img" />

        <!-- Palabra -->
        <p class="word">{{ v.word }}</p>

        <!-- Botón hablar -->
        <button @click="speak(v.letter)" class="btn btn-primary rounded-pill play-btn">
          🔊 Escuchar
        </button>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vowels: [
        { letter: 'A', word: 'Avión', image: '/img/avion.png' },
        { letter: 'E', word: 'Elefante', image: '/img/elefante.png' },
        { letter: 'I', word: 'Iglesia', image: '/img/iglesia.png' },
        { letter: 'O', word: 'Oso', image: '/img/oso.png' },
        { letter: 'U', word: 'Uva', image: '/img/uva.png' }
      ]
    }
  },

  mounted() {
    this.loadSpanishVoice()
  },

  methods: {
    /* Buscar voz en español */
    getSpanishVoice() {
      const voices = window.speechSynthesis.getVoices()
      return voices.find(v => v.lang.startsWith('es')) || null
    },

    loadSpanishVoice() {
      window.speechSynthesis.onvoiceschanged = () => {
        this.spanishVoice = this.getSpanishVoice()
      }
    },

    speak(text) {
      const speech = new SpeechSynthesisUtterance(text)
      speech.lang = 'es-ES'
      speech.voice = this.getSpanishVoice()
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(speech)
    },

    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style src="../assets/styles/vocales.css"></style>
