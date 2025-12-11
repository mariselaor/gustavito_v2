<template>
  <!-- 🔙 Botón volver -->
  <button class="btn-back" @click="goBack">⬅</button>

  <div class="vowel-scene">

    <!-- Título -->
    <h2 class="title">⭐ Haz clic en cada vocal ⭐</h2>

    <!-- Decoraciones -->
    <img src="../assets/img/nube2.png" class="decor plane" />
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
  methods: {
    speak(text) {
      const speech = new SpeechSynthesisUtterance(text)
      speech.lang = 'es-ES'
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(speech)
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style src="@/assets/styles/vocales.css"></style>
