<template>
  <!-- 🔙 Botón Volver -->
  <button class="btn-back" @click="goBack">
    <i class="bi bi-arrow-left"></i>
  </button>

  <div class="syllable-scene">

    <!-- Título -->
    <h2 class="title">⭐ Haz clic en cada sílaba ⭐</h2>

    <!-- Sílabas -->
    <div
      v-for="silaba in silabas"
      :key="silaba"
      class="letter"
      @click="speak(silaba)"
    >
      {{ silaba }}
    </div>

  </div>
</template> 

<script>
export default {
  data() {
    return {
      silabas: ['MA', 'ME', 'MI', 'MO', 'MU']
    }
  },

  mounted() {
    window.speechSynthesis.onvoiceschanged = () => {}
  },

  methods: {
    speak(text) {
      const speech = new SpeechSynthesisUtterance(text)
      const voices = window.speechSynthesis.getVoices()

      const spanishVoice = voices.find(
        v => v.lang && v.lang.toLowerCase().startsWith('es')
      )

      if (spanishVoice) speech.voice = spanishVoice

      speech.lang = 'es-ES'
      speech.rate = 0.8

      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(speech)
    },

    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style src="@/assets/styles/silabas.css"></style>
