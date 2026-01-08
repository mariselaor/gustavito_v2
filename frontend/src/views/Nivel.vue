<template>
  <div class="nivel-container">
    <button class="btn-back" @click="$router.back()">←</button>
    
    <div class="nivel-content">
      <h1 class="titulo-nivel">{{ tituloNivel }}</h1>
      <p class="descripcion">¡Elige un juego para practicar!</p>
      
      <div class="juegos-grid">
        <div 
          v-for="juego in juegosDelNivel" 
          :key="juego.path"
          class="juego-card" 
          @click="$router.push(juego.path)"
        >
          <div class="icono">{{ juego.icono }}</div>
          <h3>{{ juego.nombre }}</h3>
          <p>{{ juego.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const nivelId = computed(() => parseInt(route.params.id))
const tituloNivel = computed(() => `Nivel ${nivelId.value}`)

const juegosDelNivel = computed(() => {
  if (nivelId.value === 1) {
    return [
      { 
        path: '/juegos/nivel/1/letras', 
        icono: '🔤', 
        nombre: 'Letras Saltarinas', 
        desc: 'Atrapa las letras correctas para formar palabras' 
      }
    ]
  } else if (nivelId.value === 2) {
    return [
      { 
        path: '/juegos/nivel/2/forma-palabra', 
        icono: '📝', 
        nombre: 'Forma la Palabra', 
        desc: 'Ordena las letras para formar palabras correctamente' 
      }
    ]
  }
  return []
})
</script>

<style src="@/assets/styles/consonantes.css"></style>